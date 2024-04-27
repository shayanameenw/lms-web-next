-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" REAL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Course" ("categoryId", "createdAt", "description", "id", "imageUrl", "isPublished", "price", "title", "updatedAt", "userId") SELECT "categoryId", "createdAt", "description", "id", "imageUrl", "isPublished", "price", "title", "updatedAt", "userId" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
