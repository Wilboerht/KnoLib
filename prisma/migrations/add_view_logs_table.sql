-- 创建浏览量日志表
CREATE TABLE "view_logs" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "userIp" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "view_logs_pkey" PRIMARY KEY ("id")
);

-- 创建每日统计表
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

-- 添加外键约束
ALTER TABLE "view_logs" ADD CONSTRAINT "view_logs_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "tech_solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 创建索引
CREATE INDEX "view_logs_solutionId_idx" ON "view_logs"("solutionId");
CREATE INDEX "view_logs_viewedAt_idx" ON "view_logs"("viewedAt");
CREATE UNIQUE INDEX "daily_stats_date_key" ON "daily_stats"("date");
