import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataService, SimpleSite} from '../../services/data.service';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {finalize, tap, first} from 'rxjs';
import {Site} from "../interfaces/site.interface";

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
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule
  ],
  templateUrl: './site-edit.component.html',
  styleUrl: './site-edit.component.scss'
})
export class SiteEditComponent implements OnInit {
  siteId: number = -1;
  site: Site | undefined = undefined;
  siteForm: FormGroup;
  loading: boolean = false;
  error: string = '';

  siteTypes = [
    {value: 'Ipari park', viewValue: 'Ipari park'},
    {value: 'Barnamezős terület', viewValue: 'Barnamezős terület'},
    {value: 'Zöldmező', viewValue: 'Zöldmező'},
  ];

  // Status options
  statusOptions = [
    {value: 'Aktív', viewValue: 'Aktív'},
    {value: 'Inaktív', viewValue: 'Inaktív'},
    {value: 'Törölt', viewValue: 'Törölt'}
  ];

  // Kapcsolattarto columns
  kapcsolattartoColumns: string[] = ['nev', 'telefon', 'email', 'actions'];

  // Dokumentum columns
  dokumentumColumns: string[] = ['nev', 'tipus', 'feltoltve', 'actions'];

  // Helyrajzi szám columns
  hrszColumns: string[] = ['helyrajziSzam', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.siteForm = this.fb.group({
      // Basic information
      megnevezes: ['', Validators.required],
      megnevezesAngol: [''],
      tipus_nev: ['', Validators.required],
      azonosito: [''],
      status: ['Aktív'],
      inaktivMagyarazat: [''],

      // Location information
      regio_nev: [''],
      megye_nev: ['', Validators.required],
      telepules_nev: ['', Validators.required],
      irsz: [''],
      utca: [''],
      korzet_nev: [''],

      // Technical information
      meret: [0, [Validators.required, Validators.min(1)]],
      bpTav: [0],
      iparVaganyVan: [false],
      aram: [0],
      gaz: [0],
      viz: [0],
      ipariviz: [0],
      szennyviz: [0],
      birtokne: [''],
      allapot_nev: [''],
      kiajanlhato: [0],
      egyeb: [''],
      epuletVan: [false],

      // GPS coordinates
      terkepLink: [''],
      gpsSzelesseg: [0],
      gpsHosszusag: [0],

      // Notes
      megjegyzes: [''],

      // Related entities
      csarnok: this.fb.group({
        terulet: [0],
        belmagassag: [0],
        kapacitas: [0]
      }),

      iroda: this.fb.group({
        terulet: [0],
        szintek: [0]
      }),

      zoldmezo: this.fb.group({
        terulet: [0],
        beepithetoseg: [0]
      }),

      // Arrays of related entities
      kapcsolattartok: this.fb.array([]),
      dokumentumok: this.fb.array([]),
      telephelyReszletek: this.fb.array([]),
      helyrajziSzamok: this.fb.array([]),

      // Distances
      autoPalya: this.fb.group({
        tavolsag: [0],
        nev: ['']
      }),

      vasutallomas: this.fb.group({
        tavolsag: [0],
        nev: ['']
      }),

      folyamiKikoto: this.fb.group({
        tavolsag: [0],
        nev: ['']
      }),

      autobuszmegallo: this.fb.group({
        tavolsag: [0],
        nev: ['']
      }),

      lakoterulet: this.fb.group({
        tavolsag: [0],
        nev: ['']
      }),

      fout: this.fb.group({
        tavolsag: [0],
        nev: ['']
      })
    });
  }

  ngOnInit(): void {
    // Get the site ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.siteId = +id;
        this.loadSite();
      } else {
        this.error = 'No site ID provided';
      }
    });
  }

  // Load the site data from the DataService
  loadSite(): void {
    this.loading = true;
    this.dataService.getSitesCollection('sites')
      .pipe(
        first(),
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

  // Helper methods for form arrays
  get kapcsolattartokArray(): FormArray {
    return this.siteForm.get('kapcsolattartok') as FormArray;
  }

  get dokumentumokArray(): FormArray {
    return this.siteForm.get('dokumentumok') as FormArray;
  }

  get telephelyReszletekArray(): FormArray {
    return this.siteForm.get('telephelyReszletek') as FormArray;
  }

  get helyrajziSzamokArray(): FormArray {
    return this.siteForm.get('helyrajziSzamok') as FormArray;
  }

  // Add a new kapcsolattarto
  addKapcsolattarto(): void {
    this.kapcsolattartokArray.push(this.fb.group({
      nev: ['', Validators.required],
      telefon: [''],
      email: ['', [Validators.email]]
    }));
  }

  // Remove a kapcsolattarto
  removeKapcsolattarto(index: number): void {
    this.kapcsolattartokArray.removeAt(index);
  }

  // Add a new dokumentum
  addDokumentum(): void {
    this.dokumentumokArray.push(this.fb.group({
      nev: ['', Validators.required],
      tipus: [''],
      feltoltve: [new Date().toISOString()]
    }));
  }

  // Remove a dokumentum
  removeDokumentum(index: number): void {
    this.dokumentumokArray.removeAt(index);
  }

  // Add a new helyrajzi szám
  addHelyrajziSzam(): void {
    this.helyrajziSzamokArray.push(this.fb.group({
      helyrajziSzam: ['', Validators.required]
    }));
  }

  // Remove a helyrajzi szám
  removeHelyrajziSzam(index: number): void {
    this.helyrajziSzamokArray.removeAt(index);
  }

  // Add a new telephely részlet
  addTelephelyReszlet(): void {
    this.telephelyReszletekArray.push(this.fb.group({
      nev: ['', Validators.required],
      ertek: ['']
    }));
  }

  // Remove a telephely részlet
  removeTelephelyReszlet(index: number): void {
    this.telephelyReszletekArray.removeAt(index);
  }

  // Populate the form with the site data
  populateForm(site: Site): void {
    // Basic form fields
    this.siteForm.patchValue({
      megnevezes: site.megnevezes,
      megnevezesAngol: site.megnevezesAngol || '',
      tipus_nev: site.tipus_nev,
      azonosito: site.id || '',
      status: site.inaktiv ? 'Inaktív' : (site.torolt ? 'Törölt' : 'Aktív'),
      inaktivMagyarazat: site.inaktivMagyarazat || '',

      // Location information
      regio_nev: site.regio_nev || '',
      megye_nev: site.megye_nev,
      telepules_nev: site.telepules_nev,
      irsz: site.irsz || '',
      utca: site.utca || '',
      korzet_nev: site.korzet_nev || '',

      // Technical information
      meret: site.meret,
      bpTav: site.bpTav || 0,
      iparVaganyVan: site.iparVaganyVan || false,
      aram: site.aram || 0,
      gaz: site.gaz || 0,
      viz: site.viz || 0,
      ipariviz: site.ipariviz || 0,
      szennyviz: site.szennyviz || 0,
      birtokne: site.birtokne || '',
      allapot_nev: site.allapot_nev || '',
      kiajanlhato: site.kiajanlhato || 0,
      egyeb: site.egyeb || '',
      epuletVan: site.epuletVan || false,

      // GPS coordinates
      terkepLink: site.terkepLink || '',
      gpsSzelesseg: site.gpsSzelesseg || 0,
      gpsHosszusag: site.gpsHosszusag || 0,

      // Notes
      megjegyzes: site.megjegyzes || ''
    });

    // Handle related entities if they exist
    if (site.csarnok) {
      this.siteForm.get('csarnok')?.patchValue(site.csarnok);
    }

    if (site.iroda) {
      this.siteForm.get('iroda')?.patchValue(site.iroda);
    }

    if (site.zoldmezo) {
      this.siteForm.get('zoldmezo')?.patchValue(site.zoldmezo);
    }

    // Handle distance objects
    if (site.autoPalya) {
      this.siteForm.get('autoPalya')?.patchValue(site.autoPalya);
    }

    if (site.vasutallomas) {
      this.siteForm.get('vasutallomas')?.patchValue(site.vasutallomas);
    }

    if (site.folyamiKikoto) {
      this.siteForm.get('folyamiKikoto')?.patchValue(site.folyamiKikoto);
    }

    if (site.autobuszmegallo) {
      this.siteForm.get('autobuszmegallo')?.patchValue(site.autobuszmegallo);
    }

    if (site.lakoterulet) {
      this.siteForm.get('lakoterulet')?.patchValue(site.lakoterulet);
    }

    if (site.fout) {
      this.siteForm.get('fout')?.patchValue(site.fout);
    }

    // Clear existing arrays
    while (this.kapcsolattartokArray.length) {
      this.kapcsolattartokArray.removeAt(0);
    }

    while (this.dokumentumokArray.length) {
      this.dokumentumokArray.removeAt(0);
    }

    while (this.telephelyReszletekArray.length) {
      this.telephelyReszletekArray.removeAt(0);
    }

    while (this.helyrajziSzamokArray.length) {
      this.helyrajziSzamokArray.removeAt(0);
    }

    // Add kapcsolattartok if they exist
    if (site.kapcsolattartok && site.kapcsolattartok.length) {
      site.kapcsolattartok.forEach(kapcsolattarto => {
        this.kapcsolattartokArray.push(this.fb.group({
          nev: [kapcsolattarto.teljesnev || '', Validators.required],
          telefon: [kapcsolattarto.mobilszam || ''],
          email: [kapcsolattarto.email || '', [Validators.email]]
        }));
      });
    }

    // // Add dokumentumok if they exist
    // if (site.dokumentumok && site.dokumentumok.length) {
    //   site.dokumentumok.forEach(dokumentum => {
    //     this.dokumentumokArray.push(this.fb.group({
    //       nev: [dokumentum.nev || '', Validators.required],
    //       tipus: [dokumentum. || ''],
    //       feltoltve: [dokumentum.feltoltve || new Date().toISOString()]
    //     }));
    //   });
    // }
    //
    // // Add telephelyReszletek if they exist
    // if (site.telephelyReszletek && site.telephelyReszletek.length) {
    //   site.telephelyReszletek.forEach(reszlet => {
    //     this.telephelyReszletekArray.push(this.fb.group({
    //       nev: [reszlet.nev || '', Validators.required],
    //       ertek: [reszlet.ertek || '']
    //     }));
    //   });
    // }

    // Add helyrajziSzamok if they exist
    if (site.helyrajziSzamok && site.helyrajziSzamok.length) {
      site.helyrajziSzamok.forEach(hrsz => {
        this.helyrajziSzamokArray.push(this.fb.group({
          helyrajziSzam: [hrsz.hrsz || '', Validators.required]
        }));
      });
    }
  }

  // Save the site data
  saveSite(): void {
    if (this.siteForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.siteForm.value;

    try { // Map form values to the expected format for the API
      const updatedData = {
        id: this.siteId,
        megnevezes: formValue.megnevezes,
        megnevezesAngol: formValue.megnevezesAngol,
        tipus_nev: formValue.tipus_nev,
        megye_nev: formValue.megye_nev,
        telepules_nev: formValue.telepules_nev,
        meret: formValue.meret,
        regio_nev: formValue.regio_nev,
        irsz: formValue.irsz,
        megjegyzes: formValue.megjegyzes,

        // Additional properties
        inaktiv: formValue.status === 'Inaktív',
        torolt: formValue.status === 'Törölt',
        inaktivMagyarazat: formValue.inaktivMagyarazat,
        utca: formValue.utca,
        korzet_nev: formValue.korzet_nev,
        bpTav: formValue.bpTav,
        iparVaganyVan: formValue.iparVaganyVan,
        aram: formValue.aram,
        gaz: formValue.gaz,
        viz: formValue.viz,
        ipariviz: formValue.ipariviz,
        szennyviz: formValue.szennyviz,
        birtokne: formValue.birtokne,
        allapot_nev: formValue.allapot_nev,
        kiajanlhato: formValue.kiajanlhato,
        egyeb: formValue.egyeb,
        epuletVan: formValue.epuletVan,
        terkepLink: formValue.terkepLink,
        gpsSzelesseg: formValue.gpsSzelesseg,
        gpsHosszusag: formValue.gpsHosszusag,

        // Required fields from Site interface that might be missing
        letrehozo: this.site?.letrehozo || '',
        letrehozva: this.site?.letrehozva || new Date(),
        modosito: this.site?.modosito || '',
        modositva: new Date(),
        azonosito: formValue.azonosito || '',
        migralt: this.site?.migralt || false,
        migraltLetrehozva: this.site?.migraltLetrehozva,

        //Related entities
        csarnok: formValue.csarnok,
        iroda: formValue.iroda,
        zoldmezo: formValue.zoldmezo,
        kapcsolattartok: formValue.kapcsolattartok,
        dokumentumok: formValue.dokumentumok,
        telephelyReszletek: formValue.telephelyReszletek,
        helyrajziSzamok: formValue.helyrajziSzamok,

        // Distances
        autoPalya: formValue.autoPalya,
        vasutallomas: formValue.vasutallomas,
        folyamiKikoto: formValue.folyamiKikoto,
        autobuszmegallo: formValue.autobuszmegallo,
        lakoterulet: formValue.lakoterulet,
        fout: formValue.fout
      };

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
    } catch (e) {
      console.error(e);
    }
  }

  // Cancel editing and return to the sites list
  cancel(): void {
    this.router.navigate(['sites']);
  }
}
