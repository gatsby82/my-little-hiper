import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

export interface Site {
  id: string;
  name: string;
  type: string;
  county: string;
  settlement: string;
  size: number;
  createdAt?: string;
  lastUpdated?: string;

  // Additional properties from sites.json
  nameEnglish?: string;  // MEGNEVEZES_ANGOL
  region?: string;       // REGIO
  postalCode?: string;   // IRSZ
  migrated?: boolean;    // MIGRALT
  notes?: string;        // MEGJEGYZES

  // Properties for complex objects that might be added in the future
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
  };

  facilities?: {
    hasParking?: boolean;
    parkingCapacity?: number;
    hasLoadingDock?: boolean;
    loadingDockCount?: number;
    hasSecurity?: boolean;
    hasFireProtection?: boolean;
  };

  dimensions?: {
    width?: number;
    length?: number;
    height?: number;
    totalArea?: number;
    usableArea?: number;
  };

  // Allow for any additional properties to be added in the future
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sitesSubject = new BehaviorSubject<Site[]>([]);
  private sitesLoaded = false;
  private nextId = 1;

  // Expose sites as an Observable
  public sites$: Observable<Site[]> = this.sitesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize data on service creation
    this.initialize();
  }

  /**
   * Initialize the data service by loading sites from the sites.json file
   */
  initialize(): void {
    if (this.sitesLoaded) {
      return;
    }

    this.http.get<any>('assets/data/sites.json').pipe(
      map(sitesData => {
        // Map the data from the JSON format to the Site interface
        return sitesData.sites.map((site: any) => ({
          id: site.AZONOSITO || `SITE-${this.getNextId()}`,
          name: site.MEGNEVEZES,
          type: site.TIPUS,
          county: site.VARMEGYE,
          settlement: site.TELEPULES,
          size: site.MERET,
          createdAt: new Date().toISOString(),

          // Map additional properties from sites.json
          nameEnglish: site.MEGNEVEZES_ANGOL,
          region: site.REGIO,
          postalCode: site.IRSZ,
          migrated: site.MIGRALT,
          notes: site.MEGJEGYZES
        }));
      }),
      tap(sites => {
        this.sitesSubject.next(sites);
        this.sitesLoaded = true;
        console.log('Data service initialized with', sites.length, 'sites');
      }),
      catchError(error => {
        console.error('Error initializing data service:', error);
        // Initialize with empty array in case of error
        this.sitesSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Get all sites as an Observable
   */
  getCollection(collectionName: string): Observable<Site[]> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'sites') {
      console.warn(`Collection ${collectionName} not supported, returning sites instead`);
    }

    return this.sites$;
  }

  /**
   * Add a new site
   */
  addDocument(collectionName: string, data: any): Observable<string> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'sites') {
      console.warn(`Collection ${collectionName} not supported`);
      return of('');
    }

    const newId = `SITE-${this.getNextId()}`;
    // Create a new site with all provided data
    const newSite: Site = {
      id: newId,
      name: data.name,
      type: data.type,
      county: data.county,
      settlement: data.settlement,
      size: data.size,
      createdAt: data.createdAt || new Date().toISOString(),

      // Include additional properties if provided
      ...(data.nameEnglish && { nameEnglish: data.nameEnglish }),
      ...(data.region && { region: data.region }),
      ...(data.postalCode && { postalCode: data.postalCode }),
      ...(data.migrated !== undefined && { migrated: data.migrated }),
      ...(data.notes && { notes: data.notes }),

      // Include complex objects if provided
      ...(data.address && { address: data.address }),
      ...(data.contact && { contact: data.contact }),
      ...(data.facilities && { facilities: data.facilities }),
      ...(data.dimensions && { dimensions: data.dimensions })
    };

    const currentSites = this.sitesSubject.getValue();
    this.sitesSubject.next([...currentSites, newSite]);

    return of(newId);
  }

  /**
   * Update a site
   */
  updateDocument(collectionName: string, docId: string, data: any): Observable<boolean> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'sites') {
      console.warn(`Collection ${collectionName} not supported`);
      return of(false);
    }

    const currentSites = this.sitesSubject.getValue();
    const siteIndex = currentSites.findIndex(site => site.id === docId);

    if (siteIndex === -1) {
      console.error(`Site with ID ${docId} not found`);
      return of(false);
    }

    const updatedSite = {
      ...currentSites[siteIndex],
      ...data,
      lastUpdated: new Date().toISOString()
    };

    const updatedSites = [...currentSites];
    updatedSites[siteIndex] = updatedSite;

    this.sitesSubject.next(updatedSites);
    return of(true);
  }

  /**
   * Delete a site
   */
  deleteDocument(collectionName: string, docId: string): Observable<boolean> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'sites') {
      console.warn(`Collection ${collectionName} not supported`);
      return of(false);
    }

    const currentSites = this.sitesSubject.getValue();
    const updatedSites = currentSites.filter(site => site.id !== docId);

    if (updatedSites.length === currentSites.length) {
      console.error(`Site with ID ${docId} not found`);
      return of(false);
    }

    this.sitesSubject.next(updatedSites);
    return of(true);
  }

  /**
   * Get the next ID for a new site
   */
  private getNextId(): number {
    return this.nextId++;
  }
}
