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
    if (this.value === undefined) return this.placeholder;
    return this.toString(this.value);
  }
}

export class StringTableData extends TableData<string> {
  constructor(value: string) {
    super(value);
  }

  compare(a: string, b: string): -1 | 0 | 1 {
    throw new Error("Method not implemented.");
  }

  toString(value: string): string {
    return value;
  }
}
