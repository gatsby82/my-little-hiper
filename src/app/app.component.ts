import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SiteSearchComponent} from "./site/site-search/site-search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-little-hiper';
}
