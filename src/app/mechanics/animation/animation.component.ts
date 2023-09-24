import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription, interval } from 'rxjs';
import { Screen2D } from 'src/app/common/coordinate';
import { Calculator } from './calculator';
import { Renderer } from './renderer';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements AfterViewInit {
  @ViewChild('myCanvas')
  canvas = {} as ElementRef<HTMLCanvasElement>;
  screen2D = new Screen2D(600, 500, 20);

  animateCheckBox = {} as FormControl<boolean | null>;
  animationSubscription: Subscription | null = null;

  PI = Math.PI;
  theta: number = 2 * this.PI / 3;
  omega: number = 2; // radian/s

  renderer: Renderer | undefined;
  calculator = new Calculator();

  constructor(
    fb: FormBuilder
  ) {
    this.animateCheckBox = fb.control(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    console.log(window.innerWidth);
  }

  ngAfterViewInit(): void {
    this.renderer = new Renderer(this.canvas, this.screen2D, this.theta, this.omega);
    this.canvas.nativeElement.onmousemove = (event) => {
      this.renderer?.highlight(event);
    };
  }

  onAngleChange(event: any) {
    this.theta = +event.target.value;
    this.renderer?.calcAndDraw(this.theta, this.omega);
  }

  onAnimationToggle(event: MatSlideToggleChange) {
    if (event.checked) {
      this.animationSubscription = this.animate();
    } else if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }

  private animate() {
    return interval(100).subscribe({
      next: (_) => {
        const angle = this.theta + 0.1;
        this.theta = this.normalizeAngle(angle);
        this.renderer?.calcAndDraw(this.theta, this.omega);
      }
    });
  }

  private normalizeAngle(angle: number) {
    const twoPi = 2 * this.PI;

    if (angle < 0) {
      const n = Math.ceil(-angle / twoPi);
      return angle + n * twoPi;
    }

    if (angle > twoPi) {
      const n = Math.floor(angle / twoPi);
      return angle - n * twoPi;
    }

    return angle;
  }

  formatLabel(value: number): string {
    const degree = Math.round(value * 180 / Math.PI);
    return `${degree}\u{00B0}`;
  }
}
