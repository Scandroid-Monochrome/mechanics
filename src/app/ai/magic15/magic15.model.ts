import * as _ from 'lodash';

export const N = 4; // the cell matrix rank;

export type CellValue = number | undefined;

export class Cell {
  constructor(
    public iRow: number,
    public jCol: number,
    public value?: CellValue
  ) { }

  static fromStateIndex(k: number) {
    const jCol = k % N;
    const iRow = (k - jCol) / N;

    return new Cell(iRow, jCol);
  }

  toStateIndex(): number {
    return this.iRow*N + this.jCol;
  }

  equals(other: Cell): boolean {
    return this.iRow === other.iRow && this.jCol === other.jCol;
  }

  static isAdjacent(c1: Cell, c2: Cell): boolean {
    const di = Math.abs(c1.iRow - c2.iRow);
    const dj = Math.abs(c1.jCol - c2.jCol);
    return di+dj === 1;
  }

  static adjacentCells(cell: Cell): Cell[] {
    const i = cell.iRow;
    const j = cell.jCol;
    const cells: Cell[] = [];

    if (i > 0)   { cells.push(new Cell(i-1, j)); }
    if (j > 0)   { cells.push(new Cell(i, j-1)); }
    if (i < N-1) { cells.push(new Cell(i+1, j)); }
    if (j < N-1) { cells.push(new Cell(i, j+1)); }

    return cells;
  }
}

export class State {
  constructor(
    public cellValues: CellValue[] = []
  ) { };

  error() {
    return _.reduce(
      this.cellValues,
      (p, c, i) => p + Math.abs(c??0-i),
      0
    );
  }

  emptyCell() {
    const i = _.findIndex(this.cellValues, v => _.isNil(v));
    return Cell.fromStateIndex(i);
  }

  adjacentCells() {
    return Cell.adjacentCells(this.emptyCell());
  }

  equals(other: State) {
    for (let i=0; i<N*N; i++) {
      if (other.cellValues[i] !== this.cellValues[i]) {
        return false;
      }
    }

    return true;
  }

  frontier() {
    const emptyCell = this.emptyCell();
    const i = emptyCell.iRow;
    const j = emptyCell.jCol;

    const frontier = new Frontier();

    if (i > 0)   { frontier.addState(this.swap(new Cell(i-1, j), emptyCell)); }
    if (j > 0)   { frontier.addState(this.swap(new Cell(i, j-1), emptyCell)); }
    if (i < N-1) { frontier.addState(this.swap(new Cell(i+1, j), emptyCell)); }
    if (j < N-1) { frontier.addState(this.swap(new Cell(i, j+1), emptyCell)); }

    return frontier;
  }

  swap(cell1: Cell, cell2: Cell) {
    const state = new State(this.cellValues);
    const i1 = cell1.toStateIndex();
    const i2 = cell2.toStateIndex();
    const v = state.cellValues[i2];
    state.cellValues[i2] = state.cellValues[i1];
    state.cellValues[i1] = v;
    return state;
  }
}

export class Node {
  constructor(
    public currentState: State,
    public previousState?: State
  ) { }
}

export class Frontier {
  constructor(
    public states: State[] = []
  ) { }

  addState(state: State) {
    const stateExist = _.some(this.states, s => s.equals(state));
    if (!stateExist) { this.states.push(state)}
  }

  addStates(states: State[]) {
    _.each(states, s => this.addState(s));
  }

  mergeWith(frontier: Frontier) {
    this.addStates(frontier.states);
  }

  solutions() {
    return _.filter(this.states, state => state.error() === 0);
  }
}

export class Frontiers {
  constructor(
    private frontiers: Frontier[] = []
  ) { }

  mergeAll() {
    const frontier = new Frontier();
    _.each(this.frontiers, f => frontier.mergeWith(f));
    return frontier;
  }

  lastFrontier() {
    return _.last(this.frontiers);
  }

  addNextFrontier() {
    const nextFrontier = new Frontier();
    const states = this.mergeAll().states;
    _.each(states, s => nextFrontier.mergeWith(s.frontier()))
    this.frontiers.push(nextFrontier);
  }
}
