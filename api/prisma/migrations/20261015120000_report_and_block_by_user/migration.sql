-- Existing rows store a StudentProfile id. Move them onto the acting User
-- so both students and tutors can report a subject or block a tutor.

ALTER TABLE `Report` ADD COLUMN `reporterId` VARCHAR(191) NULL;
ALTER TABLE `BlockedTeacher` ADD COLUMN `blockerId` VARCHAR(191) NULL;

UPDATE `Report` r
INNER JOIN `StudentProfile` s ON r.`studentId` = s.`id`
SET r.`reporterId` = s.`userId`;

UPDATE `BlockedTeacher` b
INNER JOIN `StudentProfile` s ON b.`studentId` = s.`id`
SET b.`blockerId` = s.`userId`;

DELETE FROM `Report` WHERE `reporterId` IS NULL;
DELETE FROM `BlockedTeacher` WHERE `blockerId` IS NULL;

DELETE r1 FROM `Report` r1
INNER JOIN `Report` r2
  ON r1.`reporterId` = r2.`reporterId`
 AND r1.`subjectId` = r2.`subjectId`
 AND (r1.`createdAt` > r2.`createdAt` OR (r1.`createdAt` = r2.`createdAt` AND r1.`id` > r2.`id`));

DELETE b1 FROM `BlockedTeacher` b1
INNER JOIN `BlockedTeacher` b2
  ON b1.`blockerId` = b2.`blockerId`
 AND b1.`teacherId` = b2.`teacherId`
 AND b1.`id` > b2.`id`;

ALTER TABLE `Report` DROP FOREIGN KEY `Report_studentId_fkey`;
ALTER TABLE `BlockedTeacher` DROP FOREIGN KEY `BlockedTeacher_studentId_fkey`;

DROP INDEX `Report_studentId_fkey` ON `Report`;
DROP INDEX `BlockedTeacher_studentId_teacherId_key` ON `BlockedTeacher`;

ALTER TABLE `Report` DROP COLUMN `studentId`;
ALTER TABLE `BlockedTeacher` DROP COLUMN `studentId`;

ALTER TABLE `Report` MODIFY `reporterId` VARCHAR(191) NOT NULL;
ALTER TABLE `BlockedTeacher` MODIFY `blockerId` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `Report_reporterId_subjectId_key` ON `Report`(`reporterId`, `subjectId`);
CREATE INDEX `Report_reporterId_idx` ON `Report`(`reporterId`);
CREATE UNIQUE INDEX `BlockedTeacher_blockerId_teacherId_key` ON `BlockedTeacher`(`blockerId`, `teacherId`);

ALTER TABLE `Report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `BlockedTeacher` ADD CONSTRAINT `BlockedTeacher_blockerId_fkey` FOREIGN KEY (`blockerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
