import { Injectable } from "@angular/core";
import { concat, delay, interval, map, Observable, of, take } from "rxjs";

@Injectable()
export class TypewriterService {
    constructor() {}

    private type(word: string, speed: number): Observable<string> {
        return interval(speed).pipe(
            map((x) => word.substring(0, x + 1)),
            take(word.length)
        );
    }

    typeEffect(word: string): Observable<string> {
        return concat(
            this.type(word, 20),
        );
    }
}
