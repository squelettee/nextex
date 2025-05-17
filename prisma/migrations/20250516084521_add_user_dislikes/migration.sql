-- CreateTable
CREATE TABLE "UserDislikes" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "UserDislikes_pkey" PRIMARY KEY ("fromId","toId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDislikes_fromId_toId_key" ON "UserDislikes"("fromId", "toId");

-- AddForeignKey
ALTER TABLE "UserDislikes" ADD CONSTRAINT "UserDislikes_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDislikes" ADD CONSTRAINT "UserDislikes_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
