import { BehaviorSubject, Subject, Observable } from "rxjs";
import { Closeable } from "./closeable";

type KeyFn<TData, TKey> = (value: TData) => TKey;

export class BufferedStream<TData, TKey = string> implements Closeable {
  private paused$ = new BehaviorSubject<boolean>(false);

  private input$ = new Subject<TData>();
  private output$ = new Subject<TData>();

  private buffer = new Map<TKey, TData>();

  public readonly stream$: Observable<TData> = this.output$.asObservable();

  constructor(private keyFn: KeyFn<TData, TKey>) {
    this.input$.subscribe((value) => {
      const key = this.keyFn(value);

      if (this.paused$.value) {
        this.buffer.set(key, value);
      } else {
        this.output$.next(value);
      }
    });

    this.paused$.subscribe((paused) => {
      if (!paused) {
        for (const value of this.buffer.values()) {
          this.output$.next(value);
        }
        this.buffer.clear();
      }
    });
  }

  public next(value: TData) {
    this.input$.next(value);
  }

  public asObservable(): Observable<TData> {
    return this.stream$;
  }

  public pause() {
    this.paused$.next(true);
  }

  public resume() {
    this.paused$.next(false);
  }

  public isPaused(): boolean {
    return this.paused$.value;
  }

  public close(): void {
    this.input$.complete();
    this.output$.complete();
    this.paused$.complete();
    this.buffer.clear();
  }
}
