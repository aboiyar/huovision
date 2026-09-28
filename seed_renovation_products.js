const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://SnapShop:SnapShop123456@127.0.0.1:27017/HuonVision?authSource=admin";

const categories = [
  { name: "Roofing", slug: "roofing" },
  { name: "Flooring", slug: "flooring" },
  { name: "Windows & Doors", slug: "windows-doors" },
  { name: "Paints & Finishes", slug: "paints-finishes" },
  { name: "Kitchen & Bath", slug: "kitchen-bath" },
  { name: "Furniture", slug: "furniture" },
  { name: "Lighting & Electrical", slug: "lighting-electrical" },
  { name: "Cabinetry", slug: "cabinetry" }
];

const products = [
  {
    name: "GAF Timberline HDZ Architectural Roofing Shingles",
    description: "North America's #1-selling shingle. Features LayerLock Technology and StrikeZone nailing area for high wind resistance and Dura Grip sealant for exceptional blow-off protection against up to 130 mph winds.",
    price: 42.50,
    salePrice: 38.99,
    images: ["/images/products/gaf-timberline-hdz-shingles.jpg"],
    category: "Roofing",
    brand: "GAF",
    sizes: ["Bundle (32.8 sq ft)"],
    colors: ["Charcoal", "Pewter Gray", "Weathered Wood"],
    stock: 450,
    ratings: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Owens Corning TruDefinition Duration Architectural Shingles",
    description: "Engineered with patented SureNail Technology, offering dramatic color contrast and dimensional depth with Triple Layer Protection and 130-MPH wind warranty protection.",
    price: 48.00,
    images: ["/images/products/owens-corning-duration-shingles.jpg"],
    category: "Roofing",
    brand: "Owens Corning",
    sizes: ["Bundle (32.8 sq ft)"],
    colors: ["Onyx Black", "Estate Gray", "Teak"],
    stock: 320,
    ratings: 4.8,
    reviewsCount: 94,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Shaw Floors Floorté Pro Luxury Waterproof Vinyl Plank",
    description: "Commercial-grade 100% waterproof rigid core luxury vinyl flooring with integrated acoustic pad. Exceptional scratch, stain, and dent resistance for active remodeling and heavy traffic.",
    price: 68.99,
    salePrice: 59.99,
    images: ["/images/products/shaw-floorte-vinyl-plank.jpg"],
    category: "Flooring",
    brand: "Shaw Floors",
    sizes: ["Case (23.64 sq ft)"],
    colors: ["Warm Oak", "Smoked Gray", "Toasted Chestnut"],
    stock: 180,
    ratings: 4.9,
    reviewsCount: 86,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Bruce American Vintage Scraped Solid Oak Hardwood",
    description: "Hand-crafted 3/4-inch solid Appalachian white oak flooring featuring authentic artisanal hand-scraping, pillowed edges, and Dura-Luster Plus finish for enduring warmth and elegance.",
    price: 112.50,
    images: ["/images/products/bruce-hardwood-flooring.jpg"],
    category: "Flooring",
    brand: "Bruce",
    sizes: ["Carton (20 sq ft)"],
    colors: ["Natural White Oak", "Warm Honey", "Espresso"],
    stock: 95,
    ratings: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Daltile Restore Bright White Ceramic Subway Tile",
    description: "Classic 3 in. x 6 in. glossy white ceramic subway wall tile with built-in spacer lugs. Ideal for kitchen backsplashes, shower surrounds, and timeless bathroom renovation projects.",
    price: 22.95,
    images: ["/images/products/daltile-subway-tile.jpg"],
    category: "Flooring",
    brand: "Daltile",
    sizes: ["Case (12.5 sq ft)"],
    colors: ["Bright White Gloss", "Matte White", "Biscuit"],
    stock: 240,
    ratings: 4.8,
    reviewsCount: 115,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Andersen 400 Series Tilt-Wash Double-Hung Window",
    description: "Andersen's best-selling double-hung window with Perma-Shield vinyl exterior cladding for low maintenance, High-Performance Low-E4 insulating glass, and natural pine interior.",
    price: 385.00,
    salePrice: 349.00,
    images: ["/images/products/andersen-400-series-window.jpg"],
    category: "Windows & Doors",
    brand: "Andersen Windows",
    sizes: ["28 x 54 in", "32 x 60 in", "36 x 60 in"],
    colors: ["White Clad", "Dark Bronze", "Black Clad"],
    stock: 40,
    ratings: 4.9,
    reviewsCount: 74,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Pella Impervia Black Fiberglass Casement Window",
    description: "Made with Pella's proprietary five-layer fiberglass composite that withstands extreme heat and sub-zero cold. Sleek modern black profiles with smooth fold-down crank hardware.",
    price: 420.00,
    images: ["/images/products/pella-impervia-casement.jpg"],
    category: "Windows & Doors",
    brand: "Pella",
    sizes: ["24 x 48 in", "30 x 60 in"],
    colors: ["Matte Black", "Morning Sky Gray", "White"],
    stock: 35,
    ratings: 4.8,
    reviewsCount: 38,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Therma-Tru Smooth-Star 3-Lite Fiberglass Entry Door",
    description: "Premium smooth fiberglass front entry door with insulated composite core that won't dent, rot or rust. Features modern 3-lite frosted glass panels and weather-tight threshold.",
    price: 640.00,
    images: ["/images/products/therma-tru-entry-door.jpg"],
    category: "Windows & Doors",
    brand: "Therma-Tru",
    sizes: ["36 x 80 in Right Hand", "36 x 80 in Left Hand"],
    colors: ["Slate Gray", "Iron Ore", "Primed Ready-to-Paint"],
    stock: 20,
    ratings: 4.9,
    reviewsCount: 31,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Sherwin-Williams Emerald Interior Acrylic Latex Paint",
    description: "Top-tier ultra-durable paint & primer in one with advanced stain blocking technology and antimicrobial agents that inhibit mold and mildew growth. Exceptional washable matte finish.",
    price: 78.99,
    salePrice: 69.99,
    images: ["/images/products/sherwin-williams-emerald-paint.jpg"],
    category: "Paints & Finishes",
    brand: "Sherwin-Williams",
    sizes: ["1 Gallon", "5 Gallon"],
    colors: ["Pure White", "Repose Gray", "Naval Blue", "Sea Salt"],
    stock: 150,
    ratings: 4.9,
    reviewsCount: 164,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Benjamin Moore Regal Select Interior Eggshell Paint",
    description: "Premium zero-VOC interior acrylic paint engineered with Gennex Color Technology. Delivers rich, fade-resistant color depth and flawless, uniform coverage with excellent hide.",
    price: 74.99,
    images: ["/images/products/benjamin-moore-regal-paint.jpg"],
    category: "Paints & Finishes",
    brand: "Benjamin Moore",
    sizes: ["1 Gallon"],
    colors: ["Hale Navy", "Chantilly Lace", "Revere Pewter"],
    stock: 120,
    ratings: 4.8,
    reviewsCount: 89,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Behr Dynasty Interior Stain-Blocking Paint & Primer",
    description: "Behr's most advanced one-coat hide interior paint with remarkable scuff defense and stain repellent technology. Fast drying 100% acrylic formula.",
    price: 59.98,
    images: ["/images/products/behr-dynasty-paint.jpg"],
    category: "Paints & Finishes",
    brand: "Behr",
    sizes: ["1 Gallon"],
    colors: ["Blank Canvas", "Cracked Pepper", "Swiss Coffee"],
    stock: 110,
    ratings: 4.7,
    reviewsCount: 56,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Kohler Artifacts Gentleman's Single-Hole Bathroom Faucet",
    description: "Vintage Edwardian elegance re-imagined. Solid brass construction with ceramic disc valves, finished in vibrant brushed moderne brass with lever handle.",
    price: 585.00,
    salePrice: 519.00,
    images: ["/images/products/kohler-artifacts-faucet.jpg"],
    category: "Kitchen & Bath",
    brand: "Kohler",
    sizes: ["Standard Single Hole"],
    colors: ["Vibrant Brushed Moderne Brass", "Polished Chrome", "Oil-Rubbed Bronze"],
    stock: 25,
    ratings: 4.9,
    reviewsCount: 47,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Kohler Whitehaven 36-Inch Enameled Cast Iron Apron-Front Sink",
    description: "Ultra-durable enameled cast iron farmhouse apron-front kitchen sink that resists chipping, cracking, or burning. Features a self-trimming apron design for seamless retrofit.",
    price: 1150.00,
    images: ["/images/products/kohler-farmhouse-sink.jpg"],
    category: "Kitchen & Bath",
    brand: "Kohler",
    sizes: ["36 x 21-9/16 x 9-5/8 in"],
    colors: ["White Enamel", "Black Black", "Sea Salt"],
    stock: 18,
    ratings: 4.9,
    reviewsCount: 63,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Moen Align MotionSense Wave Pull-Down Kitchen Faucet",
    description: "Hands-free touchless activation with single-sensor MotionSense Wave technology. Features Power Clean spray technology that provides 50 percent more spray power.",
    price: 395.00,
    images: ["/images/products/moen-align-kitchen-faucet.jpg"],
    category: "Kitchen & Bath",
    brand: "Moen",
    sizes: ["Single Hole Deck Mount"],
    colors: ["Matte Black", "Spot Resist Stainless", "Chrome"],
    stock: 35,
    ratings: 4.8,
    reviewsCount: 52,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Delta Vero Monitor 17 Series Dual-Function Shower Trim System",
    description: "Crisp modernist European styling with dual-function thermostatic cartridge for separate volume and water temperature control, with Touch-Clean spray holes.",
    price: 460.00,
    images: ["/images/products/delta-shower-system.jpg"],
    category: "Kitchen & Bath",
    brand: "Delta Faucet",
    sizes: ["Universal Wall Mount"],
    colors: ["Brushed Nickel", "Matte Black", "Chrome"],
    stock: 22,
    ratings: 4.7,
    reviewsCount: 29,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "West Elm Harmony 3-Piece Modular Sectional Sofa",
    description: "The ultimate plush comfort sofa. Extra deep, down-blend cushions with high-resiliency foam core, hand-upholstered in performance chenille on solid kiln-dried wood frame.",
    price: 2499.00,
    salePrice: 2199.00,
    images: ["/images/products/west-elm-harmony-sectional.jpg"],
    category: "Furniture",
    brand: "West Elm",
    sizes: ["118 x 78 in L-Shape", "136 x 84 in XL"],
    colors: ["Warm White Chenille", "Storm Gray Velvet", "Sandstone"],
    stock: 15,
    ratings: 4.9,
    reviewsCount: 92,
    isFeatured: true,
    isOnSale: true,
    isAvailable: true
  },
  {
    name: "Pottery Barn York Deep Seat Slipcovered 3-Seater Sofa",
    description: "Classic coastal slipcovered comfort. Features generous deep seating, down-filled cushions, and washable Belgian linen slipcovers tailored over an eco-friendly hardwood frame.",
    price: 1999.00,
    images: ["/images/products/pottery-barn-york-sofa.jpg"],
    category: "Furniture",
    brand: "Pottery Barn",
    sizes: ["84 in Standard", "95 in Grand"],
    colors: ["Flax Belgian Linen", "White Washed Canvas", "Oatmeal"],
    stock: 12,
    ratings: 4.8,
    reviewsCount: 65,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "West Elm Haven Top-Grain Leather Sectional Sofa",
    description: "Low-slung modern silhouette wrapped in supple cognac Italian top-grain leather that burnishes beautifully with age. Deep, springy down-blend back cushions for laid-back luxury.",
    price: 3899.00,
    images: ["/images/products/west-elm-haven-sectional.jpg"],
    category: "Furniture",
    brand: "West Elm",
    sizes: ["112 x 70 in"],
    colors: ["Cognac Caramel", "Nutmeg Saddle", "Charcoal Slate"],
    stock: 8,
    ratings: 4.9,
    reviewsCount: 38,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Lutron Caséta Smart Wireless Dimmer Switch with Pico Remote",
    description: "Industry-standard smart home wall dimmer that doesn't require a neutral wire. Works with Apple HomeKit, Alexa, Google Home, and Lutron app for automated scheduling and smooth dimming.",
    price: 72.95,
    images: ["/images/products/lutron-caseta-dimmer.jpg"],
    category: "Lighting & Electrical",
    brand: "Lutron",
    sizes: ["Single Pole / Multi-Location"],
    colors: ["White", "Light Almond", "Black"],
    stock: 85,
    ratings: 4.9,
    reviewsCount: 210,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Progress Lighting Gulliver 5-Light Drum Chandelier",
    description: "Rustic coastal farmhouse 5-light open-cage drum chandelier featuring dual-toned bands of faux weathered gray wood and antique bronze metal accents.",
    price: 249.00,
    images: ["/images/products/progress-lighting-chandelier.jpg"],
    category: "Lighting & Electrical",
    brand: "Progress Lighting",
    sizes: ["21-5/8 in Dia x 25-1/2 in H"],
    colors: ["Graphite with Weathered Gray Wood", "Antique Bronze"],
    stock: 30,
    ratings: 4.8,
    reviewsCount: 54,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  },
  {
    name: "Hampton Bay Designer Assembled White Shaker Kitchen Wall Cabinet",
    description: "Fully assembled solid maple face-frame kitchen cabinet with durable white thermal-foil shaker door panels, soft-close hinges, and adjustable interior shelving.",
    price: 289.00,
    images: ["/images/products/hampton-bay-shaker-cabinets.jpg"],
    category: "Cabinetry",
    brand: "Hampton Bay",
    sizes: ["30 x 36 x 12 in", "36 x 36 x 12 in"],
    colors: ["Satin White", "Dove Gray", "Navy Blue"],
    stock: 45,
    ratings: 4.7,
    reviewsCount: 78,
    isFeatured: false,
    isOnSale: false,
    isAvailable: true
  }
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;

  // 1. Seed Categories
  console.log("Seeding categories...");
  for (const cat of categories) {
    await db.collection("categories").updateOne(
      { slug: cat.slug },
      { $set: { name: cat.name, slug: cat.slug, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 2. Clear old demo clothing products and seed fresh renovation products
  console.log("Clearing outdated/sample products...");
  await db.collection("products").deleteMany({});

  console.log(`Inserting ${products.length} home renovation & remodeling products...`);
  const now = new Date();
  const docs = products.map((p, idx) => ({
    ...p,
    createdAt: new Date(now.getTime() - (products.length - idx) * 3600000),
    updatedAt: now
  }));

  const res = await db.collection("products").insertMany(docs);
  console.log(`Successfully inserted ${res.insertedCount} products!`);

  const count = await db.collection("products").countDocuments();
  console.log(`Total products in database: ${count}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. All done!");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
