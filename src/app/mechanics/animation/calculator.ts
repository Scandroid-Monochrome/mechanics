import * as _ from 'lodash';
import { Point } from 'src/app/common/coordinate';

export class Velocity {
  constructor(
    public x: number,
    public y: number
  ) {}
}

export class Acceleration {
  constructor(
    public x: number,
    public y: number
  ) {}
}

export class Kinematics {
  constructor(
    public positions: Point[],
    public velocities: Velocity[],
    public accelerations: Acceleration[],
  ) {}
}

export class Linkage {
  A = Point.of(0, 0, 'A');
  E = Point.of(-35, -70, 'E');
  G = Point.of(-312, 90, 'G');

  AB = 60.2066483;
  BD = 89.02677406;
  DE = 75.00480118;
  EC = 155.6546344;
  CF = 151.8206524;
  FG = 165.7366372;

  omegaAB = 2;
}

export class Calculator {
  linkage = new Linkage();
  kinematics: Kinematics | null = null;

  calcKinematics(theta: number, omega: number) {
    return new Kinematics(
      this.positions(theta),
      this.velocities(theta, omega),
      this.accelerations(theta, omega)
    );
  }

  /**
   * For a given AB bar angle, this returns X, Y positions for all joints
   * of a 5-bar linkage mechanism.
   *
   * @param theta angle (in radian) of bar AB with respec to X-axis
   * @returns X, Y positions of all joints
   */
  positions(theta: number) {
    const A = this.linkage.A;
    const E = this.linkage.E;
    const G = this.linkage.G;

    const AB = this.linkage.AB;
    const BD = this.linkage.BD;
    const DE = this.linkage.DE;

    const EC = this.linkage.EC;
    const CF = this.linkage.CF;
    const FG = this.linkage.FG;

    const B = Point.of(AB*Math.cos(theta), AB*Math.sin(theta), 'B');
    const D = this.triangleJoint(B, E, BD, DE, 'D');
    const C = this.linearJoint(E, D, EC, 'C');
    const F = this.triangleJoint(C, G, CF, FG, 'F');

    return [A, B, C, D, E, F, G];
  }

  /**
   * For a given AB bar angle theta and its constant angular velocity omega,
   * this returns velocities for all joints of a 5-bar linkage mechanism.
   *
   * @param theta angle (in radian) of bar AB with respec to X-axis
   * @param omega angular velocity (in radian/s) of bar AB.
   */
  velocities(theta: number, omega: number) {
    const dt = 0.1;
    const positions1 = this.positions(theta);
    const positions2 = this.positions(theta + omega * dt);

    return _.map(positions1, (p1, i) => {
      const p2 = positions2[i];
      return new Velocity(
        (p2.x - p1.x) / dt,
        (p2.y - p1.y) / dt
      );
    });
  }

  /**
   * For a given AB bar angle theta and its constant angular velocity omega,
   * this returns accelerations for all joints of a 5-bar linkage mechanism.
   *
   * @param theta angle (in radian) of bar AB with respec to X-axis
   * @param omega angular velocity (in radian/s) of bar AB.
   */
  accelerations(theta: number, omega: number) {
    const dt = 0.1;
    const velocities1 = this.velocities(theta, omega);
    const velocities2 = this.velocities(theta + omega * dt, omega);

    return _.map(velocities1, (v1, i) => {
      const v2 = velocities2[i];
      return new Acceleration(
        (v2.x - v1.x) / dt,
        (v2.y - v1.y) / dt
      );
    });
  }

  linearJoint(p1: Point, p2: Point, d: number, label = '') {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const r12 = Math.sqrt(dx*dx + dy*dy);

    const x = p1.x + dx * d/r12;
    const y = p1.y + dy * d/r12;

    return Point.of(x, y, label);
  }

  triangleJoint(p1: Point, p2: Point, d1: number, d2: number, label = ''): Point {
    const x1 = p1.x;
    const x2 = p2.x;
    const y1 = p1.y;
    const y2 = p2.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dd = d2 - d1;
    const xb = 0.5*(x1+x2);
    const yb = 0.5*(y1+y2);
    const db = 0.5*(d1+d2);

    const p = yb + (dx*xb-dd*db)/dy;
    const q = dx/dy;
    const a = 1 + q*q;
    const b = 2*(q*(y1 - p) - x1);
    const c = x1*x1 + y1*y1 + p*p - d1*d1 - 2*p*y1;

    // TODO: do we need to check the 2nd solution?
    const x = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
    const y = p - q*x;

    return Point.of(x, y, label);
  }
}