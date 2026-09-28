export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getSettings } from "@/lib/settings";
import Translation from "@/models/Translation";
import ConsultationForm from "@/components/ConsultationForm";
import { 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Cpu, 
  BarChart3, 
  Factory, 
  Zap, 
  Users, 
  Globe2, 
  ShieldCheck, 
  Mail, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

async function getHomeData() {
  try {
    await dbConnect();
    const settings = await getSettings();

    const featuredProducts = await Product.find({ isFeatured: true, isAvailable: true }).limit(8);
    const popularProducts = await Product.find({ isAvailable: true }).sort({ ratings: -1, reviewsCount: -1 }).limit(8);
    const newArrivals = await Product.find({ isAvailable: true }).sort({ createdAt: -1 }).limit(8);
    const categoriesRaw = await Category.find({});
    
    const categoriesWithProducts = [];
    for (const cat of categoriesRaw) {
      const latestProduct = await Product.findOne({ 
        category: { $regex: new RegExp(`^${cat.slug}$`, 'i') }, 
        isAvailable: true 
      }).sort({ createdAt: -1 });

      if (latestProduct) {
        categoriesWithProducts.push({
          ...cat.toObject(),
          imageUrl: latestProduct.images && latestProduct.images.length > 0 ? latestProduct.images[0] : "",
        });
      }
    }

    return {
      settings: JSON.parse(JSON.stringify(settings)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      popularProducts: JSON.parse(JSON.stringify(popularProducts)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      categories: JSON.parse(JSON.stringify(categoriesWithProducts)),
    };
  } catch (e) {
    console.error("Failed to load home data:", e);
    return {
      settings: {
        storeName: "HuonVision",
        heroTitle: "Green Operational Strategy & AI Innovation",
        heroSubtitle: "Driving operational excellence through advanced engineering, sustainable practices, and AI-driven innovation across global industries.",
        heroImageUrl: "https://static.wixstatic.com/media/88a5c5_9fcd9695dedb4968b36eceb32fa35630~mv2.png",
        currency: "$",
      },
      featuredProducts: [],
      popularProducts: [],
      newArrivals: [],
      categories: [],
    };
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { settings, featuredProducts, popularProducts, newArrivals, categories } = await getHomeData();

  // Load translations matching current locale
  let translationsRaw: any[] = [];
  try {
    translationsRaw = await Translation.find({});
  } catch (e) {
    // Ignore db fallback
  }

  const t = (key: string): string => {
    const item = translationsRaw.find((item: any) => item.key === key);
    if (!item) return key;
    let val = "";
    if (typeof item.translations?.get === "function") {
      val = item.translations.get(lang);
    } else if (item.translations) {
      val = item.translations[lang];
    }
    return val || item.translations?.get?.("en") || item.translations?.["en"] || key;
  };

  const getProductLink = (p: any) => {
    if (settings.productUrlFormat !== "id" && p.slug) {
      return `/${lang}/product/${p.slug}`;
    }
    return `/${lang}/product/${p._id || p.id}`;
  };

  // Default solutions showcase if store catalog is empty
  const defaultSolutions = [
    {
      _id: "sol-1",
      name: "Enterprise AI Workflow & Automation Sprint",
      category: "AI Innovation",
      price: 4500,
      description: "Custom machine learning pipeline integration, predictive analytics, and automated decision-making for complex enterprise operations.",
      features: ["Custom Neural Agent Architecture", "Real-Time Telemetry Dashboard", "Legacy ERP Integration", "30-Day Deployment"],
      badge: "High Demand"
    },
    {
      _id: "sol-2",
      name: "Green Operational & Decarbonization Audit",
      category: "Sustainability",
      price: 5800,
      description: "End-to-end operational carbon footprint assessment, compliance roadmap with global ESG standards, and energy efficiency optimization.",
      features: ["ISO 14001 Benchmark Report", "Circular Supply Chain Model", "Scope 1-3 Emissions Analysis", "Executive Roadmap"],
      badge: "ESG Certified"
    },
    {
      _id: "sol-3",
      name: "Retail Supply Chain & Inventory Optimization",
      category: "Retail Strategy",
      price: 3900,
      description: "Advanced demand forecasting, warehouse automation planning, and stock volatility reduction across omni-channel retail networks.",
      features: ["Dynamic Replenishment Algorithms", "Inventory Turnover Acceleration", "Multi-Warehouse Sync", "Vendor SLAs"],
      badge: "ROI Focused"
    },
    {
      _id: "sol-4",
      name: "Critical Utilities & Infrastructure Architecture",
      category: "Utilities",
      price: 6400,
      description: "Technical precision engineering, predictive grid maintenance, and regulatory compliance for power, water, and telecom infrastructure.",
      features: ["SCADA / IoT Architecture", "Failure Risk Modeling", "24/7 Resilience Review", "Environmental Risk Audit"],
      badge: "Mission Critical"
    }
  ];

  const displaySolutions = featuredProducts.length > 0 ? featuredProducts : defaultSolutions;

  const capabilities = [
    {
      id: "pillar-01",
      num: "01",
      title: "Retail Strategy",
      icon: BarChart3,
      tag: "Supply Chain & Inventory",
      desc: "Optimizing supply chains and inventory management to ensure peak efficiency and customer satisfaction in dynamic retail environments.",
      bullets: [
        "Predictive stock-level modeling & demand velocity tracking",
        "Omni-channel distribution synchronization & fulfillment routing",
        "Vendor performance analytics and lead-time shrinkage"
      ]
    },
    {
      id: "pillar-02",
      num: "02",
      title: "Manufacturing",
      icon: Factory,
      tag: "Advanced Engineering",
      desc: "Driving operational excellence through advanced engineering and AI-driven innovation in complex manufacturing and production systems.",
      bullets: [
        "Digital twin modeling and production line throughput tuning",
        "Predictive equipment maintenance reducing unplanned downtime",
        "Quality assurance computer vision inspection architectures"
      ]
    },
    {
      id: "pillar-03",
      num: "03",
      title: "Utilities",
      icon: Zap,
      tag: "Critical Infrastructure",
      desc: "Ensuring technical precision and sustainable operations for critical infrastructure, adapting to shifting economic conditions and environmental demands.",
      bullets: [
        "Smart grid telemetry and load balancing distribution analysis",
        "Water & energy resource allocation optimization",
        "Regulatory compliance with strict safety and uptime standards"
      ]
    },
    {
      id: "pillar-04",
      num: "04",
      title: "Office Staffing",
      icon: Users,
      tag: "Workforce Architecture",
      desc: "Strategic workforce planning and talent acquisition solutions designed to support long-term business growth and organizational stability.",
      bullets: [
        "Data-driven capability gap analysis & succession architecture",
        "Cross-functional operational squad design and enablement",
        "Retention, performance metrics, and modern leadership alignment"
      ]
    },
    {
      id: "pillar-05",
      num: "05",
      title: "Sustainability",
      icon: Leaf,
      tag: "ESG & Decarbonization",
      desc: "Integrating environmental responsibility into core operations, ensuring long-term viability and compliance with global standards.",
      bullets: [
        "Complete Scope 1, 2, and 3 emission transparency models",
        "Circular resource recovery and packaging lifecycle audits",
        "Renewable energy integration and ESG investment readiness"
      ]
    },
    {
      id: "pillar-06",
      num: "06",
      title: "AI Innovation",
      icon: Cpu,
      tag: "Enterprise Automation",
      desc: "Implementing advanced artificial intelligence to automate processes and drive data-driven decision-making across all sectors.",
      bullets: [
        "Domain-specific LLMs & autonomous agent workflows",
        "Real-time operational anomaly detection & adaptive alerts",
        "Enterprise data orchestration with end-to-end compliance"
      ]
    }
  ];

  const industries = [
    "Telecommunications",
    "Retail",
    "Transportation & Logistics",
    "Wholesale & Distribution",
    "E-commerce & Online Retail",
    "Entertainment & Leisure",
    "Critical Utilities",
    "Industrial Manufacturing"
  ];

  const pricingTiers = [
    {
      name: "Strategic Assessment",
      price: "2,500",
      period: "per assessment",
      desc: "Targeted operational and sustainability diagnostic for emerging organizations and mid-market departments.",
      features: [
        "Comprehensive 360° Operational Audit",
        "Current ESG & Carbon Footprint Benchmark",
        "AI Automation Opportunity Heatmap",
        "Executive Advisory Deliverable & Debrief",
        "Initial 30-Day Implementation Roadmap"
      ],
      cta: "Schedule Assessment",
      popular: false
    },
    {
      name: "Growth Acceleration",
      price: "6,500",
      period: "per month",
      desc: "Hands-on implementation sprint integrating AI workflows, supply chain efficiency, and sustainable practices.",
      features: [
        "Full Capability Pillar Integration (Any 2 Pillars)",
        "Custom Machine Learning Pipeline Deployment",
        "Supply Chain & Inventory Velocity Optimization",
        "Dedicated Principal Technical Consultant",
        "Bi-weekly Executive Strategy Reviews",
        "24/7 Advisory Desk Access"
      ],
      cta: "Launch Acceleration",
      popular: true
    },
    {
      name: "Enterprise Transformation",
      price: "15,000",
      period: "per month",
      desc: "Comprehensive cross-facility operational overhaul, bespoke enterprise AI models, and continuous ESG governance.",
      features: [
        "All 6 Strategic Capability Pillars Included",
        "Proprietary Autonomous Decision Agent Network",
        "Full Scope Decarbonization & Global Compliance",
        "Dedicated Multi-Disciplinary Advisory Squad",
        "Executive Board Reporting & C-Suite Advisory",
        "Guaranteed 99.8% SLA & Incident Command"
      ],
      cta: "Inquire Enterprise Plan",
      popular: false
    }
  ];

  return (
    <main className="huon-main">
      {/* ===================== HERO SECTION (EXACT HUONVISION DESIGN) ===================== */}
      <section className="hv-exact-hero">
        <div className="hv-exact-hero-inner">
          <div className="hv-exact-hero-text">
            <h1 className="hv-exact-hero-title">
              HuonVision
            </h1>

            <p className="hv-exact-hero-subtitle">
              Visionary Solutions for Operational Excellence
            </p>

            <div className="hv-exact-hero-actions">
              <a href="#solutions" className="hv-exact-hero-btn">
                Explore Solutions
              </a>
            </div>
          </div>

          {/* Centered Iridescent Sphere Floating Centerpiece */}
          <div className="hv-exact-hero-bubble-box">
            <img
              src="/huonvision-sphere.jpg"
              alt="HuonVision Iridescent Sphere"
              className="hv-exact-hero-bubble-img"
            />
          </div>
        </div>
      </section>


      {/* ===================== INDUSTRIES MARQUEE ===================== */}
      <section className="huon-industries">
        <div className="container">
          <p className="huon-industries-title">
            DELIVERING MISSION-CRITICAL TRANSFORMATION ACROSS CORE SECTORS
          </p>
          <div className="huon-industries-grid">
            {industries.map((ind, i) => (
              <div key={i} className="huon-industry-pill">
                <CheckCircle2 size={15} className="huon-pill-icon" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STRATEGIC CAPABILITIES (01 - 06) ===================== */}
      <section id="capabilities" className="huon-section huon-capabilities-section">
        <div className="container">
          <div className="huon-section-header">
            <span className="huon-section-kicker">CORE METHODOLOGY</span>
            <h2 className="huon-section-title">Strategic Capabilities</h2>
            <p className="huon-section-desc">
              Six foundational pillars engineered to modernize industrial operations, maximize resource efficiency, and embed intelligent autonomy.
            </p>
          </div>

          <div className="huon-capabilities-grid">
            {capabilities.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div key={cap.id} id={cap.id} className="huon-cap-card">
                  <div className="huon-cap-top">
                    <span className="huon-cap-num">{cap.num}</span>
                    <div className="huon-cap-icon-box">
                      <IconComp size={24} />
                    </div>
                  </div>

                  <span className="huon-cap-tag">{cap.tag}</span>
                  <h3 className="huon-cap-title">{cap.title}</h3>
                  <p className="huon-cap-desc">{cap.desc}</p>

                  <ul className="huon-cap-bullets">
                    {cap.bullets.map((b, bi) => (
                      <li key={bi} className="huon-cap-bullet">
                        <ChevronRight size={14} className="huon-bullet-arrow" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="huon-cap-footer">
                    <a href="#consultation" className="huon-cap-link">
                      Consult with Advisory <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== DEEP DIVE: GREEN OPERATIONAL STRATEGY ===================== */}
      <section id="green-strategy" className="huon-section huon-deepdive huon-deepdive-green">
        <div className="container huon-deepdive-grid">
          <div className="huon-deepdive-visual">
            <div className="huon-deepdive-img-frame">
              <img
                src="https://static.wixstatic.com/media/88a5c5_9e45027c95ad4b68b7b69f30ce4527ac~mv2.jpg"
                alt="Green Operational Strategy"
                className="huon-deepdive-img"
              />
              <div className="huon-deepdive-badge-float">
                <Leaf size={18} className="text-emerald-400" />
                <div>
                  <strong>Zero-Waste Paradigm</strong>
                  <span>Circularity &amp; Carbon Accounting</span>
                </div>
              </div>
            </div>
          </div>

          <div className="huon-deepdive-text">
            <span className="huon-section-kicker">SUSTAINABILITY EXCELLENCE</span>
            <h2 className="huon-section-title">Green Operational Strategy</h2>
            <p className="huon-deepdive-lead">
              Integrating environmental responsibility into core operations, ensuring long-term viability, cost minimization, and compliance with rigorous global standards.
            </p>
            
            <div className="huon-deepdive-points">
              <div className="huon-point-item">
                <div className="huon-point-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h4>Regulatory Compliance &amp; ESG Audits</h4>
                  <p>Seamless alignment with European CSRD, SEC ESG disclosures, and international ISO 14001 environmental benchmarks.</p>
                </div>
              </div>

              <div className="huon-point-item">
                <div className="huon-point-icon"><TrendingUp size={20} /></div>
                <div>
                  <h4>Decarbonization with Provable ROI</h4>
                  <p>Transforming sustainability from a cost center into an operational lever by minimizing raw material waste and energy leakage.</p>
                </div>
              </div>

              <div className="huon-point-item">
                <div className="huon-point-icon"><Globe2 size={20} /></div>
                <div>
                  <h4>Resilient Circular Supply Networks</h4>
                  <p>Structuring supply logistics around low-carbon transport corridors and closed-loop material reintroduction.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "32px" }}>
              <a href="#consultation" className="huon-btn huon-btn-primary">
                Inquire on Green Strategy <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DEEP DIVE: AI & INNOVATION ===================== */}
      <section id="ai-innovation" className="huon-section huon-deepdive huon-deepdive-ai">
        <div className="container huon-deepdive-grid huon-deepdive-reverse">
          <div className="huon-deepdive-text">
            <span className="huon-section-kicker">NEXT-GEN INTELLIGENCE</span>
            <h2 className="huon-section-title">AI &amp; Autonomous Innovation</h2>
            <p className="huon-deepdive-lead">
              Implementing cutting-edge artificial intelligence to eliminate bottlenecks, automate intricate workflows, and power real-time data-driven decision-making across all enterprise sectors.
            </p>

            <div className="huon-deepdive-points">
              <div className="huon-point-item">
                <div className="huon-point-icon"><Cpu size={20} /></div>
                <div>
                  <h4>Autonomous Workflow Orchestration</h4>
                  <p>Multi-agent AI architectures that coordinate cross-departmental operations with microsecond response times and auditability.</p>
                </div>
              </div>

              <div className="huon-point-item">
                <div className="huon-point-icon"><BarChart3 size={20} /></div>
                <div>
                  <h4>Predictive Telemetry &amp; Demand Forecasting</h4>
                  <p>Self-calibrating neural forecasting models that anticipate demand surges, supply disruptions, and machinery strain.</p>
                </div>
              </div>

              <div className="huon-point-item">
                <div className="huon-point-icon"><Award size={20} /></div>
                <div>
                  <h4>Enterprise Data Governance &amp; Security</h4>
                  <p>Isolated fine-tuned models operating inside your sovereign infrastructure without external telemetry exposure.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "32px" }}>
              <a href="#consultation" className="huon-btn huon-btn-primary">
                Request AI Advisory <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="huon-deepdive-visual">
            <div className="huon-ai-console">
              <div className="huon-console-header">
                <span className="huon-console-title">Autonomous Execution Engine</span>
                <span className="huon-console-pill">ONLINE</span>
              </div>
              <div className="huon-console-body">
                <div className="console-line"><span className="text-emerald-400">SYS_INIT:</span> Neural orchestration pipeline loaded.</div>
                <div className="console-line"><span className="text-cyan-400">TELEMETRY:</span> Ingesting 2.4M sensory signals across 14 facilities.</div>
                <div className="console-line"><span className="text-yellow-400">ANOMALY_CHECK:</span> Variance &lt; 0.02% (Optimal baseline).</div>
                <div className="console-line"><span className="text-emerald-400">OPTIMIZATION:</span> Automated supply routing saved 3,420 kg CO2 today.</div>
                <div className="console-line"><span className="text-purple-400">DISPATCH:</span> Autonomous inventory replenishment queued for 04:00.</div>
              </div>
              <div className="huon-console-metrics">
                <div className="c-metric">
                  <span className="c-num">99.98%</span>
                  <span className="c-txt">Model Confidence</span>
                </div>
                <div className="c-metric">
                  <span className="c-num">12ms</span>
                  <span className="c-txt">Inference Latency</span>
                </div>
                <div className="c-metric">
                  <span className="c-num">Zero</span>
                  <span className="c-txt">Data Leakage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED SOLUTIONS CATALOG ===================== */}
      <section id="solutions" className="huon-section huon-solutions-section">
        <div className="container">
          <div className="huon-section-header">
            <span className="huon-section-kicker">ENGAGEMENT PACKAGES</span>
            <h2 className="huon-section-title">Solutions &amp; Advisory Offerings</h2>
            <p className="huon-section-desc">
              Pre-configured advisory sprints and technical transformation packages available for immediate deployment.
            </p>
          </div>

          <div className="huon-solutions-grid">
            {displaySolutions.map((sol: any, idx: number) => {
              const solPrice = typeof sol.price === "number" ? sol.price : 4500;
              return (
                <div key={sol._id || idx} className="huon-solution-card">
                  <div className="huon-solution-head">
                    <span className="huon-sol-cat">{sol.category || "Consulting"}</span>
                    {sol.badge && <span className="huon-sol-badge">{sol.badge}</span>}
                  </div>

                  <h3 className="huon-sol-title">{sol.name}</h3>
                  <p className="huon-sol-desc">
                    {sol.description || "Comprehensive strategic blueprint and engineering implementation for enterprise teams."}
                  </p>

                  <div className="huon-sol-features">
                    {(sol.features || [
                      "Full technical architecture audit",
                      "Executive implementation roadmap",
                      "Dedicated technical partner",
                      "30-day post-delivery SLA"
                    ]).map((feat: string, fi: number) => (
                      <div key={fi} className="huon-sol-feat-item">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="huon-sol-price-row">
                    <div>
                      <span className="huon-price-curr">{settings.currency || "$"}</span>
                      <span className="huon-price-val">{solPrice.toLocaleString()}</span>
                      <span className="huon-price-period"> / package</span>
                    </div>

                    <Link href={getProductLink(sol)} className="huon-sol-btn">
                      Order Solution <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/shop" className="huon-btn huon-btn-secondary">
              View Full Solutions Catalog <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== PLANS & PRICING ===================== */}
      <section id="pricing" className="huon-section huon-pricing-section">
        <div className="container">
          <div className="huon-section-header">
            <span className="huon-section-kicker">FLEXIBLE ENGAGEMENT MODELS</span>
            <h2 className="huon-section-title">Plans &amp; Pricing</h2>
            <p className="huon-section-desc">
              Transparent enterprise retainers tailored to your organizational scale, strategic roadmap, and operational complexity.
            </p>
          </div>

          <div className="huon-pricing-grid">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`huon-pricing-card ${tier.popular ? "huon-pricing-featured" : ""}`}
              >
                {tier.popular && (
                  <div className="huon-pricing-ribbon">
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div className="huon-p-head">
                  <h3 className="huon-p-name">{tier.name}</h3>
                  <p className="huon-p-desc">{tier.desc}</p>
                </div>

                <div className="huon-p-cost">
                  <span className="huon-p-curr">{settings.currency || "$"}</span>
                  <span className="huon-p-val">{tier.price}</span>
                  <span className="huon-p-sub"> / {tier.period}</span>
                </div>

                <ul className="huon-p-list">
                  {tier.features.map((f, fi) => (
                    <li key={fi}>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="#consultation" 
                  className={`huon-p-btn ${tier.popular ? "huon-btn-primary" : "huon-btn-secondary"}`}
                >
                  {tier.cta} <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CONSULTATION & BOOKING FORM ===================== */}
      <section id="consultation" className="huon-section huon-consult-section">
        <div className="container">
          <div className="huon-consult-layout">
            <div className="huon-consult-info">
              <span className="huon-section-kicker">CONNECT WITH EXPERTISE</span>
              <h2 className="huon-section-title">Initiate Your Strategic Consultation</h2>
              <p className="huon-consult-text">
                Speak directly with HuonVision principal partners regarding your operational strategy, industrial engineering challenges, or enterprise AI deployment.
              </p>

              <div className="huon-contact-channels">
                <div className="channel-box">
                  <Mail className="channel-icon" size={20} />
                  <div>
                    <span className="channel-title">Direct Corporate Inquiries</span>
                    <a href="mailto:hello@huonvision.com" className="channel-link">hello@huonvision.com</a>
                  </div>
                </div>

                <div className="channel-box">
                  <Globe2 className="channel-icon" size={20} />
                  <div>
                    <span className="channel-title">Global Advisory Coverage</span>
                    <span className="channel-text">Worldwide On-Site Engagements &amp; Virtual Command Centers</span>
                  </div>
                </div>
              </div>

              <div className="huon-consult-guarantee">
                <ShieldCheck size={24} className="text-emerald-400" />
                <div>
                  <strong>Enterprise SLA &amp; Privacy</strong>
                  <p>All inquiries are handled under strict NDA. You will receive an initial response within 24 business hours.</p>
                </div>
              </div>
            </div>

            <div className="huon-consult-card">
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
