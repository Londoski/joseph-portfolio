/*
  Warnings:

  - You are about to drop the column `shareEnabled` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `shareToken` on the `Project` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "client" TEXT,
    "year" INTEGER,
    "role" TEXT,
    "thumbnail" TEXT,
    "videoUrl" TEXT,
    "gallery" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("category", "client", "createdAt", "description", "featured", "gallery", "id", "order", "published", "role", "slug", "thumbnail", "title", "updatedAt", "videoUrl", "year") SELECT "category", "client", "createdAt", "description", "featured", "gallery", "id", "order", "published", "role", "slug", "thumbnail", "title", "updatedAt", "videoUrl", "year" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
