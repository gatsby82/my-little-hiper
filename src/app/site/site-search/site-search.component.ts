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

// Interface for site data
export interface Site {
  id: number;
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

    // Sample data
    sites: Site[] = [
      {id: 1, name: 'Duna Raktárbázis', type: 'Raktár', county: 'Pest', settlement: 'Budapest', size: 1500},
      {id: 2, name: 'Hajdú Business Center', type: 'Iroda', county: 'Hajdú-Bihar', settlement: 'Debrecen', size: 800},
      {id: 3, name: 'Avas Ipari Park', type: 'Gyártóüzem', county: 'Borsod-Abaúj-Zemplén', settlement: 'Miskolc', size: 3000},
      {id: 4, name: 'Mecsek Logisztika', type: 'Raktár', county: 'Baranya', settlement: 'Pécs', size: 1200},
      {id: 5, name: 'Tisza Cargo Center', type: 'Logisztikai központ', county: 'Csongrád-Csanád', settlement: 'Szeged', size: 2500},
      {id: 6, name: 'Rába Raktár Komplexum', type: 'Raktár', county: 'Győr-Moson-Sopron', settlement: 'Győr', size: 1800},
      {id: 7, name: 'Savaria Irodaház', type: 'Iroda', county: 'Vas', settlement: 'Szombathely', size: 650},
      {id: 8, name: 'Zala Ipari Centrum', type: 'Gyártóüzem', county: 'Zala', settlement: 'Zalaegerszeg', size: 2800},
      {id: 9, name: 'Kapos Logisztikai Park', type: 'Logisztikai központ', county: 'Somogy', settlement: 'Kaposvár', size: 2200},
      {id: 10, name: 'Gemenc Raktárbázis', type: 'Raktár', county: 'Tolna', settlement: 'Szekszárd', size: 1100},
      {id: 11, name: 'Korona Üzletközpont', type: 'Iroda', county: 'Fejér', settlement: 'Székesfehérvár', size: 750},
      {id: 12, name: 'Bakony Ipari Park', type: 'Gyártóüzem', county: 'Veszprém', settlement: 'Veszprém', size: 3200},
      {id: 13, name: 'Turul Raktártelep', type: 'Raktár', county: 'Komárom-Esztergom', settlement: 'Tatabánya', size: 1400},
      {id: 14, name: 'Érd-Parkváros Logisztikai Központ', type: 'Logisztikai központ', county: 'Pest', settlement: 'Érd', size: 2100},
      {id: 15, name: 'Karancs Irodaház', type: 'Iroda', county: 'Nógrád', settlement: 'Salgótarján', size: 600},
      {id: 16, name: 'Dobó Ipari Centrum', type: 'Gyártóüzem', county: 'Heves', settlement: 'Eger', size: 2900},
      {id: 17, name: 'Tisza-parti Raktárbázis', type: 'Raktár', county: 'Jász-Nagykun-Szolnok', settlement: 'Szolnok', size: 1300},
      {id: 18, name: 'Munkácsy Business Center', type: 'Iroda', county: 'Békés', settlement: 'Békéscsaba', size: 720},
      {id: 19, name: 'Hírös Logisztikai Park', type: 'Logisztikai központ', county: 'Bács-Kiskun', settlement: 'Kecskemét', size: 2400},
      {id: 20, name: 'Nyírség Ipari Centrum', type: 'Gyártóüzem', county: 'Szabolcs-Szatmár-Bereg', settlement: 'Nyíregyháza', size: 3100},
      {id: 21, name: 'Grassalkovich Raktárbázis', type: 'Raktár', county: 'Pest', settlement: 'Gödöllő', size: 1250},
      {id: 22, name: 'Dunakanyar Irodaház', type: 'Iroda', county: 'Pest', settlement: 'Szentendre', size: 580},
      {id: 23, name: 'Hajdúsági Ipari Park', type: 'Gyártóüzem', county: 'Hajdú-Bihar', settlement: 'Hajdúszoboszló', size: 2700},
      {id: 24, name: 'Hódtó Raktárkomplexum', type: 'Raktár', county: 'Csongrád-Csanád', settlement: 'Hódmezővásárhely', size: 1350},
      {id: 25, name: 'Duna-Dráva Logisztikai Központ', type: 'Logisztikai központ', county: 'Baranya', settlement: 'Mohács', size: 2300},
      {id: 26, name: 'BorsodChem Irodaház', type: 'Iroda', county: 'Borsod-Abaúj-Zemplén', settlement: 'Kazincbarcika', size: 680},
      {id: 27, name: 'Lővér Ipari Park', type: 'Gyártóüzem', county: 'Győr-Moson-Sopron', settlement: 'Sopron', size: 2950},
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
      // Initialize the data source
      this.dataSource.data = this.sites;

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
    editSite(site: Site): void {
      console.log('Edit site:', site);
      // Implement edit functionality
    }

    deleteSite(site: Site): void {
      console.log('Delete site:', site);
      // Implement delete functionality
    }

    viewSite(site: Site): void {
      console.log('View site:', site);
      // Implement view functionality
    }

    // Create new site
    createNewSite(): void {
      console.log('Create new site');
      // Implement new site creation functionality
      // This would typically open a dialog or navigate to a form
    }

    // Export to Excel
    exportToExcel(): void {
      console.log('Export to Excel');
      // Implement Excel export functionality
      // This would typically generate an Excel file with the current data
      alert('Excel export functionality would be implemented here');
    }
}
