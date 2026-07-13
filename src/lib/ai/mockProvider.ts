import { AIMessage, AIProvider, ASSISTANT_SYSTEM_NOTICE } from "./provider";

const FAQ_KEYWORDS: Record<string, { ar: string; en: string; vi: string }> = {
  passport: {
    ar: "لفقدان جواز السفر، يرجى تقديم طلب من نوع (فقدان جواز) من صفحة الطلبات، مرفقًا بمحضر شرطة إن وجد.",
    en: "For a lost passport, please submit a 'Lost Passport' request from the Requests page, attaching a police report if available.",
    vi: "Đối với hộ chiếu bị mất, vui lòng gửi yêu cầu 'Mất hộ chiếu' kèm biên bản công an nếu có."
  },
  appointment: {
    ar: "يمكنك حجز موعد من صفحة (المواعيد) واختيار الوقت المناسب المتاح.",
    en: "You can book an appointment from the Appointments page and select an available time slot.",
    vi: "Bạn có thể đặt lịch hẹn từ trang Lịch hẹn và chọn khung giờ phù hợp."
  },
  university: {
    ar: "يمكنك تصفح دليل الجامعات الشريكة من بوابة الطلاب للحصول على معلومات كاملة.",
    en: "You can browse the partner universities directory from the Student Portal for full details.",
    vi: "Bạn có thể xem danh bạ các trường đại học đối tác từ Cổng thông tin Sinh viên."
  }
};

export class MockAIProvider implements AIProvider {
  name = "mock";

  async chat(messages: AIMessage[], locale: string): Promise<string> {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.toLowerCase() ?? "";

    for (const key of Object.keys(FAQ_KEYWORDS)) {
      if (lastUser.includes(key)) {
        const entry = FAQ_KEYWORDS[key];
        return (entry as any)[locale] ?? entry.en;
      }
    }

    const fallback: Record<string, string> = {
      ar: `مرحبًا! أنا VietConnect AI (وضع تجريبي دون اتصال خارجي). ${ASSISTANT_SYSTEM_NOTICE} يمكنك سؤالي عن الطلاب، المواعيد، أو جواز السفر.`,
      en: `Hello! I'm VietConnect AI (offline demo mode). ${ASSISTANT_SYSTEM_NOTICE} Ask me about students, appointments, or passports.`,
      vi: `Xin chào! Tôi là VietConnect AI (chế độ demo ngoại tuyến). ${ASSISTANT_SYSTEM_NOTICE}`
    };
    return fallback[locale] ?? fallback.en;
  }
}
