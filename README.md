# HuonVision - Enterprise Operational Strategy & AI Platform

Welcome to the **HuonVision** codebase! HuonVision is a high-performance Next.js 16 / TypeScript / Tailwind CSS enterprise platform designed for green operational strategy, autonomous AI innovation, and solutions catalog management.

---

## 🌐 Live Deployment

- **Storefront URL**: [https://huovision.brickservers.ng/](https://huovision.brickservers.ng/)
- **Admin Control Panel**: [https://huovision.brickservers.ng/admin](https://huovision.brickservers.ng/admin)
- **Direct Origin Host**: `184.192.242.60` (`my-ec2`)

---

## 🎨 HuonVision Frontend Architecture

The frontend accurately clones and enhances the design system, copy, and visual identity from [HuonVision](https://www.huonvision.com/):

- **6 Strategic Capability Pillars**:
  1. *01 Retail Strategy* — Consumer behavior analytics, dynamic merchandising, omnichannel fulfillment.
  2. *02 Manufacturing & Industrial* — Smart plant orchestration, robotic process automation, edge IoT.
  3. *03 Utilities & Infrastructure* — Technical precision engineering, predictive grid maintenance.
  4. *04 Office & Corporate Staffing* — Workforce optimization, executive talent matching, agile squad formation.
  5. *05 Green Operational Strategy* — Decarbonization roadmaps, circular resource efficiency, carbon tracking.
  6. *06 AI & Autonomous Innovation* — Custom LLM agents, predictive forecasting, neural process automation.
- **Components**:
  - `src/components/Navbar.tsx`: HuonVision responsive navigation, capability dropdowns, solutions catalog link, and consultation CTA.
  - `src/components/Footer.tsx`: Dark-mode footer with capability matrix, legal disclosures, and direct contact (`hello@huonvision.com`).
  - `src/components/ConsultationForm.tsx`: Interactive consultation request modal with time slot selection and capability targeting.
  - `src/app/[lang]/page.tsx`: Dynamic storefront integrating the hero, industries marquee, 6 capability cards, deep-dive strategies, solutions pricing tiers, and database catalog.
  - `src/app/globals.css`: HuonVision dark-mode theme, glassmorphic card stylings, and emerald/slate accents.

---

## 🏗️ Server Architecture on `my-ec2`

The application runs in coexistence with other virtual hosts on the EC2 server without interfering with existing services (`brickfarms.ng`, etc.):

- **Next.js Engine**: Managed by **PM2** (`app name: huonvision`) listening on `127.0.0.1:3000`.
- **Database**: **MongoDB 7.0** running in Docker container `huonvision-mongo` on `127.0.0.1:27017` with authentication.
- **Web Server / Reverse Proxy**: **Bitnami Apache** proxying HTTP (`*:80`) and HTTPS (`*:443`) traffic with WebSocket support to PM2.
- **DNS & CDN**: Cloudflare proxy forwarding to origin `184.192.242.60`.

### Remote Paths on `my-ec2`:
- **Application Code**: `/opt/bitnami/apache2/htdocs/huonvision`
- **Apache HTTP Vhost**: `/opt/bitnami/apache2/conf/vhosts/huovision.brickservers.ng.conf`
- **Apache HTTPS Vhost**: `/opt/bitnami/apache2/conf/vhosts/huovision.brickservers.ng-https.conf`

---

## 🔐 Credentials & Administration

### Admin Dashboard Access:
- **Login URL**: [https://huovision.brickservers.ng/admin](https://huovision.brickservers.ng/admin)
- **Username**: `huonadmin`
- **Email**: `admin@huonvision.com`
- **Initial Password**: `HuonVision2026!` *(Change upon first login in Admin Settings)*

### Database Connection:
```env
MONGODB_URI=mongodb://SnapShop:SnapShop123456@127.0.0.1:27017/snapshop?authSource=admin
```

---

## 🚀 One-Click Future Deployments

When you make changes to the local codebase, you can deploy them directly to `my-ec2` with a single command:

### From Windows (PowerShell):
```powershell
.\deploy-ec2.ps1
```

### From Linux / WSL / macOS:
```bash
./deploy-ec2.sh
```

These scripts package the codebase (excluding `node_modules` and `.next`), upload the archive to `my-ec2`, run `npm run build`, and hot-reload the PM2 cluster with zero downtime.

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the storefront locally.
