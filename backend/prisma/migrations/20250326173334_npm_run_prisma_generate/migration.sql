-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "virtual_capital" DOUBLE PRECISION NOT NULL DEFAULT 100000.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "market_cap" BIGINT,
    "description" TEXT,
    "ai_impact_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ai_score_rationale" TEXT,
    "last_price_update" TIMESTAMP(3),
    "last_price" DOUBLE PRECISION,
    "last_score_update" TIMESTAMP(3),

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "shares" INTEGER NOT NULL,
    "average_cost_basis" DOUBLE PRECISION NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "trade_type" TEXT NOT NULL,
    "shares" INTEGER NOT NULL,
    "trade_price" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "stock_symbol" TEXT,
    "headline" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT,
    "ai_keywords" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" SERIAL NOT NULL,
    "watchlist_id" INTEGER NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "threshold_value" DOUBLE PRECISION,
    "change_threshold" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_triggered_at" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_user_id_stock_symbol_key" ON "Portfolio"("user_id", "stock_symbol");

-- CreateIndex
CREATE UNIQUE INDEX "News_url_key" ON "News"("url");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_watchlist_id_stock_symbol_key" ON "WatchlistItem"("watchlist_id", "stock_symbol");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_stock_symbol_fkey" FOREIGN KEY ("stock_symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_stock_symbol_fkey" FOREIGN KEY ("stock_symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_stock_symbol_fkey" FOREIGN KEY ("stock_symbol") REFERENCES "Stock"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "Watchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_stock_symbol_fkey" FOREIGN KEY ("stock_symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_stock_symbol_fkey" FOREIGN KEY ("stock_symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
