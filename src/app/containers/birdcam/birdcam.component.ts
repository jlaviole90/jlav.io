import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';

@Component({
    selector: 'app-birdcam',
    templateUrl: './birdcam.component.html',
    styleUrls: ['./birdcam.component.scss'],
    imports: [FormsModule],
})
export class BirdcamComponent implements OnDestroy {
    @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

    passphrase = '';
    authenticated = false;
    isLive = false;
    error = '';
    loading = false;

    private streamUrl = '';
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
            this.authenticated = true;

            // Wait one tick for the video element to render
            setTimeout(() => this.initStream(), 0);
        } catch {
            this.error = 'Could not reach server.';
        } finally {
            this.loading = false;
        }
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
