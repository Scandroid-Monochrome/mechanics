import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BitService } from './bit.service';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { map, startWith, tap } from 'rxjs';
import * as _ from 'lodash';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

interface LabelValue {
  label: string;
  value: string;
}

@Component({
  selector: 'app-bit-operator',
  templateUrl: './bit-operator.component.html',
  styleUrls: ['./bit-operator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitOperatorComponent {
  #service = inject(BitService);
  #fb = inject(NonNullableFormBuilder);

  numberInput1 = this.#fb.control(0);
  number1$ = this.numberInput1.valueChanges.pipe(startWith(0));
  number1 = toSignal(this.number1$);
  binary1$ = this.number1$.pipe(
    map(x => this.#service.dec2bin(x))
  );

  numberInput2 = this.#fb.control(0);
  number2$ = this.numberInput2.valueChanges.pipe(startWith(0));
  number2 = toSignal(this.number2$);
  binary2$ = this.number2$.pipe(
    map(x => this.#service.dec2bin(x))
  );

  binaryOperatorControl = this.#fb.control('&');
  binaryOperator$ = this.binaryOperatorControl.valueChanges.pipe(startWith('&'));
  binaryOperator = toSignal(this.binaryOperator$);

  number3 = computed(() => {
    const n1 = this.number1();
    const n2 = this.number2();

    if (_.isNil(n1) || _.isNil(n2)) { return null; }

    switch (this.binaryOperator()) {
      case '&': return n1 & n2;
      case '|': return n1 | n2;
      case '^': return n1 ^ n2;
      default: return null;
    }
  });

  binary3 = computed(() => this.#service.dec2bin(this.number3()));

  unaryOperatorControl1 = this.#fb.control('<<');
  unaryOperator1$ = this.unaryOperatorControl1.valueChanges.pipe(startWith('<<'));
  unaryOperator1 = toSignal(this.unaryOperator1$);

  unaryOperatorControl2 = this.#fb.control('<<');
  unaryOperator2$ = this.unaryOperatorControl2.valueChanges.pipe(startWith('<<'));
  unaryOperator2 = toSignal(this.unaryOperator2$);

  range = _.range(0, 32);

  binaryOperators: LabelValue[] = [
    {value: '&', label: '&'}, // Bitwise AND
    {value: '|', label: '|'}, // Bitwise OR
    {value: '^', label: '^'}, // Bitwise XOR
  ];

  unaryOperators: LabelValue[] = [
    {value: '<<', label: '<<'}, // Left Shift
    {value: '>>', label: '>>'}, // Right Shift
    {value: '~', label: '~)'}, // Bitwise NOT
  ];
}
