-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Domain_hostname_idx" ON "Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_brandId_idx" ON "Domain"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_brandId_hostname_key" ON "Domain"("brandId", "hostname");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
