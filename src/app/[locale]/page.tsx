import Link from "next/link";
import { getDictionary } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/ServiceCard";
import { StatCard } from "@/components/StatCard";
import {
  GraduationCap, Users, Briefcase, TrendingUp, Scale, LifeBuoy, CalendarClock, MapPinned
} from "lucide-react";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const [userCount, studentCount, companyCount, requestCount, eventCount, newsItems, partners] =
    await Promise.all([
      prisma.user.count(),
      prisma.studentProfile.count(),
      prisma.company.count(),
      prisma.serviceRequest.count(),
      prisma.event.count(),
      prisma.newsArticle.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.partner.findMany({ take: 6 })
    ]);

  const titleKey = `title${locale.charAt(0).toUpperCase()}${locale.slice(1)}` as
    | "titleAr" | "titleEn" | "titleVi";

  const services = [
    { icon: Users, key: "citizens", href: `/${locale}/citizens` },
    { icon: GraduationCap, key: "students", href: `/${locale}/students` },
    { icon: Briefcase, key: "business", href: `/${locale}/business` },
    { icon: TrendingUp, key: "investment", href: `/${locale}/investment` },
    { icon: Scale, key: "legal", href: `/${locale}/services` },
    { icon: LifeBuoy, key: "emergency", href: `/${locale}/emergency` },
    { icon: CalendarClock, key: "appointments", href: `/${locale}/appointments` },
    { icon: MapPinned, key: "directory", href: `/${locale}/directory` }
  ];

  const serviceLabels: Record<string, { title: string; desc: string }> = {
    citizens: { title: dict.nav.citizens, desc: "خدمات ودعم للمواطنين الفيتناميين المقيمين في مصر" },
    students: { title: dict.nav.students, desc: "دعم شامل للطلاب والباحثين في الجامعات المصرية" },
    business: { title: dict.nav.business, desc: "فرص تجارية وشراكات بين مصر وفيتنام" },
    investment: { title: dict.nav.investment, desc: "فرص استثمارية موثقة في القطاعين" },
    legal: { title: "المساعدة القانونية", desc: "إرشاد قانوني أولي وربط بجهات مختصة" },
    emergency: { title: dict.nav.emergency, desc: "دعم فوري في الحالات الطارئة" },
    appointments: { title: "المواعيد", desc: "حجز وإدارة المواعيد الرسمية بسهولة" },
    directory: { title: dict.nav.directory, desc: "دليل شامل لخدمات الإسكندرية" }
  };

  if (locale === "en") {
    serviceLabels.citizens.title = dict.nav.citizens;
    serviceLabels.citizens.desc = "Services and support for Vietnamese citizens residing in Egypt";
    serviceLabels.students.desc = "Comprehensive support for students and researchers at Egyptian universities";
    serviceLabels.business.desc = "Trade opportunities and partnerships between Egypt and Vietnam";
    serviceLabels.investment.desc = "Documented investment opportunities across both markets";
    serviceLabels.legal.title = "Legal Assistance";
    serviceLabels.legal.desc = "Initial legal guidance and referral to specialized entities";
    serviceLabels.emergency.desc = "Immediate support in emergency situations";
    serviceLabels.appointments.title = "Appointments";
    serviceLabels.appointments.desc = "Book and manage official appointments easily";
    serviceLabels.directory.desc = "A comprehensive directory of Alexandria services";
  }
  if (locale === "vi") {
    serviceLabels.citizens.desc = "Dịch vụ và hỗ trợ cho công dân Việt Nam đang cư trú tại Ai Cập";
    serviceLabels.students.desc = "Hỗ trợ toàn diện cho sinh viên và nhà nghiên cứu tại các trường đại học Ai Cập";
    serviceLabels.business.desc = "Cơ hội thương mại và hợp tác giữa Ai Cập và Việt Nam";
    serviceLabels.investment.desc = "Cơ hội đầu tư đã được xác thực tại cả hai thị trường";
    serviceLabels.legal.title = "Hỗ trợ pháp lý";
    serviceLabels.legal.desc = "Hướng dẫn pháp lý ban đầu và giới thiệu đến các cơ quan chuyên môn";
    serviceLabels.emergency.desc = "Hỗ trợ tức thời trong các tình huống khẩn cấp";
    serviceLabels.appointments.title = "Lịch hẹn";
    serviceLabels.appointments.desc = "Đặt và quản lý các cuộc hẹn chính thức dễ dàng";
    serviceLabels.directory.desc = "Danh bạ toàn diện các dịch vụ tại Alexandria";
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-diplomatic-navy to-diplomatic-navyLight text-white">
        <div className="container-page py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide">
              {dict.brand.tagline}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-4 text-white/80 max-w-xl">{dict.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}/services`} className="rounded-full bg-vn-gold text-diplomatic-navy font-bold px-6 py-3 hover:opacity-90 transition">
                {dict.home.ctaExplore}
              </Link>
              <Link href={`/${locale}/auth/register`} className="rounded-full border border-white/40 font-bold px-6 py-3 hover:bg-white/10 transition">
                {dict.home.ctaStart}
              </Link>
            </div>
          </div>
          <div className="relative">
            <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden="true">
              <defs>
                <linearGradient id="route" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFCD00" />
                  <stop offset="100%" stopColor="#DA251D" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="90" r="10" fill="#FFCD00" />
              <text x="40" y="70" fill="white" fontSize="14">Vietnam</text>
              <circle cx="330" cy="220" r="10" fill="#DA251D" />
              <text x="290" y="250" fill="white" fontSize="14">Alexandria</text>
              <path d="M70,90 C180,40 220,260 330,220" stroke="url(#route)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            </svg>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={userCount} label={dict.home.statsTitle} />
          <StatCard value={studentCount} label={dict.nav.students} />
          <StatCard value={companyCount} label={dict.nav.business} />
          <StatCard value={requestCount} label="Requests" />
        </div>
        <p className="mt-3 text-center text-xs text-diplomatic-navy/50">{dict.home.demoDataLabel}</p>
      </section>

      {/* SERVICES */}
      <section className="container-page py-16">
        <h2 className="section-title text-center">{dict.home.servicesTitle}</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <ServiceCard
              key={s.key}
              icon={s.icon}
              title={serviceLabels[s.key].title}
              description={serviceLabels[s.key].desc}
              href={s.href}
            />
          ))}
        </div>
      </section>

      {/* WHY ALEXANDRIA */}
      <section className="bg-white py-16 border-y border-diplomatic-slate/10">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="section-title">{dict.home.whyAlexTitle}</h2>
            <ul className="mt-4 space-y-3 text-diplomatic-navy/80 text-sm">
              <li>• موقع تجاري واستراتيجي على البحر الأبيض المتوسط، وميناء الإسكندرية أحد أهم موانئ المنطقة.</li>
              <li>• كثافة جامعية ومؤسسات بحثية تجعلها وجهة طبيعية للطلاب والباحثين الفيتناميين.</li>
              <li>• قرب من مناطق صناعية وتجارية يخدم الشركات والمصدرين والمستوردين.</li>
              <li>• تقليل زمن الوصول للخدمات مقارنة بالسفر الدائم إلى القاهرة.</li>
              <li>• فرصة عملية لدعم التعاون المصري الفيتنامي في شمال مصر.</li>
            </ul>
          </div>
          <div className="card-diplomatic">
            <p className="text-sm text-diplomatic-navy/70 leading-relaxed">
              تقدم VietConnect Egy دليلاً عمليًا على الاحتياج والقيمة المحتملة لتوسيع الخدمات المجتمعية
              والتجارية في الإسكندرية، دون الادعاء بأنها تُحدث حتمًا أي قرار رسمي بشأن فتح قنصلية.
            </p>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="container-page py-16">
        <h2 className="section-title">{dict.home.newsTitle}</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-5">
          {newsItems.map((n) => (
            <article key={n.id} className="card-diplomatic">
              <span className="badge-demo">{dict.home.demoDataLabel}</span>
              <h3 className="mt-3 font-bold text-diplomatic-navy">{(n as any)[titleKey]}</h3>
            </article>
          ))}
          {newsItems.length === 0 && <p className="text-diplomatic-navy/60">{dict.common.empty}</p>}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-white py-16 border-t border-diplomatic-slate/10">
        <div className="container-page">
          <h2 className="section-title text-center">{dict.home.partnersTitle}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-diplomatic-navy/50 text-sm">
            {partners.length === 0 ? (
              <p>{dict.common.empty}</p>
            ) : (
              partners.map((p) => <span key={p.id} className="card-diplomatic px-6 py-3">{(p as any)[titleKey.replace("title", "name")] ?? p.nameEn}</span>)
            )}
          </div>
        </div>
      </section>
    </>
  );
}
