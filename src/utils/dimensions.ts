export class Dimensions {
  constructor(
    public w: number = 0,
    public h: number = 0,
  ) {}

  public static of(w: number, h: number): Dimensions {
    return new Dimensions(w, h);
  }
}
