import { FlexRow } from "../table/components/elements/flex-row";
import { Padding } from "../table/components/elements/padding";
import { Text } from "../table/components/elements/text";
import { Dimensions } from "./dimensions";
import { ElementRenderer } from "./element-renderer";
import { Point } from "./point";

describe("Element Renderer", () => {
  test("computes layout width and height correctly", () => {
    const elementRenderer = new ElementRenderer(
      Point.at(0, 0),
      Dimensions.of(100, 100)
    );
    const renderTree = FlexRow({
      gap: 10,
      children: [
        Padding({
          left: 10,
          right: 15,
          top: 0,
          bottom: 0,
          children: [
            Text({
              color: "red",
              content: "jassy",
              font: "24px Sans Serif",
              alignment: "left",
            }),
          ],
        }),
      ],
    });
    const layoutWidth =
      elementRenderer.recursivelyComputeStaticLayoutWidth(renderTree);

    expect(layoutWidth).toBe(25);
  });

  test("throws an error when multiple text elements are provided", () => {
    const elementRenderer = new ElementRenderer(
      Point.at(0, 0),
      Dimensions.of(100, 100)
    );
    const renderTree = FlexRow({
      gap: 10,
      children: [
        Padding({
          left: 10,
          right: 15,
          top: 0,
          bottom: 0,
          children: [
            Text({
              color: "red",
              content: "bitcoin",
              font: "24px Sans Serif",
              alignment: "left",
            }),
          ],
        }),
        Text({
          color: "red",
          content: "dogecoin",
          font: "24px Sans Serif",
          alignment: "left",
        }),
      ],
    });
    expect(() =>
      elementRenderer.recursivelyComputeStaticLayoutWidth(renderTree)
    ).toThrow("Cannot have more than one dynamic element within a CellContent");
  });
});
