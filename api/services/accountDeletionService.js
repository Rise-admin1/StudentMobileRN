import prisma from '../lib/prisma.js';
import { deleteZoomUser } from './zoomService.js';

export async function performAccountDeletion(user) {
  if (!user?.id) {
    throw new Error('User is required for account deletion');
  }

  if (user.userType === 'TEACHER' && user.email) {
    try {
      await deleteZoomUser(user.email);
    } catch (zoomErr) {
      console.warn('Could not delete Zoom user on account deletion:', zoomErr.message);
    }
  }

  await prisma.user.delete({
    where: { id: user.id },
  });
}
