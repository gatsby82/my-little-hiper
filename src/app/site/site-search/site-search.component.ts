import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-site-search',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatButton
  ],
  templateUrl: './site-search.component.html',
  styleUrl: './site-search.component.scss'
})
export class SiteSearchComponent implements OnInit {
    ngOnInit(): void {
      console.log('ngOnInit');
    }

}
