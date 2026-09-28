const mongoose = require("/opt/bitnami/apache2/htdocs/huonvision/node_modules/mongoose");
const bcrypt = require("/opt/bitnami/apache2/htdocs/huonvision/node_modules/bcryptjs");

const uri = "mongodb://SnapShop:SnapShop123456@127.0.0.1:27017/snapshop?authSource=admin";

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const usersCol = mongoose.connection.db.collection("users");
  const existing = await usersCol.findOne({ email: "admin@huonvision.com" });
  if (existing) {
    console.log("Admin user already exists");
  } else {
    const hashedPassword = await bcrypt.hash("HuonVision2026!", 10);
    await usersCol.insertOne({
      username: "huonadmin",
      email: "admin@huonvision.com",
      password: hashedPassword,
      passwordSet: true,
      provider: "credentials",
      role: "admin",
      phone: "+1 (555) 019-2834",
      bio: "HuonVision Platform Administrator",
      avatar: "",
      preferredCurrency: "USD",
      theme: "dark",
      newsletter: true,
      orderUpdates: true,
      promotionalOffers: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Created admin user huonadmin / admin@huonvision.com");
  }

  const settingsCol = mongoose.connection.db.collection("generalsettings");
  const existingSettings = await settingsCol.findOne({});
  if (!existingSettings) {
    await settingsCol.insertOne({
      storeName: "HuonVision",
      websiteLink: "https://huovision.brickservers.ng",
      storeEmail: "admin@huonvision.com",
      phone: "+1 (555) 019-2834",
      address: "HuonVision Global HQ, Tech District",
      currency: "USD",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Created GeneralSettings");
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
