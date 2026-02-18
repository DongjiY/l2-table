import { TableRow } from "../types/table-config";
import { CellDataStore } from "./cell-data-store";

export class SortedRowModel<TDataRow extends TableRow> {
  public sortDirection: "ASC" | "DESC" | undefined;
  public columnIdUnderSort: string | undefined;
  private rowIdToIndexMap: Map<string, number>;
  private sortedRows: Array<{
    rowDefinition: TDataRow;
    columnUnderSortValue: any;
  }>;

  constructor(
    private readonly cellDataStore: CellDataStore<TDataRow>,
    private readonly rowDefinition: Array<TDataRow>,
  ) {
    this.rowIdToIndexMap = new Map(
      rowDefinition.map((row, index) => [row.rowId, index]),
    );
    this.sortedRows = rowDefinition.map((row) => ({
      rowDefinition: row,
      columnUnderSortValue: undefined,
    }));
  }

  public get length(): number {
    return this.sortedRows.length;
  }

  public toggleSort(columnId: string): void {
    if (this.columnIdUnderSort !== columnId) {
      this.columnIdUnderSort = columnId;
      this.sortDirection = "ASC";
      this.initialSort();
      return;
    }

    if (this.sortDirection === "ASC") {
      this.sortDirection = "DESC";
      this.initialSort();
      return;
    }

    if (this.sortDirection === "DESC") {
      this.columnIdUnderSort = undefined;
      this.sortDirection = undefined;
      this.initialSort();
      return;
    }

    this.columnIdUnderSort = columnId;
    this.sortDirection = "ASC";
  }

  public getRow(index: number): TDataRow {
    return this.sortedRows[index].rowDefinition;
  }

  private initialSort(): void {
    if (this.columnIdUnderSort === undefined) {
      this.sortedRows = this.rowDefinition.map((row) => ({
        rowDefinition: row,
        columnUnderSortValue: undefined,
      }));
      return;
    }

    let compareFn;
    this.sortedRows = this.rowDefinition.map((row) => {
      const placeholder = row.placeholders[this.columnIdUnderSort!];
      const cellData = this.cellDataStore.getCellData(
        row.rowId,
        this.columnIdUnderSort!,
      );
      compareFn = cellData.compare;
      const existingValue = cellData.getValue();

      return {
        rowDefinition: row,
        columnUnderSortValue: existingValue ?? placeholder,
      };
    });

    if (compareFn) this.sort(compareFn);
  }

  private sort(compare: (a: any, b: any) => -1 | 0 | 1): void {
    const compareProxy = (a: any, b: any): number => {
      if (a === undefined && b === undefined) return 0;
      if (a === undefined) return 1;
      if (b === undefined) return -1;
      return compare(a, b) * this.getSortDirectionMultiplier();
    };

    this.sortedRows.sort((a, b) =>
      compareProxy(a.columnUnderSortValue, b.columnUnderSortValue),
    );

    this.rowIdToIndexMap.clear();
    for (let i = 0; i < this.sortedRows.length; i++) {
      this.rowIdToIndexMap.set(this.sortedRows[i].rowDefinition.rowId, i);
    }
  }

  public resort({
    rowId,
    columnId,
    compare,
    value,
  }: {
    rowId: string;
    columnId: string;
    value: any;
    compare: (a: any, b: any) => -1 | 0 | 1;
  }): void {
    if (columnId !== this.columnIdUnderSort) return;

    const index = this.rowIdToIndexMap.get(rowId);
    if (index === undefined) return;

    this.sortedRows[index].columnUnderSortValue = value;

    this.sort(compare);
  }

  private getSortDirectionMultiplier(): 1 | -1 {
    if (this.sortDirection === "ASC") return 1;
    return -1;
  }
}
