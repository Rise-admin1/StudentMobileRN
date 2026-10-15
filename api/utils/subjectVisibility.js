import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getViewerHiddenSubjects = async (userId) => {
    if (!userId) {
        return { reportedSubjectIds: [], blockedTeacherProfileIds: [] };
    }

    const [reports, blocks] = await Promise.all([
        prisma.report.findMany({
            where: { reporterId: userId },
            select: { subjectId: true },
        }),
        prisma.blockedTeacher.findMany({
            where: { blockerId: userId },
            select: { teacherId: true },
        }),
    ]);

    return {
        reportedSubjectIds: reports.map((report) => report.subjectId),
        blockedTeacherProfileIds: blocks.map((block) => block.teacherId),
    };
};

export const viewerCatalogExclusion = async (userId) => {
    const { reportedSubjectIds, blockedTeacherProfileIds } = await getViewerHiddenSubjects(userId);
    const or = [];
    if (reportedSubjectIds.length > 0) {
        or.push({ id: { in: reportedSubjectIds } });
    }
    if (blockedTeacherProfileIds.length > 0) {
        or.push({ teacherId: { in: blockedTeacherProfileIds } });
    }
    if (or.length === 0) return {};
    return { NOT: { OR: or } };
};

export const isSubjectHiddenFromUser = async (userId, subjectId, teacherProfileId) => {
    if (!userId) return false;
    const [report, block] = await Promise.all([
        prisma.report.findFirst({
            where: { reporterId: userId, subjectId },
            select: { id: true },
        }),
        teacherProfileId
            ? prisma.blockedTeacher.findFirst({
                where: { blockerId: userId, teacherId: teacherProfileId },
                select: { id: true },
            })
            : null,
    ]);
    return Boolean(report || block);
};
