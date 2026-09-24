import { TextMeasurer } from "./text-measurer";

describe("TextMeasurer", () => {
  test("uses the supplied font and rounds widths up", () => {
    const measureText = jest.fn().mockReturnValue({ width: 12.1 });
    const context = {
      font: "",
      measureText,
    } as unknown as CanvasRenderingContext2D;
    const measurer = new TextMeasurer(context);

    expect(measurer.measure("price", "12px Inter")).toBe(13);
    expect(context.font).toBe("12px Inter");
    expect(measureText).toHaveBeenCalledWith("price");
  });
});
