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
  ): {
    width: number;
    overflown: boolean;
  } {
    throw new Error("Method not implemented");
  }
}
