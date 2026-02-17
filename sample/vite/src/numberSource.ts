import { interval, map, mergeMap, from, Observable } from "rxjs";
import type { TableConfig, TableRow, TableSourceData } from "../../../dist";

export function numberSource<TDataRow extends TableRow>(
  tableConfig: TableConfig<TDataRow>,
): Observable<TableSourceData> {
  const cells: Array<{ rowId: string; columnId: string }> = [];

  tableConfig.rows.forEach((row) => {
    tableConfig.columns
      .filter((column) => column.columnId !== "index")
      .forEach((column) => {
        cells.push({
          rowId: row.rowId,
          columnId: column.columnId,
        });
      });
  });

  const batchSize = Math.min(500, cells.length);

  return interval(50).pipe(
    map(() => {
      // pick N random cells (with replacement)
      const batch: TableSourceData[] = [];

      for (let i = 0; i < batchSize; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        const value = Number((Math.random() * 100000000).toFixed(2));

        batch.push({
          rowId: cell.rowId,
          columnId: cell.columnId,
          data: value,
        });
      }

      return batch;
    }),
    // emit each cell update one by one
    mergeMap((batch) => from(batch)),
  );
}
