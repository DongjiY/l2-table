import { Painter } from "./painter";

export interface Drawable {
  draw(ctx: Painter): void;
}
