export class Layouter {
  private recordingLayout: boolean = false;
  private layoutWidth: number = 0;

  public layout(width: number): void {
    if (!this.recordingLayout) {
      console.warn("Layouting skipped... did you call start?");
    }
    this.layoutWidth += width;
  }

  public start(): void {
    if (this.recordingLayout) throw new Error("Layouter is already started");
    this.recordingLayout = true;
  }

  public stop(): number {
    if (!this.recordingLayout) throw new Error("Layouter is already stopped");
    const res = this.layoutWidth;
    this.recordingLayout = false;
    this.layoutWidth = 0;
    return res;
  }
}
