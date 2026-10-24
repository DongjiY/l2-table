import { MomentumScroller } from "./momentum-scroller";
import { Point } from "./point";

describe("MomentumScroller", () => {
  it("applies drag deltas immediately and decays them after release", () => {
    let now = 0;
    let frame: ((timestamp: number) => void) | undefined;
    const applyDelta = jest.fn();
    const momentum = new MomentumScroller(applyDelta, {
      now: () => now,
      requestFrame: (callback) => {
        frame = callback;
        return 1;
      },
      cancelFrame: jest.fn(),
      friction: 0.01,
    });

    momentum.start();
    now = 10;
    momentum.drag(new Point(20, 0));
    momentum.release();
    frame?.(20);

    expect(applyDelta).toHaveBeenNthCalledWith(1, new Point(20, 0));
    expect(applyDelta).toHaveBeenNthCalledWith(2, new Point(20, 0));
    expect(frame).toBeDefined();
  });

  it("cancels an active glide when a new drag begins", () => {
    let now = 0;
    const cancelFrame = jest.fn();
    const momentum = new MomentumScroller(jest.fn(), {
      now: () => now,
      requestFrame: () => 7,
      cancelFrame,
    });

    momentum.start();
    now = 10;
    momentum.drag(new Point(10, 0));
    momentum.release();
    momentum.start();

    expect(cancelFrame).toHaveBeenCalledWith(7);
  });
});
