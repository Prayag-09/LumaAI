/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserChats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_userId_key" ON "UserChats"("userId");

-- CreateIndex
CREATE INDEX "UserChats_userId_idx" ON "UserChats"("userId");
