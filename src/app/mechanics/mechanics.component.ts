import { Component } from '@angular/core';

const pages = [
  'Animation',
  'Force Analysis',
  'Theory'
] as const;

type Page = typeof pages[number];

@Component({
  selector: 'app-mechanics',
  templateUrl: './mechanics.component.html',
  styleUrls: ['./mechanics.component.scss'],
})
export class MechanicsComponent {
  activePage: Page = 'Animation';
  pages = pages;
}
