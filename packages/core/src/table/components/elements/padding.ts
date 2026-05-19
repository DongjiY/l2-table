import { FunctionElement } from "../../../types/element";
import { Dimensions, Point } from "../../../utils";

export const Padding: FunctionElement<{
  left: number;
  right: number;
  top: number;
  bottom: number;
}> = ({ left, right, top, bottom, children }) => {
  const padding = {
    top,
    bottom,
    left,
    right,
  };

  return {
    layout: "static",
    layoutWidth: left + right,
    draw: ({ anchor, effectiveCellSize, painter }) => {
      painter.clipArea(anchor, effectiveCellSize, padding);
    },
    getNewAnchor: ({ currentAnchor }) =>
      Point.at(currentAnchor.x + left, currentAnchor.y + top),
    getNewEffectiveCellSize: (currentEffectiveCellSize) =>
      Dimensions.of(
        currentEffectiveCellSize.w - (left + right),
        currentEffectiveCellSize.h - (top + bottom)
      ),
    children,
  };
};
