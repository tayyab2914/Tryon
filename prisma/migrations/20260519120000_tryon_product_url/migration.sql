-- Drop the unused random shopper placeholder.
ALTER TABLE "TryOn" DROP COLUMN "shopper";

-- Store the product image URL the shopper tried on.
ALTER TABLE "TryOn" ADD COLUMN "productUrl" TEXT;
