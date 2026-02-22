import { TableColumnDef, TableRow } from "../types/table-config";

export class ColumnLookup<TDataRow extends TableRow> {
  private idToIndexMap: Map<string, number>;
  private indexToIdMap: Map<number, string>;

  constructor(columns: Array<TableColumnDef<TDataRow>>) {
    this.idToIndexMap = new Map(
      columns.map((column, index) => [column.columnId, index]),
    );
    this.indexToIdMap = new Map(
      columns.map((column, index) => [index, column.columnId]),
    );
  }

  public getId(index: number): string | undefined {
    return this.indexToIdMap.get(index);
  }

  public getIndex(id: string): number | undefined {
    return this.idToIndexMap.get(id);
  }
}
