import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CobradorComponent } from './cobrador-component/cobrador-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [CommonModule, CobradorComponent]
})
export class App {
  title = 'frontend-api';
}
