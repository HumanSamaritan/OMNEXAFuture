import type { Metadata } from "next";
import Image from "next/image";
import BookingGate from "@/components/BookingGate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Meet Dhiraj Kumar | OMNeXa",
  description:
    "Book a 30-minute introductory conversation with Dhiraj Kumar, Founder & CEO of OMNeXa Pte. Ltd.",
  alternates: { canonical: "/connect" }
};

const conversationThemes = [
  { number: "01", label: "Partnerships & ecosystems" },
  { number: "02", label: "OMNeXa products & pilots" },
  { number: "03", label: "AI, transformation & governance" },
  { number: "04", label: "Education & future skills" }
];

export default function ConnectPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <main className={styles.page}>
      <section className={`section-shell ${styles.connectGrid}`}>
        <div className={styles.intro}>
          <div className={styles.identity}>
            <div className={styles.portraitWrap}>
              <Image
                src="/dhiraj-founder.png"
                alt="Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd."
                width={1254}
                height={1254}
                sizes="112px"
                className={styles.portrait}
                priority
              />
            </div>
            <div>
              <p className="eyebrow">Meet Dhiraj Kumar</p>
              <p className={styles.role}>Founder &amp; CEO · OMNeXa Pte. Ltd.</p>
              <a className={styles.profileLink} href="/dhiraj-kumar">View founder profile →</a>
            </div>
          </div>

          <h1 className={styles.headline}>Let&apos;s explore where our ideas can connect.</h1>
          <p className={styles.lead}>
            A focused 30-minute conversation to discuss OMNeXa&apos;s vision, potential partnerships,
            products, pilots or transformation opportunities.
          </p>

          <div className={styles.themeGrid} aria-label="Good topics for an introductory conversation">
            {conversationThemes.map((theme) => (
              <div className={styles.themeItem} key={theme.number}>
                <span>{theme.number}</span>
                <strong>{theme.label}</strong>
              </div>
            ))}
          </div>

          <p className={styles.note}>
            No preparation needed — bring the idea, opportunity or problem you would like to explore.
          </p>
        </div>

        <aside className={styles.bookingColumn} aria-label="Book an introductory conversation">
          <BookingGate recaptchaSiteKey={recaptchaSiteKey} />
        </aside>
      </section>
    </main>
  );
}
