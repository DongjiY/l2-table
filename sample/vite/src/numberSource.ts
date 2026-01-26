import { interval, map, Observable } from "rxjs";
import type { TableConfig, TableRow, TableSourceData } from "../../../dist";

export function numberSource<TDataRow extends TableRow>(
  tableConfig: TableConfig<TDataRow>,
): Observable<TableSourceData> {
  const cells: Array<{ rowId: string; columnId: string }> = [];

  tableConfig.rows.forEach((row) => {
    tableConfig.columns.forEach((column) => {
      cells.push({
        rowId: row.rowId,
        columnId: column.columnId,
      });
    });
  });

  let index = 0;

  return interval(500).pipe(
    map(() => {
      const cell = cells[index];
      index = (index + 1) % cells.length;

      const value = Number((Math.random() * 100000000).toFixed(2));

      return {
        rowId: cell.rowId,
        columnId: cell.columnId,
        data: value,
      };
    }),
  );
}
