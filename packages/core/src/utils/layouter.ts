export class Layouter {
  private recordingLayout: boolean = false;
  private layoutWidth: number = 0;

  public layout(width: number): void {
    if (!this.recordingLayout) return;
    this.layoutWidth += width;
  }

  public get staticContentWidth(): number {
    return this.layoutWidth;
  }

  public start(): void {
    if (this.recordingLayout) throw new Error("Layouter is already started");
    this.recordingLayout = true;
  }

  public stop(): void {
    if (!this.recordingLayout) throw new Error("Layouter is already stopped");
    this.recordingLayout = false;
    this.layoutWidth = 0;
  }
}
