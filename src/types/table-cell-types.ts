export type TableCellFontStyling = {
  alignment?: "left" | "middle" | "right";
  font?: string;
  color?: string;
};

export type TableCellStyles = {
  text?: TableCellFontStyling;
  padding?: Padding;
};

export type Padding = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
