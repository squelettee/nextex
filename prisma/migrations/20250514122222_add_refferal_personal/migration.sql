/*
  Warnings:

  - A unique constraint covering the columns `[personalReferral]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personalReferral" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_personalReferral_key" ON "User"("personalReferral");
