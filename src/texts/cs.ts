/**
 * All user-facing texts in Czech.
 * Do NOT hardcode any text in components — always use t() from here.
 * Future: add sk.ts for Slovak.
 */

const cs = {
  // App / brand
  app: {
    name: "Fajfka",
  },

  // Bottom navigation
  nav: {
    home: "Domů",
    invoices: "Faktury",
    customers: "Zákazníci",
    more: "Více",
  },

  // Home screen
  home: {
    greeting: "Ahoj",
    monthPaid: "zaplaceno",
    waiting: "Čeká",
    overdue: "Po splatnosti",
    recentInvoices: "Poslední faktury",
    newInvoice: "Nová faktura",
    quickInvoice: "Rychlá faktura",
    eetConnected: "EET připojeno",
    eetDisconnected: "EET nepřipojeno",
    eetOff: "EET OFF",
  },

  // Invoice statuses
  status: {
    paid: "Zaplaceno",
    waiting: "Čeká",
    overdue: "Po splatnosti",
    draft: "Koncept",
    cancelled: "Stornováno",
    inEet: "V EET",
  },

  // Invoice form – step 1: customer
  invoiceCustomer: {
    title: "Komu fakturuješ?",
    person: "Člověk",
    company: "Firma",
    searchPlaceholder: "Jméno, IČO nebo e-mail",
    recentCustomers: "Naposledy",
    newCustomer: "Nový zákazník",
    continue: "Pokračovat",
  },

  // Invoice form – step 2: items
  invoiceItems: {
    title: "Co fakturuješ?",
    addItem: "Přidat položku",
    fromPricelist: "Z ceníku",
    total: "Celkem",
    vatSummary: "Rekapitulace DPH",
    continue: "Pokračovat k platbě",
  },

  // Invoice form – step 3: payment
  invoicePayment: {
    title: "Jak zaplatí?",
    qrOnSite: "QR platba teď",
    qrOnSiteDesc: "Zákazník zaplatí přes mobil",
    cash: "Hotově nebo kartou",
    cashDesc: "Zaplatí u vás",
    later: "Zaplatí později",
    laterDesc: "Fakturu s QR dostane e-mailem",
    emailLabel: "E-mail zákazníka",
    emailPlaceholder: "Fakturu pošleme e-mailem",
    reverseCharge: "Přenesená daňová povinnost",
  },

  // QR screen
  qr: {
    title: "QR platba",
    instructions: "Zákazník naskenuje QR kód mobilní bankou",
    variableSymbol: "VS",
    bank: "Účet",
    paid: "Zaplaceno",
  },

  // Success screen
  success: {
    paid: "Zaplaceno ✓",
    eetSent: "Tržba je v EET ✓",
    eetPending: "EET odešleme, až budeš online",
    emailSent: "E-mail odeslán",
    done: "Hotovo",
    share: "Sdílet PDF",
  },

  // Invoice list
  invoiceList: {
    title: "Faktury",
    filters: {
      all: "Vše",
      waiting: "Čeká",
      overdue: "Po splatnosti",
      paid: "Zaplaceno",
    },
    empty: "Žádné faktury",
  },

  // Customers
  customers: {
    title: "Zákazníci",
    searchPlaceholder: "Hledat zákazníka",
    empty: "Žádní zákazníci",
    newCustomer: "Nový zákazník",
  },

  // Customer form (new / edit)
  customerForm: {
    titleNew: "Nový zákazník",
    titleEdit: "Upravit zákazníka",
    tabPerson: "Člověk",
    tabCompany: "Firma",
    namePerson: "Jméno",
    nameCompany: "Název firmy",
    namePlaceholderPerson: "Jan Novák",
    namePlaceholderCompany: "ABC s.r.o.",
    ico: "IČO",
    icoPlaceholder: "12345678",
    icoLookup: "Načíst z ARESu",
    dic: "DIČ",
    dicPlaceholder: "CZ12345678",
    vatPayer: "Plátce DPH",
    vatNonPayer: "Neplátce DPH",
    email: "E-mail",
    emailPlaceholder: "novak@example.com",
    phone: "Telefon",
    phonePlaceholder: "+420 777 123 456",
    street: "Ulice a číslo",
    streetPlaceholder: "Hlavní 1",
    city: "Město",
    cityPlaceholder: "Praha",
    zip: "PSČ",
    zipPlaceholder: "110 00",
    save: "Uložit zákazníka",
    saveChanges: "Uložit změny",
    delete: "Smazat zákazníka",
  },

  // Pricelist
  pricelist: {
    title: "Ceník",
    empty: "Žádné položky v ceníku",
    newItem: "Nová položka",
    titleNew: "Nová položka",
    titleEdit: "Upravit položku",
    name: "Název",
    namePlaceholder: "Hodina práce",
    unit: "Jednotka",
    price: "Cena bez DPH",
    vatRate: "Sazba DPH",
    save: "Uložit položku",
    saveChanges: "Uložit změny",
    archive: "Archivovat",
    archived: "Archivováno",
  },

  // More / settings
  more: {
    title: "Více",
    pricelist: "Ceník",
    settings: "Nastavení",
    export: "Export pro účetní",
    subscription: "Předplatné",
  },

  // Errors
  error: {
    noSignal: "Nemáš signál. Fakturu jsme uložili, EET odešleme, až budeš online.",
    eetFailed: "EET se nepodařilo odeslat. Zkontroluj připojení.",
    generic: "Něco se pokazilo. Zkus to znovu.",
    aresUnavailable: "ARES není dostupný. Zadej údaje ručně.",
  },

  // Onboarding
  onboarding: {
    step1Title: "Zadej IČO",
    step1Desc: "Načteme tvoje údaje z ARESu",
    step2Title: "Jsi plátce DPH?",
    step2Yes: "Ano, jsem plátce DPH",
    step2No: "Ne, nejsem plátce DPH",
    step3Title: "Bankovní účet a EET",
    ibanLabel: "Číslo účtu (IBAN)",
    eetLater: "Nastavím EET později",
    eetOff: "Mám EET OFF (paušál 1. pásmo)",
    continue: "Pokračovat",
    finish: "Hotovo, jdeme fakturovat",
  },

  // Add to home screen
  addToHome: {
    title: "Přidej na plochu",
    subtitle: "Aby ses nemusel přihlašovat pokaždé",
    step1: "Klepni na",
    step1suffix: "v dolním panelu Safari",
    step2: 'Vyber "Přidat na plochu"',
    step3: 'Potvrď tlačítkem "Přidat"',
    understood: "Rozumím",
  },
} as const;

export type TextKey = typeof cs;

/**
 * Returns text by dot-notation key path.
 * Usage: t('nav.home') → "Domů"
 * For interpolation use template literals: `${t('home.greeting')}, Petře`
 */
export function t<
  K1 extends keyof TextKey,
  K2 extends keyof TextKey[K1],
>(key: `${K1}.${K2 extends string ? K2 : never}`): string {
  const [k1, k2] = key.split(".") as [K1, K2];
  const val = cs[k1]?.[k2];
  return typeof val === "string" ? val : String(val ?? key);
}

export default cs;
