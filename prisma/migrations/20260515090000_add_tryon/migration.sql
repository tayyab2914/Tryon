-- CreateEnum
CREATE TYPE "TryOnStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "TryOn" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "garment" TEXT NOT NULL,
    "shopper" TEXT NOT NULL,
    "status" "TryOnStatus" NOT NULL DEFAULT 'PROCESSING',
    "personImageUri" TEXT,
    "productImageUri" TEXT,
    "resultImageUri" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TryOn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TryOn_brandId_idx" ON "TryOn"("brandId");

-- AddForeignKey
ALTER TABLE "TryOn" ADD CONSTRAINT "TryOn_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
