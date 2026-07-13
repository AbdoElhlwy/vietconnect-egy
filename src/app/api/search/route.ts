import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const contains = { contains: q, mode: "insensitive" as const };

  const [services, news, directory, universities, companies, faqs, events] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true, OR: [{ nameAr: contains }, { nameEn: contains }] }, take: 5 }),
    prisma.newsArticle.findMany({ where: { status: "PUBLISHED", OR: [{ titleAr: contains }, { titleEn: contains }] }, take: 5 }),
    prisma.directoryPlace.findMany({ where: { OR: [{ nameAr: contains }, { nameEn: contains }] }, take: 5 }),
    prisma.university.findMany({ where: { OR: [{ nameAr: contains }, { nameEn: contains }] }, take: 5 }),
    prisma.company.findMany({ where: { OR: [{ nameAr: contains }, { nameEn: contains }] }, take: 5 }),
    prisma.fAQ.findMany({ where: { isPublished: true, OR: [{ questionAr: contains }, { questionEn: contains }] }, take: 5 }),
    prisma.event.findMany({ where: { status: "PUBLISHED", OR: [{ titleAr: contains }, { titleEn: contains }] }, take: 5 })
  ]);

  const results = [
    ...services.map((s) => ({ category: "services", id: s.id, title: s.nameAr, subtitle: s.nameEn })),
    ...news.map((n) => ({ category: "news", id: n.id, title: n.titleAr, subtitle: n.titleEn })),
    ...directory.map((d) => ({ category: "directory", id: d.id, title: d.nameAr, subtitle: d.category })),
    ...universities.map((u) => ({ category: "universities", id: u.id, title: u.nameAr, subtitle: u.city })),
    ...companies.map((c) => ({ category: "companies", id: c.id, title: c.nameAr, subtitle: c.sector })),
    ...faqs.map((f) => ({ category: "faq", id: f.id, title: f.questionAr, subtitle: f.answerAr.slice(0, 60) })),
    ...events.map((e) => ({ category: "events", id: e.id, title: e.titleAr, subtitle: e.location ?? "" }))
  ];

  return NextResponse.json({ results });
}
