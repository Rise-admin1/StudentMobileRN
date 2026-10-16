-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `submittedForVerificationAt` DATETIME(3) NULL;

-- Backfill existing rows from creation time
UPDATE `Subject` SET `submittedForVerificationAt` = `createdAt`;

-- AlterTable
ALTER TABLE `Subject` MODIFY `submittedForVerificationAt` DATETIME(3) NOT NULL;
