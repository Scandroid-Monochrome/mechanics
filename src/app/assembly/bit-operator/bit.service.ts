import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BitService {

  constructor() {
    // this.testDec2Bin();
    // this.testLogicNegate();
  }

  dec2bin(x: number | null) {
    const s = _.isNil(x) ? _.repeat('', 32) : (x >>> 0).toString(2);
    return [...s.padStart(32, '0')];
  }

  testDec2Bin() {
    for (let x=-10; x<=10; x++) {
      console.log(this.dec2bin(x));
    }
  }

  logicNegateSignedInt(x: number): number {
    return ((x >> 31) | ((~x + 1) >> 31)) + 1;
  }

  logicNegateUnsignedInt(x: number): number {
    return (((x >> 1) | (x & 1)) + ~0) >> 31;
  }

  testLogicNegate() {
    for (let x=-100; x<=100; x++) {
      console.log('%d %d', x, this.logicNegateSignedInt(x));
    }
  }

  /*
  Decimal	Octal	Hex	 Binary	Value
  048	    060	30	0011 0000	0	 
  049	    061	31	0011 0001	1	 
  050	    062	32	0011 0010	2	 
  051	    063	33	0011 0011	3	 
  052	    064	34	0011 0100	4	 
  053	    065	35	0011 0101	5	 
  054	    066	36	0011 0110	6	 
  055	    067	37	0011 0111	7	 
  056	    070	38	0011 1000	8	 
  057	    071	39	0011 1001	9	 
  */
  isDigit(x: number) {
    return (
      !(x >> 6) && // ASCII digit's 7-32 bits are all 0
      !(((x & 0b111111) >> 4) ^ 0b11) && // ASCII digit's 5-6 bit are 11
      !(((x & 0b1111) >> 3) && ((x & 0b111) >> 1)) // ASCII digit's 4th bit is either 0, or if 1, its 2-3 bits are all 0
    );
  }
}
