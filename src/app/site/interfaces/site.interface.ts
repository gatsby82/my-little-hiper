
import { Iroda } from './iroda.interface';
import { Zoldmezo } from './zoldmezo.interface';
import { TelephelyKapcsolattarto } from './telephely-kapcsolattarto.interface';
import { Fajl } from './fajl.interface';
import { TelephelyReszlet } from './telephely-reszlet.interface';
import { TelephelyHrsz } from './telephely-hrsz.interface';
import { Tavolsag } from './tavolsag.interface';
import {Csarnok} from "./csarnok.interface";

export interface Site {
  id: number;
  inaktiv: boolean;
  inaktivMagyarazat: string;
  letrehozo: string;
  letrehozva: Date;
  modosito: string;
  modositva: Date;
  torolt: boolean;
  megnevezes: string;
  megnevezesAngol: string;
  azonosito: string;
  tipus_nev: string;
  regio_nev: string;
  megye_nev: string; // varmegye_nev lehet, de érdemes átnevezni
  telepules_nev: string;
  korzet_nev: string;
  irsz: string;
  utca: string;
  migralt: boolean;
  migraltLetrehozva: Date;
  meret: number;
  megjegyzes: string;
  bpTav: number;
  iparVaganyVan: boolean;
  aram: number;
  gaz: number;
  viz: number;
  ipariviz: number;
  szennyviz: number;
  birtokne: string;
  allapot_nev: string;
  kijajanlhato: number;
  egyeb: string;
  epuletVan: boolean;
  terkepLink: string;
  gpsSzelesseg: number;
  gpsHosszusag: number;
  // Kapcsolt entitások
  csarnok: Csarnok[];
  iroda: Iroda[];
  zoldmezo: Zoldmezo[];
  kapcsolattartok: TelephelyKapcsolattarto[];
  dokumentumok: Fajl[];
  telephelyReszletek: TelephelyReszlet[];
  helyrajziSzamok: TelephelyHrsz[];
  autoPalya: Tavolsag[];
  vasutallomas: Tavolsag[];
  folyamikiKikoto: Tavolsag[];
  autobusmegallo: Tavolsag[];
  lakoterulet: Tavolsag[];
  fout: Tavolsag[];
}
