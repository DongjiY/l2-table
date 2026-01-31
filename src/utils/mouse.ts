import { Camera } from "./camera";
import { Point } from "./point";

export class Mouse {
  private point: Point = new Point();

  constructor(
    container: HTMLElement,
    private readonly camera: Camera,
  ) {
    container.addEventListener("mousemove", () => this.onMouseMove);
  }

  private onMouseMove(e: MouseEvent): void {
    console.log(e);
  }
}
