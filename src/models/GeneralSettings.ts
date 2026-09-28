import mongoose, { Schema, model, models } from "mongoose";

const GeneralSettingsSchema = new Schema(
  {
    storeName: { type: String, default: "HuonVision" },
    storeEmail: { type: String, default: "hello@huonvision.com" },
    websiteLink: { type: String, default: "huonvision.com" },
    logoUrl: { type: String, default: "https://static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png" },
    faviconUrl: { type: String, default: "https://static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png" },
    currency: { type: String, default: "$" },
    shippingCost: { type: Number, default: 0 },
    promoCode: { type: String, default: "HUON2026" },
    promoDiscount: { type: Number, default: 15 },
    heroTitle: { type: String, default: "Green Operational Strategy & AI Innovation" },
    heroSubtitle: { type: String, default: "Driving operational excellence through advanced engineering, sustainable practices, and AI-driven innovation across global industries." },
    heroImageUrl: { type: String, default: "https://static.wixstatic.com/media/88a5c5_9fcd9695dedb4968b36eceb32fa35630~mv2.png" },
    heroCountdownDate: { type: Date, default: () => new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
    storeCountry: { type: String, default: "Morocco" },
    activeZones: { type: [String], default: ["Worldwide"] },
    shippingPolicy: { 
      type: String, 
      default: "We offer fast and reliable shipping to all locations. Orders are typically processed within 1-2 business days and delivered within 3-5 business days." 
    },
    returnsPolicy: { 
      type: String, 
      default: "We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging with tags attached." 
    },
    sizeGuideContent: { 
      type: String, 
      default: "How to Measure:\n- Bust/Chest: Measure around the fullest part of your bust, keeping the tape level.\n- Waist: Measure around your natural waistline, which is the narrowest part of your waist.\n- Hips: Measure around the fullest part of your hips, approximately 7-8 inches below your waist." 
    },
    productUrlFormat: {
      type: String,
      enum: ["id", "slug"],
      default: "slug",
    },
  },
  { timestamps: true }
);

if (models.GeneralSettings) {
  delete models.GeneralSettings;
}

const GeneralSettings = model("GeneralSettings", GeneralSettingsSchema);

export default GeneralSettings;
