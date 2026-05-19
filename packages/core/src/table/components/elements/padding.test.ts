import { Dimensions, Point } from "../../../utils";
import { Padding } from "./padding";
import { Text } from "./text";

describe("Padding", () => {
  test("updates the anchor point to left and top pads", () => {
    const padding = Padding({
      left: 10,
      right: 25,
      top: 4,
      bottom: 7,
      children: [
        Text({
          content: "one",
          font: "",
          color: "red",
          alignment: "right",
        }),
      ],
    });

    const textLeftAnchor = padding.getNewAnchor({
      currentAnchor: Point.at(0, 0),
    });
    expect(textLeftAnchor).toEqual({
      x: 10,
      y: 4,
    });
  });

  test("updates the effective cell size given padding constraints", () => {
    const padding = Padding({
      left: 4,
      right: 9,
      top: 5,
      bottom: 2,
    });

    const effectiveCellSize = padding.getNewEffectiveCellSize(
      Dimensions.of(100, 100)
    );
    expect(effectiveCellSize).toEqual({
      w: 87,
      h: 93,
    });
  });
});
