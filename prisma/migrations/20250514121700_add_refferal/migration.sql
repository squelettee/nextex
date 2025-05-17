/*
  Warnings:

  - A unique constraint covering the columns `[refferal]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refferal" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_refferal_key" ON "User"("refferal");
