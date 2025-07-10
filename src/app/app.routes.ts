import {Routes} from '@angular/router';
import {SiteSearchComponent} from './site/site-search/site-search.component';
import {SiteEditComponent} from './site/site-edit/site-edit.component';
import {SiteViewComponent} from "./site/site-view/site-view.component";

export const routes: Routes = [
  { path: '', redirectTo: 'sites', pathMatch: 'full' },
  { path: 'sites', component: SiteSearchComponent },
  { path: 'sites/edit/:id', component: SiteEditComponent }
];
