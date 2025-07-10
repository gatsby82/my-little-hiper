// Script to generate 67 sites with all connected entities
const fs = require('fs');

// Template for a site with all connected entities
const siteTemplate = {
  id: 0,
  inaktiv: false,
  inaktivMagyarazat: "",
  letrehozo: "admin",
  letrehozva: "2023-01-01T08:00:00Z",
  modosito: "admin",
  modositva: "2023-01-01T08:00:00Z",
  torolt: false,
  megnevezes: "",
  megnevezesAngol: "",
  azonosito: "",
  tipus_nev: "",
  regio_nev: "",
  megye_nev: "",
  telepules_nev: "",
  korzet_nev: "",
  irsz: "",
  utca: "",
  migralt: false,
  migraltLetrehozva: "2022-12-01T08:00:00Z",
  meret: 0,
  megjegyzes: "",
  bpTav: 0,
  iparVaganyVan: false,
  aram: 0,
  gaz: 0,
  viz: 0,
  ipariviz: 0,
  szennyviz: 0,
  birtokne: "",
  allapot_nev: "",
  kijajanlhato: 1,
  egyeb: "",
  epuletVan: false,
  terkepLink: "",
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
  folyamikiKikoto: undefined,
  autobusmegallo: undefined,
  lakoterulet: undefined,
  fout: undefined
};

// Data for generating sites
const tipusok = ["Raktár", "Iroda", "Gyártóüzem", "Logisztikai központ"];
const regiok = ["Közép-Magyarország", "Észak-Alföld", "Észak-Magyarország", "Dél-Dunántúl", "Dél-Alföld", "Nyugat-Dunántúl", "Közép-Dunántúl"];
const megyek = ["Pest", "Hajdú-Bihar", "Borsod-Abaúj-Zemplén", "Baranya", "Csongrád-Csanád", "Győr-Moson-Sopron", "Vas", "Zala", "Somogy", "Tolna", "Fejér", "Veszprém", "Komárom-Esztergom", "Nógrád", "Heves", "Jász-Nagykun-Szolnok", "Békés", "Bács-Kiskun", "Szabolcs-Szatmár-Bereg"];
const telepulesek = ["Budapest", "Debrecen", "Miskolc", "Pécs", "Szeged", "Győr", "Szombathely", "Zalaegerszeg", "Kaposvár", "Szekszárd", "Székesfehérvár", "Veszprém", "Tatabánya", "Érd", "Salgótarján", "Eger", "Szolnok", "Békéscsaba", "Kecskemét", "Nyíregyháza", "Gödöllő", "Szentendre", "Hajdúszoboszló", "Hódmezővásárhely", "Mohács", "Kazincbarcika", "Sopron", "Budaörs"];
const allapotok = ["Kiváló", "Jó", "Megfelelő", "Felújítandó"];
const birtokok = ["Saját tulajdon", "Bérelt", "Lízingelt"];

// Generate a random site
function generateSite(id) {
  const tipus = tipusok[Math.floor(Math.random() * tipusok.length)];
  const regio = regiok[Math.floor(Math.random() * regiok.length)];
  const megye = megyek[Math.floor(Math.random() * megyek.length)];
  const telepules = telepulesek[Math.floor(Math.random() * telepulesek.length)];
  const allapot = allapotok[Math.floor(Math.random() * allapotok.length)];
  const birtok = birtokok[Math.floor(Math.random() * birtokok.length)];

  const megnevezes = `${telepules} ${tipus} ${id}`;
  const megnevezesAngol = `${telepules} ${tipus} ${id} EN`;
  const azonosito = `SITE-${String(id).padStart(3, '0')}-${telepules.substring(0, 2).toUpperCase()}`;

  const site = { ...siteTemplate };
  site.id = id;
  site.megnevezes = megnevezes;
  site.megnevezesAngol = megnevezesAngol;
  site.azonosito = azonosito;
  site.tipus_nev = tipus;
  site.regio_nev = regio;
  site.megye_nev = megye;
  site.telepules_nev = telepules;
  site.korzet_nev = "Belváros";
  site.irsz = `${Math.floor(1000 + Math.random() * 8000)}`;
  site.utca = `Fő utca ${Math.floor(1 + Math.random() * 100)}.`;
  site.migralt = id <= 30;
  site.meret = Math.floor(500 + Math.random() * 3500);
  site.megjegyzes = `${megnevezes} megjegyzés`;
  site.bpTav = telepules === "Budapest" ? 0 : Math.floor(10 + Math.random() * 290);
  site.iparVaganyVan = Math.random() > 0.7;
  site.aram = Math.floor(70 + Math.random() * 31);
  site.gaz = Math.floor(70 + Math.random() * 31);
  site.viz = Math.floor(70 + Math.random() * 31);
  site.ipariviz = tipus === "Gyártóüzem" ? Math.floor(50 + Math.random() * 51) : 0;
  site.szennyviz = Math.floor(70 + Math.random() * 31);
  site.birtokne = birtok;
  site.allapot_nev = allapot;
  site.egyeb = `${megnevezes} egyéb információ`;
  site.epuletVan = tipus !== "Zöldmező";
  site.terkepLink = `https://maps.google.com/?q=${46 + Math.random() * 3},${16 + Math.random() * 6}`;
  site.gpsSzelesseg = 46 + Math.random() * 3;
  site.gpsHosszusag = 16 + Math.random() * 6;

  // Add connected entities
  addConnectedEntities(site, id);

  return site;
}

// Add connected entities to a site
function addConnectedEntities(site, siteId) {
  // Determine the type of site based on siteId
  // siteId % 3 = 0: Csarnok, siteId % 3 = 1: Iroda, siteId % 3 = 2: Zoldmezo
  const siteType = siteId % 3;

  if (siteType === 0) {
    // Add csarnok
    site.csarnok = {
      id: siteId * 10,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      telephely_id: siteId,
      meret: Math.floor(500 + Math.random() * 2500),
      teruletBovitheto: Math.random() > 0.5,
      csarnokBovitheto: Math.random() > 0.5,
      iparterMeret: Math.floor(300 + Math.random() * 700),
      gyartoCsarnokMeret: site.tipus_nev === "Gyártóüzem" ? Math.floor(500 + Math.random() * 1500) : Math.floor(200 + Math.random() * 300),
      raktarMeret: site.tipus_nev === "Raktár" ? Math.floor(500 + Math.random() * 1500) : Math.floor(200 + Math.random() * 300),
      kozosHelyMeret: Math.floor(100 + Math.random() * 200),
      nyitottTerulet: Math.floor(200 + Math.random() * 500),
      epuleteSzerkezet: Math.random() > 0.5 ? "Vasbeton" : "Acélszerkezet",
      suritettLevego: Math.random() > 0.5 ? "Van" : "Nincs",
      padloTerhTol: Math.floor(1 + Math.random() * 3),
      padloTerhIg: Math.floor(4 + Math.random() * 5),
      belmagassagTol: Math.floor(4 + Math.random() * 3),
      belmagassagIg: Math.floor(7 + Math.random() * 5),
      epitesEv: Math.floor(1990 + Math.random() * 33),
      daruLehet: Math.random() > 0.5,
      darukSzama: Math.floor(1 + Math.random() * 4),
      daruTipus: "Híddaru",
      ipariKapuVan: true, // Always true for fully populated
      crossDockLehet: true, // Always true for fully populated
      hutoFutoVan: true, // Always true for fully populated
      tuzcsapVan: true, // Always true for fully populated
      tuzoltoRendszerVan: true, // Always true for fully populated
      kameraRendszerVan: true, // Always true for fully populated
      riasztoRendszerVan: true, // Always true for fully populated
      keritesVan: true, // Always true for fully populated
      parkoloVan: true, // Always true for fully populated
      kamionMegkoz: true, // Always true for fully populated
      felujitasKell: Math.random() > 0.5,
      btsOpcioVan: true, // Always true for fully populated
      kiado: Math.random() > 0.5,
      elado: Math.random() > 0.5,
      kiadoIdoszakMin: Math.floor(6 + Math.random() * 18),
      kiadoMinTerulet: Math.floor(200 + Math.random() * 800),
      kiadoBerletiDijEur: Math.floor(5 + Math.random() * 15),
      kiadoEgyebDijEur: Math.floor(1 + Math.random() * 5),
      eladasiIranyarEur: Math.floor(500000 + Math.random() * 1500000), // Always set a value for fully populated
      birtokne: site.birtokne,
      minosites: Math.random() > 0.5 ? "A+" : "A",
      szolgDij: `${Math.floor(1 + Math.random() * 4)} EUR/m²/hó`,
      ipariKapuSzamEp: Math.floor(2 + Math.random() * 6),
      ipariKapuSzamTh: Math.floor(2 + Math.random() * 6),
      csarnokTeruletek: []
    };

    // Add csarnokTeruletek - always add 3 for fully populated
    const teruletCount = 3;
    for (let j = 0; j < teruletCount; j++) {
      const teruletId = site.csarnok.id * 10 + j;
      const terulet = {
        id: teruletId,
        letrehozo: "admin",
        letrehozva: "2023-01-01T08:00:00Z",
        modosito: "admin",
        modositva: "2023-01-01T08:00:00Z",
        torolt: false,
        csarnok_id: site.csarnok.id,
        sorszam: j + 1,
        tipus_nev: j === 0 ? (site.tipus_nev === "Raktár" ? "Raktár" : "Gyártócsarnok") : (j === 1 ? "Iroda" : "Közös helyiség"),
        meret: j === 0 ? (site.tipus_nev === "Raktár" ? site.csarnok.raktarMeret : site.csarnok.gyartoCsarnokMeret) : (j === 1 ? 200 : site.csarnok.kozosHelyMeret),
        belmagassagTol: j === 0 ? site.csarnok.belmagassagTol : 3,
        belmagassagIg: j === 0 ? site.csarnok.belmagassagIg : 3
      };
      site.csarnok.csarnokTeruletek.push(terulet);
    }
  } else if (siteType === 1) {
    // Add iroda
    site.iroda = {
      id: siteId * 10,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      telephely_id: siteId,
      nev: `${site.megnevezes} Iroda`,
      besorolas_nev: Math.random() > 0.5 ? "A+ kategória" : "A kategória",
      elhelyezkedes: Math.random() > 0.5 ? "Földszint" : `${Math.floor(1 + Math.random() * 5)}. emelet`,
      teljesTerulet: Math.floor(100 + Math.random() * 900),
      legkondiVan: true, // Always true for fully populated
      portaszolgVan: true, // Always true for fully populated
      etteremVan: true, // Always true for fully populated
      takaritasVan: true, // Always true for fully populated
      biztSzolgVan: true, // Always true for fully populated
      parkoloVan: true, // Always true for fully populated
      orvosVan: true, // Always true for fully populated
      parkVan: true, // Always true for fully populated
      postaVan: true, // Always true for fully populated
      berletiDijEur: Math.floor(8 + Math.random() * 12),
      minBerterulet: Math.floor(30 + Math.random() * 70),
      minBerido: Math.floor(6 + Math.random() * 18),
      minBeridoEgyseg_nev: "hónap",
      uzemidijEur: Math.floor(2 + Math.random() * 4),
      kozosSzintTermut: Math.floor(20 + Math.random() * 100)
    };
  } else {
    // Add zoldmezo
    site.zoldmezo = {
      id: siteId * 10,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      telephely_id: siteId,
      oszthato: Math.random() > 0.5,
      legkisebbTerulet: Math.floor(500 + Math.random() * 1500),
      bovithetoTerulet: Math.floor(1000 + Math.random() * 5000),
      meret: `${Math.floor(5000 + Math.random() * 20000)} m²`,
      maxBeepitheto: Math.floor(30 + Math.random() * 40),
      minZoldterulet: Math.floor(20 + Math.random() * 30),
      maxEpuletMagassag: Math.floor(10 + Math.random() * 20),
      besorolas_nev: "Ipari terület",
      tulForma_nev: site.birtokne,
      erdoVan: Math.random() > 0.5,
      loszerMentKell: Math.random() > 0.5,
      karMentKell: Math.random() > 0.5,
      bontasKell: Math.random() > 0.5,
      vezetekAtmegy: Math.random() > 0.5,
      vezetekAthelyezheto: Math.random() > 0.5,
      palyazatiErintettseg: Math.random() > 0.5,
      regeszetiErintettseg: Math.random() > 0.5,
      geodeziaVan_nev: Math.random() > 0.5 ? "Van" : "Nincs",
      kornyHatVizsgaVan_nev: Math.random() > 0.5 ? "Van" : "Nincs",
      lejtes_nev: Math.random() > 0.7 ? "Sík" : "Enyhe lejtés",
      iranyarEur: Math.floor(500000 + Math.random() * 1500000),
      iranyarNmEurTol: Math.floor(20 + Math.random() * 30),
      iranyarNmEurIg: Math.floor(50 + Math.random() * 50),
      megujuloEnergia_nev: Math.random() > 0.5 ? "Napelem" : "Nincs",
      jelenlegiHasznositas: "Ipari terület",
      termVedErintettseg: Math.random() > 0.5 ? "Van" : "Nincs"
    };
  }

  // Add kapcsolattartok - always add 2 for fully populated
  const kapcsolattartoCount = 2;
  for (let i = 0; i < kapcsolattartoCount; i++) {
    const kapcsolattartoId = siteId * 10 + i;
    const kapcsolattarto = {
      id: kapcsolattartoId,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      inaktiv: false,
      elsodleges: i === 0,
      telephely_id: siteId,
      kapcsolattarto_id: kapcsolattartoId,
      teljesnev: i === 0 ? "Kovács János" : "Nagy Éva",
      beosztas: i === 0 ? "Telephelyvezető" : "Adminisztrátor",
      mobilszam: i === 0 ? "+36301234567" : "+36309876543",
      email: i === 0 ? "kovacs.janos@example.com" : "nagy.eva@example.com"
    };
    site.kapcsolattartok.push(kapcsolattarto);
  }

  // Add dokumentumok - always add 2 for fully populated
  const dokumentumCount = 2;
  for (let i = 0; i < dokumentumCount; i++) {
    const dokumentumId = siteId * 10 + i;
    const dokumentum = {
      id: dokumentumId,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      sorszam: i + 1,
      azonosito: `DOK-${String(dokumentumId).padStart(3, '0')}`,
      nev: i === 0 ? "Alaprajz" : "Műszaki leírás",
      fajlnev: i === 0 ? "alaprajz.pdf" : "muszaki_leiras.pdf",
      entitasNev: "Telephely",
      entitasId: siteId,
      felhasznalas_nev: "Dokumentáció",
      bpmId: "",
      bpmLink: "",
      externalId: "",
      externalLink: "",
      ikataszam: "",
      korrelacioId: "",
      dokWsHibaKod: 0,
      dokWsHibaSzoveg: "",
      dokWsParam: "",
      megjegyzes: i === 0 ? "Telephely alaprajza" : "Telephely műszaki leírása",
      letrehozvaStr: "2023-01-01 08:00:00",
      modositvaStr: "2023-01-01 08:00:00"
    };
    site.dokumentumok.push(dokumentum);
  }

  // Add telephelyReszletek - always add 2 for fully populated
  const reszletCount = 2;
  for (let i = 0; i < reszletCount; i++) {
    const reszletId = siteId * 10 + i;
    const reszlet = {
      id: reszletId,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      telephely_id: siteId,
      sorszam: i + 1,
      azonosito: `RESZLET-${String(reszletId).padStart(3, '0')}`,
      megnevezes: i === 0 ? "Főépület" : "Melléképület",
      megnevezesAngol: i === 0 ? "Main Building" : "Annex Building",
      minTerulet: i === 0 ? Math.floor(500 + Math.random() * 1500) : Math.floor(200 + Math.random() * 300),
      meret: i === 0 ? `${Math.floor(1000 + Math.random() * 2000)} m²` : `${Math.floor(200 + Math.random() * 300)} m²`,
      megjegyzes: i === 0 ? "Központi épület" : "Kiegészítő épület"
    };
    site.telephelyReszletek.push(reszlet);
  }

  // Add helyrajziSzamok - always add 2 for fully populated
  const hrszCount = 2;
  for (let i = 0; i < hrszCount; i++) {
    const hrszId = siteId * 10 + i;
    const hrsz = {
      id: hrszId,
      letrehozo: "admin",
      letrehozva: "2023-01-01T08:00:00Z",
      modosito: "admin",
      modositva: "2023-01-01T08:00:00Z",
      torolt: false,
      telephely_id: siteId,
      sorszam: i + 1,
      hrsz: `${Math.floor(10000 + Math.random() * 90000)}/${Math.floor(1 + Math.random() * 9)}`
    };
    site.helyrajziSzamok.push(hrsz);
  }

  // Add autoPalya - now a single field
  const autopalyaId = siteId * 100;
  site.autoPalya = {
    id: autopalyaId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Autópálya",
    nev: `M${Math.floor(1 + Math.random() * 7)}`,
    tav: Math.floor(1 + Math.random() * 20),
    ido: Math.floor(5 + Math.random() * 25)
  };

  // Add vasutallomas - now a single field
  const vasutId = siteId * 100 + 10;
  site.vasutallomas = {
    id: vasutId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Vasútállomás",
    nev: `${site.telepules_nev} vasútállomás`,
    tav: Math.floor(1 + Math.random() * 10),
    ido: Math.floor(5 + Math.random() * 20)
  };

  // Add folyamikiKikoto - now a single field
  const kikotoId = siteId * 100 + 20;
  site.folyamikiKikoto = {
    id: kikotoId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Folyami kikötő",
    nev: `${site.telepules_nev} kikötő`,
    tav: Math.floor(1 + Math.random() * 15),
    ido: Math.floor(5 + Math.random() * 30)
  };

  // Add autobusmegallo - now a single field
  const buszId = siteId * 100 + 30;
  site.autobusmegallo = {
    id: buszId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Autóbuszmegálló",
    nev: `${site.utca.split('.')[0]} megálló`,
    tav: Math.random() * 0.5,
    ido: Math.floor(1 + Math.random() * 5)
  };

  // Add lakoterulet - now a single field
  const lakoId = siteId * 100 + 40;
  site.lakoterulet = {
    id: lakoId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Lakóterület",
    nev: site.korzet_nev,
    tav: Math.floor(Math.random() * 3),
    ido: Math.floor(1 + Math.random() * 10)
  };

  // Add fout - now a single field
  const foutId = siteId * 100 + 50;
  site.fout = {
    id: foutId,
    letrehozo: "admin",
    letrehozva: "2023-01-01T08:00:00Z",
    modosito: "admin",
    modositva: "2023-01-01T08:00:00Z",
    torolt: false,
    telephely_id: siteId,
    sorszam: 1,
    tipus_nev: "Főút",
    nev: `${Math.floor(1 + Math.random() * 8)}-es főút`,
    tav: Math.floor(Math.random() * 5),
    ido: Math.floor(1 + Math.random() * 10)
  };
}

// Generate 7 fully populated sites
const sites = [];
for (let i = 1; i <= 7; i++) {
  sites.push(generateSite(i));
}

// Write to file
const data = {
  sites: sites
};

fs.writeFileSync('src/assets/data/sites.json', JSON.stringify(data, null, 2));
console.log('Generated 7 fully populated sites with all connected entities to sites.json');
