import { Component } from '@angular/core';
import * as _ from 'lodash';

type Cell = number | null;

@Component({
  selector: 'app-magic15',
  templateUrl: './magic15.component.html',
  styleUrls: ['./magic15.component.scss']
})
export class Magic15Component {
  n = 4;
  matrix: Cell[][] = [];

  constructor() {
    this.refresh();
  }

  get range() {
    return _.range(0, this.n);
  }

  refresh() {
    const a = _.range(1, 16);
    const b = shuffle(a);
    const r = Math.floor(Math.random()*16);
    console.log(b);
    console.log(r);

    const d: Cell[][] = [];
    for (let i=0; i<this.n; i++) { d[i] = _.times(this.n, () => null); }
    for (let k=0; k<this.n*this.n-1; k++) {
      const m = k<r ? k : (k+1);
      const i = Math.floor(m/this.n);
      const j = m - this.n*i;
      d[i][j] = b[k];
    }

    this.matrix = d;
    console.log(this.matrix);
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