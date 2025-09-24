-- AlterTable
ALTER TABLE "tech_categories" ADD COLUMN     "isProtected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
