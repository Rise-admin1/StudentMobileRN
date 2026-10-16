import prisma from "../lib/prisma.js";
import { Resend } from "resend";
import { OPS_NOTIFY_EMAILS, ADMIN_CC_EMAIL } from "../utils/opsNotify.js";
const resend = new Resend(process.env.COACH_ACADEM_RESEND_API_KEY);


const canReportOrBlock = (userType) => userType === 'STUDENT' || userType === 'TEACHER';

const findSubjectTutor = async (subjectId) => {
    if (!subjectId) return null;
    return prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
            id: true,
            teacherId: true,
            teacherProfile: {
                select: { userId: true },
            },
        },
    });
};

export const reportSubject = async (req, res, next) => {
    const {subjectId, reportReason} = req.body;
    const userId = req.userId;
    const userEmail = req.email;
    const cleanedReason = typeof reportReason === 'string' ? reportReason.replace(/\s+/g, ' ').trim() : '';
    try {
        if (!canReportOrBlock(req.userType)) {
            return res.status(400).json({ message: "Only students and tutors can report a subject" });
        }
        if (!cleanedReason) {
            return res.status(400).json({ message: "Please provide a reason for reporting" });
        }

        const subject = await findSubjectTutor(subjectId);
        if (!subject || !subject.teacherProfile) {
            return res.status(404).json({ message: "Subject not found" });
        }
        if (subject.teacherProfile.userId === userId) {
            return res.status(400).json({ message: "You cannot report your own subject" });
        }

        const existingReport = await prisma.report.findUnique({
            where: {
                reporterId_subjectId: {
                    reporterId: userId,
                    subjectId,
                },
            },
        });
        if (existingReport) {
            return res.status(400).json({ message: "You have already reported this subject" });
        }

        // Create the report record
        const report = await prisma.report.create({
            data: {
                subjectId,
                reportDescription: cleanedReason,
                reporterId: userId,
            }
        });

        // Send emails after successful report creation
        await Promise.all([
            resend.emails.send({
                from: `"Support - Coach Academ" <${process.env.COACH_ACADEM_RESEND_EMAIL}>`,
                to: OPS_NOTIFY_EMAILS,
                cc: ADMIN_CC_EMAIL,
                subject: "⚠️ New Report Alert",
                html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
                    <div style="background-color: #1A2B4B; padding: 40px 20px; text-align: center; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1;">
                            <div style="position: absolute; top: 20px; left: 20px; width: 60px; height: 60px; border: 4px solid #ffffff; transform: rotate(45deg);"></div>
                            <div style="position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border: 4px solid #ffffff; border-radius: 50%;"></div>
                        </div>
                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Report Alert</h1>
                    </div>

                    <div style="padding: 40px 20px; background-color: #ffffff;">
                        <div style="background-color: #F8FAFC; padding: 30px; margin-bottom: 30px; position: relative; border-left: 4px solid #1A2B4B;">
                            <h3 style="color: #1A2B4B; font-size: 18px; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">Report Details</h3>
                            <p style="margin: 10px 0; color: #64748B;"><strong>User ID:</strong> ${userId}</p>
                            <p style="margin: 10px 0; color: #64748B;"><strong>Subject ID:</strong> ${subjectId}</p>
                            <p style="margin: 10px 0; color: #64748B;"><strong>Reason:</strong> ${cleanedReason}</p>
                        </div>

                        <div style="text-align: center; padding-top: 30px; border-top: 2px solid #F8FAFC;">
                            <p style="margin: 0; color: #64748B; font-size: 14px;">Please review this report and take appropriate action.</p>
                        </div>
                    </div>
                </div>
                `,
            }),
            resend.emails.send({
                from: `"Support - Coach Academ" <${process.env.COACH_ACADEM_RESEND_EMAIL}>`,
                to: userEmail,
                cc: ADMIN_CC_EMAIL,
                subject: "Report Submission Confirmation",
                html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
                    <div style="background-color: #1A2B4B; padding: 40px 20px; text-align: center; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1;">
                            <div style="position: absolute; top: 20px; left: 20px; width: 60px; height: 60px; border: 4px solid #ffffff; transform: rotate(45deg);"></div>
                            <div style="position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border: 4px solid #ffffff; border-radius: 50%;"></div>
                        </div>
                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Report Submitted</h1>
                    </div>

                    <div style="padding: 40px 20px; background-color: #ffffff;">
                        <p style="margin: 0 0 20px 0; color: #64748B; font-size: 16px; line-height: 1.6;">
                            Thank you for bringing this to our attention. Your report has been successfully submitted and will be reviewed by our team.
                        </p>
                        <div style="background-color: #F8FAFC; padding: 30px; margin-bottom: 30px; position: relative; border-left: 4px solid #1A2B4B;">
                            <p style="margin: 0; color: #64748B; font-size: 14px;">
                                <strong>Report Details:</strong><br>
                                Subject ID: ${subjectId}<br>
                                Reason: ${cleanedReason}
                            </p>
                        </div>

                        <div style="text-align: center; padding-top: 30px; border-top: 2px solid #F8FAFC;">
                            <p style="margin: 0; color: #64748B; font-size: 14px;">
                                We take all reports seriously and will investigate this matter thoroughly.
                            </p>
                        </div>
                    </div>
                </div>
                `,
            }),
        ]).catch((emailErr) => {
            console.log(emailErr);
        });

        return res.status(200).json({message: "Report created successfully", report});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const blockUser = async (req, res,next) => {
    const userId = req.userId;
    const {subjectId} = req.body;
    try {
        if (!canReportOrBlock(req.userType)) {
            return res.status(400).json({ message: "Only students and tutors can block a tutor" });
        }

        const subject = await findSubjectTutor(subjectId);
        if (!subject || !subject.teacherProfile) {
            return res.status(400).json({ message: "Subject or teacher not found" });
        }
        if (subject.teacherProfile.userId === userId) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        const blockSubjectTeacher = await prisma.blockedTeacher.findUnique({
            where: {
                blockerId_teacherId: {
                    blockerId: userId,
                    teacherId: subject.teacherId
                }
            }
        })
        
        if (blockSubjectTeacher) {
            return res.status(400).json({message: "You have already blocked this user"});
        }

        await prisma.blockedTeacher.create({
            data: {
                blockerId: userId,
                teacherId: subject.teacherId
            }
        })

        return res.status(200).json({message: "User blocked successfully"});
        
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const getUserReports = async (req, res, next) => {
    const userId = req.userId;
    try {
        const reports = await prisma.report.findMany({
            where: {
                reporterId: userId
            },
            include: {
                reportedSubject: {
                    select: {
                        subjectName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(reports);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const getBlockedUsers = async (req, res, next) => {
    const userId = req.userId;
    try {
        const blockedUsers = await prisma.blockedTeacher.findMany({
            where: {
                blockerId: userId
            },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const transformedBlockedUsers = blockedUsers.map(blocked => ({
            ...blocked,
            blockedTeacherId: blocked.teacher.user.id,
            blockedTeacher: blocked.teacher.user
        }));

        return res.status(200).json(transformedBlockedUsers);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const unblockUser = async (req, res, next) => {
    const userId = req.userId;
    const { blockedTeacherId } = req.body; // User.id of the blocked tutor
    try {
        const teacherUser = await prisma.user.findUnique({
            where: { id: blockedTeacherId },
            include: {
                teacherProfile: {
                    select: { id: true }
                }
            }
        });

        if (!teacherUser || !teacherUser.teacherProfile) {
            return res.status(400).json({ message: "Teacher profile not found" });
        }

        const findBlockedRecord = await prisma.blockedTeacher.findUnique({
            where: {
                blockerId_teacherId: {
                    blockerId: userId,
                    teacherId: teacherUser.teacherProfile.id
                }
            },
           
        });

        if (!findBlockedRecord) {
            return res.status(400).json({ message: "User not found in blocked list" });
        }

        await prisma.blockedTeacher.delete({
            where: {
                blockerId_teacherId: {
                    blockerId: userId,
                    teacherId: teacherUser.teacherProfile.id
                }
            }
        });

        return res.status(200).json({ message: "User unblocked successfully" });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await prisma.report.findMany();
        return res.status(200).json(reports);
    } catch (err) {
        console.log(err);
        next(err);
    }
}