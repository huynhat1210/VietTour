"use client";

import {
  FOOTER_CONTACT_INFO,
  FOOTER_LINKS,
  SITE_NAME,
  SOCIALS,
} from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t, language } = useLanguage();

  const getFooterColKey = (title: string) => {
    if (title === "Khám phá") return "footer_explore";
    if (title === "Điểm đến hot") return "footer_hot_dest";
    return title;
  };

  const getFooterLinkLabel = (label: string) => {
    if (label === "Tour du lịch") return t("nav_tours" as any);
    if (label === "Giới thiệu") return t("nav_about" as any);
    if (label === "Liên hệ") return t("nav_contact" as any);
    return label;
  };

  const getContactLabel = (label: string) => {
    if (label === "Địa chỉ") return t("footer_address_label" as any);
    return label;
  };

  const getContactValue = (label: string, value: string) => {
    if (label === "Địa chỉ") {
      return language === "vi" ? "123 Nguyễn Huệ, Q.1, TP.HCM" : "123 Nguyen Hue, Dist 1, HCMC";
    }
    return value;
  };

  return (
    <footer className="border-t border-gray-100 bg-slate-50/50 py-16 dark:border-stone-900/60 dark:bg-stone-950/20">
      <div className="padding-container max-container flex w-full flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-4 max-w-[280px]">
            <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.04]">
              <Image
                src="/camp.svg"
                alt="VietTour"
                width={40}
                height={40}
                style={{ width: "auto", height: "auto" }}
                unoptimized
                priority
              />
              <span className="font-black text-2xl tracking-tight text-gray-90 dark:text-white">
                Viet<span className="text-green-50">Tour</span>
              </span>
            </Link>
            <p className="regular-14 leading-relaxed text-gray-30 dark:text-stone-400">
              {t("footer_desc" as any)}
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:justify-between md:flex-1 md:justify-end md:gap-14">
            {FOOTER_LINKS.map((column) => (
              <FooterColumn title={t(getFooterColKey(column.title) as any)} key={column.title}>
                <ul className="regular-14 flex flex-col gap-3 text-gray-30 dark:text-stone-400">
                  {column.links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.label}
                      className="hover:text-green-50 dark:hover:text-green-400 transition-colors"
                    >
                      {getFooterLinkLabel(link.label)}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <FooterColumn title={t("footer_contact" as any)}>
              <div className="flex flex-col gap-4">
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <div key={link.label} className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-20 dark:text-stone-500">
                      {getContactLabel(link.label)}
                    </p>
                    <p className="medium-14 text-blue-70 dark:text-green-400">
                      {getContactValue(link.label, link.value)}
                    </p>
                  </div>
                ))}
              </div>
            </FooterColumn>

            <FooterColumn title={t("footer_socials" as any)}>
              <ul className="flex gap-3">
                {SOCIALS.links.map((link) => (
                  <a
                    href={link.href}
                    key={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-stone-850 bg-white dark:bg-stone-900 text-gray-40 dark:text-stone-400 transition-all hover:border-green-50 hover:bg-green-50/5 dark:hover:border-green-400 hover:text-green-50 hover:shadow-sm cursor-pointer"
                  >
                    <Image
                      src={link.icon}
                      alt={link.label}
                      width={18}
                      height={18}
                      className="dark:brightness-0 dark:invert opacity-70 hover:opacity-100 transition-opacity"
                      unoptimized
                    />
                  </a>
                ))}
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200/60 dark:bg-stone-900" />
        
        <p className="regular-14 w-full text-center text-gray-30 dark:text-stone-500">
          © {new Date().getFullYear()} {SITE_NAME} | {
            language === "vi"
              ? "Website du lịch & đặt tour Việt Nam"
              : "Vietnam travel & tour booking website"
          }
        </p>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap text-gray-90 dark:text-white">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;
