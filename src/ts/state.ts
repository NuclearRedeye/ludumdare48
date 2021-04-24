export enum states {
  STARTING,
  LOADING,
  LOADED
}

let currentState: number = states.STARTING;

export function getCurrentState(): number {
  return currentState;
}

export function setCurrentState(state: number): void {
  if (state !== currentState) {
    currentState = state;
  }
}
