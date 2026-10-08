-- CreateEnum
CREATE TYPE "VatPayerStatus" AS ENUM ('PAYER', 'NON_PAYER');

-- CreateEnum
CREATE TYPE "EetMode" AS ENUM ('NOT_SET', 'ON', 'OFF');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'CRAFTSMAN');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('PERSON', 'COMPANY');

-- CreateEnum
CREATE TYPE "InvoiceKind" AS ENUM ('NON_VAT_INVOICE', 'VAT_INVOICE', 'SIMPLIFIED_VAT_INVOICE', 'VAT_INVOICE_REVERSE_CHARGE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('QR_ON_SITE', 'CASH', 'CARD', 'BANK_TRANSFER_LATER');

-- CreateEnum
CREATE TYPE "EetStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "ico" TEXT,
    "dic" TEXT,
    "name" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "vatStatus" "VatPayerStatus" NOT NULL DEFAULT 'NON_PAYER',
    "pricesIncludeVat" BOOLEAN NOT NULL DEFAULT true,
    "iban" TEXT,
    "bankName" TEXT,
    "logoUrl" TEXT,
    "accentColor" TEXT,
    "invoiceFooter" TEXT,
    "defaultDueDays" INTEGER NOT NULL DEFAULT 14,
    "eetMode" "EetMode" NOT NULL DEFAULT 'NOT_SET',
    "eetEic" TEXT,
    "eetUnitId" TEXT,
    "eetRegisterId" TEXT DEFAULT 'FAJFKA-01',
    "eetCertEncrypted" BYTEA,
    "eetCertPassEnc" BYTEA,
    "eetCertValidTo" TIMESTAMP(3),
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "CustomerType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "ico" TEXT,
    "dic" TEXT,
    "vatStatus" "VatPayerStatus",
    "street" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "priceHal" INTEGER NOT NULL,
    "vatRate" INTEGER NOT NULL DEFAULT 21,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSequence" (
    "accountId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "last" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("accountId","year")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "customerId" TEXT,
    "number" TEXT,
    "variableSymbol" TEXT,
    "kind" "InvoiceKind",
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentMethod" "PaymentMethod",
    "reverseCharge" BOOLEAN NOT NULL DEFAULT false,
    "issueDate" TIMESTAMP(3),
    "taxableDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "supplierSnapshot" JSONB,
    "customerSnapshot" JSONB,
    "subtotalHal" INTEGER NOT NULL DEFAULT 0,
    "vatHal" INTEGER NOT NULL DEFAULT 0,
    "roundingHal" INTEGER NOT NULL DEFAULT 0,
    "totalHal" INTEGER NOT NULL DEFAULT 0,
    "amountReceivedHal" INTEGER,
    "vatRecap" JSONB,
    "cancelsInvoiceId" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantityMilli" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPriceHal" INTEGER NOT NULL,
    "vatRate" INTEGER NOT NULL,
    "baseHal" INTEGER NOT NULL,
    "vatHal" INTEGER NOT NULL,
    "totalHal" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EetRecord" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "sequenceNo" TEXT NOT NULL,
    "amountHal" INTEGER NOT NULL,
    "messageUuid" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "firstSentAt" TIMESTAMP(3),
    "status" "EetStatus" NOT NULL DEFAULT 'PENDING',
    "pok" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'QUEUED',
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_ico_key" ON "Account"("ico");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Customer_accountId_lastUsedAt_idx" ON "Customer"("accountId", "lastUsedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_cancelsInvoiceId_key" ON "Invoice"("cancelsInvoiceId");

-- CreateIndex
CREATE INDEX "Invoice_accountId_status_issueDate_idx" ON "Invoice"("accountId", "status", "issueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_accountId_number_key" ON "Invoice"("accountId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "EetRecord_messageUuid_key" ON "EetRecord"("messageUuid");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSequence" ADD CONSTRAINT "InvoiceSequence_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_cancelsInvoiceId_fkey" FOREIGN KEY ("cancelsInvoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EetRecord" ADD CONSTRAINT "EetRecord_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
