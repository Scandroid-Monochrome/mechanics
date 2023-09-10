import { ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Coordinate, Point, Screen2D, User2D } from 'src/app/common/coordinate';
import { Calculator, Kinematics } from './calculator';
import { AxesRenderer } from './renderer-axes';

export class Renderer {
  ctx: CanvasRenderingContext2D;
  screen2D: Screen2D;
  user2D: User2D;
  coord: Coordinate;
  kinematics: Kinematics | undefined;

  STYLE_JOINT = '#888888';

  constructor(
    canvas: ElementRef<HTMLCanvasElement>,
    screen2D: Screen2D,
    theta: number,
    omega: number
  ) {
    this.ctx = canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    this.screen2D = screen2D;
    this.user2D = this.initUser2D();

    this.coord = new Coordinate();
    this.coord.screen2D = this.screen2D;
    this.coord.user2D = this.user2D;
    this.calcAndDraw(theta, omega);
  }

  private initUser2D() {
    let yMin = Number.MAX_VALUE;
    let yMax = Number.MIN_VALUE;
    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;

    for (let theta=0; theta<2*Math.PI; theta+=0.1) {
      const points = new Calculator().positions(theta);

      const xArray = _.map(points, p => p.x);
      const yArray = _.map(points, p => p.y);

      yMin = Math.min(yMin, _.min(yArray) ?? 0);
      yMax = Math.max(yMax, _.max(yArray) ?? 0);
      xMin = Math.min(xMin, _.min(xArray) ?? 0);
      xMax = Math.max(xMax, _.max(xArray) ?? 0);
    }

    return new User2D(Point.of(xMin, yMin), Point.of(xMax, yMax), Point.of(0, 0));
  }

  calcAndDraw(theta: number, omega: number) {
    this.kinematics = new Calculator().calcKinematics(theta, omega);
    this.draw(this.kinematics.positions);
  }

  highlight(event: MouseEvent) {
    const positions = this.kinematics?.positions;
    if (positions) {
      _.each(positions, (p, i) => {
        const sp = this.coord.userToScreen(p);
        const dx = event.offsetX - sp.x;
        const dy = event.offsetY - sp.y;
        const r = Math.sqrt(dx*dx + dy*dy);
        if (r < 10) {
          console.log(`Near point ${i}`);
        }
      });
    }
  }

  draw(points: Point[]) {
    const A = points[0];
    const B = points[1];
    const C = points[2];
    const D = points[3];
    const E = points[4];
    const F = points[5];
    const G = points[6];

    this.ctx.clearRect(0, 0, this.screen2D.width, this.screen2D.height);

    const axesRenderer = new AxesRenderer();
    axesRenderer.drawXAxis(this.ctx, this.coord);
    axesRenderer.drawYAxis(this.ctx, this.coord);

    this.labelPoint(A, 'A');
    this.labelPoint(B, 'B');
    this.labelPoint(C, 'C');
    this.labelPoint(D, 'D');
    this.labelPoint(E, 'E');
    this.labelPoint(F, 'F');
    this.labelPoint(G, 'G');

    this.bar(A, B);
    this.bar(B, D);
    this.bar(E, C);
    this.bar(C, F);
    this.bar(F, G);

    this.pivot(A);
    this.pivot(E);
    this.pivot(G);
  }

  labelPoint(p: Point, label: string) {
    this.ctx.save();
    this.ctx.strokeStyle = this.STYLE_JOINT;
    this.ctx.fillStyle = this.STYLE_JOINT;

    let sp = this.coord.userToScreen(p);

    this.ctx.beginPath();
    this.ctx.arc(sp.x, sp.y, 4, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.strokeText(label, sp.x - 4, sp.y - 12);
    this.ctx.restore();
  }

  bar(p1: Point, p2: Point) {
    this.ctx.save();

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = "#996600";

    this.ctx.beginPath();

    let p = this.coord.userToScreen(p1);
    this.ctx.lineTo(p.x, p.y);

    p = this.coord.userToScreen(p2);
    this.ctx.lineTo(p.x, p.y);

    this.ctx.stroke();
    this.ctx.restore();
  }

  pivot(p: Point) {
    this.ctx.save();
    this.ctx.strokeStyle = this.STYLE_JOINT;
    this.ctx.fillStyle = this.STYLE_JOINT;

    this.ctx.beginPath();

    let sp = this.coord.userToScreen(p);

    this.ctx.arc(sp.x, sp.y, 8, Math.PI, 0);

    this.ctx.moveTo(sp.x + 8, sp.y);
    this.ctx.lineTo(sp.x + 8, sp.y + 6);
    this.ctx.moveTo(sp.x - 8, sp.y);
    this.ctx.lineTo(sp.x - 8, sp.y + 6);

    this.ctx.strokeRect(sp.x - 12, sp.y + 6, 24, 6);
    this.ctx.stroke();
    this.ctx.restore();
  }
}