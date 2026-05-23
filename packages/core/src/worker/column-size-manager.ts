import { ColumnConstraints } from "../types/column-constraints";
import { TableCellStyles } from "../types/styles";
import { DEFAULT_FONT_STRING } from "../utils/cell-style-defaults";

export class ColumnSizeManager {
  private columnConstraints: ColumnConstraints = {};
  private columnSizeMap: Map<string, number> = new Map();
  private canvas: OffscreenCanvas | undefined;
  private ctx: OffscreenCanvasRenderingContext2D | null | undefined;
  private cellStyling: TableCellStyles | undefined;

  public init(
    w: number,
    h: number,
    columnMaxWidths: ColumnConstraints,
    styling: TableCellStyles | undefined
  ): void {
    this.canvas = new OffscreenCanvas(w, h);
    this.ctx = this.canvas.getContext("2d");
    this.columnConstraints = columnMaxWidths;
    this.cellStyling = styling;
  }

  public computeColumnSize(
    columnId: string,
    content: string
  ): {
    columnId: string;
    width: number;
    overflown: boolean;
  } {
    if (!this.ctx)
      return {
        columnId,
        width: 0,
        overflown: false,
      };

    const currColumnWidth = this.columnSizeMap.get(columnId) ?? 0;
    const font = this.cellStyling?.text?.font ?? DEFAULT_FONT_STRING;
    const computedWidth = this.measureContent(content, font);
    const newCellWidth = Math.min(
      this.columnConstraints[columnId].maxWidth,
      Math.max(
        computedWidth,
        currColumnWidth,
        this.columnConstraints[columnId].minWidth
      )
    );
    this.columnSizeMap.set(columnId, newCellWidth);
    return {
      columnId,
      width: newCellWidth,
      overflown: computedWidth > newCellWidth,
    };
  }

  public measureContent(content: string, font: string): number {
    if (!this.ctx) return 0;
    this.ctx.font = font;
    const computedMetrics = this.ctx.measureText(content);
    return Math.ceil(computedMetrics.width);
  }
}
