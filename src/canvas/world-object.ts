import { Drawable } from "./drawable";

export abstract class WorldObject implements Drawable {
  protected readonly worldX: number;
  protected readonly worldY: number;

  constructor(worldX: number, worldY: number) {
    this.worldX = worldX;
    this.worldY = worldY;
  }

  get X(): number {
    return this.worldX;
  }

  get Y(): number {
    return this.worldY;
  }

  public abstract getBoundingBox(): {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  public abstract draw(): void;
}
