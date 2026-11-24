import { XIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '#/common/components/ui/button';
import { Field, FieldLabel } from '#/common/components/ui/field';
import { Input } from '#/common/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/common/components/ui/tooltip';

type TextFilterProps = {
  debounce?: number;
  minLength?: number;
  inputMaxWidth?: number | null;
  label?: string;
  placeholder?: string | null;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
};

/**
 * Debounced search/filter control that doesn't emit the value if it's not empty but shorter than minLength.
 * Debounce is bypassed when user hits Enter key or presses Clear button.
 * Emits null instead of empty string.
 */
export function TextFilter({
  debounce = 400,
  minLength = 3,
  inputMaxWidth = 200,
  label = 'Filter',
  placeholder,
  disabled = false,
  onValueChange,
}: TextFilterProps) {
  const [text, setText] = useState('');
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmittedValueRef = useRef<string | null>(null);

  const computedPlaceholder =
    placeholder ?? (minLength > 0 ? `Type ${minLength}+ chars` : '');

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      emitValue(text);
    }, debounce);

    return resetTimeout;
  }, [
    text,
    debounce,
    // biome-ignore lint/correctness/useExhaustiveDependencies: it complains that emitValue and resetTimeout are not memoized, but react compiler will do that
    emitValue,
    // biome-ignore lint/correctness/useExhaustiveDependencies: as above
    resetTimeout,
  ]);

  function emitValue(s: string) {
    const value = s?.length >= minLength ? s : null;

    if (lastEmittedValueRef.current === value) {
      return;
    }

    lastEmittedValueRef.current = value;
    onValueChange(value);
  }

  function resetTimeout() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function onEnter() {
    resetTimeout();
    emitValue(text);
  }

  function onClear() {
    setText('');
    resetTimeout();
    emitValue('');
    inputRef.current?.focus();
  }

  return (
    <Field orientation="horizontal" data-disabled={disabled} className="w-fit">
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

      <div
        className="relative w-full"
        style={{ maxWidth: inputMaxWidth ?? undefined }}
      >
        <Input
          ref={inputRef}
          id={inputId}
          value={text}
          placeholder={computedPlaceholder}
          disabled={disabled}
          className="pr-9"
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault(); // Prevent form submission if ever used in a form
              onEnter();
            }
          }}
        />

        {text && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Clear filter"
                  disabled={disabled}
                  className="absolute top-0 right-1 bottom-0 my-auto"
                  onClick={onClear}
                >
                  <XIcon />
                </Button>
              }
            />
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Field>
  );
}
