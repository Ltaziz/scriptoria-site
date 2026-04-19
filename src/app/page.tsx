export default function Home() {
  const services = [
    {
      title: "إدارة حسابات التواصل الاجتماعي",
      desc: "نصنع حضوراً ثابتاً، ونحوّل المنصات إلى واجهة قوية تعكس قيمة العلامة التجارية.",
    },
    {
      title: "تصميم الهوية البصرية",
      desc: "نبني هوية راقية ومتسقة تمنح مشروعك صورة احترافية سهلة التمييز والتذكر.",
    },
    {
      title: "إنتاج المحتوى الإبداعي",
      desc: "محتوى بصري ونصي مصمم بعناية ليجذب الانتباه ويخلق تأثيراً حقيقياً.",
    },
    {
      title: "إدارة الحملات الإعلانية",
      desc: "حملات مدروسة تستهدف الجمهور الصحيح وتُدار بأهداف واضحة ونتائج قابلة للقياس.",
    },
    {
      title: "تصوير المنتجات والخدمات",
      desc: "إخراج بصري احترافي يرفع القيمة المدركة ويُظهر التفاصيل بأفضل صورة.",
    },
    {
      title: "الاستشارات التسويقية",
      desc: "رؤية استراتيجية تساعدك على اتخاذ قرارات أدق وبناء نمو مستدام لمشروعك.",
    },
  ];

  const reasons = [
    "استراتيجية واضحة مبنية على فهم السوق والجمهور",
    "تصميم وهوية يعكسان فخامة العلامة التجارية",
    "تنفيذ احترافي مع التزام بالجودة والتفاصيل",
    "متابعة وتحليل وتحسين مستمر للنتائج",
  ];

  const steps = [
    { no: "01", title: "فهم المشروع", desc: "نحلل النشاط التجاري والأهداف والجمهور لبناء أساس صحيح." },
    { no: "02", title: "بناء الخطة", desc: "نضع خطة تسويقية واضحة تشمل الهوية والمحتوى والإعلانات." },
    { no: "03", title: "التنفيذ", desc: "نحوّل الخطة إلى محتوى وحملات وإخراج بصري احترافي." },
    { no: "04", title: "التطوير", desc: "نقيس الأداء ونحسن النتائج باستمرار للوصول لأفضل أثر ممكن." },
  ];

  const stats = [
    { value: "+120", label: "مشروعاً تم العمل عليه" },
    { value: "+35", label: "علامة تجارية وثقت بنا" },
    { value: "+4X", label: "تحسن متوسط في التفاعل" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,98,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(44,104,176,0.16),transparent_24%),linear-gradient(180deg,#07111f_0%,#081423_45%,#060d18_100%)]" />
        <div className="absolute right-[-90px] top-8 h-72 w-72 rounded-full bg-[#d4af62]/10 blur-3xl" />
        <div className="absolute left-[-90px] top-80 h-80 w-80 rounded-full bg-[#2a68b2]/10 blur-3xl" />

        <div className="relative z-10">
          <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10 md:pt-10">
            <nav className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e7c57a] to-[#9a6d25] text-base font-black text-[#07111f] shadow-[0_12px_30px_rgba(212,175,98,0.35)]">
                  S
                </div>
                <div>
                  <p className="text-xs text-white/55">وكالة تسويق رقمي</p>
                  <h2 className="text-lg font-semibold tracking-wide">Scriptoria</h2>
                </div>
              </div>

              <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
                <a href="#about" className="transition hover:text-[#f3d188]">من نحن</a>
                <a href="#services" className="transition hover:text-[#f3d188]">الخدمات</a>
                <a href="#process" className="transition hover:text-[#f3d188]">آلية العمل</a>
                <a href="#contact" className="transition hover:text-[#f3d188]">تواصل معنا</a>
              </div>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-[#d4af62]/30 bg-[#d4af62]/10 px-4 py-2 text-sm text-[#f3d188] backdrop-blur-xl">
                  هوية راقية · محتوى احترافي · نتائج تُلاحظ
                </span>

                <h1 className="mt-6 text-4xl font-black leading-[1.15] md:text-6xl md:leading-[1.08]">
                  نصنع حضوراً رقمياً
                  <span className="mt-2 block bg-gradient-to-l from-[#fff7df] via-[#f3d188] to-[#b9852f] bg-clip-text text-transparent">
                    يليق بعلامتك التجارية
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
                  نقدم حلول تسويق رقمي متكاملة تساعد الشركات على الوصول إلى جمهورها
                  المستهدف، بناء هوية قوية، وتحقيق نتائج ملموسة عبر استراتيجيات مدروسة ومحتوى احترافي.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="#contact"
                    className="rounded-full bg-gradient-to-l from-[#d4af62] to-[#9a6d25] px-7 py-3.5 text-sm font-bold text-[#07111f] shadow-[0_18px_45px_rgba(212,175,98,0.28)] transition hover:scale-[1.02]"
                  >
                    ابدأ مشروعك
                  </a>
                  <a
                    href="#services"
                    className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
                  >
                    خدماتنا
                  </a>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >
                      <div className="text-3xl font-black text-[#f3d188]">{item.value}</div>
                      <p className="mt-2 text-sm leading-6 text-white/60">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[34px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
                  <div className="rounded-[26px] bg-[radial-gradient(circle_at_top,rgba(212,175,98,0.16),transparent_34%),linear-gradient(180deg,#0d1a2c_0%,#0a1320_100%)] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50">Brand Performance</p>
                        <h3 className="mt-2 text-2xl font-bold">قوة الحضور التسويقي</h3>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#e7c57a] to-[#9a6d25]" />
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                          <span>قوة الهوية</span>
                          <span>92%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[92%] rounded-full bg-gradient-to-l from-[#d4af62] to-[#9a6d25]" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                          <span>جاذبية المحتوى</span>
                          <span>88%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[88%] rounded-full bg-gradient-to-l from-[#5da8ff] to-[#2a68b2]" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                          <span>جاهزية الإطلاق</span>
                          <span>96%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[96%] rounded-full bg-gradient-to-l from-[#f6dfaa] to-[#d4af62]" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/65">
                      نصنع تجربة تسويقية تجمع بين الفخامة البصرية، الوضوح الاستراتيجي، والقدرة على تحقيق نتائج حقيقية.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <p className="text-sm tracking-[0.25em] text-[#f3d188]">ABOUT</p>
                <h2 className="mt-4 text-3xl font-bold md:text-4xl">من نحن</h2>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-lg leading-9 text-white/72 backdrop-blur-xl">
                نحن شركة متخصصة في التسويق الرقمي وصناعة المحتوى، نعمل على تطوير حضور
                العلامات التجارية عبر استراتيجيات إبداعية تجمع بين التحليل، التصميم،
                والإعلان الفعّال. نؤمن أن النجاح لا يتحقق بالظهور فقط، بل بصناعة تأثير
                حقيقي ومستدام.
              </div>
            </div>
          </section>

          <section id="services" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm tracking-[0.25em] text-[#f3d188]">SERVICES</p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl">خدماتنا</h2>
              </div>
              <p className="max-w-2xl text-white/65">
                حلول احترافية مصممة لدعم نمو النشاط التجاري وتعزيز حضوره في السوق.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#d4af62]/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#f3d188]">0{index + 1}</span>
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10" />
                  </div>
                  <h3 className="mt-7 text-2xl font-bold leading-9">{service.title}</h3>
                  <p className="mt-4 leading-8 text-white/65">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,175,98,0.12),rgba(255,255,255,0.04),rgba(42,104,178,0.1))] p-8 backdrop-blur-2xl md:p-10">
              <div className="mb-10">
                <p className="text-sm tracking-[0.25em] text-[#f3d188]">WHY US</p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl">ليش تختارنا</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {reasons.map((item) => (
                  <div key={item} className="rounded-[24px] border border-white/10 bg-black/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-[#d4af62]" />
                      <p className="text-lg leading-8 text-white/82">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="process" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <div className="mb-12">
              <p className="text-sm tracking-[0.25em] text-[#f3d188]">PROCESS</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">آلية العمل</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.no}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="text-4xl font-black text-white/15">{step.no}</div>
                  <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-4 leading-8 text-white/65">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10">
            <div className="overflow-hidden rounded-[36px] border border-[#d4af62]/20 bg-[linear-gradient(135deg,#0d1726_0%,#0b1220_45%,#0a0f18_100%)] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
              <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm tracking-[0.25em] text-[#f3d188]">CONTACT</p>
                  <h2 className="mt-4 text-3xl font-bold md:text-5xl">تواصل معنا</h2>
                  <p className="mt-6 max-w-2xl text-lg leading-9 text-white/72">
                    هل تبحث عن شريك يساعدك على بناء حضور رقمي قوي؟ يسعدنا التواصل معك
                    ومناقشة احتياجات مشروعك.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/9640000000000"
                      className="flex items-center justify-between rounded-2xl border border-[#d4af62]/20 bg-gradient-to-l from-[#d4af62] to-[#9a6d25] px-5 py-4 font-bold text-[#07111f] transition hover:opacity-95"
                    >
                      <span>واتساب</span>
                      <span>↗</span>
                    </a>

                    <a
                      href="mailto:info@example.com"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                    >
                      <span>البريد الإلكتروني</span>
                      <span>↗</span>
                    </a>
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5">
                    <p className="text-sm text-white/50">جاهزون لمناقشة</p>
                    <p className="mt-2 text-xl font-bold">الهوية، المحتوى، الإعلانات، وخطة النمو</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
هذا هو الصفحة مال الموقع  page tsx و layout = import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} next config import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

export default nextConfig;
globals= @import "tailwindcss";

:root{
  color-scheme: dark;
}

*{
  box-sizing: border-box;
}

html{
  scroll-behavior: smooth;
}

body{
  margin: 0;
  background: #07111f;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
}  اريد حل نهائي و سهل و عادي حتى لو نسوي من جديد المهم يشتغل بالكلاود فلاير 100٪ 19459
::contentReference[oaicite:2]{index=2}