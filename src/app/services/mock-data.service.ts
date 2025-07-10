import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, forkJoin, from, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private siteTypes = ['Raktár', 'Iroda', 'Gyártóüzem', 'Logisztikai központ'];
  private counties: string[] = [];
  private settlements: { [county: string]: string[] } = {};
  private prefixes = ['Északi', 'Déli', 'Keleti', 'Nyugati', 'Központi', 'Városi', 'Regionális', 'Nemzetközi', 'Modern', 'Új'];
  private suffixes = ['Raktárbázis', 'Ipari Park', 'Logisztikai Központ', 'Irodaház', 'Üzletközpont', 'Ipari Centrum', 'Cargo Center', 'Business Center', 'Raktárkomplexum', 'Raktártelep'];
  private initialized = false;

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) {}

  /**
   * Initialize the mock data service by loading counties and settlements from the sites.json file
   */
  initialize(): Observable<void> {
    if (this.initialized) {
      return of(void 0);
    }

    return this.http.get<any>('assets/data/sites.json').pipe(
      map(sitesData => {
        // Extract unique counties and their settlements
        const countyMap = new Map<string, Set<string>>();

        sitesData.sites.forEach((site: any) => {
          const county = site.VARMEGYE;
          const settlement = site.TELEPULES;

          if (!countyMap.has(county)) {
            countyMap.set(county, new Set<string>());
          }

          countyMap.get(county)?.add(settlement);
        });

        // Convert to arrays
        this.counties = Array.from(countyMap.keys());

        countyMap.forEach((settlements, county) => {
          this.settlements[county] = Array.from(settlements);
        });

        this.initialized = true;
        console.log('Mock data service initialized with', this.counties.length, 'counties and',
          Object.values(this.settlements).reduce((sum, arr) => sum + arr.length, 0), 'settlements');
      }),
      map(() => void 0)
    );
  }

  /**
   * Generate a random site name
   */
  private generateSiteName(): string {
    const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
    const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
    return `${prefix} ${suffix}`;
  }

  /**
   * Generate a random site type
   */
  private generateSiteType(): string {
    return this.siteTypes[Math.floor(Math.random() * this.siteTypes.length)];
  }

  /**
   * Generate a random county
   */
  private generateCounty(): string {
    return this.counties[Math.floor(Math.random() * this.counties.length)];
  }

  /**
   * Generate a random settlement for a given county
   */
  private generateSettlement(county: string): string {
    const countySettlements = this.settlements[county] || [];
    if (countySettlements.length === 0) {
      return 'Unknown';
    }
    return countySettlements[Math.floor(Math.random() * countySettlements.length)];
  }

  /**
   * Generate a random size between min and max
   */
  private generateSize(min: number = 500, max: number = 4000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a single random site
   */
  generateRandomSite(): any {
    const county = this.generateCounty();
    return {
      name: this.generateSiteName(),
      type: this.generateSiteType(),
      county: county,
      settlement: this.generateSettlement(county),
      size: this.generateSize(),
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Generate multiple random sites
   */
  generateRandomSites(count: number): any[] {
    const sites = [];
    for (let i = 0; i < count; i++) {
      sites.push(this.generateRandomSite());
    }
    return sites;
  }

  /**
   * Populate the database with random sites
   */
  populateDatabase(count: number = 20): Observable<void> {
    // Initialize the service if not already initialized
    return this.initialize().pipe(
      switchMap(() => {
        console.log(`Generating ${count} random sites...`);
        const sites = this.generateRandomSites(count);

        console.log('Adding sites to data service...');
        // Add sites one by one using concatMap to ensure they're added sequentially
        return from(sites).pipe(
          concatMap(site => this.dataService.addDocument('sites', site)),
          tap(id => console.log(`Added site with ID: ${id}`)),
          // Collect all results but we don't need them
          toArray(),
          map(() => {
            console.log(`Successfully added ${count} random sites.`);
            return void 0;
          })
        );
      })
    );
  }

  /**
   * Clear all sites from the database and populate with random data
   */
  resetAndPopulateDatabase(count: number = 20): Observable<void> {
    return this.dataService.getSitesCollection('sites').pipe(
      switchMap(existingSites => {
        console.log(`Deleting ${existingSites.length} existing sites...`);

        if (existingSites.length === 0) {
          return this.populateDatabase(count);
        }

        // Delete all existing sites using concatMap to ensure they're deleted sequentially
        return from(existingSites).pipe(
          concatMap(site => this.dataService.deleteDocument('sites', site.id)),
          toArray(),
          switchMap(() => this.populateDatabase(count)),
          map(() => {
            console.log('Database reset and populated with random data.');
            return void 0;
          })
        );
      })
    );
  }
}

// Helper operator to collect all emissions into an array
function toArray<T>() {
  return (source: Observable<T>) => {
    return new Observable<T[]>(subscriber => {
      const values: T[] = [];
      return source.subscribe({
        next: value => values.push(value),
        error: err => subscriber.error(err),
        complete: () => {
          subscriber.next(values);
          subscriber.complete();
        }
      });
    });
  };
}
