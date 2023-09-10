import { Coordinate, Point } from 'src/app/common/coordinate';

export class AxesRenderer {
  private readonly STYLE_AXIS = '#CCCCCC';

  drawXAxis(ctx: CanvasRenderingContext2D, coord: Coordinate, label = 'X') {
    ctx.save();
    ctx.strokeStyle = this.STYLE_AXIS;
    ctx.fillStyle = this.STYLE_AXIS;

    const o = this.origin(coord);
    const br = this.boundRect(coord);

    // draw X-axis
    ctx.beginPath();
    ctx.moveTo(br.xMin, o.y);
    ctx.lineTo(br.xMax, o.y);
    ctx.stroke();

    const a = this.arrow();

    // draw X-axis arrow
    const p = Point.of(br.xMax, o.y);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - a.d1, p.y + a.d2);
    ctx.lineTo(p.x - a.d3, p.y);
    ctx.lineTo(p.x - a.d1, p.y - a.d2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeText(label, p.x - 10, p.y - 10);
    ctx.restore();
  }

  drawYAxis(ctx: CanvasRenderingContext2D, coord: Coordinate, label = 'Y') {
    ctx.save();
    ctx.strokeStyle = this.STYLE_AXIS;
    ctx.fillStyle = this.STYLE_AXIS;

    const o = this.origin(coord);
    const br = this.boundRect(coord);

    // draw Y-axis
    ctx.beginPath();
    ctx.moveTo(o.x, br.yMin);
    ctx.lineTo(o.x, br.yMax);
    ctx.stroke();

    const a = this.arrow();

    // draw Y-axis arrow
    const p = Point.of(o.x, br.yMax);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + a.d2, p.y + a.d1);
    ctx.lineTo(p.x, p.y + a.d3);
    ctx.lineTo(p.x - a.d2, p.y + a.d1);
    ctx.closePath();
    ctx.fill();

    ctx.strokeText(label, p.x + 10, p.y + 10);
    ctx.restore();
  }

  private origin(coord: Coordinate) {
    return coord.userToScreen(coord.user2D.o);
  }

  private bottomLeft(coord: Coordinate) {
    return coord.userToScreen(coord.user2D.p1);
  }

  private topRight(coord: Coordinate) {
    return coord.userToScreen(coord.user2D.p2);
  }

  private boundRect(coord: Coordinate) {
    const bl = this.bottomLeft(coord);
    const tr = this.topRight(coord);

    return {
      xMin: bl.x,
      yMin: bl.y,
      xMax: tr.x,
      yMax: tr.y,
    };
  }

  private arrow(size = 12) {
    return {
      d1: size,
      d2: size / 3,
      d3: (2 * size) / 3,
    };
  }
}