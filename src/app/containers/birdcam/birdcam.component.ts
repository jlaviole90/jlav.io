import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import Hls from 'hls.js';

const STREAM_URL = 'https://server1.tail14a46d.ts.net/hls/birdcam.m3u8';

@Component({
    selector: 'app-birdcam',
    templateUrl: './birdcam.component.html',
    styleUrls: ['./birdcam.component.scss'],
})
export class BirdcamComponent implements AfterViewInit, OnDestroy {
    @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

    isLive = false;
    error = '';

    private hls: Hls | null = null;
    private retryTimeout: ReturnType<typeof setTimeout> | null = null;

    ngAfterViewInit(): void {
        this.initStream();
    }

    ngOnDestroy(): void {
        this.destroyStream();
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
    }

    private initStream(): void {
        const video = this.videoRef.nativeElement;

        if (Hls.isSupported()) {
            this.hls = new Hls({
                liveDurationInfinity: true,
                enableWorker: true,
            });

            this.hls.loadSource(STREAM_URL);
            this.hls.attachMedia(video);

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.isLive = true;
                this.error = '';
                video.play();
            });

            this.hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    this.isLive = false;
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        this.error = 'Stream is offline. Retrying…';
                        this.scheduleRetry();
                    } else {
                        this.error = 'Playback error. Retrying…';
                        this.scheduleRetry();
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = STREAM_URL;
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
