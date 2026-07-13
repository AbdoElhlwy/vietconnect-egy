import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationList } from "./NotificationList";

export default async function NotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const items = await prisma.notificationRecipient.findMany({
    where: { userId: (session.user as any).id },
    include: { notification: true },
    orderBy: { id: "desc" }
  });

  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">الإشعارات / Notifications</h1>
      <NotificationList items={items.map((i) => ({
        id: i.id,
        isRead: i.isRead,
        titleAr: i.notification.titleAr,
        bodyAr: i.notification.bodyAr
      }))} />
    </div>
  );
}
