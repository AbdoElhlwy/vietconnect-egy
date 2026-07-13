import { prisma } from "@/lib/prisma";
import { BookingForm } from "./BookingForm";

export default async function AppointmentsPage() {
  const slots = await prisma.appointmentSlot.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 20
  });

  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">حجز موعد / Book an Appointment</h1>
      <p className="text-diplomatic-navy/60 mb-6 text-sm">اختر موعدًا متاحًا من القائمة أدناه.</p>

      <div className="space-y-3">
        {slots.map((s) => (
          <div key={s.id} className="card-diplomatic flex items-center justify-between">
            <div>
              <p className="font-semibold">{s.date.toLocaleDateString("ar")}</p>
              <p className="text-xs text-diplomatic-navy/60">{s.startTime} - {s.endTime} · {s.bookedCount}/{s.capacity} محجوز</p>
            </div>
            <BookingForm slotId={s.id} full={s.bookedCount >= s.capacity} />
          </div>
        ))}
        {slots.length === 0 && <p className="text-diplomatic-navy/60">لا توجد مواعيد متاحة حاليًا.</p>}
      </div>
    </div>
  );
}
