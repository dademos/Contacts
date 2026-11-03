import { Observable, iif, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Emits the value from the source observable if it is truthy, otherwise completes without emitting.
 */
export function If<T>(source: Observable<T>): Observable<T> {
  return source.pipe(mergeMap((value) => iif(() => !!value, of(value), EMPTY)));
}
