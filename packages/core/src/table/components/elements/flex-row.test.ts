import { Point } from "../../../utils";
import { FlexRow } from "./flex-row";
import { Text } from "./text";

describe("Flex Row", () => {
  test("updates the anchor point correctly", () => {
    const flexRow = FlexRow({
      gap: 5,
      children: [
        Text({
          content: "hello",
          font: "",
          color: "blue",
          alignment: "left",
        }),
        Text({
          content: "goodbye",
          font: "",
          color: "blue",
          alignment: "left",
        }),
        Text({
          content: "again",
          font: "",
          color: "blue",
          alignment: "left",
        }),
      ],
    });
    const text1LayoutWidth = 10;
    const text2LayoutWidth = 20;

    const text1LeftAnchor = flexRow.getNewAnchor({
      currentAnchor: Point.at(0, 0),
      childCount: 0,
    });
    expect(text1LeftAnchor).toEqual({
      x: 0,
      y: 0,
    });

    const text2LeftAnchor = flexRow.getNewAnchor({
      currentAnchor: Point.at(
        text1LeftAnchor.x + text1LayoutWidth,
        text1LeftAnchor.y
      ),
      childCount: 1,
    });
    expect(text2LeftAnchor).toEqual({
      x: 15,
      y: 0,
    });

    const text3LeftAnchor = flexRow.getNewAnchor({
      currentAnchor: Point.at(
        text2LeftAnchor.x + text2LayoutWidth,
        text2LeftAnchor.y
      ),
      childCount: 2,
    });
    expect(text3LeftAnchor).toEqual({
      x: 40,
      y: 0,
    });
  });
});
