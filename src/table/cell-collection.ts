import { TableCell } from "./cell";

export class TableCellCollection<TCellData> {
  private cellsByRow: Map<string, Map<string, TableCell<TCellData>>> =
    new Map();
  private cellsByCol: Map<string, Map<string, TableCell<TCellData>>> =
    new Map();

  public addCell(cell: TableCell<TCellData>): void {
    let rowMap = this.cellsByRow.get(cell.rowId);
    if (!rowMap) {
      rowMap = new Map<string, TableCell<TCellData>>();
      this.cellsByRow.set(cell.rowId, rowMap);
    }
    rowMap.set(cell.columnId, cell);

    let colMap = this.cellsByCol.get(cell.columnId);
    if (!colMap) {
      colMap = new Map<string, TableCell<TCellData>>();
      this.cellsByCol.set(cell.columnId, colMap);
    }
    colMap.set(cell.rowId, cell);
  }

  public getRow(rowId: string): Map<string, TableCell<TCellData>> | undefined {
    return this.cellsByRow.get(rowId);
  }

  public getCol(colId: string): Map<string, TableCell<TCellData>> | undefined {
    return this.cellsByCol.get(colId);
  }

  public getCell(
    rowId: string,
    colId: string
  ): TableCell<TCellData> | undefined {
    return this.cellsByRow.get(rowId)?.get(colId);
  }

  //   public allCells(): Iterable<TableCell<TCellData>> {
  //     for (const rowMap of this.cellsByRow.values()) {
  //       for (const cell of rowMap.values()) {
  //         yield cell;
  //       }
  //     }
  //   }

  public removeCell(rowId: string, colId: string): void {
    this.cellsByRow.get(rowId)?.delete(colId);
    this.cellsByCol.get(colId)?.delete(rowId);
  }
}
