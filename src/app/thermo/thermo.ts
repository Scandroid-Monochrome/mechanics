import { Coordinate, Point } from '../common/coordinate';

export class Constants {
  static R = 8.314; // gas constant in J/(mol.K)
  static M = 28.97; // molar mass of air in g/mol
  static C = this.R / this.M;

  static Cp = 1; // air isobaric heat capacity in kJ/(kg.K)
  static Cv = 0.7142857143; // air isochoric heat capacity in kJ/(kg.K)
  static k = this.Cp / this.Cv; // heat capacity ratio
}

// state of a thermo system
export class State {
  P = 0; // pressure in Pa
  v = 0; // specific volumn in m^3/kg
  T = 0; // temperature in K
  u = 0; // specific internal energy in J/kg
  h = 0; // specific enthalpy in J/kg
  s = 0; // specific entropy in J/(kg.K)

  pvPoint(coord: Coordinate) {
    return coord.userToScreen(
      Point.of(this.v, this.P)
    );
  }

  ptPoint(coord: Coordinate) {
    return coord.userToScreen(
      Point.of(this.T, this.P)
    );
  }

  idealGasP() {
    const C = Constants.C;
    return C * (this.T / this.v);
  }

  idealGasV() {
    const C = Constants.C;
    return C * (this.T / this.P);
  }

  idealGasT() {
    const C = Constants.C;
    return (this.P * this.v) / C;
  }

  isentropicPFromPT(T2: number) {
    const k = Constants.k;
    const n = k / (1 - k);
    return this.P * Math.pow(this.T / T2, n);
  }

  isentropicTFromPT(P2: number) {
    const k = Constants.k;
    const n = (1 - k) / k;
    return this.T * Math.pow(this.P / P2, n);
  }

  isentropicPFromPv(v2: number) {
    const k = Constants.k;
    return this.P * Math.pow(this.v / v2, k);
  }

  isentropicVFromPv(P2: number) {
    const k = Constants.k;
    const n = 1 / k;
    return this.v * Math.pow(this.P / P2, n);
  }

  isentropicTFromTv(v2: number) {
    const k = Constants.k;
    const n = k - 1;
    return this.T * Math.pow(this.v / v2, n);
  }

  isentropicVFromTv(T2: number) {
    const k = Constants.k;
    const n = 1 / (k - 1);
    return this.v * Math.pow(this.T / T2, n);
  }

  log(label: string) {
    console.log(`${label}: P=${this.P} T=${this.T} v=${this.v}`);
  }
}
