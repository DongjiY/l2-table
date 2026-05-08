export type TableCellFontStyling = {
  alignment?: "left" | "middle" | "right";
  font?: string;
  color?: string;
};

export type TableCellStyles = {
  text?: TableCellFontStyling;
  padding?: Padding;
  hovered?: TableCellHoverStyles;
  backgroundColor?: string;
};

export type TableCellHoverStyles = {
  backgroundColor?: string;
};

export type Padding = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type TableHeaderResizerStyles = {
  width?: number;
  color?: string;
};
