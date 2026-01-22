export abstract class TableData<TUnderlyingData> {
  private value: TUnderlyingData | undefined;
  private placeholder: string = "--";

  constructor(value: TUnderlyingData | undefined, placeholder?: string) {
    this.value = value;
    if (placeholder) this.placeholder = placeholder;
  }

  public setValue(value: TUnderlyingData): void {
    this.value = value;
  }

  public getValue(): TUnderlyingData | undefined {
    return this.value;
  }

  abstract compare(a: TUnderlyingData, b: TUnderlyingData): -1 | 0 | 1;

  abstract toString(value: TUnderlyingData): string;

  public getDisplayableContent(): string {
    try {
      if (this.value === undefined) return this.placeholder;
      return this.toString(this.value);
    } catch (err) {
      console.error(err);
      return this.placeholder;
    }
  }
}
