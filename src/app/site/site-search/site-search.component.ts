import {Component, OnInit, ViewChild} from '@angular/core';
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
import {FirebaseService} from "../../services/firebase.service";

// Interface for site data
export interface Site {
  id: string;
  name: string;
  type: string;
  county: string;
  settlement: string;
  size: number;
}

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
export class SiteSearchComponent implements OnInit {
    // Define columns to display
    displayedColumns: string[] = ['name', 'type', 'county', 'settlement', 'size', 'actions'];

    // Data source for the table
    dataSource = new MatTableDataSource<Site>();

    // Search filter
    searchText = '';

    // View options
    viewOptions = [
      { value: 'all', viewValue: 'Összes telephely' },
      { value: 'warehouse', viewValue: 'Raktárak' },
      { value: 'office', viewValue: 'Irodák' },
      { value: 'factory', viewValue: 'Gyártóüzemek' },
      { value: 'logistics', viewValue: 'Logisztikai központok' }
    ];
    selectedView = 'all';

    // Sites data
    sites: Site[] = [];

    // Loading indicator
    loading = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private firebaseService: FirebaseService) {}

    ngOnInit(): void {
      // Load sites from Firebase
      this.loadSites();

      // Set up filter predicate to search by name
      this.dataSource.filterPredicate = (data: Site, filter: string) => {
        const searchTerms = filter.split('|');
        const searchText = searchTerms[0].toLowerCase();
        const viewFilter = searchTerms[1];

        // Check if the site matches the view filter
        let matchesViewFilter = true;
        if (viewFilter !== 'all') {
          switch (viewFilter) {
            case 'warehouse':
              matchesViewFilter = data.type === 'Raktár';
              break;
            case 'office':
              matchesViewFilter = data.type === 'Iroda';
              break;
            case 'factory':
              matchesViewFilter = data.type === 'Gyártóüzem';
              break;
            case 'logistics':
              matchesViewFilter = data.type === 'Logisztikai központ';
              break;
          }
        }

        // Check if the site name contains the search text
        const matchesSearchText = searchText ? data.name.toLowerCase().includes(searchText) : true;

        return matchesSearchText && matchesViewFilter;
      };
    }

    ngAfterViewInit() {
      // Set up paginator and sort after view is initialized
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    // Apply filters when search text or view selection changes
    applyFilters(): void {
      this.dataSource.filter = this.searchText.trim().toLowerCase() + '|' + this.selectedView;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    // Action methods
    async editSite(site: Site): Promise<void> {
      console.log('Edit site:', site);
      try {
        // In a real application, you would open a dialog to edit the site
        // For now, we'll just update a field to demonstrate Firebase update
        const updatedData = {
          name: `${site.name} (Updated)`,
          lastUpdated: new Date().toISOString()
        };

        await this.firebaseService.updateDocument('sites', site.id, updatedData);
        console.log('Site updated in Firebase');
        // Reload sites to reflect changes
        await this.loadSites();
      } catch (error) {
        console.error('Error updating site:', error);
      }
    }

    async deleteSite(site: Site): Promise<void> {
      console.log('Delete site:', site);
      try {
        // In a real application, you would show a confirmation dialog
        if (confirm(`Are you sure you want to delete ${site.name}?`)) {
          await this.firebaseService.deleteDocument('sites', site.id);
          console.log('Site deleted from Firebase');
          // Reload sites to reflect changes
          await this.loadSites();
        }
      } catch (error) {
        console.error('Error deleting site:', error);
      }
    }

    viewSite(site: Site): void {
      console.log('View site:', site);
      // In a real application, you would navigate to a detail view
      alert(`Viewing details for: ${site.name}`);
    }

    // Create new site
    async createNewSite(): Promise<void> {
      console.log('Create new site');
      try {
        // In a real application, you would open a dialog to create a new site
        // For now, we'll create a sample site to demonstrate Firebase create
        const newSite = {
          name: `New Site ${new Date().getTime()}`,
          type: 'Raktár',
          county: 'Budapest',
          settlement: 'Budapest',
          size: 1000,
          createdAt: new Date().toISOString()
        };

        const newSiteId = await this.firebaseService.addDocument('sites', newSite);
        console.log('New site created in Firebase with ID:', newSiteId);
        // Reload sites to reflect changes
        await this.loadSites();
      } catch (error) {
        console.error('Error creating new site:', error);
      }
    }

    // Export to Excel
    exportToExcel(): void {
      console.log('Export to Excel');
      // Implement Excel export functionality
      // This would typically generate an Excel file with the current data
      alert('Excel export functionality would be implemented here');
    }

    // Load sites from Firebase
    async loadSites(): Promise<void> {
      try {
        this.loading = true;
        this.sites = await this.firebaseService.getCollection('sites') as Site[];
        this.dataSource.data = this.sites;
        console.log('Sites loaded from Firebase:', this.sites);
      } catch (error) {
        console.error('Error loading sites:', error);
        // If no data exists yet, initialize with sample data
        if (this.sites.length === 0) {
          this.initializeSampleData();
        }
      } finally {
        this.loading = false;
      }
    }

    // Initialize sample data in Firebase if no data exists
    async initializeSampleData(): Promise<void> {
      const sampleSites = [
        {name: 'Duna Raktárbázis', type: 'Raktár', county: 'Pest', settlement: 'Budapest', size: 1500},
        {name: 'Hajdú Business Center', type: 'Iroda', county: 'Hajdú-Bihar', settlement: 'Debrecen', size: 800},
        {name: 'Avas Ipari Park', type: 'Gyártóüzem', county: 'Borsod-Abaúj-Zemplén', settlement: 'Miskolc', size: 3000}
      ];

      try {
        for (const site of sampleSites) {
          await this.firebaseService.addDocument('sites', site);
        }
        console.log('Sample data initialized in Firebase');
        // Reload sites after initialization
        await this.loadSites();
      } catch (error) {
        console.error('Error initializing sample data:', error);
      }
    }
}
