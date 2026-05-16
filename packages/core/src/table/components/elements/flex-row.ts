import { FunctionElement } from "../../../types/element";
import { Point } from "../../../utils/point";

export const FlexRow: FunctionElement<{
  gap: number;
}> = ({ gap, children }) => {
  const childrenCount = children instanceof Array ? children.length : 1;

  return {
    layout: "static",
    children,
    layoutWidth: (childrenCount - 1) * gap,
    draw: () => {},
    getNewAnchor: ({ currentAnchor, childCount }) => {
      if (childCount === 0) {
        return currentAnchor;
      }
      return Point.at(currentAnchor.x + gap, currentAnchor.y);
    },
    getNewEffectiveCellSize: (currentEffectiveCellSize) =>
      currentEffectiveCellSize,
  };
};

/*
suppose the cell content is initially unknown
we know that the effectiveCellSize is 100, post-padding which was 20 on X.
we have a text and a SVG, where SVG has a fixed layoutWidth.
we can only have a single dynamicText.
column width is provided


on the layouting stage, send text elements to be measured 
on the draw stage we need to inject the values of the measured text elements so that we know at what position to draw them
*/
