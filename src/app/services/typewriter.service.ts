import { Injectable } from "@angular/core";
import { concat, delay, ignoreElements, interval, map, Observable, of, take } from "rxjs";

@Injectable()
export class TypewriterService {
    constructor() {}

    type(word: string, speed: number): Observable<string> {
        return concat(
            interval(speed).pipe(
                map((x) => word.substring(0, x + 1)),
                take(word.length)
            ),
            of('').pipe(delay(1000000), ignoreElements())
        );
    }
}
