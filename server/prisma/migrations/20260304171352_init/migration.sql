-- CreateTable
CREATE TABLE "ConversionHistory" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritePair" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CachedRate" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "rates" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CachedRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversionHistory_fromCurrency_toCurrency_idx" ON "ConversionHistory"("fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "ConversionHistory_createdAt_idx" ON "ConversionHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePair_fromCurrency_toCurrency_key" ON "FavoritePair"("fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "CachedRate_fetchedAt_idx" ON "CachedRate"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CachedRate_baseCurrency_key" ON "CachedRate"("baseCurrency");
