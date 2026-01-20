import { Canvas } from "./canvas";

export class TransferrableCanvas extends Canvas {
  constructor() {
    super();
  }

  public transferOffscreen(): OffscreenCanvas {
    return this.element.transferControlToOffscreen();
  }
}
