/// <reference types="vitest/globals" />

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';

import { TextFilter } from './text-filter';

describe('TextFilter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  function renderTextFilter(
    props: Partial<ComponentProps<typeof TextFilter>> = {},
  ) {
    const onValueChange = vi.fn();

    render(
      <TextFilter
        label="Search"
        debounce={400}
        minLength={3}
        onValueChange={onValueChange}
        {...props}
      />,
    );

    return {
      input: screen.getByRole('textbox', { name: 'Search' }),
      onValueChange,
    };
  }

  async function advanceTime(milliseconds: number) {
    await vi.advanceTimersByTimeAsync(milliseconds);
  }

  it('emits a valid value only after the debounce delay', async () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'react' } });
    expect(onValueChange).not.toHaveBeenCalled();

    await advanceTime(399);
    expect(onValueChange).not.toHaveBeenCalled();

    await advanceTime(1);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('react');
  });

  it('restarts the debounce when the input changes and emits only the latest value', async () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'react' } });
    await advanceTime(200);
    fireEvent.change(input, { target: { value: 'signals' } });
    await advanceTime(399);

    expect(onValueChange).not.toHaveBeenCalled();

    await advanceTime(1);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('signals');
  });

  it('does not emit null until a valid value has been emitted', async () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'ab' } });
    await advanceTime(400);
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'abc' } });
    await advanceTime(400);
    expect(onValueChange).toHaveBeenNthCalledWith(1, 'abc');

    fireEvent.change(input, { target: { value: 'ab' } });
    await advanceTime(400);
    expect(onValueChange).toHaveBeenNthCalledWith(2, null);
  });

  it('emits the current valid value immediately when Enter is pressed', () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('react');
  });

  it('clears the input and immediately emits null after a valid value', async () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'react' } });
    await advanceTime(400);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('react');

    fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));

    expect((input as HTMLInputElement).value).toBe('');
    expect(onValueChange).toHaveBeenNthCalledWith(2, null);
    expect(document.activeElement).toBe(input);
  });

  it('does not emit typed text after Clear bypasses a pending debounce', async () => {
    const { input, onValueChange } = renderTextFilter();

    fireEvent.change(input, { target: { value: 'react' } });
    await advanceTime(400);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('react');

    fireEvent.change(input, { target: { value: 'signals' } });
    await advanceTime(200);
    fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));

    expect(onValueChange).toHaveBeenNthCalledWith(2, null);

    await advanceTime(400);
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('does not emit a pending value after unmount', async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <TextFilter label="Search" onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('textbox', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'react' } });
    unmount();
    await advanceTime(400);

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
