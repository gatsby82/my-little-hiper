export interface Iroda {
  id: number;
  letrehozo: string;
  letrehozva: Date;
  modosito: string;
  modositva: Date;
  torolt: boolean;
  telephely_id: number;
  nev: string;
  besorolas_nev: string;
  elhelyezkedes: string;
  teljesTerulet: number;
  legkondiVan: boolean;
  portaszolgVan: boolean;
  etteremVan: boolean;
  takaritasVan: boolean;
  biztSzolgVan: boolean;
  parkoloVan: boolean;
  orvosVan: boolean;
  parkVan: boolean;
  postaVan: boolean;
  berletiDijEur: number;
  minBerterulet: number;
  minBerido: number;
  minBeridoEgyseg_nev: string;
  uzemidijEur: number;
  kozosSzintTermut: number;
}
