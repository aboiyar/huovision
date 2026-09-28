import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";
import dbConnect from "@/lib/db";
import Translation from "@/models/Translation";
import User from "@/models/User";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.storeName || "HuonVision";
  return {
    title: {
      default: `${name} | Green Operational Strategy & AI Innovation`,
      template: `%s - ${name}`,
    },
    description: settings.heroSubtitle || "Driving operational excellence through advanced engineering, sustainable practices, and AI-driven innovation across global industries.",
    icons: {
      icon: settings.faviconUrl || "https://static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png",
    },
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  
  // Check if system is installed
  await dbConnect();
  let needsInstall = false;
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      needsInstall = true;
    }
  } catch (error) {
    // If DB fails, assume not installed
    needsInstall = true;
  }

  if (needsInstall) {
    redirect("/install");
  }

  const settings = await getSettings();

  // Load translations for the active storefront locale
  const translationsRaw = await Translation.find({});
  const translationsMap: Record<string, string> = {};
  
  translationsRaw.forEach((item: any) => {
    let val = "";
    if (typeof item.translations?.get === "function") {
      val = item.translations.get(lang);
    } else if (item.translations) {
      val = item.translations[lang];
    }
    
    // Fallback to English value, then key itself if missing
    translationsMap[item.key] = val || item.translations?.get?.("en") || item.translations?.["en"] || item.key;
  });

  // RTL support for specific languages (e.g. ar = Arabic)
  const isRtl = ["ar", "he", "fa", "ur"].includes(lang?.toLowerCase());
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <AppProvider initialTranslations={translationsMap}>
        <Navbar />
        {children}
        <Footer />
      </AppProvider>
    </div>
  );
}
