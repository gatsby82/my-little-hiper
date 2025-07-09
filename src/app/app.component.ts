import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {KeresoComponent} from "./telephely/kereso/kereso.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeresoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-little-hiper';
}
