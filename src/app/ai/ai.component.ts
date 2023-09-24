import { Component } from '@angular/core';

const pages = [
  'Magic 15',
  'Maze'
] as const;

type Page = typeof pages[number];

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss']
})
export class AiComponent {
  activePage: Page = 'Magic 15';
  pages = pages;
}
