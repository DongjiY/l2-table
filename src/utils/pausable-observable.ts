import { Observable, BehaviorSubject, switchMap, NEVER } from "rxjs";

export class PausableObservable<T> {
  private pauser$ = new BehaviorSubject<boolean>(true); // true = running, false = paused
  public readonly observable$: Observable<T>;

  constructor(source$: Observable<T>) {
    this.observable$ = this.pauser$.pipe(
      switchMap((running) => (running ? source$ : NEVER))
    );
  }

  pause() {
    this.pauser$.next(false);
  }

  resume() {
    this.pauser$.next(true);
  }

  isPaused(): boolean {
    return !this.pauser$.getValue();
  }
}
