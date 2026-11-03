import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TextFilter } from './text-filter';

describe('TextFilter', () => {
  let sut: TextFilter;
  let fixture: ComponentFixture<TextFilter>;
  let loader: ReturnType<typeof TestbedHarnessEnvironment.loader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(TextFilter);
    sut = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function getInput(): Promise<MatInputHarness> {
    return loader.getHarness(MatInputHarness);
  }

  async function getClearButton(): Promise<MatButtonHarness> {
    return loader.getHarness(MatButtonHarness.with({ text: 'close' }));
  }

  async function advanceTime(milliseconds: number): Promise<void> {
    await vi.advanceTimersByTimeAsync(milliseconds);
    await fixture.whenStable();
  }

  it('emits a valid value only after the debounce delay', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);
    const input = await getInput();

    await input.setValue('angular');
    expect(emitSpy).not.toHaveBeenCalled();

    await advanceTime(399);
    expect(emitSpy).not.toHaveBeenCalled();

    await advanceTime(1);
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith('angular');
  });

  it('restarts the debounce when the input changes and emits only the latest value', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);
    const input = await getInput();

    await input.setValue('angular');
    await advanceTime(200);
    await input.setValue('signals');
    await advanceTime(399);

    expect(emitSpy).not.toHaveBeenCalled();

    await advanceTime(1);
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith('signals');
  });

  it('emits null for values shorter than minLength and emits values at the boundary', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);
    const input = await getInput();

    await input.setValue('ab');
    await advanceTime(400);
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(null);

    emitSpy.mockClear();
    await input.setValue('abc');
    await advanceTime(400);
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith('abc');
  });

  it('emits the current valid value immediately when Enter is pressed', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);
    const input = await getInput();

    await input.setValue('rxjs');
    fixture.nativeElement
      .querySelector('input')
      .dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith('rxjs');
  });

  it('clears the input and immediately emits null when the Clear button is clicked', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);

    await (await getInput()).setValue('reactive');
    await fixture.whenStable();
    const clearButton = await getClearButton();
    await clearButton.click();
    await fixture.whenStable();

    expect(sut.text()).toBe('');
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(null);
  });

  it('does not emit typed text after Clear bypasses a pending debounce', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);

    await (await getInput()).setValue('angular');
    await advanceTime(200);
    const clearButton = await getClearButton();
    await clearButton.click();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(null);

    await advanceTime(400);
    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(null);
  });

  it('does not emit a pending value after the component is destroyed', async () => {
    const emitSpy = vi.fn();
    sut.value.subscribe(emitSpy);

    await (await getInput()).setValue('angular');
    fixture.destroy();
    await advanceTime(400);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});