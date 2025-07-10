import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Site } from '../site/interfaces/site.interface';

// Define an interface for backward compatibility with existing code
export interface SiteView {
  id: string;
  name: string;
  type: string;
  county: string;
  settlement: string;
  size: number;
  createdAt?: string;
  lastUpdated?: string;
  nameEnglish?: string;
  region?: string;
  postalCode?: string;
  migrated?: boolean;
  notes?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sitesSubject = new BehaviorSubject<SiteView[]>([]);
  private sitesLoaded = false;
  private nextId = 1;

  // Expose sites as an Observable
  public sites$: Observable<SiteView[]> = this.sitesSubject.asObservable();

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
        // Map the data from the JSON format to the Site interface and then to SiteView
        return sitesData.sites.map((siteData: any) => {
          // First create a Site object with the new interface
          const site: Site = {
            id: parseInt(siteData.AZONOSITO) || this.getNextId(),
            inaktiv: false,
            inaktivMagyarazat: '',
            letrehozo: '',
            letrehozva: new Date(),
            modosito: '',
            modositva: new Date(),
            torolt: false,
            megnevezes: siteData.MEGNEVEZES,
            megnevezesAngol: siteData.MEGNEVEZES_ANGOL,
            azonosito: siteData.AZONOSITO || `SITE-${this.getNextId()}`,
            tipus_nev: siteData.TIPUS,
            regio_nev: siteData.REGIO,
            megye_nev: siteData.VARMEGYE,
            telepules_nev: siteData.TELEPULES,
            korzet_nev: '',
            irsz: siteData.IRSZ,
            utca: '',
            migralt: siteData.MIGRALT,
            migraltLetrehozva: new Date(),
            meret: siteData.MERET,
            megjegyzes: siteData.MEGJEGYZES,
            bpTav: 0,
            iparVaganyVan: false,
            aram: 0,
            gaz: 0,
            viz: 0,
            ipariviz: 0,
            szennyviz: 0,
            birtokne: '',
            allapot_nev: '',
            kijajanlhato: 0,
            egyeb: '',
            epuletVan: false,
            terkepLink: '',
            gpsSzelesseg: 0,
            gpsHosszusag: 0,
            csarnok: [],
            iroda: [],
            zoldmezo: [],
            kapcsolattartok: [],
            dokumentumok: [],
            telephelyReszletek: [],
            helyrajziSzamok: [],
            autoPalya: [],
            vasutallomas: [],
            folyamikiKikoto: [],
            autobusmegallo: [],
            lakoterulet: [],
            fout: []
          };

          // Then convert to SiteView for backward compatibility
          return this.siteToSiteView(site);
        });
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
  getCollection(collectionName: string): Observable<SiteView[]> {
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

    const newId = this.getNextId();
    const azonosito = `SITE-${newId}`;

    // Create a new site with the new interface
    const newSite: Site = {
      id: newId,
      inaktiv: false,
      inaktivMagyarazat: '',
      letrehozo: '',
      letrehozva: new Date(),
      modosito: '',
      modositva: new Date(),
      torolt: false,
      megnevezes: data.name,
      megnevezesAngol: data.nameEnglish || '',
      azonosito: azonosito,
      tipus_nev: data.type,
      regio_nev: data.region || '',
      megye_nev: data.county,
      telepules_nev: data.settlement,
      korzet_nev: '',
      irsz: data.postalCode || '',
      utca: data.address?.street || '',
      migralt: data.migrated || false,
      migraltLetrehozva: new Date(),
      meret: data.size,
      megjegyzes: data.notes || '',
      bpTav: 0,
      iparVaganyVan: false,
      aram: 0,
      gaz: 0,
      viz: 0,
      ipariviz: 0,
      szennyviz: 0,
      birtokne: '',
      allapot_nev: '',
      kijajanlhato: 0,
      egyeb: '',
      epuletVan: false,
      terkepLink: '',
      gpsSzelesseg: 0,
      gpsHosszusag: 0,
      csarnok: [],
      iroda: [],
      zoldmezo: [],
      kapcsolattartok: [],
      dokumentumok: [],
      telephelyReszletek: [],
      helyrajziSzamok: [],
      autoPalya: [],
      vasutallomas: [],
      folyamikiKikoto: [],
      autobusmegallo: [],
      lakoterulet: [],
      fout: []
    };

    // Convert to SiteView for backward compatibility
    const newSiteView = this.siteToSiteView(newSite);

    const currentSites = this.sitesSubject.getValue();
    this.sitesSubject.next([...currentSites, newSiteView]);

    return of(azonosito);
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

    // Update the SiteView directly for backward compatibility
    const updatedSiteView = {
      ...currentSites[siteIndex],
      ...data,
      lastUpdated: new Date().toISOString()
    };

    const updatedSites = [...currentSites];
    updatedSites[siteIndex] = updatedSiteView;

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

  /**
   * Convert a Site object to a SiteView object for backward compatibility
   */
  private siteToSiteView(site: Site): SiteView {
    return {
      id: site.azonosito,
      name: site.megnevezes,
      type: site.tipus_nev,
      county: site.megye_nev,
      settlement: site.telepules_nev,
      size: site.meret,
      createdAt: site.letrehozva.toISOString(),
      lastUpdated: site.modositva.toISOString(),
      nameEnglish: site.megnevezesAngol,
      region: site.regio_nev,
      postalCode: site.irsz,
      migrated: site.migralt,
      notes: site.megjegyzes
    };
  }
}
