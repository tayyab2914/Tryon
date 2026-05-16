-- CreateTable
CREATE TABLE "WidgetSettings" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "buttonLabel" TEXT NOT NULL DEFAULT 'Try On with AI',
    "accentColor" TEXT NOT NULL DEFAULT '#0c0c0c',
    "consentText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WidgetSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WidgetSettings_brandId_key" ON "WidgetSettings"("brandId");

-- AddForeignKey
ALTER TABLE "WidgetSettings" ADD CONSTRAINT "WidgetSettings_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
