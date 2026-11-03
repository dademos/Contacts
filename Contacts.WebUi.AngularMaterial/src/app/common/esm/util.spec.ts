import { Subject } from 'rxjs';
import { If } from './util';

describe('util', () => {
  it.each([
    [true, true],
    [false, false],
    [1, true],
    [0, false],
    ['', false],
    [{}, true],
    [null, false],
  ])('%$ If(%o) should emit: %o', (value, shouldEmit: boolean) => {
    let error = false;
    let emitted = false;
    let emittedValue;
    let completed = false;
    const sub = new Subject();

    If(sub).subscribe({
      next: (v) => {
        emitted = true;
        emittedValue = v;
      },
      error: () => (error = true),
      complete: () => (completed = true),
    });

    sub.next(value);
    sub.complete();

    expect(emitted).toBe(shouldEmit);
    if (emitted) {
      expect(emittedValue).toBe(value);
    }
    expect(error).toBe(false);
    expect(completed).toBe(true);
  });
});
