import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TRANSLATIONS } from "@/constants/translations";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  return {
    title: dict.contact_meta_title,
    description: dict.contact_meta_desc,
  };
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  const CONTACT_DETAILS = [
    {
      label: dict.contact_label_phone,
      value: "1900 1234",
      subtext: dict.contact_sub_phone,
      icon: (
        <svg className="h-6 w-6 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      label: dict.contact_label_email,
      value: "support@viettour.vn",
      subtext: dict.contact_sub_email,
      icon: (
        <svg className="h-6 w-6 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: dict.contact_label_office,
      value: dict.contact_value_office,
      subtext: dict.contact_sub_office,
      icon: (
        <svg className="h-6 w-6 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Main Form and Support Info Grid */}
      <section className="padding-container max-container pt-12 pb-16 lg:py-20">
        {/* Simple Title & Intro Block */}
        <div className="mb-12 text-left border-b border-gray-10 dark:border-stone-700 pb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
            {dict.contact_badge}
          </span>
          <h1 className="mt-1 text-3xl font-black md:text-4xl text-slate-800 dark:text-stone-100 tracking-tight leading-tight">
            {dict.contact_header_title}
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-stone-400 font-semibold max-w-3xl leading-relaxed">
            {dict.contact_header_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h2 className="bold-24 text-gray-90 dark:text-stone-100">{dict.contact_form_title}</h2>
              <p className="regular-16 mt-2 text-gray-30 dark:text-stone-400">{dict.contact_form_desc}</p>
            </div>
            <ContactForm />
          </div>

          {/* Contact details and Schedule column */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div>
              <h2 className="bold-24 mb-6 text-gray-90 dark:text-stone-100">{dict.contact_info_title}</h2>
              <div className="flex flex-col gap-4">
                {CONTACT_DETAILS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50/10">
                      {item.icon}
                    </div>
                    <div>
                      <p className="regular-14 text-gray-30 dark:text-stone-400 font-medium">{item.label}</p>
                      <p className="bold-18 mt-1 text-gray-90 dark:text-stone-100">{item.value}</p>
                      <p className="regular-12 mt-0.5 text-gray-20 dark:text-stone-500">{item.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time schedule card */}
            <div className="rounded-3xl bg-green-90 p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-0 bottom-0 h-24 w-24 rounded-full bg-white/5 blur-lg" />
              <h3 className="bold-20 border-b border-white/10 pb-3">{dict.contact_hours_title}</h3>
              <div className="mt-4 space-y-2">
                <p className="regular-16 flex justify-between">
                  <span>{dict.contact_hours_weekdays}</span>
                  <span className="font-semibold">8:00 - 18:00</span>
                </p>
                <p className="regular-16 flex justify-between">
                  <span>{dict.contact_hours_saturday}</span>
                  <span className="font-semibold">8:00 - 12:00</span>
                </p>
                <p className="regular-16 flex justify-between border-t border-white/10 pt-3 text-emerald-300">
                  <span>{dict.contact_hours_emergency}</span>
                  <span className="bold-16">24/7</span>
                </p>
              </div>
            </div>

            {/* Live Google Map Iframe */}
            <div className="overflow-hidden rounded-3xl border border-gray-10 dark:border-stone-700 shadow-sm h-64 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d3919.4241674391696!2d106.70051187586884!3d10.778761189370123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a1b17e23%3A0x86c3d9b04f7f6f1c!2zMTIzIMSQxrDhu51uZyBMw6ogTOG7o2ksIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaGluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1718456000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
