import { TableData } from "../table/components/table-data";

export class StringTableData extends TableData<string> {
  constructor(defaultValue?: string) {
    super(defaultValue);
  }

  compare(a: string, b: string): -1 | 0 | 1 {
    throw new Error("Method not implemented.");
  }

  toString(value: string): string {
    return value;
  }
}
