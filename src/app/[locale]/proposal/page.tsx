const SECTIONS = [
  { title: "الرؤية / Vision", body: "بناء جسر رقمي موثوق يربط المجتمع الفيتنامي في مصر — وخاصة في الإسكندرية — بالخدمات القنصلية والتعليمية والتجارية، بما يعزز التعاون المصري الفيتنامي." },
  { title: "المشكلة / The Challenge", body: "تركّز الخدمات القنصلية الرسمية في القاهرة يزيد العبء التشغيلي والزمني على الطلاب والمواطنين ورجال الأعمال في الإسكندرية وشمال مصر." },
  { title: "الحل / The Solution", body: "منصة رقمية موحدة (VietConnect Egy) تدير الطلبات والمواعيد والمستندات والتواصل، وتوفر دليلاً عمليًا على الاحتياج الفعلي لتوسيع الخدمات." },
  { title: "لماذا الإسكندرية؟ / Why Alexandria", body: "موقعها الاستراتيجي على البحر الأبيض المتوسط، ميناؤها التجاري، كثافتها الجامعية، وقربها من المناطق الصناعية تجعلها نقطة ارتكاز طبيعية." },
  { title: "الفئات المستفيدة / Beneficiaries", body: "الطلاب والباحثون، المواطنون المقيمون، الشركات والمصدرون والمستوردون، والمستثمرون في القطاعين." },
  { title: "القيمة الدبلوماسية / Diplomatic Value", body: "تعزيز قنوات التواصل الرسمية دون استبدال الاختصاصات القنصلية، وتوفير بيانات تشغيلية تدعم اتخاذ القرار." },
  { title: "الأمن والخصوصية / Security & Privacy", body: "تشفير كلمات المرور، تحكم وصول قائم على الأدوار، سجلات تدقيق كاملة، وسياسات احتفاظ بيانات واضحة." },
  { title: "نموذج التشغيل / Operating Model", body: "فريق إداري مصغر يدير الطلبات والمحتوى، مع صلاحيات موزعة حسب الأدوار (قنصلي، طلابي، تجاري، طوارئ)." },
  { title: "مراحل التنفيذ / Implementation Phases", body: "المرحلة الأولى: الخدمات الأساسية للطلاب والمواطنين. المرحلة الثانية: الأعمال والاستثمار والدليل الذكي. المرحلة الثالثة: تكاملات رسمية وتوسع مؤسسي." },
  { title: "دعوة للشراكة / Call for Partnership", body: "تقدّم VietConnect Egy دليلاً عمليًا على القيمة المحتملة لتوسيع الخدمات في الإسكندرية، وتدعو لتجربة Pilot Program محدودة النطاق قبل أي قرار رسمي." }
];

export default function ProposalPage() {
  return (
    <div className="container-page py-14 max-w-3xl">
      <span className="badge-demo">Strategic Proposal — غير رسمي</span>
      <h1 className="section-title mt-3">المقترح الاستراتيجي / Strategic Proposal</h1>
      <p className="text-diplomatic-navy/60 mb-8 text-sm">
        هذه الصفحة مُعدّة للعرض التوضيحي أمام الجهات الدبلوماسية والمؤسسية، ولا تمثل التزامًا رسميًا من
        أي جهة حكومية.
      </p>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title} className="card-diplomatic">
            <h2 className="font-bold text-diplomatic-navy">{s.title}</h2>
            <p className="mt-2 text-sm text-diplomatic-navy/70 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
