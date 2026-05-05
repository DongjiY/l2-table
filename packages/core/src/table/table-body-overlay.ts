export class TableBodyOverlay {
  private rowActionContainer: HTMLDivElement;

  constructor(parent: HTMLElement, rowHeight: number) {
    this.rowActionContainer = document.createElement("div");
    this.rowActionContainer.style.position = "absolute";
    this.rowActionContainer.style.width = "100%";
    this.rowActionContainer.style.height = `${rowHeight}px`;
    this.rowActionContainer.style.background = "transparent";
    this.rowActionContainer.style.opacity = "0";
    this.rowActionContainer.style.top = "0";
    parent.appendChild(this.rowActionContainer);
  }

  public hide(): void {
    this.rowActionContainer.style.opacity = "0";
  }

  public drawAtPoint(y: number): void {
    this.rowActionContainer.style.top = `${y}px`;
    this.rowActionContainer.style.opacity = "0.5";
  }
}
