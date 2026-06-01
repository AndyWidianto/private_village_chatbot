/*
  Warnings:

  - You are about to drop the column `contactId` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_contactId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "contactId";
