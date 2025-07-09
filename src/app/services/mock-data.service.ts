import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private siteTypes = ['Raktár', 'Iroda', 'Gyártóüzem', 'Logisztikai központ'];
  private counties: string[] = [];
  private settlements: { [county: string]: string[] } = {};
  private prefixes = ['Északi', 'Déli', 'Keleti', 'Nyugati', 'Központi', 'Városi', 'Regionális', 'Nemzetközi', 'Modern', 'Új'];
  private suffixes = ['Raktárbázis', 'Ipari Park', 'Logisztikai Központ', 'Irodaház', 'Üzletközpont', 'Ipari Centrum', 'Cargo Center', 'Business Center', 'Raktárkomplexum', 'Raktártelep'];

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient
  ) {}

  /**
   * Initialize the mock data service by loading counties and settlements from the sites.json file
   */
  async initialize(): Promise<void> {
    try {
      const sitesData = await firstValueFrom(this.http.get<any>('assets/data/sites.json'));

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

      console.log('Mock data service initialized with', this.counties.length, 'counties and',
        Object.values(this.settlements).reduce((sum, arr) => sum + arr.length, 0), 'settlements');
    } catch (error) {
      console.error('Error initializing mock data service:', error);
    }
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
   * Populate the Firebase database with random sites
   */
  async populateDatabase(count: number = 20): Promise<void> {
    try {
      // Initialize the service if not already initialized
      if (this.counties.length === 0) {
        await this.initialize();
      }

      console.log(`Generating ${count} random sites...`);
      const sites = this.generateRandomSites(count);

      console.log('Adding sites to Firebase...');
      for (const site of sites) {
        await this.firebaseService.addDocument('sites', site);
      }

      console.log(`Successfully added ${count} random sites to Firebase.`);
    } catch (error) {
      console.error('Error populating database with random sites:', error);
    }
  }

  /**
   * Clear all sites from the database and populate with random data
   */
  async resetAndPopulateDatabase(count: number = 20): Promise<void> {
    try {
      // Get all existing sites
      const existingSites = await this.firebaseService.getCollection('sites');

      // Delete all existing sites
      console.log(`Deleting ${existingSites.length} existing sites...`);
      for (const site of existingSites) {
        await this.firebaseService.deleteDocument('sites', site.id);
      }

      // Populate with new random sites
      await this.populateDatabase(count);

      console.log('Database reset and populated with random data.');
    } catch (error) {
      console.error('Error resetting and populating database:', error);
    }
  }
}
