// import { TableCell } from "../table/components/table-cell";
// import { Table } from "../table/table";
// import { TableRow } from "../types/table-config";

// export class CellCollection<TDataRow extends TableRow> {
//   private rowCollection: Map<string, Array<TableCell<TDataRow>>>;
//   private columnCollection: Map<string, Array<TableCell<TDataRow>>>;

//   constructor() {
//     this.columnCollection = new Map();
//     this.rowCollection = new Map();
//   }

//   public addCell(cell: TableCell<TDataRow>): void {
//     if (!this.rowCollection.has(cell.rowId))
//       this.rowCollection.set(cell.rowId, []);
//     this.rowCollection.get(cell.rowId)?.push(cell);

//     if (!this.columnCollection.has(cell.columnId))
//       this.columnCollection.set(cell.columnId, []);
//     this.columnCollection.get(cell.columnId)?.push(cell);
//   }

//   public removeCell(cell: TableCell<TDataRow>): void {
//     const row = this.rowCollection.get(cell.rowId);
//     if (row) {
//       const idx = row.indexOf(cell);
//       if (idx !== -1) {
//         row.splice(idx, 1);
//         if (row.length === 0) {
//           this.rowCollection.delete(cell.rowId);
//         }
//       }
//     }

//     const col = this.columnCollection.get(cell.columnId);
//     if (col) {
//       const idx = col.indexOf(cell);
//       if (idx !== -1) {
//         col.splice(idx, 1);
//         if (col.length === 0) {
//           this.columnCollection.delete(cell.columnId);
//         }
//       }
//     }
//   }

//   public *allCells(): IterableIterator<TableCell<TDataRow>> {
//     for (const cells of this.rowCollection.values()) {
//       for (const cell of cells) {
//         yield cell;
//       }
//     }
//   }

//   public *visibleCells(bounds: {
//     leftColumnIndex: number;
//     rightColumnIndex: number;
//     topRowIndex: number;
//     bottomRowIndex: number;
//   }): IterableIterator<TableCell<TDataRow>> {
//     const rows = Array.from(this.rowCollection.values());
//     for (let i = bounds.topRowIndex; i <= bounds.bottomRowIndex; i++) {
//       const row = rows[i];
//       for (let j = bounds.leftColumnIndex; j <= bounds.rightColumnIndex; j++) {
//         yield row[j];
//       }
//     }
//   }

//   public getAllCellsInRow(rowId: string): Array<TableCell<TDataRow>> {
//     return this.rowCollection.get(rowId) ?? [];
//   }

//   public getAllCellsInColumn(columnId: string): Array<TableCell<TDataRow>> {
//     return this.columnCollection.get(columnId) ?? [];
//   }
// }
