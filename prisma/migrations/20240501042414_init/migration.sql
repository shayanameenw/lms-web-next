/*
  Warnings:

  - You are about to drop the column `chapterId` on the `Purchase` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Purchase_chapterId_idx";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "chapterId",
ADD COLUMN     "courseId" TEXT;

-- CreateIndex
CREATE INDEX "Purchase_courseId_idx" ON "Purchase"("courseId");
