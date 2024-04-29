/*
  Warnings:

  - Made the column `courseId` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Chapter" ("courseId", "createdAt", "description", "id", "isFree", "isPublished", "position", "title", "updatedAt", "videoUrl") SELECT "courseId", "createdAt", "description", "id", "isFree", "isPublished", "position", "title", "updatedAt", "videoUrl" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
