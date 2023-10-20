import { Component } from '@angular/core';
import * as _ from 'lodash';

type CellValue = number | null;
type State = CellValue[];

class Cell {
  constructor(public iRow: number, public jCol: number) {
  }

  static fromStateIndex(k: number) {
    const jCol = k % Matrix.rank;
    const iRow = (k - jCol) / Matrix.rank;

    return new Cell(iRow, jCol);
  }

  toStateIndex(): number {
    return this.iRow*Matrix.rank + this.jCol;
  }

  equals(other: Cell): boolean {
    return this.iRow === other.iRow && this.jCol === other.jCol;
  }

  static isAdjacent(c1: Cell, c2: Cell): boolean {
    const di = Math.abs(c1.iRow - c2.iRow);
    const dj = Math.abs(c1.jCol - c2.jCol);
    return di+dj === 1;
  }
}

class Matrix {
  static rank = 4; // rank
  rank = Matrix.rank;
  data!: CellValue[][];

  constructor() { this.init(); }

  init() {
    const n = Matrix.rank;
    const matrix: CellValue[][] = [];
    for (let i=0; i<n; i++) {
      const row: CellValue[] = [];
      for (let j=0; j<n; j++) {
        row[j] = null;
      }
      matrix[i] = row;
    }
    this.data = matrix;
  }

  static fromState(s: State): Matrix {
    const a = new Matrix();
    const n = a.rank;

    if (s?.length === n) {
      for (let i=0; i<n; i++) {
        for (let j=0; j<n; j++) {
          const k = i*n + j;
          a.data[i][j] = s[k];
        }
      }
    }

    return a;
  }

  toState(): State {
    const s: State = [];
    const n = this.rank;

    for (let i=0; i<n; i++) {
      for (let j=0; j<n; j++) {
        const k = i*n + j;
        s[k] = this.data[i][j];
      }
    }

    return s;
  }
}

@Component({
  selector: 'app-magic15',
  templateUrl: './magic15.component.html',
  styleUrls: ['./magic15.component.scss']
})
export class Magic15Component {
  n = Matrix.rank;
  state!: CellValue[];
  iEmpty!: number;

  constructor() {
    this.refresh();
  }

  matrix(i: number, j: number): CellValue {
    return this.state ? this.state[i*this.n+j] : null;
  }

  get range() {
    return _.range(0, this.n);
  }

  refresh() {
    const n2 = this.n * this.n;
    const a = _.range(1, n2);
    const b = shuffle(a);
    const r = Math.floor(Math.random()*n2);

    const s1 = b.slice(0, r);
    const s2 = b.slice(r);

    this.state = [...s1, null, ...s2];
    this.iEmpty = r;

    console.log(this.state);
  }

  onClick(i: number, j: number) {
    const emptyCell = Cell.fromStateIndex(this.iEmpty);
    let thisCell = new Cell(i, j);
    const thisIndex = thisCell.toStateIndex();

    if (Cell.isAdjacent(emptyCell, thisCell)) {
      const thisValue = this.state[thisIndex];
      this.state[this.iEmpty] = thisValue;
      this.state[thisIndex] = null;
      this.iEmpty = thisIndex;
    }
  }

  cellClass(i: number, j: number) {
    const emptyCell = Cell.fromStateIndex(this.iEmpty);
    let thisCell = new Cell(i, j);

    return Cell.isAdjacent(emptyCell, thisCell) ? 'active' : 'inactive';
  }
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}