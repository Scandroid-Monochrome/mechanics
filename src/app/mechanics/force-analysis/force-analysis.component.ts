import { Component } from '@angular/core';
import { FormArray, FormControl, FormBuilder } from '@angular/forms';
import { data } from './data';
import { Matrix } from './matrix';

@Component({
  selector: 'app-force-analysis',
  templateUrl: './force-analysis.component.html',
  styleUrls: ['./force-analysis.component.scss']
})
export class ForceAnalysisComponent {
  form = {} as FormArray<FormArray<FormControl<number>>>;
  columnLabels: string[] = [];

  matrix = {} as Matrix;

  constructor(
    private fb: FormBuilder
  ) {
    this.initForm(fb);
  }

  private initForm(fb: FormBuilder) {
    this.columnLabels = [
      'T',
      'Ax', 'Ay',
      'Bx', 'By',
      'Cx', 'Cy',
      'Dx', 'Dy',
      'Ex', 'Ey',
      'Fx', 'Fy',
      'Gx', 'Gy',
      'Value'
    ];

    const n = this.columnLabels.length;

    this.matrix = Matrix.of(n);
    this.matrix.setColumnLabels(this.columnLabels);
    this.matrix.setRows(data);

    const rows: FormArray<FormControl<number>>[] = [];
    for (let i = 0; i < n; i++) {
      const controls: FormControl<number>[] = [];
      for (let j = 0; j < n; j++) {
        controls[j] = fb.control(this.matrix.valueAt(i, j));
      }

      rows[i] = fb.array(controls);
    }

    this.form = fb.array(rows);
  }

  solve() {
    this.matrix.gaussian();

    const n = this.columnLabels.length;

    for (let i = 0; i < n - 1; i++) {
      const row = this.form.controls[i];
      for (let j = 0; j < n; j++) {
        const control = row.controls[j];
        control.patchValue(this.matrix.valueAt(i, j));
      }
    }
  }
}
