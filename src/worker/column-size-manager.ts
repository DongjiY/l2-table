import { TableCellFontStyling } from "../types/table-cell-types";

export class ColumnSizeManager {
  private columnSizeMap = new Map<string, number>();
  private canvas: OffscreenCanvas | undefined;

  public init(w: number, h: number): void {
    this.canvas = new OffscreenCanvas(w, h);
  }

  public computeColumnSize(
    content: string,
    styling: TableCellFontStyling,
  ): number {
    if (this.canvas === undefined) return -1;
    return 0;
  }
}
