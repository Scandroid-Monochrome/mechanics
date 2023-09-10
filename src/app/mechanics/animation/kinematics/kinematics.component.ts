import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { Renderer } from '../renderer';
import { Point } from 'src/app/common/coordinate';
import { Acceleration, Velocity } from '../calculator';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-kinematics',
  templateUrl: './kinematics.component.html',
  styleUrls: ['./kinematics.component.scss']
})
export class KinematicsComponent {
  @Input() renderer: Renderer | undefined

  displayedColumns: string[] = ['joint', 'position', 'velocity', 'acceleration'];

  constructor(
    private dp: DecimalPipe
  ) {}

  get kinematicsDataSource() {
    const k = this.renderer?.kinematics;
    if (!k) { return []; }

    return _.map(k.positions, (p, i) => {
      return {
        joint: p.label,
        position: this.position(p),
        velocity: this.velocity(k.velocities[i]),
        acceleration: this.acceleration(k.accelerations[i])
      }
    });
  }

  private position(p: Point): string {
    const x = this.format(p.x);
    const y = this.format(p.y);
    return `(${x}, ${y})`;
  }

  private velocity(v: Velocity): string {
    const x = this.format(v.x);
    const y = this.format(v.y);
    return `(${x}, ${y})`;
  }

  private acceleration(a: Acceleration): string {
    const x = this.format(a.x);
    const y = this.format(a.y);
    return `(${x}, ${y})`;
  }

  private format(v: number) {
    return this.dp.transform(v, '1.2-2');
  }
}
