import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataService, SiteView} from '../../services/data.service';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {finalize, tap} from 'rxjs';

@Component({
  selector: 'app-site-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './site-edit.component.html',
  styleUrl: './site-edit.component.scss'
})
export class SiteEditComponent implements OnInit {
  siteId: string = '';
  site: SiteView | null = null;
  siteForm: FormGroup;
  loading: boolean = false;
  error: string = '';

  // Site type options
  siteTypes = [
    {value: 'Raktár', viewValue: 'Raktár'},
    {value: 'Iroda', viewValue: 'Iroda'},
    {value: 'Gyártóüzem', viewValue: 'Gyártóüzem'},
    {value: 'Logisztikai központ', viewValue: 'Logisztikai központ'}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      county: ['', Validators.required],
      settlement: ['', Validators.required],
      size: [0, [Validators.required, Validators.min(1)]],
      nameEnglish: [''],
      region: [''],
      postalCode: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Get the site ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.siteId = id;
        this.loadSite();
      } else {
        this.error = 'No site ID provided';
      }
    });
  }

  // Load the site data from the DataService
  loadSite(): void {
    this.loading = true;
    this.dataService.getCollection('sites')
      .pipe(
        tap(sites => {
          const site = sites.find(s => s.id === this.siteId);
          if (site) {
            this.site = site;
            this.populateForm(site);
          } else {
            this.error = `Site with ID ${this.siteId} not found`;
          }
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  // Populate the form with the site data
  populateForm(site: SiteView): void {
    this.siteForm.patchValue({
      name: site.name,
      type: site.type,
      county: site.county,
      settlement: site.settlement,
      size: site.size,
      nameEnglish: site.nameEnglish || '',
      region: site.region || '',
      postalCode: site.postalCode || '',
      notes: site.notes || ''
    });
  }

  // Save the site data
  saveSite(): void {
    if (this.siteForm.invalid) {
      return;
    }

    this.loading = true;
    const updatedData = this.siteForm.value;

    this.dataService.updateDocument('sites', this.siteId, updatedData)
      .pipe(
        tap(success => {
          if (success) {
            this.router.navigate(['sites']);
          } else {
            this.error = 'Failed to update site';
          }
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  // Cancel editing and return to the sites list
  cancel(): void {
    this.router.navigate(['sites']);
  }
}
