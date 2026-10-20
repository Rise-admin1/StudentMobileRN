-- AlterTable
ALTER TABLE `api_request_logs` ADD COLUMN `requestHeaders` JSON NULL,
    ADD COLUMN `requestBody` JSON NULL;
