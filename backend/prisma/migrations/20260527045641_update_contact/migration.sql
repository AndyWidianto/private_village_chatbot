/*
  Warnings:

  - Added the required column `deviceId` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remoteJid` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "remoteJid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
