import * as _ from 'lodash';

export class Matrix {
  private rows: number[][] = [];
  private columnLabels: string[] = [];

  static of(n: number, defaultValue = 0): Matrix {
    const a = new Matrix();

    a.rows = [];
    for (let i=0; i<n; i++) {
      const row: number[] = [];
      for (let j=0; j<n; j++) {
        row[j] = defaultValue;
      }
      a.rows[i] = row;
    }

    for (let j=0; j<n; j++) {
      a.columnLabels[j] = `x${j}`;
    }

    return a;
  }

  setRows(rows: number[][]) {
    this.rows = rows;
  }

  setColumnLabels(labels: string[]) {
    const n = this.rank;
    const m = labels?.length ?? 0;

    if (m === n) {
      this.columnLabels = labels;
    } else {
      console.error('Number of column labels does not match matrix rank');
    }
  }

  setValue(iRow: number, jCol: number, value: number) {
    this.checkRange(iRow, jCol);
    this.rows[iRow][jCol] = value;
  }

  valueAt(iRow: number, jCol: number): any {
    this.checkRange(iRow, jCol);
    return this.rows[iRow][jCol];
  }

  get rank() {
    return this.rows?.length ?? 0;
  }

  private checkRange(iRow: number, jCol: number) {
    const n = this.rank;
    const inRange = iRow >= 0 && iRow < n && jCol >= 0 && jCol < n;

    if (!inRange) {
      throw ('Invalid operation: out of bounds');
    }
  }

  gaussian() {
    const n = this.rank - 1;
    for (let j=0; j<n; j++) {
      const i = _.findIndex(this.rows, row => row[j] !== 0)
      if (i > j) {
        this.swapRows(i, j);
      }

      this.normalizeRow(j);
      if (j === n) { break; }

      for (let i=j+1; i<n; i++) {
        const a = this.rows[i][j];
        for (let k=j; k<n+1; k++) {
          this.rows[i][k] -= a*this.rows[j][k];
        }
      }
    }

    for (let j=n-1; j>0; j--) {
      for (let i=0; i<j; i++) {
        const a = this.rows[i][j];
        this.rows[i][j] = 0;
        this.rows[i][n] -= a*this.rows[j][n];
      }
    }
  }

  private swapRows(i1: number, i2: number) {
    const row = this.rows[i1];
    this.rows[i1] = this.rows[i2];
    this.rows[i2] = row;
  }

  private normalizeRow(i: number) {
    const row = this.rows[i];
    const a = row[i];
    for (let j=0; j<this.rank; j++) {
      row[j] /= a;
    }
  }
}
