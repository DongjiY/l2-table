import { TableData } from "l2-table";

export class NumberTableData extends TableData<number> {
  constructor() {
    super(undefined);
  }

  compare(a: number, b: number): -1 | 0 | 1 {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  toString(value: number): string {
    return value.toString();
  }
}
