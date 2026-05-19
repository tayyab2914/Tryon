-- CreateEnum
CREATE TYPE "TryOnLimitPeriod" AS ENUM ('DAILY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "tryOnLimitEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tryOnLimitPerIp" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "tryOnLimitPeriod" "TryOnLimitPeriod" NOT NULL DEFAULT 'DAILY';

-- AlterTable
ALTER TABLE "TryOn" ADD COLUMN     "ipHash" TEXT;

-- CreateIndex
CREATE INDEX "TryOn_brandId_ipHash_createdAt_idx" ON "TryOn"("brandId", "ipHash", "createdAt");
