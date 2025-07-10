import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, catchError, map, of, tap} from 'rxjs';
import {Site} from '../site/interfaces/site.interface';

// Define an interface for backward compatibility with existing code
export interface SimpleSite {
  id: number;
  megnevezes: string;
  tipus_nev: string;
  county: string;
  settlement: string;
  size: number;
  nameEnglish?: string;
  region?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sitesSubject = new BehaviorSubject<Site[]>([]);
  // Expose sites as an Observable
  public sites$: Observable<Site[]> = this.sitesSubject.asObservable();
  private simpleSitesSubject = new BehaviorSubject<SimpleSite[]>([]);
  public simpleSites$: Observable<SimpleSite[]> = this.simpleSitesSubject.asObservable();
  private sitesLoaded = false;
  private nextId = 1;

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
        return sitesData.sites.map((siteData: any) => {
          const site: Site = {
            id: siteData.id,
            inaktiv: siteData.inaktiv || false,
            inaktivMagyarazat: siteData.inaktivMagyarazat || '',
            letrehozo: siteData.letrehozo || '',
            letrehozva: new Date(siteData.letrehozva),
            modosito: siteData.modosito || '',
            modositva: new Date(siteData.modositva),
            torolt: siteData.torolt || false,
            megnevezes: siteData.megnevezes,
            megnevezesAngol: siteData.megnevezesAngol || '',
            azonosito: siteData.azonosito,
            tipus_nev: siteData.tipus_nev,
            regio_nev: siteData.regio_nev || '',
            megye_nev: siteData.megye_nev,
            telepules_nev: siteData.telepules_nev,
            korzet_nev: siteData.korzet_nev || '',
            irsz: siteData.irsz || '',
            utca: siteData.utca || '',
            migralt: siteData.migralt || false,
            migraltLetrehozva: siteData.migraltLetrehozva ? new Date(siteData.migraltLetrehozva) : new Date(),
            meret: siteData.meret || 0,
            megjegyzes: siteData.megjegyzes || '',
            bpTav: siteData.bpTav || 0,
            iparVaganyVan: siteData.iparVaganyVan || false,
            aram: siteData.aram || 0,
            gaz: siteData.gaz || 0,
            viz: siteData.viz || 0,
            ipariviz: siteData.ipariviz || 0,
            szennyviz: siteData.szennyviz || 0,
            birtokne: siteData.birtokne || '',
            allapot_nev: siteData.allapot_nev || '',
            kiajanlhato: siteData.kijajanlhato || 0,
            egyeb: siteData.egyeb || '',
            epuletVan: siteData.epuletVan || false,
            terkepLink: siteData.terkepLink || '',
            gpsSzelesseg: siteData.gpsSzelesseg || 0,
            gpsHosszusag: siteData.gpsHosszusag || 0,
            csarnok: siteData.csarnok,
            iroda: siteData.iroda,
            zoldmezo: siteData.zoldmezo,
            kapcsolattartok: siteData.kapcsolattartok || [],
            dokumentumok: siteData.dokumentumok || [],
            telephelyReszletek: siteData.telephelyReszletek || [],
            helyrajziSzamok: siteData.helyrajziSzamok || [],
            autoPalya: siteData.autoPalya,
            vasutallomas: siteData.vasutallomas,
            folyamiKikoto: siteData.folyamikiKikoto,
            autobuszmegallo: siteData.autobusmegallo,
            lakoterulet: siteData.lakoterulet,
            fout: siteData.fout
          };

          // Then convert to SiteView for backward compatibility
          return site; // this.siteToSimpleSite(site);
        });
      }),
      tap((sites: Site[]) => {
        this.updateSiteSubjects(sites);

        this.sitesLoaded = true;
      }),
      catchError(error => {
        console.error('Error initializing data service:', error);
        this.updateSiteSubjects([]);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Get all sites as an Observable
   */
  getSitesCollection(collectionName: string): Observable<Site[]> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'sites') {
      console.warn(`Collection ${collectionName} not supported, returning sites instead`);
    }

    return this.sites$;
  }

  getSimpleSitesCollection(collectionName: string): Observable<SimpleSite[]> {
    if (!this.sitesLoaded) {
      this.initialize();
    }

    if (collectionName !== 'simpleSites') {
      console.warn(`Collection ${collectionName} not supported, returning simpleSites instead`);
    }

    return this.simpleSites$;
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
      kiajanlhato: 0,
      egyeb: '',
      epuletVan: false,
      terkepLink: '',
      gpsSzelesseg: 0,
      gpsHosszusag: 0,
      csarnok: undefined,
      iroda: undefined,
      zoldmezo: undefined,
      kapcsolattartok: [],
      dokumentumok: [],
      telephelyReszletek: [],
      helyrajziSzamok: [],
      autoPalya: undefined,
      vasutallomas: undefined,
      folyamiKikoto: undefined,
      autobuszmegallo: undefined,
      lakoterulet: undefined,
      fout: undefined
    };

    const currentSites = this.sitesSubject.getValue();
    this.updateSiteSubjects([...currentSites, newSite]);

    // this.sitesSubject.next([...currentSites, newSite]);
    //
    // const currentSimpleSites = this.simpleSitesSubject.getValue();
    // this.simpleSitesSubject.next([...currentSimpleSites, this.siteToSimpleSite(newSite)]);

    return of(azonosito);
  }

  /**
   * Update a site
   */
  updateDocument(collectionName: string, docId: number, data: any): Observable<boolean> {
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

    this.updateSiteSubjects(updatedSites);
    return of(true);
  }

  /**
   * Delete a site
   */
  deleteDocument(collectionName: string, docId: number): Observable<boolean> {
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

    this.updateSiteSubjects(updatedSites);
    return of(true);
  }

  private getNextId(): number {
    return this.nextId++;
  }

  private updateSiteSubjects(sites: Site[]): void {
    this.sitesSubject.next(sites);
    this.simpleSitesSubject.next(sites.map(site => this.siteToSimpleSite(site)));
  }

  private siteToSimpleSite(site: Site): SimpleSite {
    return {
      id: site.id,
      megnevezes: site.megnevezes,
      tipus_nev: site.tipus_nev,
      county: site.megye_nev,
      settlement: site.telepules_nev,
      size: site.meret,
      region: site.regio_nev
    };
  }
}
