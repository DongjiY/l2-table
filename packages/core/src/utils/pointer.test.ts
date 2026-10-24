import { Pointer } from "./pointer";

type Listener = (event: PointerEvent) => void;

class PointerElement {
  public readonly style = { touchAction: "" };
  private readonly listeners = new Map<string, Listener>();
  private capturedPointerId: number | undefined;

  public addEventListener(type: string, listener: Listener): void {
    this.listeners.set(type, listener);
  }

  public removeEventListener(type: string): void {
    this.listeners.delete(type);
  }

  public setPointerCapture(pointerId: number): void {
    this.capturedPointerId = pointerId;
  }

  public hasPointerCapture(pointerId: number): boolean {
    return this.capturedPointerId === pointerId;
  }

  public releasePointerCapture(pointerId: number): void {
    if (this.capturedPointerId === pointerId) {
      this.capturedPointerId = undefined;
    }
  }

  public getBoundingClientRect(): DOMRect {
    return { left: 0, top: 0 } as DOMRect;
  }

  public dispatch(type: string, event: Partial<PointerEvent>): void {
    this.listeners.get(type)?.({
      isPrimary: true,
      button: 0,
      pointerId: 1,
      pointerType: "mouse",
      clientX: 0,
      clientY: 0,
      ...event,
    } as PointerEvent);
  }
}

describe("Pointer", () => {
  it("includes the pointer source with drag deltas", () => {
    const element = new PointerElement();
    const pointer = new Pointer(element as unknown as HTMLElement);
    const drag = jest.fn();
    pointer.onDrag(drag);

    element.dispatch("pointerdown", { pointerType: "mouse" });
    element.dispatch("pointermove", { pointerType: "mouse", clientX: 10 });
    element.dispatch("pointerup", { pointerType: "mouse", clientX: 10 });

    expect(drag).toHaveBeenCalledTimes(1);
    expect(drag).toHaveBeenLastCalledWith(
      expect.objectContaining({ x: 10, y: 0 }),
      "mouse"
    );

    element.dispatch("pointerdown", { pointerId: 2, pointerType: "touch" });
    element.dispatch("pointermove", {
      pointerId: 2,
      pointerType: "touch",
      clientX: 10,
      clientY: 5,
    });

    expect(drag).toHaveBeenCalledTimes(2);
    expect(drag).toHaveBeenLastCalledWith(
      expect.objectContaining({ x: 10, y: 5 }),
      "touch"
    );

    pointer.close();
  });

  it("reports pointer type when a drag ends or is cancelled", () => {
    const element = new PointerElement();
    const pointer = new Pointer(element as unknown as HTMLElement);
    const up = jest.fn();
    const cancel = jest.fn();
    pointer.onPointerUp(up);
    pointer.onPointerCancel(cancel);

    element.dispatch("pointerdown", { pointerType: "touch" });
    element.dispatch("pointerup", { pointerType: "touch" });
    element.dispatch("pointerdown", { pointerType: "pen" });
    element.dispatch("pointercancel", { pointerType: "pen" });

    expect(up).toHaveBeenCalledWith("touch");
    expect(cancel).toHaveBeenCalledWith("pen");

    pointer.close();
  });
});
