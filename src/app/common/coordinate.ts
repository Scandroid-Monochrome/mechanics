import * as _ from 'lodash';

export class Point {
  x = 0;
  y = 0;
  label = '';

  static of(x: number, y: number, label = '') {
    const p = new Point();

    p.x = x;
    p.y = y;
    p.label = label;

    return p;
  }
}

export class User2D {
  o: Point;

  constructor(
    public p1: Point, // bottom left corner
    public p2: Point, // top right corner
    o: Point | null = null, // origin
  ) {
    this.o = o ?? p1;
  }
}

export class Screen2D {
  constructor(
    public width: number,
    public height: number,
    public margin: number
  ) {}
}

export class Coordinate {
  screen2D = {} as Screen2D;
  user2D = {} as User2D;

  userToScreen(userPoint: Point): Point {
    const x = userPoint.x;
    const y = userPoint.y;

    const w = this.screen2D.width;
    const h = this.screen2D.height;
    const m = this.screen2D.margin;

    const x1 = this.user2D.p1.x;
    const x2 = this.user2D.p2.x;

    const y1 = this.user2D.p1.y;
    const y2 = this.user2D.p2.y;

    const px = m + ((w - 2 * m) * (x - x1)) / (x2 - x1);
    const py = m + ((h - 2 * m) * (y - y2)) / (y1 - y2);

    return Point.of(px, py);
  }

  screenToUser(screenPoint: Point): Point {
    const px = screenPoint.x;
    const py = screenPoint.y;

    const w = this.screen2D.width;
    const h = this.screen2D.height;
    const m = this.screen2D.margin;

    const x1 = this.user2D.p1.x;
    const x2 = this.user2D.p2.x;

    const y1 = this.user2D.p1.y;
    const y2 = this.user2D.p2.y;

    const x = x1 + ((x2 - x1) * (px - m)) / (w - 2 * m);
    const y = y2 + ((y1 - y2) * (py - m)) / (h - 2 * m);

    return Point.of(x, y);
  }
}
