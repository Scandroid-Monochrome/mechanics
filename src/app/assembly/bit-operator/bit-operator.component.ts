import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BitService } from './bit.service';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-bit-operator',
  templateUrl: './bit-operator.component.html',
  styleUrls: ['./bit-operator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitOperatorComponent {
  #service = inject(BitService);
  #fb = inject(FormBuilder);
  numberInput = this.#fb.control(0);
  binary$ = this.numberInput.valueChanges.pipe(
    map(x => this.#service.dec2bin(x))
  )

  range = _.range(0, 32);
}
