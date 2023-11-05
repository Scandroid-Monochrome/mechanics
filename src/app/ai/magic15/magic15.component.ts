import { Component } from '@angular/core';
import * as _ from 'lodash';
import { Cell, CellValue, N, Node, State } from './magic15.model';
import { Magic15Service } from './magic15.service';

@Component({
  selector: 'app-magic15',
  templateUrl: './magic15.component.html',
  styleUrls: ['./magic15.component.scss']
})
export class Magic15Component {
  state!: State;

  constructor(
    private service: Magic15Service
  ) {
    this.refresh();
  }

  matrix(i: number, j: number): CellValue {
    return this.state ? this.state.cellValues[i*N+j] : undefined;
  }

  get range() {
    return _.range(0, N);
  }

  private get iEmpty() {
    return this.state.emptyCell().toStateIndex();
  }

  refresh() {
    const n2 = N * N;
    const a = _.range(1, n2);
    const b = _.shuffle(a);
    const r = Math.floor(Math.random()*n2);

    const s1 = b.slice(0, r);
    const s2 = b.slice(r);

    this.state = new State([...s1, undefined, ...s2]);

    console.log(this.state);
  }

  onClick(i: number, j: number) {
    this.moveCell(new Cell(i, j));
  }

  private moveCell(cell: Cell) {
    const emptyCell = this.state.emptyCell()

    if (Cell.isAdjacent(emptyCell, cell)) {
      const i = cell.toStateIndex();
      this.state.cellValues[this.iEmpty] = this.state.cellValues[i];
      this.state.cellValues[i] = undefined;
    }
  }

  cellClass(i: number, j: number) {
    const emptyCell = Cell.fromStateIndex(this.iEmpty);
    let thisCell = new Cell(i, j);

    return Cell.isAdjacent(emptyCell, thisCell) ? 'active' : 'inactive';
  }

  play() {
    this.service.solve(this.state);
  }
}
