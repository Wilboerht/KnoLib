-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "view_logs" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "userIp" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "view_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalSolutions" INTEGER NOT NULL DEFAULT 0,
    "publishedSolutions" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "newSolutions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_date_key" ON "daily_stats"("date");

-- AddForeignKey
ALTER TABLE "view_logs" ADD CONSTRAINT "view_logs_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "tech_solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
