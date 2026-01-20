import { TableData } from "../worker/table-components/table-data";

export class StringTableData extends TableData<string> {
  constructor() {
    super(undefined);
  }

  compare(a: string, b: string): -1 | 0 | 1 {
    throw new Error("Method not implemented.");
  }

  toString(value: string): string {
    return value;
  }
}
