# Dátový model – 1. verzia

Nižšie je **návrh** Prisma schémy. Úloha 1 ho prenesie do `prisma/schema.prisma`. Úprava je možná, ale treba dodržať pravidlá:

- sumy v haléřích (`Int`),
- každá tabuľka s dátami používateľa má `accountId`,
- vystavená faktúra sa nemení.

Na doklade sú **kópie** údajov dodávateľa a odberateľa (snapshot), aby zmena zákazníka alebo nastavenia nezmenila starú faktúru.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum VatPayerStatus {
  PAYER
  NON_PAYER
}

enum EetMode {
  NOT_SET   // ešte nenastavené
  ON        // certifikát nahraný
  OFF       // režim EET OFF (paušál 1. pásmo)
}

enum Plan {
  FREE
  CRAFTSMAN
}

model Account {
  id                String         @id @default(cuid())
  ico               String?        @unique
  dic               String?
  name              String
  street            String?
  city              String?
  zip               String?
  vatStatus         VatPayerStatus @default(NON_PAYER)
  pricesIncludeVat  Boolean        @default(true)
  iban              String?
  bankName          String?
  logoUrl           String?
  accentColor       String?
  invoiceFooter     String?
  defaultDueDays    Int            @default(14)

  eetMode           EetMode        @default(NOT_SET)
  eetEic            String?        // identifikátor podnikateľa [OVERIŤ názov]
  eetUnitId         String?        // id_jednotky
  eetRegisterId     String?        @default("FAJFKA-01") // id_pokl
  eetCertEncrypted  Bytes?         // .p12 zašifrovaný AES-256-GCM
  eetCertPassEnc    Bytes?
  eetCertValidTo    DateTime?

  plan              Plan           @default(FREE)
  stripeCustomerId  String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  users     User[]
  customers Customer[]
  items     Item[]
  invoices  Invoice[]
  sequences InvoiceSequence[]
}

model User {
  id         String   @id @default(cuid())
  email      String   @unique
  accountId  String
  account    Account  @relation(fields: [accountId], references: [id])
  createdAt  DateTime @default(now())
  lastLogin  DateTime?
}

enum CustomerType {
  PERSON
  COMPANY
}

model Customer {
  id         String          @id @default(cuid())
  accountId  String
  account    Account         @relation(fields: [accountId], references: [id])
  type       CustomerType
  name       String
  email      String?
  phone      String?
  ico        String?
  dic        String?
  vatStatus  VatPayerStatus?
  street     String?
  city       String?
  zip        String?
  lastUsedAt DateTime?
  createdAt  DateTime        @default(now())
  invoices   Invoice[]

  @@index([accountId, lastUsedAt])
}

model Item {
  id         String  @id @default(cuid())
  accountId  String
  account    Account @relation(fields: [accountId], references: [id])
  name       String
  unit       String  // ks, h, m, m2, km, paušál
  priceHal   Int     // cena za jednotku v haléřích (s/bez DPH podľa Account.pricesIncludeVat)
  vatRate    Int     @default(21) // 21 | 12 | 0
  sortOrder  Int     @default(0)
  archived   Boolean @default(false)
}

model InvoiceSequence {
  accountId String
  account   Account @relation(fields: [accountId], references: [id])
  year      Int
  last      Int     @default(0)

  @@id([accountId, year])
}

enum InvoiceKind {
  NON_VAT_INVOICE
  VAT_INVOICE
  SIMPLIFIED_VAT_INVOICE
  VAT_INVOICE_REVERSE_CHARGE
}

enum InvoiceStatus {
  DRAFT
  ISSUED
  PAID
  CANCELLED
}

enum PaymentMethod {
  QR_ON_SITE
  CASH
  CARD
  BANK_TRANSFER_LATER
}

model Invoice {
  id              String        @id @default(cuid())
  accountId       String
  account         Account       @relation(fields: [accountId], references: [id])
  customerId      String?
  customer        Customer?     @relation(fields: [customerId], references: [id])

  number          String?       // 2026-0142, pridelí sa pri vystavení
  variableSymbol  String?
  kind            InvoiceKind?
  status          InvoiceStatus @default(DRAFT)
  paymentMethod   PaymentMethod?
  reverseCharge   Boolean       @default(false)

  issueDate       DateTime?
  taxableDate     DateTime?     // DUZP
  dueDate         DateTime?
  paidAt          DateTime?

  supplierSnapshot Json?        // kópia údajov Account pri vystavení
  customerSnapshot Json?        // kópia údajov Customer pri vystavení

  subtotalHal     Int           @default(0) // základ spolu
  vatHal          Int           @default(0)
  roundingHal     Int           @default(0)
  totalHal        Int           @default(0)
  amountReceivedHal Int?        // pri hotovosti
  vatRecap        Json?         // [{rate, baseHal, vatHal, totalHal}]

  cancelsInvoiceId String?      @unique
  cancelsInvoice   Invoice?     @relation("Cancellation", fields: [cancelsInvoiceId], references: [id])
  cancelledBy      Invoice?     @relation("Cancellation")

  pdfUrl          String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  lines      InvoiceLine[]
  eetRecords EetRecord[]
  emails     EmailLog[]

  @@unique([accountId, number])
  @@index([accountId, status, issueDate])
}

model InvoiceLine {
  id            String  @id @default(cuid())
  invoiceId     String
  invoice       Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  position      Int
  description   String
  quantityMilli Int     // 1,5 h = 1500
  unit          String
  unitPriceHal  Int
  vatRate       Int
  baseHal       Int
  vatHal        Int
  totalHal      Int
}

enum EetStatus {
  PENDING
  ACCEPTED
  REJECTED
  FAILED
}

model EetRecord {
  id            String    @id @default(cuid())
  invoiceId     String
  invoice       Invoice   @relation(fields: [invoiceId], references: [id])
  sequenceNo    String    // porad_cis
  amountHal     Int       // záporné pri storne
  messageUuid   String    @unique
  receivedAt    DateTime  // dat_trzby
  firstSentAt   DateTime?
  status        EetStatus @default(PENDING)
  pok           String?   // potvrdzovací kód
  attempts      Int       @default(0)
  lastError     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum EmailStatus {
  QUEUED
  SENT
  DELIVERED
  BOUNCED
  FAILED
}

model EmailLog {
  id          String      @id @default(cuid())
  invoiceId   String
  invoice     Invoice     @relation(fields: [invoiceId], references: [id])
  recipient   String
  kind        String      // invoice | reminder
  status      EmailStatus @default(QUEUED)
  providerId  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

Tabuľky pre session a magické odkazy dodá zvolená knižnica na prihlásenie (Auth.js adaptér pre Prisma).
