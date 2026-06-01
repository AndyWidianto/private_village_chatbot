/*
  Warnings:

  - A unique constraint covering the columns `[remoteJid]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_contactId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "contacts_remoteJid_key" ON "contacts"("remoteJid");

-- CreateIndex
CREATE INDEX "contacts_remoteJid_idx" ON "contacts"("remoteJid");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("remoteJid") ON DELETE RESTRICT ON UPDATE CASCADE;
