import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export class NotificationController {
  // GET NOTIFICATIONS
  public static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      res.json({ success: true, notifications, unreadCount });
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // MARK SINGLE NOTIFICATION AS READ
  public static async markRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;

      await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true },
      });

      res.json({ success: true, message: 'Notification marked as read.' });
    } catch (error: any) {
      console.error('Mark read error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // MARK ALL AS READ
  public static async markAllRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await prisma.notification.updateMany({
        where: { userId },
        data: { isRead: true },
      });

      res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (error: any) {
      console.error('Mark all read error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
