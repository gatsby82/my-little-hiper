import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {DataService, SimpleSite} from "../../services/data.service";
import {Observable, Subscription, finalize, first, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-site-search',
  standalone: true,
  imports: [
    MatButton,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIcon,
    MatIconButton,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './site-search.component.html',
  styleUrl: './site-search.component.scss'
})
export class SiteSearchComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'type', 'county', 'settlement', 'size', 'actions'];

  dataSource = new MatTableDataSource<SimpleSite>();

  searchText = '';

  tipusNevOptions = [
    {value: 'all', viewValue: 'Összes telephely'},
    {value: 'Ipari park', viewValue: 'Ipari parkok'},
    {value: 'Barnamezős terület', viewValue: 'Barnamezős területek'},
    {value: 'Zöldmező', viewValue: 'Zöldmezők'},
  ];
  selectedTipusNev = 'all';

  simpleSites: SimpleSite[] = [];

  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private subscriptions = new Subscription();

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    // Load sites from data service
    this.loadSites();

    // Set up filter predicate to search by name
    this.dataSource.filterPredicate = (data: SimpleSite, filter: string) => {
      const searchTerms = filter.split('|');
      const searchText = searchTerms[0].toLowerCase();
      const viewFilter = searchTerms[1];

      // Check if the site matches the view filter
      let matchesViewFilter = true;
      if (viewFilter !== 'all') {
        switch (viewFilter) {
          case 'Ipari park':
            matchesViewFilter = data.tipus_nev === 'Ipari park';
            break;
          case 'Barnamezős terület':
            matchesViewFilter = data.tipus_nev === 'Barnamezős terület';
            break;
          case 'Zöldmező':
            matchesViewFilter = data.tipus_nev === 'Zöldmező';
            break;
        }
      }

      const matchesSearchText = searchText ? data.megnevezes.toLowerCase().includes(searchText) : true;

      return matchesSearchText && matchesViewFilter;
    };
  }

  ngAfterViewInit() {
    // Set up paginator and sort after view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }

  // Apply filters when search text or view selection changes
  applyFilters(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase() + '|' + this.selectedTipusNev;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Action methods
  editSite(site: SimpleSite): void {
    console.log('Edit site:', site);

    // Navigate to the SiteEditComponent with the site ID
    this.router.navigate(['/sites/edit', site.id]).then(r => console.log(r)
    );
  }

  deleteSite(site: SimpleSite): void {
    console.log('Delete site:', site);

    // In a real application, you would show a confirmation dialog
    if (confirm(`Are you sure you want to delete ${site.megnevezes}?`)) {
      this.loading = true;

      const subscription = this.dataService.deleteDocument('sites', +site.id)
        .pipe(
          tap(success => {
            if (success) {
              console.log('Site deleted');
            } else {
              console.error('Failed to delete site');
            }
          }),
          finalize(() => this.loading = false)
        )
        .subscribe();

      this.subscriptions.add(subscription);
    }
  }

  viewSite(site: SimpleSite): void {
    console.log('View site:', site);
    // In a real application, you would navigate to a detail view
    alert(`Viewing details for: ${site.megnevezes}`);
  }

  // Create new site
  createNewSite(): void {
    console.log('Create new site');

    // In a real application, you would open a dialog to create a new site
    // For now, we'll create a sample site to demonstrate create
    const newSite = {
      name: `New Site ${new Date().getTime()}`,
      type: 'Raktár',
      county: 'Budapest',
      settlement: 'Budapest',
      size: 1000,
      createdAt: new Date().toISOString()
    };

    this.loading = true;

    const subscription = this.dataService.addDocument('sites', newSite)
      .pipe(
        tap(newSiteId => {
          console.log('New site created with ID:', newSiteId);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();

    this.subscriptions.add(subscription);
  }

  // Export to Excel
  exportToExcel(): void {
    console.log('Export to Excel');
    // Implement Excel export functionality
    // This would typically generate an Excel file with the current data
    alert('Excel export functionality would be implemented here');
  }

  // Load sites from data service
  loadSites(): void {
    this.loading = true;

    const subscription = this.dataService.getSimpleSitesCollection('simpleSites')
      .pipe(
        tap(sites => {
          this.simpleSites = sites;
          this.dataSource.data = sites;
          console.log('Sites loaded:', sites);

          // If no data exists yet, initialize with sample data
          if (sites.length === 0) {
            this.initializeSampleData();
          }
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();

    this.subscriptions.add(subscription);
  }

  // Initialize sample data if no data exists
  initializeSampleData(): void {
    const sampleSites = [
      {name: 'Duna Raktárbázis', type: 'Raktár', county: 'Pest', settlement: 'Budapest', size: 1500},
      {name: 'Hajdú Business Center', type: 'Iroda', county: 'Hajdú-Bihar', settlement: 'Debrecen', size: 800},
      {name: 'Avas Ipari Park', type: 'Gyártóüzem', county: 'Borsod-Abaúj-Zemplén', settlement: 'Miskolc', size: 3000}
    ];

    console.log('Initializing sample data...');
    this.loading = true;

    // Add sites one by one
    const subscription = this.addSitesSequentially(sampleSites)
      .pipe(
        tap(() => {
          console.log('Sample data initialized');
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();

    this.subscriptions.add(subscription);
  }

  // Helper method to add sites sequentially
  private addSitesSequentially(sites: any[]): Observable<any> {
    // Use switchMap to chain the observables
    return this.dataService.addDocument('sites', sites[0]).pipe(
      switchMap(() => {
        if (sites.length > 1) {
          return this.addSitesSequentially(sites.slice(1));
        }
        return this.dataService.getSitesCollection('sites').pipe(first());
      })
    );
  }
}
