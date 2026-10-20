-- CreateTable
CREATE TABLE `api_request_logs` (
    `id` VARCHAR(191) NOT NULL,
    `method` VARCHAR(16) NOT NULL,
    `path` VARCHAR(300) NOT NULL,
    `statusCode` INTEGER NOT NULL,
    `durationMs` INTEGER NOT NULL,
    `ip` VARCHAR(64) NULL,
    `actorUserId` VARCHAR(64) NULL,
    `email` VARCHAR(255) NULL,
    `accountType` VARCHAR(32) NULL,
    `errorMessage` VARCHAR(200) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `api_request_logs_createdAt_idx`(`createdAt`),
    INDEX `api_request_logs_statusCode_createdAt_idx`(`statusCode`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
