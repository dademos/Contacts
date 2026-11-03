import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject, distinctUntilChanged, mergeWith, map, switchMap, timer, of } from 'rxjs';

/**
 * Debounced search/filter control that doesn't emit the value if it's not empty but shorter than minLength.
 * Debounce is bypassed when user hits Enter key or presses Clear button.
 * Emits null instead of empty string.
 */
@Component({
  selector: 'app-text-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  styleUrl: 'text-filter.scss',
  templateUrl: './text-filter.html',
  host: {
    '[style.max-width.px]': 'maxWidth() || null',
    '[class]': 'maxWidth() ? "flex-auto" : "flex-full"',
  },
})
export class TextFilter {
  readonly debounce = input<number>(400); // Debounce timeout in milliseconds
  readonly minLength = input<number>(3); // Min length of value to emit (other than empty)
  readonly maxWidth = input<number | null>(200); // Max width of control in pixels
  readonly label = input<string>('Filter');
  readonly placeholder = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  readonly value = output<string | null>(); // Emits null instead of empty string

  readonly text = signal<string>('');

  readonly computedPlaceholder = computed(
    () => this.placeholder() ?? (this.minLength() > 0 ? `Type ${this.minLength()}+ chars` : ''),
  );

  private readonly debounceBypass = new Subject<string>();

  constructor() {
    toObservable(this.text)
      .pipe(
        map((text) => ({ text, debounced: true })),
        mergeWith(this.debounceBypass.pipe(map((text) => ({ text, debounced: false })))),
        switchMap(({ text, debounced }) =>
          debounced ? timer(this.debounce()).pipe(map(() => text)) : of(text),
        ),
        map((text) => (text === '' || text.length >= this.minLength() ? text : '')),
        distinctUntilChanged(),
        takeUntilDestroyed(), // Auto-injects DestroyRef when called in constructor
      )
      .subscribe((text) => this.value.emit(text.length ? text : null));
  }

  onEnter() {
    this.debounceBypass.next(this.text());
  }

  onClear() {
    this.text.set('');
    this.debounceBypass.next('');
  }
}
