/**
 * Atharva Nagari VIII - Multi-Floor Elevator State Machine & Movement Engine
 * 
 * Supports:
 * - 12 residential storeys + Ground floor.
 * - Formal FSM: IDLE_CLOSED -> OPENING -> DOORS_OPEN -> CLOSING -> MOVING -> ARRIVED.
 * - Floor queueing system.
 * - Kinematic platform attachment for transporting the player smoothly.
 */

export type ElevatorState =
  | 'IDLE_CLOSED'
  | 'OPENING'
  | 'DOORS_OPEN'
  | 'CLOSING'
  | 'MOVING'
  | 'ARRIVED';

export interface ElevatorEventMap {
  stateChange: (state: ElevatorState, prev: ElevatorState) => void;
  floorArrival: (floor: number) => void;
  doorProgress: (progress: number) => void; // 0 to 1
}

export class ElevatorStateMachine {
  private state: ElevatorState = 'IDLE_CLOSED';
  public currentFloor: number = 0;
  public targetFloor: number = 0;
  public currentY: number = 0;

  // Floor heights configuration (Ground = 0.0m, 2.6m per floor)
  public readonly floorHeights: number[] = [
    0.0,  // G
    2.6,  // 1
    5.2,  // 2
    7.8,  // 3
    10.4, // 4
    13.0, // 5
    15.6, // 6
    18.2, // 7
    20.8, // 8
    23.4, // 9
    26.0, // 10
    28.6, // 11
    31.2, // 12 (Penthouse / Sample Flat)
  ];

  public doorProgress: number = 0; // 0 = closed, 1 = open
  public travelSpeed: number = 3.5; // m/s
  public doorSpeed: number = 1.6; // 1 / sec

  private listeners: Partial<ElevatorEventMap> = {};
  private floorQueue: number[] = [];

  constructor(initialFloor = 0, listeners?: Partial<ElevatorEventMap>) {
    this.currentFloor = initialFloor;
    this.targetFloor = initialFloor;
    this.currentY = this.floorHeights[initialFloor] ?? 0;
    if (listeners) this.listeners = listeners;
  }

  public getState(): ElevatorState {
    return this.state;
  }

  private setState(next: ElevatorState): void {
    if (this.state === next) return;
    const prev = this.state;
    this.state = next;
    this.listeners.stateChange?.(next, prev);
  }

  /**
   * Request a destination floor from inside the cabin or call button
   */
  public requestFloor(floor: number): void {
    if (floor < 0 || floor >= this.floorHeights.length) return;

    if (floor === this.currentFloor && this.state === 'IDLE_CLOSED') {
      this.setState('OPENING');
      return;
    }

    if (!this.floorQueue.includes(floor)) {
      this.floorQueue.push(floor);
    }

    if (this.state === 'IDLE_CLOSED') {
      this.processNextQueueItem();
    } else if (this.state === 'DOORS_OPEN') {
      this.setState('CLOSING');
    }
  }

  private processNextQueueItem(): void {
    if (this.floorQueue.length === 0) return;
    this.targetFloor = this.floorQueue.shift()!;
    if (this.targetFloor !== this.currentFloor) {
      this.setState('MOVING');
    } else {
      this.setState('OPENING');
    }
  }

  /**
   * Tick function called in the render / physics loop
   * 
   * @param dt Delta time in seconds
   * @returns Delta Y movement during this frame (used to carry the player)
   */
  public update(dt: number): number {
    let deltaY = 0;

    switch (this.state) {
      case 'OPENING':
        this.doorProgress += this.doorSpeed * dt;
        if (this.doorProgress >= 1.0) {
          this.doorProgress = 1.0;
          this.setState('DOORS_OPEN');
        }
        this.listeners.doorProgress?.(this.doorProgress);
        break;

      case 'CLOSING':
        this.doorProgress -= this.doorSpeed * dt;
        if (this.doorProgress <= 0.0) {
          this.doorProgress = 0.0;
          if (this.targetFloor !== this.currentFloor) {
            this.setState('MOVING');
          } else {
            this.setState('IDLE_CLOSED');
            this.processNextQueueItem();
          }
        }
        this.listeners.doorProgress?.(this.doorProgress);
        break;

      case 'MOVING': {
        const targetY = this.floorHeights[this.targetFloor];
        const dir = Math.sign(targetY - this.currentY);
        const step = this.travelSpeed * dt;

        if (Math.abs(targetY - this.currentY) <= step) {
          deltaY = targetY - this.currentY;
          this.currentY = targetY;
          this.currentFloor = this.targetFloor;
          this.setState('ARRIVED');
          this.listeners.floorArrival?.(this.currentFloor);

          // Automatically open doors after arrival
          setTimeout(() => {
            this.setState('OPENING');
          }, 400);
        } else {
          deltaY = dir * step;
          this.currentY += deltaY;
        }
        break;
      }

      case 'ARRIVED':
      case 'DOORS_OPEN':
      case 'IDLE_CLOSED':
      default:
        break;
    }

    return deltaY;
  }
}
