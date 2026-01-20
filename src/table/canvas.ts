export class Canvas {
  protected element: HTMLCanvasElement;

  constructor() {
    this.element = document.createElement("canvas");
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.display = "block";
  }

  public getElement(): HTMLCanvasElement {
    return this.element;
  }
}
