import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Screen2D, User2D, Point, Coordinate } from '../common/coordinate';
import { State } from './thermo';
import { AxesRenderer } from '../mechanics/animation/renderer-axes';

type DiagramType = 'PV' | 'PT' | 'ST';

@Component({
  selector: 'app-thermo',
  templateUrl: './thermo.component.html',
  styleUrls: ['./thermo.component.scss']
})
export class ThermoComponent implements AfterViewInit {
  @ViewChild('myCanvas')
  canvas = {} as ElementRef<HTMLCanvasElement>;

  screen2D = new Screen2D(600, 400, 10);
  ctx = {} as CanvasRenderingContext2D;

  diagramType: DiagramType = 'PT';

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    this.decideWhichDiagramToShow();
  }

  private decideWhichDiagramToShow() {
    this.ctx.clearRect(0, 0, this.screen2D.width, this.screen2D.height);

    const states = this.states();

    switch (this.diagramType) {
      case 'PT':
        this.ptDiagram(states);
        break;

      case 'PV':
      default:
        this.pvDiagram(states);
        break;
    }
  }

  private ptDiagram(states: State[]) {
    let yMin = states[0].P;
    let yMax = states[3].P;
    let xMin = states[0].T;
    let xMax = states[3].T;

    const dx = xMax - xMin;
    const dy = yMax - yMin;

    xMin = xMin - 0.05*dx;
    yMin = yMin - 0.05*dy;

    const user2D = new User2D(Point.of(xMin, yMin), Point.of(xMax, yMax));

    const coord = new Coordinate();
    coord.screen2D = this.screen2D;
    coord.user2D = user2D;

    const axesRenderer = new AxesRenderer();
    axesRenderer.drawXAxis(this.ctx, coord, 'T');
    axesRenderer.drawYAxis(this.ctx, coord, 'P');

    this.isentropicPTPath(states[0], states[1], coord);
    this.straightPTPath(states[1], states[2], coord);
    this.straightPTPath(states[2], states[3], coord);
    this.isentropicPTPath(states[3], states[4], coord);
    this.straightPTPath(states[4], states[0], coord);
  }

  private pvDiagram(states: State[]) {
    let yMin = states[0].P;
    let yMax = states[2].P;
    let xMin = states[2].v;
    let xMax = states[0].v;

    const dx = xMax - xMin;
    const dy = yMax - yMin;

    xMin = xMin - 0.06*dx;
    yMin = yMin - 0.1*dy;

    const user2D = new User2D(Point.of(xMin, yMin), Point.of(xMax, yMax));

    const coord = new Coordinate();
    coord.screen2D = this.screen2D;
    coord.user2D = user2D;

    const axesRenderer = new AxesRenderer();
    axesRenderer.drawXAxis(this.ctx, coord, 'V');
    axesRenderer.drawYAxis(this.ctx, coord, 'P');

    this.isentropicPVPath(states[0], states[1], coord);
    this.straightPVPath(states[1], states[2], coord);
    this.straightPVPath(states[2], states[3], coord);
    this.isentropicPVPath(states[3], states[4], coord);
    this.straightPVPath(states[4], states[0], coord);
  }

  private states() {
    const state1 = new State();
    state1.P = 1e5;
    state1.T = 300;
    state1.v = state1.idealGasV();
    state1.log('State 1');

    const state2 = new State();
    state2.P = 4023270.658;
    state2.T = state1.isentropicTFromPT(state2.P);
    state2.v = state2.idealGasV();
    state2.log('State 2');

    const stateX = new State();
    stateX.P = 5.675e6;
    stateX.v = state2.v;
    stateX.T = stateX.idealGasT();
    stateX.log('State X');

    const state3 = new State();
    state3.P = stateX.P
    state3.T = 2200;
    state3.v = state3.idealGasV();
    state3.log('State 3');

    const state4 = new State();
    state4.v = state1.v;
    state4.P = state3.isentropicPFromPv(state4.v);
    state4.T = state4.idealGasT();
    state4.log('State 4');

    return [state1, state2, stateX, state3, state4];
  }

  private isentropicPTPath(state1: State, state2: State, coord: Coordinate) {
    const N = 100;
    const dT = (state2.T - state1.T) / N;

    this.ctx.beginPath();

    for (let i = 0; i <= N; i++) {
      const state = new State();
      state.T = state1.T + i * dT;
      state.P = state1.isentropicPFromPT(state.T);
      const screenPoint = state.ptPoint(coord);
      this.ctx.lineTo(screenPoint.x, screenPoint.y);
    }

    this.ctx.stroke();
  }

  private isentropicPVPath(state1: State, state2: State, coord: Coordinate) {
    const N = 100;
    const dV = (state2.v - state1.v) / N;

    this.ctx.beginPath();

    for (let i = 0; i <= N; i++) {
      const state = new State();
      state.v = state1.v + i * dV;
      state.P = state1.isentropicPFromPv(state.v);
      const screenPoint = state.pvPoint(coord);
      this.ctx.lineTo(screenPoint.x, screenPoint.y);
    }

    this.ctx.stroke();
  }

  private straightPTPath(state1: State, state2: State, coord: Coordinate) {
    this.ctx.beginPath();

    let screenPoint = state1.ptPoint(coord);
    this.ctx.lineTo(screenPoint.x, screenPoint.y);

    screenPoint = state2.ptPoint(coord);
    this.ctx.lineTo(screenPoint.x, screenPoint.y);

    this.ctx.stroke();
  }

  private straightPVPath(state1: State, state2: State, coord: Coordinate) {
    this.ctx.beginPath();

    let screenPoint = state1.pvPoint(coord);
    this.ctx.lineTo(screenPoint.x, screenPoint.y);

    screenPoint = state2.pvPoint(coord);
    this.ctx.lineTo(screenPoint.x, screenPoint.y);

    this.ctx.stroke();
  }

  onDiagramChange(event: any) {
    this.decideWhichDiagramToShow();
  }
}
