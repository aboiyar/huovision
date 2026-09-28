"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useApp();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="contact" style={styles.footer}>
      <div className="container" style={styles.footerGrid}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <img 
              src="https://static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png" 
              alt="HuonVision" 
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
            />
            <h3 style={styles.logo}>HUONVISION</h3>
          </div>
          <p style={styles.text}>
            {t("Driving operational excellence through advanced engineering, sustainable practices, and AI-driven innovation across global industries.")}
          </p>
          <div style={{ marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              ● Operational Intelligence & ESG Compliance
            </span>
          </div>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Capabilities")}</h4>
          <ul style={styles.list}>
            <li><Link href="/#pillar-01" style={styles.link}>01 {t("Retail Strategy")}</Link></li>
            <li><Link href="/#pillar-02" style={styles.link}>02 {t("Manufacturing")}</Link></li>
            <li><Link href="/#pillar-03" style={styles.link}>03 {t("Utilities")}</Link></li>
            <li><Link href="/#pillar-04" style={styles.link}>04 {t("Office Staffing")}</Link></li>
            <li><Link href="/#pillar-05" style={styles.link}>05 {t("Sustainability")}</Link></li>
            <li><Link href="/#pillar-06" style={styles.link}>06 {t("AI Innovation")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Platform")}</h4>
          <ul style={styles.list}>
            <li><Link href="/#solutions" style={styles.link}>{t("Explore Solutions")}</Link></li>
            <li><Link href="/#pricing" style={styles.link}>{t("Plans & Pricing")}</Link></li>
            <li><Link href="/#green-strategy" style={styles.link}>{t("Green Strategy")}</Link></li>
            <li><Link href="/#ai-innovation" style={styles.link}>{t("AI Framework")}</Link></li>
            <li><Link href="/#consultation" style={styles.link}>{t("Book Consultation")}</Link></li>
            <li><Link href="/shop" style={styles.link}>{t("Solutions Catalog")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Connect")}</h4>
          <p style={styles.text}>
            <strong>{t("Email")}:</strong> <a href="mailto:hello@huonvision.com" style={{ color: "#34d399", textDecoration: "none" }}>hello@huonvision.com</a>
          </p>
          <p style={styles.text}>
            <strong>{t("Consultations")}:</strong> {t("Online & Global On-Site")}
          </p>
          <p style={styles.text}>
            <strong>{t("Inquiry Desk")}:</strong> {t("24/7 Dedicated Advisory")}
          </p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} HuonVision. All rights reserved. Precision Engineering & Strategic Transformation.</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "60px 0 30px",
    marginTop: "80px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "clamp(24px, 4vw, 40px)",
  },
  logo: {
    fontFamily: "var(--font-sans)",
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "16px",
  },
  text: {
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#aaaaaa",
    fontSize: "14px",
    display: "inline-block",
    marginBottom: "12px",
    transition: "color 0.2s ease",
  },
  bottom: {
    borderTop: "1px solid #222222",
    marginTop: "40px",
    paddingTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#666666",
  },
};
