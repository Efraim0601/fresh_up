-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT', 'TAILOR');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'VALIDATED', 'PAID', 'MEASUREMENTS_CONFIRMED', 'CUTTING', 'SEWING', 'FITTING', 'READY', 'DELIVERED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "fullName" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "colors" TEXT[],
    "couleurHex" TEXT,
    "pricePerMeter" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "stockMeters" DECIMAL(10,2) NOT NULL,
    "rollWidthCm" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "albedoTextureUrl" TEXT,
    "normalTextureUrl" TEXT,
    "roughnessTextureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garment_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "glbUrl" TEXT,
    "baseYardageM" DECIMAL(6,2) NOT NULL,
    "laborPriceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garment_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garment_options" (
    "id" TEXT NOT NULL,
    "garmentModelId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "extraYardageM" DECIMAL(6,2) NOT NULL DEFAULT 0,

    CONSTRAINT "garment_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "validatedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fabricId" TEXT NOT NULL,
    "garmentModelId" TEXT NOT NULL,
    "measurementId" TEXT,
    "selectedOptions" JSONB NOT NULL,
    "renderSnapshotUrl" TEXT,
    "designJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tailorId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "computedYardageM" DECIMAL(6,2) NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "paymentProvider" TEXT,
    "paymentReference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_events" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "garment_options" ADD CONSTRAINT "garment_options_garmentModelId_fkey" FOREIGN KEY ("garmentModelId") REFERENCES "garment_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "fabrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_garmentModelId_fkey" FOREIGN KEY ("garmentModelId") REFERENCES "garment_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
