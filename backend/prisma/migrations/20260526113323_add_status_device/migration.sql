-- CreateEnum
CREATE TYPE "StatusDevice" AS ENUM ('CONNECTING', 'CONNECTED', 'DISCONNECTED');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "status" "StatusDevice" NOT NULL DEFAULT 'CONNECTING';

-- AddForeignKey
ALTER TABLE "Broadcast" ADD CONSTRAINT "Broadcast_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
