import { Element } from "../types/element";
import { Dimensions } from "./dimensions";
import { Painter } from "./painter";
import { Point } from "./point";

export class ElementRenderer {
  private dynamicElementSeen: boolean = false;

  constructor(private anchor: Point, private cellSize: Dimensions) {}

  public recursivelyRenderElements(
    root: Element,
    anchor: Point,
    cellSize: Dimensions,
    painter: Painter,
    contentLayout: Map<string, number>
  ): void {
    const arrChildren = this.getIterableElementChildren(root);
  }

  public recursivelyComputeStaticLayoutWidth(root: Element): number {
    let totalLayoutWidth = 0;
    if (root.layout === "static") totalLayoutWidth = root.layoutWidth;

    const arrChildren = this.getIterableElementChildren(root);

    while (arrChildren.length > 0) {
      const child = arrChildren.shift();

      if (child === undefined) continue;
      if (child.layout === "dynamic" && this.dynamicElementSeen)
        throw new Error(
          "Cannot have more than one dynamic element within a CellContent"
        );
      if (child.layout === "dynamic") {
        this.dynamicElementSeen = true;
      }

      const layoutWidth = this.recursivelyComputeStaticLayoutWidth(child);

      // todo - right now we are adding 0s for elements with variable (computable) layout width and height.
      // explore the idea of actually adding the computed size - I think this fails if you have two text elements in a flex row config
      // because the second text element does not know where to draw (anchor not moved)
      totalLayoutWidth += layoutWidth;
    }

    return totalLayoutWidth;
  }

  private getIterableElementChildren(e: Element): Array<Element> {
    const rawChildren = e.children;
    const childArr = rawChildren instanceof Array ? rawChildren : [rawChildren];
    return childArr.filter((child) => child !== undefined);
  }
}
