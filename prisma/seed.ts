import { PrismaClient, RoleKey, AccountType, RequestType, RequestStatus, RequestPriority, EmergencyType, EmergencyStatus, ContentStatus, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ROLES: { key: RoleKey; nameAr: string; nameEn: string; nameVi: string }[] = [
  { key: "SUPER_ADMIN", nameAr: "مدير النظام", nameEn: "Super Admin", nameVi: "Quản trị viên cấp cao" },
  { key: "EMBASSY_ADMIN", nameAr: "مدير السفارة", nameEn: "Embassy Admin", nameVi: "Quản trị Đại sứ quán" },
  { key: "CONSULAR_OFFICER", nameAr: "موظف قنصلي", nameEn: "Consular Officer", nameVi: "Cán bộ Lãnh sự" },
  { key: "STUDENT_OFFICER", nameAr: "مسؤول الطلاب", nameEn: "Student Officer", nameVi: "Cán bộ Sinh viên" },
  { key: "BUSINESS_OFFICER", nameAr: "مسؤول الأعمال", nameEn: "Business Officer", nameVi: "Cán bộ Kinh doanh" },
  { key: "CONTENT_EDITOR", nameAr: "محرر المحتوى", nameEn: "Content Editor", nameVi: "Biên tập viên" },
  { key: "EMERGENCY_OFFICER", nameAr: "مسؤول الطوارئ", nameEn: "Emergency Officer", nameVi: "Cán bộ Khẩn cấp" },
  { key: "ANALYST", nameAr: "محلل بيانات", nameEn: "Analyst", nameVi: "Chuyên viên phân tích" },
  { key: "CITIZEN", nameAr: "مواطن", nameEn: "Citizen", nameVi: "Công dân" },
  { key: "STUDENT", nameAr: "طالب", nameEn: "Student", nameVi: "Sinh viên" },
  { key: "RESEARCHER", nameAr: "باحث", nameEn: "Researcher", nameVi: "Nhà nghiên cứu" },
  { key: "BUSINESS_OWNER", nameAr: "صاحب عمل", nameEn: "Business Owner", nameVi: "Chủ doanh nghiệp" },
  { key: "INVESTOR", nameAr: "مستثمر", nameEn: "Investor", nameVi: "Nhà đầu tư" },
  { key: "EGYPTIAN_PARTNER", nameAr: "شريك مصري", nameEn: "Egyptian Partner", nameVi: "Đối tác Ai Cập" },
  { key: "SERVICE_PROVIDER", nameAr: "مقدم خدمة", nameEn: "Service Provider", nameVi: "Nhà cung cấp dịch vụ" }
];

const PERMISSIONS = [
  "users:manage", "requests:read", "requests:manage", "appointments:manage",
  "documents:manage", "news:manage", "directory:manage", "partners:manage",
  "reports:read", "settings:manage", "translations:manage", "emergencies:manage",
  "business:manage", "investments:manage"
];

async function main() {
  console.log("Seeding VietConnect Egy demo database...");

  // Languages
  await prisma.language.createMany({
    data: [
      { code: "ar", nameNative: "العربية", isRtl: true, isActive: true },
      { code: "en", nameNative: "English", isRtl: false, isActive: true },
      { code: "vi", nameNative: "Tiếng Việt", isRtl: false, isActive: true }
    ],
    skipDuplicates: true
  });

  // Permissions
  for (const code of PERMISSIONS) {
    await prisma.permission.upsert({ where: { code }, update: {}, create: { code } });
  }

  // Roles
  for (const r of ROLES) {
    await prisma.role.upsert({ where: { key: r.key }, update: {}, create: r });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { key: "SUPER_ADMIN" } });
  const allPerms = await prisma.permission.findMany();
  for (const p of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id }
    });
  }

  // Demo password hash
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // --- Users: admin, student, business ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@vietconnect-egy.local" },
    update: {},
    create: {
      email: "admin@vietconnect-egy.local",
      passwordHash: hash("Admin@123456"),
      fullName: "System Administrator (Demo)",
      accountType: AccountType.STAFF,
      isApproved: true,
      emailVerified: new Date()
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {}, create: { userId: admin.id, roleId: adminRole.id }
  });

  const studentRole = await prisma.role.findUniqueOrThrow({ where: { key: "STUDENT" } });
  const studentUser = await prisma.user.upsert({
    where: { email: "student@vietconnect-egy.local" },
    update: {},
    create: {
      email: "student@vietconnect-egy.local",
      passwordHash: hash("Student@123456"),
      fullName: "Nguyen Van A (Demo Student)",
      accountType: AccountType.STUDENT,
      city: "Alexandria",
      isApproved: true,
      emailVerified: new Date()
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: studentUser.id, roleId: studentRole.id } },
    update: {}, create: { userId: studentUser.id, roleId: studentRole.id }
  });

  const bizRole = await prisma.role.findUniqueOrThrow({ where: { key: "BUSINESS_OWNER" } });
  const bizUser = await prisma.user.upsert({
    where: { email: "business@vietconnect-egy.local" },
    update: {},
    create: {
      email: "business@vietconnect-egy.local",
      passwordHash: hash("Business@123456"),
      fullName: "Tran Thi B (Demo Business Owner)",
      accountType: AccountType.BUSINESS,
      city: "Alexandria",
      isApproved: true,
      emailVerified: new Date()
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: bizUser.id, roleId: bizRole.id } },
    update: {}, create: { userId: bizUser.id, roleId: bizRole.id }
  });

  // Universities (5)
  const uniNames = [
    ["جامعة الإسكندرية", "Alexandria University", "Đại học Alexandria"],
    ["جامعة الأكاديمية العربية للعلوم والتكنولوجيا", "Arab Academy for Science and Technology", "Học viện Ả Rập Khoa học và Công nghệ"],
    ["جامعة سنغور", "Senghor University", "Đại học Senghor"],
    ["الجامعة المصرية اليابانية للعلوم والتكنولوجيا", "Egypt-Japan University of Science and Technology", "Đại học Ai Cập - Nhật Bản"],
    ["جامعة فاروس", "Pharos University", "Đại học Pharos"]
  ];
  const universities = [];
  for (const [ar, en, vi] of uniNames) {
    universities.push(await prisma.university.create({
      data: { nameAr: ar, nameEn: en, nameVi: vi, city: "Alexandria", isPartner: true }
    }));
  }

  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      universityId: universities[0].id,
      faculty: "Engineering",
      studyLevel: "Undergraduate",
      startDate: new Date("2023-09-01"),
      expectedGraduation: new Date("2027-06-30"),
      residencyExpiry: new Date("2026-12-31"),
      housingAddress: "Smouha, Alexandria",
      emergencyContactName: "Nguyen Van C",
      emergencyContactPhone: "+84 900 000 000"
    }
  });

  // 9 more demo students (10 total)
  for (let i = 1; i <= 9; i++) {
    const u = await prisma.user.create({
      data: {
        email: `demo.student${i}@vietconnect-egy.local`,
        passwordHash: hash("Demo@123456"),
        fullName: `Demo Student ${i}`,
        accountType: AccountType.STUDENT,
        city: "Alexandria",
        isApproved: true
      }
    });
    await prisma.userRole.create({ data: { userId: u.id, roleId: studentRole.id } });
    await prisma.studentProfile.create({
      data: {
        userId: u.id,
        universityId: universities[i % universities.length].id,
        faculty: ["Engineering", "Medicine", "Business", "Pharmacy", "Arts"][i % 5],
        studyLevel: "Undergraduate",
        residencyExpiry: new Date(2026, (i % 12), 15)
      }
    });
  }

  // Companies (8)
  const sectors = ["Agriculture", "Textiles", "Electronics", "Logistics", "Food", "Furniture", "Technology", "Energy"];
  const companies = [];
  for (let i = 1; i <= 8; i++) {
    companies.push(await prisma.company.create({
      data: {
        nameAr: `شركة تجارية ${i}`,
        nameEn: `Trading Company ${i}`,
        nameVi: `Công ty Thương mại ${i}`,
        sector: sectors[i - 1],
        country: i % 2 === 0 ? "Vietnam" : "Egypt",
        city: i % 2 === 0 ? "Ho Chi Minh City" : "Alexandria",
        verificationStatus: VerificationStatus.VERIFIED,
        description: "Demo company profile for platform showcase."
      }
    }));
  }

  await prisma.businessProfile.upsert({
    where: { userId: bizUser.id },
    update: {},
    create: { userId: bizUser.id, companyId: companies[0].id, position: "Owner" }
  });

  // Business opportunities (10)
  for (let i = 1; i <= 10; i++) {
    await prisma.businessOpportunity.create({
      data: {
        companyId: companies[i % companies.length].id,
        titleAr: `فرصة تجارية ${i}`,
        titleEn: `Business Opportunity ${i}`,
        titleVi: `Cơ hội Kinh doanh ${i}`,
        sector: sectors[i % sectors.length],
        type: ["import", "export", "partnership", "distributor", "supplier"][i % 5],
        country: i % 2 === 0 ? "Vietnam" : "Egypt",
        description: "Demo opportunity for showcase purposes — not a binding offer.",
        attachments: []
      }
    });
  }

  // Investment opportunities (6)
  for (let i = 1; i <= 6; i++) {
    await prisma.investmentOpportunity.create({
      data: {
        titleAr: `فرصة استثمارية ${i}`,
        titleEn: `Investment Opportunity ${i}`,
        titleVi: `Cơ hội Đầu tư ${i}`,
        sector: sectors[i % sectors.length],
        country: i % 2 === 0 ? "Vietnam" : "Egypt",
        stage: ["Seed", "Growth", "Expansion"][i % 3],
        riskNote: "Illustrative demo data — figures are not guaranteed returns.",
        description: "Demo investment opportunity for showcase purposes."
      }
    });
  }

  // Services (12)
  const serviceDefs = [
    ["general-inquiry", "استفسار عام", "General Inquiry", "Yêu cầu chung"],
    ["passport-assistance", "مساعدة جواز السفر", "Passport Assistance", "Hỗ trợ hộ chiếu"],
    ["residency-support", "دعم الإقامة", "Residency Support", "Hỗ trợ cư trú"],
    ["student-affairs", "شؤون الطلاب", "Student Affairs", "Công tác sinh viên"],
    ["document-attestation", "توثيق المستندات", "Document Attestation", "Chứng thực tài liệu"],
    ["legal-guidance", "إرشاد قانوني", "Legal Guidance", "Hướng dẫn pháp lý"],
    ["business-matchmaking", "التوفيق التجاري", "Business Matchmaking", "Kết nối kinh doanh"],
    ["investment-consult", "استشارة استثمارية", "Investment Consultation", "Tư vấn đầu tư"],
    ["appointment-booking", "حجز موعد", "Appointment Booking", "Đặt lịch hẹn"],
    ["emergency-support", "دعم الطوارئ", "Emergency Support", "Hỗ trợ khẩn cấp"],
    ["translation-center", "مركز الترجمة", "Translation Center", "Trung tâm dịch thuật"],
    ["alexandria-guide", "دليل الإسكندرية", "Alexandria Guide", "Hướng dẫn Alexandria"]
  ];
  for (const [code, ar, en, vi] of serviceDefs) {
    await prisma.service.upsert({
      where: { code },
      update: {},
      create: { code, nameAr: ar, nameEn: en, nameVi: vi, category: "general" }
    });
  }

  // Directory places (15)
  const dirCats: [string, string, string, string][] = [
    ["university", "جامعة الإسكندرية", "Alexandria University", "Đại học Alexandria"],
    ["hospital", "مستشفى الإسكندرية الجامعي", "Alexandria University Hospital", "Bệnh viện Đại học Alexandria"],
    ["pharmacy", "صيدلية سيف", "Seif Pharmacy", "Nhà thuốc Seif"],
    ["police", "قسم شرطة المنتزه", "Montaza Police Station", "Đồn công an Montaza"],
    ["hotel", "فندق فور سيزونز الإسكندرية", "Four Seasons Alexandria", "Khách sạn Four Seasons Alexandria"],
    ["restaurant", "مطعم فيتنامي - سمك السلطان", "Sultan Fish Restaurant", "Nhà hàng Sultan Fish"],
    ["translator", "مكتب ترجمة معتمد", "Certified Translation Office", "Văn phòng dịch thuật"],
    ["lawyer", "مكتب محاماة الإسكندرية", "Alexandria Law Office", "Văn phòng luật Alexandria"],
    ["shipping", "شركة شحن دولي", "International Shipping Co.", "Công ty vận chuyển quốc tế"],
    ["port", "ميناء الإسكندرية", "Port of Alexandria", "Cảng Alexandria"],
    ["airport", "مطار برج العرب الدولي", "Borg El Arab International Airport", "Sân bay quốc tế Borg El Arab"],
    ["bank", "بنك مصر - فرع الإسكندرية", "Banque Misr — Alexandria Branch", "Ngân hàng Misr — Chi nhánh Alexandria"],
    ["telecom", "مركز اتصالات فودافون", "Vodafone Service Center", "Trung tâm dịch vụ Vodafone"],
    ["accommodation", "سكن طلابي خاص", "Private Student Housing", "Nhà ở sinh viên"],
    ["attraction", "مكتبة الإسكندرية", "Bibliotheca Alexandrina", "Thư viện Alexandria"]
  ];
  for (const [cat, ar, en, vi] of dirCats) {
    await prisma.directoryPlace.create({
      data: {
        category: cat, nameAr: ar, nameEn: en, nameVi: vi,
        address: "Alexandria, Egypt",
        verificationStatus: VerificationStatus.VERIFIED,
        languagesSupported: ["ar", "en"]
      }
    });
  }

  // News (10)
  for (let i = 1; i <= 10; i++) {
    await prisma.newsArticle.create({
      data: {
        slug: `demo-news-${i}`,
        titleAr: `خبر تجريبي رقم ${i}`,
        titleEn: `Demo News Item ${i}`,
        titleVi: `Tin tức demo ${i}`,
        bodyAr: "محتوى تجريبي لأغراض العرض فقط.",
        bodyEn: "Demo content for showcase purposes only.",
        bodyVi: "Nội dung demo chỉ nhằm mục đích trình bày.",
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date()
      }
    });
  }

  // Events (6)
  for (let i = 1; i <= 6; i++) {
    await prisma.event.create({
      data: {
        titleAr: `فعالية تجريبية ${i}`,
        titleEn: `Demo Event ${i}`,
        titleVi: `Sự kiện demo ${i}`,
        location: "Alexandria, Egypt",
        startAt: new Date(Date.now() + i * 7 * 24 * 3600 * 1000),
        status: ContentStatus.PUBLISHED
      }
    });
  }

  // Scholarships (5), Internships (5), Jobs (5)
  for (let i = 1; i <= 5; i++) {
    await prisma.scholarship.create({
      data: { titleAr: `منحة تجريبية ${i}`, titleEn: `Demo Scholarship ${i}`, titleVi: `Học bổng demo ${i}`, provider: "Demo Provider" }
    });
    await prisma.internship.create({
      data: { titleAr: `تدريب تجريبي ${i}`, titleEn: `Demo Internship ${i}`, titleVi: `Thực tập demo ${i}`, organization: "Demo Org" }
    });
    await prisma.jobOpportunity.create({
      data: { titleAr: `وظيفة تجريبية ${i}`, titleEn: `Demo Job ${i}`, titleVi: `Việc làm demo ${i}`, company: "Demo Company" }
    });
  }

  // Service requests (8)
  const reqTypes: RequestType[] = [
    "GENERAL_INQUIRY", "LOST_PASSPORT", "RESIDENCY_ISSUE", "STUDENT_CASE",
    "DOCUMENT_ATTESTATION", "BUSINESS_ISSUE", "HEALTH_ISSUE", "COMPLAINT"
  ];
  for (let i = 0; i < 8; i++) {
    await prisma.serviceRequest.create({
      data: {
        userId: i % 2 === 0 ? studentUser.id : bizUser.id,
        type: reqTypes[i],
        priority: (["LOW", "NORMAL", "HIGH", "URGENT"] as RequestPriority[])[i % 4],
        status: (["NEW", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED"] as RequestStatus[])[i % 4],
        subject: `Demo Request ${i + 1}`,
        description: "Demo request generated by seed script for showcase purposes."
      }
    });
  }

  // Appointment slots + appointments (5)
  for (let i = 0; i < 5; i++) {
    const slot = await prisma.appointmentSlot.create({
      data: {
        date: new Date(Date.now() + (i + 1) * 24 * 3600 * 1000),
        startTime: "10:00",
        endTime: "10:30",
        capacity: 3
      }
    });
    await prisma.appointment.create({
      data: {
        userId: i % 2 === 0 ? studentUser.id : bizUser.id,
        slotId: slot.id,
        serviceName: serviceDefs[i][2],
        status: "CONFIRMED"
      }
    });
  }

  // Emergency cases (2)
  await prisma.emergencyCase.create({
    data: { userId: studentUser.id, type: EmergencyType.LOST_DOCUMENTS, status: EmergencyStatus.RESOLVED, description: "Demo resolved emergency case." }
  });
  await prisma.emergencyCase.create({
    data: { userId: studentUser.id, type: EmergencyType.MEDICAL, status: EmergencyStatus.OPEN, description: "Demo open emergency case." }
  });

  // Document types
  const docTypes = [
    ["passport", "جواز سفر", "Passport", "Hộ chiếu"],
    ["residency", "إقامة", "Residency Permit", "Giấy phép cư trú"],
    ["student_id", "بطاقة طالب", "Student ID", "Thẻ sinh viên"],
    ["insurance", "تأمين", "Insurance", "Bảo hiểm"],
    ["commercial_register", "سجل تجاري", "Commercial Register", "Đăng ký kinh doanh"]
  ];
  for (const [code, ar, en, vi] of docTypes) {
    await prisma.documentType.upsert({
      where: { code },
      update: {},
      create: { code, nameAr: ar, nameEn: en, nameVi: vi }
    });
  }

  // System settings
  await prisma.systemSetting.upsert({
    where: { key: "officialEndorsement" },
    update: {},
    create: { key: "officialEndorsement", value: "false" }
  });
  await prisma.systemSetting.upsert({
    where: { key: "stats.registeredUsers" },
    update: {},
    create: { key: "stats.registeredUsers", value: "17" }
  });

  // Notifications (20)
  const notif = await prisma.notification.create({
    data: {
      titleAr: "مرحبًا بك في VietConnect Egy",
      titleEn: "Welcome to VietConnect Egy",
      titleVi: "Chào mừng đến với VietConnect Egy",
      bodyAr: "هذه بيانات تجريبية لأغراض العرض.",
      bodyEn: "This is demo data for showcase purposes.",
      bodyVi: "Đây là dữ liệu demo chỉ nhằm mục đích trình bày."
    }
  });
  for (const u of [studentUser, bizUser, admin]) {
    for (let i = 0; i < 6; i++) {
      await prisma.notificationRecipient.create({ data: { notificationId: notif.id, userId: u.id } });
    }
  }

  // FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        category: "general",
        questionAr: "هل هذه منصة رسمية تابعة للسفارة؟",
        questionEn: "Is this an official embassy platform?",
        questionVi: "Đây có phải là nền tảng chính thức của Đại sứ quán không?",
        answerAr: "لا، VietConnect Egy مقترح تعاون رقمي مستقل وليس منصة رسمية إلا بعد اعتمادها رسميًا.",
        answerEn: "No. VietConnect Egy is an independent digital cooperation proposal and is not an official platform unless formally adopted.",
        answerVi: "Không. VietConnect Egy là một đề xuất hợp tác kỹ thuật số độc lập và không phải là nền tảng chính thức trừ khi được cơ quan có thẩm quyền phê duyệt."
      }
    ]
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
