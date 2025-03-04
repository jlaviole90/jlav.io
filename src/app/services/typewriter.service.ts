import { Injectable } from "@angular/core";
import { concat, interval, map, Observable, take } from "rxjs";

@Injectable()
export class TypewriterService {
    constructor() {}

    type(word: string, speed: number): Observable<string> {
        return interval(speed).pipe(
            map((x) => word.substring(0, x + 1)),
            take(word.length)
        );
    }
}
