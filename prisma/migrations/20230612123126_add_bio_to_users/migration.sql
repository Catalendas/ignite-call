-- AlterTable
ALTER TABLE "users" ADD COLUMN "bio" TEXT;

-- CreateIndex
CREATE INDEX "user_time_intervals_user_Id_idx" ON "user_time_intervals"("user_Id");
