import { Element, FunctionElement } from "../../../types/element";
import { Point } from "../../../utils";
import {
  DEFAULT_FONT_STRING,
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TEXT_COLOR,
} from "../../../utils/cell-style-defaults";

export const Text: FunctionElement<{
  content: string;
  alignment: "left" | "middle" | "right";
  font: string;
  color: string;
}> = ({ content, alignment, font, color }): Element => {
  return {
    layout: "dynamic",
    id: Date.now().toString(), // todo - this sucks make this an actual id
    draw: ({ anchor, effectiveCellSize, painter }) => {
      const { x, textAlign } = getAlignment(
        effectiveCellSize.w,
        anchor.x,
        alignment
      );

      painter.writeText(content, Point.at(x, anchor.y), {
        alignment: textAlign,
        baseline: "middle",
        color: color ?? DEFAULT_TEXT_COLOR,
        font: font ?? DEFAULT_FONT_STRING,
      });
    },
    getNewAnchor: ({ currentAnchor }) => currentAnchor,
    getNewEffectiveCellSize: (currentEffectiveCellSize) =>
      currentEffectiveCellSize,
  };
};

function getAlignment(
  innerWidth: number,
  anchorX: number,
  configAlignment?: "left" | "middle" | "right"
): {
  x: number;
  textAlign: CanvasTextAlign;
} {
  const alignment = configAlignment ?? DEFAULT_TEXT_ALIGN;
  switch (alignment) {
    case "middle":
      return {
        x: anchorX + innerWidth / 2,
        textAlign: "center",
      };
    case "right":
      return {
        x: anchorX + innerWidth,
        textAlign: "right",
      };
    case "left":
    default:
      return {
        x: anchorX,
        textAlign: "left",
      };
  }
}
