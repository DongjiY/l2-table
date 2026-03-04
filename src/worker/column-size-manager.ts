import { HEADER_FILTER_BUFFER } from "../table/components/header-filter";
import { ColumnConstraints } from "../types/column-constraints";
import { TableCellStyles } from "../types/table-cell-types";
import { DEFAULT_FONT_STRING } from "../utils/cell-style-defaults";
import { getPadding } from "../utils/padding-utils";

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
    styling: TableCellStyles | undefined,
  ): void {
    this.canvas = new OffscreenCanvas(w, h);
    this.ctx = this.canvas.getContext("2d");
    this.columnConstraints = columnMaxWidths;
    this.cellStyling = styling;
  }

  public computeColumnSize(
    columnId: string,
    content: string,
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

    this.ctx.font = this.cellStyling?.text?.font ?? DEFAULT_FONT_STRING;
    const computedMetrics = this.ctx.measureText(content);
    const currColumnWidth = this.columnSizeMap.get(columnId) ?? 0;
    const { left: leftPadding, right: rightPadding } = getPadding(
      this.cellStyling?.padding,
    );
    const computedWidth =
      computedMetrics.width + leftPadding + rightPadding + HEADER_FILTER_BUFFER;
    const newCellWidth = Math.min(
      this.columnConstraints[columnId].maxWidth,
      Math.max(
        computedWidth,
        currColumnWidth,
        this.columnConstraints[columnId].minWidth,
      ),
    );
    this.columnSizeMap.set(columnId, newCellWidth);
    return {
      columnId,
      width: newCellWidth,
      overflown: computedWidth > newCellWidth,
    };
  }
}
