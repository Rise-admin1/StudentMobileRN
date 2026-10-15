CREATE TABLE `StudentRating` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `teacherId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,

    INDEX `StudentRating_studentId_idx`(`studentId`),
    UNIQUE INDEX `StudentRating_teacherId_studentId_key`(`teacherId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `StudentRating` ADD CONSTRAINT `StudentRating_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `TeacherProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `StudentRating` ADD CONSTRAINT `StudentRating_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
