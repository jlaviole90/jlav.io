import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Hls from 'hls.js';

interface Detection {
    id: string;
    species_id: number | null;
    confidence: number;
    detected_at: string;
    frame_count: number | null;
    extra_metadata: {
        common_name: string;
        species_code: string;
        is_notable: boolean;
        was_rerouted: boolean;
        top5: { species: string; confidence: number }[];
    } | null;
}

interface DetectionsResponse {
    items: Detection[];
    total: number;
    page: number;
    page_size: number;
}

@Component({
    selector: 'app-birdcam',
    templateUrl: './birdcam.component.html',
    styleUrls: ['./birdcam.component.scss'],
    imports: [FormsModule, DatePipe],
})
export class BirdcamComponent implements OnDestroy {
    @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

    passphrase = '';
    authenticated = false;
    isLive = false;
    error = '';
    loading = false;

    sightings: Detection[] = [];
    sightingsOpen = false;
    sightingsLoading = false;
    activeClip: Detection | null = null;

    private streamUrl = '';
    apiUrl = '';
    private hls: Hls | null = null;
    private retryTimeout: ReturnType<typeof setTimeout> | null = null;

    ngOnDestroy(): void {
        this.destroyStream();
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
    }

    async submitPassphrase(): Promise<void> {
        this.error = '';
        this.loading = true;

        try {
            const res = await fetch('/api/birdcam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passphrase: this.passphrase }),
            });

            if (!res.ok) {
                this.error = res.status === 401 ? 'Wrong passphrase.' : 'Something went wrong.';
                return;
            }

            const data = await res.json();
            this.streamUrl = data.streamUrl;
            this.apiUrl = data.apiUrl || '';
            this.authenticated = true;

            setTimeout(() => this.initStream(), 0);
        } catch {
            this.error = 'Could not reach server.';
        } finally {
            this.loading = false;
        }
    }

    toggleSightings(): void {
        this.sightingsOpen = !this.sightingsOpen;
        if (this.sightingsOpen && this.sightings.length === 0) {
            this.fetchSightings();
        }
    }

    async fetchSightings(): Promise<void> {
        if (!this.apiUrl) return;
        this.sightingsLoading = true;

        try {
            const res = await fetch(
                `${this.apiUrl}/api/v1/detections?page_size=20&min_confidence=0.5`
            );
            if (res.ok) {
                const data: DetectionsResponse = await res.json();
                this.sightings = data.items;
            }
        } catch {
            // Silently fail — sightings are supplementary
        } finally {
            this.sightingsLoading = false;
        }
    }

    playClip(detection: Detection): void {
        if (!this.apiUrl || !detection.frame_count) return;
        this.destroyStream();
        this.activeClip = detection;
        this.isLive = false;

        const video = this.videoRef.nativeElement;
        video.src = `${this.apiUrl}/api/v1/detections/${detection.id}/video?fps=5`;
        video.muted = false;
        video.play();
    }

    hasVideo(detection: Detection): boolean {
        return !!detection.frame_count && detection.frame_count > 0;
    }

    backToLive(): void {
        this.activeClip = null;
        const video = this.videoRef.nativeElement;
        video.removeAttribute('src');
        video.muted = true;
        this.initStream();
    }

    getSpeciesName(detection: Detection): string {
        return detection.extra_metadata?.common_name || 'Unknown';
    }

    private initStream(): void {
        const video = this.videoRef.nativeElement;

        if (Hls.isSupported()) {
            this.hls = new Hls({
                liveDurationInfinity: true,
                enableWorker: true,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 6,
                liveBackBufferLength: 0,
            });

            this.hls.loadSource(this.streamUrl);
            this.hls.attachMedia(video);

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.isLive = true;
                this.error = '';
                video.play();
            });

            this.hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    this.isLive = false;
                    this.error = 'Stream is offline. Retrying…';
                    this.scheduleRetry();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = this.streamUrl;
            video.addEventListener('loadedmetadata', () => {
                this.isLive = true;
                video.play();
            });
            video.addEventListener('error', () => {
                this.isLive = false;
                this.error = 'Stream is offline. Retrying…';
                this.scheduleRetry();
            });
        } else {
            this.error = 'Your browser does not support HLS playback.';
        }
    }

    private scheduleRetry(): void {
        this.destroyStream();
        this.retryTimeout = setTimeout(() => this.initStream(), 5000);
    }

    private destroyStream(): void {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
    }
}
