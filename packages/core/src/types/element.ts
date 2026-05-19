import { Dimensions, Painter, Point } from "../utils";

export type FunctionElement<TParams extends Record<string, any>> = (
  params:
    | {
        children?: ElementChildren;
      } & TParams
) => Element;

export type ElementChildren = Array<Element> | Element;

export type ElementBase = {
  draw: ({
    anchor,
    effectiveCellSize,
    painter,
  }: {
    anchor: Point;
    effectiveCellSize: Dimensions;
    painter: Painter;
  }) => void;
  getNewAnchor: ({
    currentAnchor,
    childCount,
  }: {
    currentAnchor: Point;
    childCount?: number;
  }) => Point;
  getNewEffectiveCellSize: (currentEffectiveCellSize: Dimensions) => Dimensions;
  children?: ElementChildren;
};

type DynamicElement = {
  layout: "dynamic";
  id: string;
} & ElementBase;

type StaticElement = {
  layout: "static";
  layoutWidth: number;
} & ElementBase;

export type Element = DynamicElement | StaticElement;
