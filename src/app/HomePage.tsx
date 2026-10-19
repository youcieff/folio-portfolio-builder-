"use client";

import Link from "next/link";
import { LanguageToggle, useUiLanguage } from "@/i18n/UiLanguageProvider";
import styles from "./Home.module.css";

const features = [
  ["01", "Start with a style", "Pick from expressive themes, rich gradients, and flexible layouts. Every detail stays yours to change."],
  ["02", "Add what matters", "Tell your story, add project images and links, and shape the sections around your work."],
  ["03", "Take it anywhere", "Preview desktop and mobile, then export one responsive HTML file you can keep and share."],
] as const;

export function HomePage() {
  const { language, t } = useUiLanguage();
  const isArabic = language === "ar";
  return (
    <main className={styles.page} lang={language} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.siteLoader} aria-hidden="true">
        <div className={styles.loaderLockup}>
          <span className={styles.loaderMark}>f</span>
          <span className={styles.loaderName}>folio<span>.</span></span>
        </div>
        <p className={styles.loaderTagline}>{t("Your work, beautifully yours.")}</p>
        <span className={styles.loaderTrack}><i /></span>
      </div>
      <nav id="top" className={styles.nav} aria-label={t("Main navigation")}>
        <Link className={styles.brand} href="/" aria-label="Folio home">folio<span>.</span></Link>
        <div className={styles.navCenter}>
          <Link href="#features">{isArabic ? "طريقة العمل" : "How it works"}</Link>
          <Link href="/editor/">{isArabic ? "استكشف التصاميم" : "Explore designs"}</Link>
        </div>
        <div className={styles.navActions}><LanguageToggle className={styles.languageToggle} /><Link className={styles.navCta} href="/editor/">{t("Open the studio")} <span aria-hidden="true">↗</span></Link></div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.introWash} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><i /> {t("YOUR WORK DESERVES A BETTER STAGE")}</span>
          <h1>{isArabic ? <>خلّي شغلك<br />مستحيل <em>يتنسي.</em></> : <>Make your work<br />impossible to <em>scroll past.</em></>}</h1>
          <p className={styles.lead}>{t("Create a portfolio that feels unmistakably yours. Choose a look, add your story and projects, and watch the whole site come together.")}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryCta} href="/editor/">{t("Build my portfolio")} <span aria-hidden="true">↗</span></Link>
            <span className={styles.freeNote}><b>{t("Free, forever.")}</b>{t("No account. No subscription.")}</span>
          </div>
          <div className={styles.trustLine}><span>{t("40+ distinctive themes")}</span><i /><span>{t("20 gradient styles")}</span><i /><span>{t("Responsive by default")}</span></div>
        </div>

        <div className={styles.visual} aria-label={isArabic ? "معاينة تصميم بورتفوليو" : "Preview of a portfolio design"}>
          <div className={styles.glow} />
          <div className={styles.browser}>
            <div className={styles.browserBar}><span /><span /><span /><div>yourname.studio</div><b>•••</b></div>
            <div className={styles.portfolio} dir={isArabic ? "rtl" : "ltr"}>
              <div className={styles.portfolioNav}><b>YM<span>.</span></b><div><i>{isArabic ? "نبذة" : "About"}</i><i>{isArabic ? "الأعمال" : "Work"}</i><i>{isArabic ? "تواصل" : "Contact"}</i></div><small>{isArabic ? "لنتحدث ↗" : "LET’S TALK ↗"}</small></div>
              <div className={styles.portfolioHero}>
                <div><span className={styles.portfolioKicker}>{isArabic ? "مصمم مستقل · القاهرة" : "INDEPENDENT DESIGNER · CAIRO"}</span><h2>{isArabic ? <>أفكار تصنع<br /><em>أثرًا.</em></> : <>Ideas made<br /><em>memorable.</em></>}</h2><p>{isArabic ? "أعمال مدروسة لمن يصنعون ما هو قادم." : "Thoughtful work for people building what comes next."}</p><span className={styles.portfolioLink}>{isArabic ? "اكتشف أعمالي ↗" : "EXPLORE SELECTED WORK ↗"}</span></div>
                <div className={styles.artCard}><div /><span>FORM / FUNCTION<br />01—04</span></div>
              </div>
              <div className={styles.workLabel}><span>{isArabic ? "أعمال مختارة" : "SELECTED WORK"}</span><span>2022 — 2025</span></div>
              <div className={styles.workTiles}><i /><i /><i /></div>
            </div>
          </div>
          <div className={styles.floatBadge}><i /> {isArabic ? "موقعك. أسلوبك. ملكك." : "Your site. Your style. Yours to keep."}</div>
          <span className={styles.sparkle} aria-hidden="true">✳</span>
        </div>
      </section>

      <section id="features" className={styles.featureBand}>
        <div className={styles.featureIntro}><span>{t("FROM FIRST IDEA TO YOUR OWN WEBSITE")}</span><h2>{isArabic ? <>إعداد أقل.<br /><em>مساحة أكبر لك.</em></> : <>Less setup.<br /><em>More you.</em></>}</h2></div>
        <div className={styles.features}>{features.map(([number, title, description]) => <article key={number} className={styles.feature}><span>{number}</span><h3>{t(title)}</h3><p>{t(description)}</p></article>)}</div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerIdentity}>
            <Link className={styles.brand} href="/" aria-label="Folio home">folio<span>.</span></Link>
            <p>{t("Your work, beautifully yours.")}</p>
          </div>
          <Link className={styles.footerCta} href="/editor/">{t("Build my portfolio")} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Folio Studio</span>
          <span className={styles.footerNote}>{isArabic ? "مساحتك الإبداعية تبدأ من هنا" : "A little space for your next big thing."}</span>
          <a href="#top">{isArabic ? "العودة للأعلى" : "Back to top"}<span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </main>
  );
}
