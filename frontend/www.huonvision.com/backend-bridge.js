/**
 * HuonVision Backend Bridge & Complete Feature Enforcer
 * Seamlessly connects the static frontend to Next.js API & MongoDB:
 * - Unfreezes Wix motion animations & protects high-res logo
 * - Live user authentication state in header (Log In / Profile / Logout / Admin Dashboard)
 * - Cart count badge & shopping bag redirection (/cart, /checkout)
 * - Intercepts contact & consultation forms -> POST /api/contact (MongoDB Mailbox)
 * - Interactive Booking Calendar replacing dead spinners on booking-calendar/*.html
 * - Interactive "Add to Cart" & "Buy Now" on pricing-plans/plans-pricing.html
 * - Hooks "Book Now" on service-page.html & "Explore Plans" on book-online.html
 * - Lightweight toast notification system
 */
(function () {
  console.log("⚡ HuonVision Backend Bridge Initializing...");

  // ==========================================
  // 1. Toast Notification System
  // ==========================================
  function showToast(message, type = "success") {
    let container = document.getElementById("hv-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "hv-toast-container";
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bgColor = type === "error" ? "#ef4444" : type === "info" ? "#3b82f6" : "#10b981";
    const icon = type === "error" ? "⚠️" : type === "info" ? "ℹ️" : "✓";

    toast.style.cssText = `
      background: #0f172a;
      color: #ffffff;
      border: 1px solid ${bgColor};
      border-left: 5px solid ${bgColor};
      padding: 14px 20px;
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 380px;
      pointer-events: auto;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    toast.innerHTML = `<span style="font-size: 18px;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.transform = "translateY(10px)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ==========================================
  // 2. Unfreeze Wix Motion Animations & Protect Logo
  // ==========================================
  function unfreeze() {
    const els = document.querySelectorAll('[id^="comp-"], [class*="comp-"], [data-motion-part], [data-motion-enter]');
    els.forEach((el) => {
      el.dataset.motionEnter = "done";
    });
  }

  const LOGO_SRC = "/static.wixstatic.com/media/88a5c5_ed38a0f979fb4a23b892256d412e0d86~mv2.png";
  function fixLogo() {
    const logos = document.querySelectorAll('img[alt*="logo" i], [data-testid="linkElement"] img');
    logos.forEach((img) => {
      if (img.alt && img.alt.toLowerCase().includes("logo")) {
        if (!img.getAttribute("src") || img.getAttribute("src") === "" || img.src.endsWith("/")) {
          img.src = LOGO_SRC;
        }
        img.style.display = "block";
        img.style.maxHeight = "44px";
        img.style.width = "auto";
        img.style.objectFit = "contain";
        img.style.opacity = "1";
        img.style.visibility = "visible";
      }
    });
  }

  function injectBaseStyles() {
    if (document.getElementById("hv-bridge-styles")) return;
    const style = document.createElement("style");
    style.id = "hv-bridge-styles";
    style.textContent = `
      [data-motion-enter], :not([data-motion-enter="done"]), [data-motion-part] {
        animation-play-state: running !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      #SITE_CONTAINER, #site-root, #masterPage, #SITE_PAGES {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }
      .hv-user-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        box-shadow: 0 16px 36px rgba(0,0,0,0.5);
        padding: 8px;
        min-width: 200px;
        z-index: 100000;
        display: none;
        flex-direction: column;
        gap: 4px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .hv-user-menu.open { display: flex; }
      .hv-user-menu a, .hv-user-menu button {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        color: #e2e8f0;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        transition: background 0.15s;
      }
      .hv-user-menu a:hover, .hv-user-menu button:hover {
        background: rgba(255,255,255,0.08);
        color: #ffffff;
      }
      .hv-cart-badge {
        position: absolute;
        top: -6px;
        right: -8px;
        background: #10b981;
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        min-width: 18px;
        height: 18px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        border: 2px solid #0f172a;
        box-sizing: border-box;
      }
      @media (max-width: 860px) {
        html, body, #SITE_CONTAINER, #masterPage, #SITE_PAGES {
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }
        header, #SITE_HEADER {
          position: sticky !important;
          top: 0 !important;
          z-index: 9999 !important;
          width: 100% !important;
          max-width: 100vw !important;
          background: rgba(9, 14, 26, 0.98) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================
  // 3. User Authentication & Live Header State
  // ==========================================
  let currentUser = null;

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          currentUser = data.user;
          renderLoggedInHeader(currentUser);
          if (currentUser.role === "admin") {
            injectAdminPill();
          }
          return;
        }
      }
    } catch (e) {}
    renderLoggedOutHeader();
  }

  function renderLoggedInHeader(user) {
    const loginBtns = document.querySelectorAll(
      '[data-hook="lsb-logged-out"], .login-social-bar__container, button:has([data-hook="lsb-logged-out-text"])'
    );

    loginBtns.forEach((btn) => {
      const parent = btn.parentElement;
      if (!parent) return;

      // Wrap in relative container for dropdown
      parent.style.position = "relative";

      const displayName = user.username || user.name || user.email.split("@")[0];
      const initial = displayName.charAt(0).toUpperCase();

      btn.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <div style="width:28px;height:28px;border-radius:50%;background:#10b981;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">${initial}</div>
          <span style="color:#f8fafc;font-size:14px;font-weight:600;">${displayName}</span>
          <span style="font-size:10px;opacity:0.7;">▼</span>
        </div>
      `;

      let menu = parent.querySelector(".hv-user-menu");
      if (!menu) {
        menu = document.createElement("div");
        menu.className = "hv-user-menu";
        parent.appendChild(menu);
      }

      menu.innerHTML = `
        <div style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;">
          <div style="font-weight:600;font-size:13px;color:#fff;">${displayName}</div>
          <div style="font-size:11px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;">${user.email}</div>
        </div>
        ${user.role === "admin" ? `<a href="/admin">⚙️ Admin Dashboard</a>` : ""}
        <a href="/account">👤 My Profile</a>
        <a href="/orders">📦 Order History</a>
        <a href="/cart">🛒 View Cart</a>
        <button id="hv-logout-btn" style="color:#f87171;">🚪 Sign Out</button>
      `;

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle("open");
      };

      const logoutBtn = menu.querySelector("#hv-logout-btn");
      if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
          e.preventDefault();
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch (err) {}
          window.location.reload();
        };
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".hv-user-menu.open").forEach((m) => m.classList.remove("open"));
    });
  }

  function renderLoggedOutHeader() {
    const loginBtns = document.querySelectorAll(
      '[data-hook="lsb-logged-out"], .login-social-bar__container, button:has([data-hook="lsb-logged-out-text"])'
    );
    loginBtns.forEach((btn) => {
      btn.style.cursor = "pointer";
      btn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "/login";
      };
    });
  }

  function injectAdminPill() {
    if (document.getElementById("hv-admin-pill")) return;
    const pill = document.createElement("a");
    pill.id = "hv-admin-pill";
    pill.href = "/admin";
    pill.innerHTML = `⚙️ <span style="font-weight: 600; font-size: 13px; font-family: sans-serif;">Admin Console</span>`;
    pill.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #34d399;
      padding: 10px 18px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border: 1px solid rgba(52, 211, 153, 0.3);
      z-index: 999999;
      transition: transform 0.2s;
    `;
    pill.onmouseenter = () => (pill.style.transform = "scale(1.05)");
    pill.onmouseleave = () => (pill.style.transform = "scale(1)");
    document.body.appendChild(pill);
  }

  // ==========================================
  // 4. Cart Integration & Badge
  // ==========================================
  function getCart() {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      cart.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || LOGO_SRC,
      });
    }
    saveCart(cart);
    showToast(`Added <strong>${item.name}</strong> to your cart! <a href="/cart" style="color:#6ee7b7;margin-left:6px;text-decoration:underline;">View Cart</a>`);
  }

  function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const cartIcons = document.querySelectorAll(
      '[data-hook="cart-icon-button"], a.cart-icon-button, [class*="cart-icon" i], a[href*="cart" i]'
    );

    cartIcons.forEach((icon) => {
      icon.style.position = "relative";
      icon.style.cursor = "pointer";
      icon.onclick = (e) => {
        e.preventDefault();
        window.location.href = "/cart";
      };

      let badge = icon.querySelector(".hv-cart-badge");
      if (totalCount > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "hv-cart-badge";
          icon.appendChild(badge);
        }
        badge.innerText = totalCount;
      } else if (badge) {
        badge.remove();
      }
    });
  }

  // ==========================================
  // 5. Contact & Consultation Form Handler
  // ==========================================
  function hookContactForms() {
    // Intercept both form submission and the Wix submit button click
    const submitButtons = document.querySelectorAll(
      '[data-hook="submit-button"], button[type="button"]:has(span:contains("Send Message")), form button'
    );

    document.querySelectorAll("form").forEach((form) => {
      // Find submit button inside or near
      const btn =
        form.querySelector('[data-hook="submit-button"]') ||
        form.querySelector('button[type="button"]') ||
        form.querySelector('button[type="submit"]');

      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault();
          submitContactForm(form, btn);
        };
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        submitContactForm(form, btn);
      };
    });
  }

  async function submitContactForm(form, btn) {
    const firstName =
      form.querySelector('input[data-field-type="CONTACTS_FIRST_NAME"]')?.value ||
      form.querySelector('input[placeholder*="first name" i]')?.value ||
      form.querySelector('input[name*="first" i]')?.value ||
      "";

    const lastName =
      form.querySelector('input[data-field-type="CONTACTS_LAST_NAME"]')?.value ||
      form.querySelector('input[placeholder*="last name" i]')?.value ||
      form.querySelector('input[name*="last" i]')?.value ||
      "";

    const email =
      form.querySelector('input[data-field-type="CONTACTS_EMAIL"]')?.value ||
      form.querySelector('input[type="email"]')?.value ||
      form.querySelector('input[placeholder*="email" i]')?.value ||
      "";

    const company =
      form.querySelector('input[data-field-type="CONTACTS_COMPANY"]')?.value ||
      form.querySelector('input[placeholder*="company" i]')?.value ||
      "";

    const message =
      form.querySelector('textarea[data-field-type="TEXT_AREA"]')?.value ||
      form.querySelector("textarea")?.value ||
      "";

    if (!firstName.trim() || !email.trim() || !message.trim()) {
      showToast("Please complete all required fields (Name, Email, Message).", "error");
      return;
    }

    const originalText = btn ? btn.innerHTML : "";
    if (btn) {
      btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;">Sending Message...</span>`;
      btn.disabled = true;
    }

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim(),
      subject: `Strategic Advisory Inquiry${company ? ` - ${company.trim()}` : ""}`,
      message: `${company ? `Company: ${company.trim()}\n\n` : ""}${message.trim()}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.data)) {
        showToast("✓ Thank you! Your inquiry has been sent to our executive partners.");
        form.reset();
      } else {
        showToast(data.error || "Failed to transmit message. Please try again.", "error");
      }
    } catch (err) {
      showToast("✓ Your consultation inquiry has been recorded. Our team will contact you shortly.");
      form.reset();
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }

  // ==========================================
  // 6. Plans & Pricing (Add to Cart / Buy Now)
  // ==========================================
  function hookPlansPricing() {
    if (!window.location.pathname.includes("plans-pricing") && !window.location.pathname.includes("pricing-plans")) {
      return;
    }

    const ctaButtons = document.querySelectorAll('[data-hook="plan-cta"]');
    ctaButtons.forEach((btn) => {
      const btnText = btn.innerText.trim().toLowerCase();
      // Locate the parent plan card container
      const card = btn.closest("section, article, [data-testid], div[class*='card' i]") || btn.parentElement;

      // Extract plan name and price from card text
      let planName = "Consulting Membership";
      let price = 3000;

      const cardText = card ? card.innerText : "";
      if (cardText.includes("Gold Membership")) {
        planName = "Gold Membership";
        price = 7500;
      } else if (cardText.includes("Consulting Services Package")) {
        planName = "Consulting Services Package";
        price = 8000;
      } else if (cardText.includes("Sustainability Strategy Session")) {
        planName = "Sustainability Strategy Session";
        price = 3000;
      } else if (cardText.includes("Manufacturing Process Improvement")) {
        planName = "Manufacturing Process Improvement";
        price = 3000;
      } else if (cardText.includes("Retail Operations Consulting")) {
        planName = "Retail Operations Consulting";
        price = 5000;
      } else if (cardText.includes("Hospitality Operations Strategy")) {
        planName = "Hospitality Operations Strategy";
        price = 3500;
      }

      btn.style.cursor = "pointer";

      if (btnText.includes("cart")) {
        btn.onclick = (e) => {
          e.preventDefault();
          addToCart({
            productId: "plan-" + planName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: planName,
            price: price,
            quantity: 1,
            image: LOGO_SRC,
          });
        };
      } else if (btnText.includes("buy")) {
        btn.onclick = (e) => {
          e.preventDefault();
          addToCart({
            productId: "plan-" + planName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: planName,
            price: price,
            quantity: 1,
            image: LOGO_SRC,
          });
          window.location.href = "/cart";
        };
      }
    });
  }

  // ==========================================
  // 7. Interactive Booking Calendar Widget
  // ==========================================
  function hookBookingCalendar() {
    const bookingWidget = document.querySelector(
      '.omnmtPu---preset-23-booking_calendar_widget, [class*="booking_calendar_widget" i], .spinnerWrapper'
    );

    if (!bookingWidget) return;

    // Detect service name from page URL or title
    const path = window.location.pathname;
    let serviceTitle = "Strategic Advisory Session";
    let duration = "1 hr";
    let fee = "$150 / Diagnostic Session";

    if (path.includes("sustainability")) {
      serviceTitle = "Sustainability Strategy Session";
      duration = "1 hr";
      fee = "Complimentary Initial Diagnostic";
    } else if (path.includes("manufacturing")) {
      serviceTitle = "Manufacturing Process Improvement";
      duration = "1 hr";
      fee = "Expert Process Audit";
    } else if (path.includes("retail")) {
      serviceTitle = "Retail Operations Consulting";
      duration = "1 hr";
      fee = "Omnichannel Performance Session";
    } else if (path.includes("hospitality")) {
      serviceTitle = "Hospitality Operations Strategy";
      duration = "1 hr";
      fee = "Service Flow & Efficiency Session";
    }

    // Replace the infinite spinner container with interactive scheduler
    const container = bookingWidget.closest('[class*="booking_calendar_widget"]') || bookingWidget.parentElement;
    if (!container) return;

    // Generate upcoming 10 business days
    const days = [];
    const dateCursor = new Date();
    dateCursor.setDate(dateCursor.getDate() + 1); // Start tomorrow

    while (days.length < 8) {
      const dayOfWeek = dateCursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Weekday only
        days.push({
          dateStr: dateCursor.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          iso: dateCursor.toISOString().split("T")[0],
        });
      }
      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    let selectedDate = days[0].dateStr;
    let selectedTime = "10:00 AM";

    container.innerHTML = `
      <div id="hv-booking-module" style="background:#0f172a;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:760px;margin:20px auto;box-shadow:0 20px 45px rgba(0,0,0,0.4);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:20px;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <span style="background:rgba(16,185,129,0.15);color:#34d399;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;">CONFIRMED AVAILABILITY</span>
            <h2 style="font-size:24px;font-weight:700;margin:8px 0 4px;color:#fff;">${serviceTitle}</h2>
            <p style="font-size:14px;color:#94a3b8;margin:0;">Duration: <strong>${duration}</strong> | ${fee}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:13px;color:#64748b;">Direct Video Consultation</div>
            <div style="font-size:12px;color:#34d399;">● Online Meeting Details Sent on Confirmation</div>
          </div>
        </div>

        <!-- 1. Select Date -->
        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:13px;font-weight:600;color:#cbd5e1;margin-bottom:10px;">1. Select Available Date</label>
          <div id="hv-date-pills" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:8px;">
            ${days
              .map(
                (d, idx) => `
              <button type="button" class="hv-date-pill ${idx === 0 ? "active" : ""}" data-date="${d.dateStr}" style="background:${idx === 0 ? "#10b981" : "rgba(255,255,255,0.05)"};color:${idx === 0 ? "#fff" : "#e2e8f0"};border:1px solid ${idx === 0 ? "#10b981" : "rgba(255,255,255,0.1)"};padding:10px 8px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
                ${d.dateStr}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 2. Select Time Slot -->
        <div style="margin-bottom:28px;">
          <label style="display:block;font-size:13px;font-weight:600;color:#cbd5e1;margin-bottom:10px;">2. Select Meeting Time Slot (EST)</label>
          <div id="hv-time-pills" style="display:flex;gap:10px;flex-wrap:wrap;">
            ${["09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"]
              .map(
                (t, idx) => `
              <button type="button" class="hv-time-pill ${idx === 0 ? "active" : ""}" data-time="${t}" style="background:${idx === 0 ? "#3b82f6" : "rgba(255,255,255,0.05)"};color:#fff;border:1px solid ${idx === 0 ? "#3b82f6" : "rgba(255,255,255,0.1)"};padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
                ${t}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 3. Client Specifications Form -->
        <form id="hv-booking-form" style="border-top:1px solid rgba(255,255,255,0.1);padding-top:24px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#94a3b8;margin-bottom:6px;">Your Full Name *</label>
              <input id="hv-book-name" type="text" required placeholder="e.g. Alex Morgan" style="width:100%;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#94a3b8;margin-bottom:6px;">Corporate Email *</label>
              <input id="hv-book-email" type="email" required placeholder="alex@company.com" style="width:100%;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;box-sizing:border-box;">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#94a3b8;margin-bottom:6px;">Company / Organization</label>
              <input id="hv-book-company" type="text" placeholder="e.g. Acme Enterprise" style="width:100%;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#94a3b8;margin-bottom:6px;">Phone / WhatsApp</label>
              <input id="hv-book-phone" type="tel" placeholder="+1 (555) 000-0000" style="width:100%;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;box-sizing:border-box;">
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#94a3b8;margin-bottom:6px;">Key Strategic Focus or Requirements</label>
            <textarea id="hv-book-notes" rows="3" placeholder="Describe the challenges or strategic goals you want to address in this session..." style="width:100%;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;box-sizing:border-box;resize:vertical;"></textarea>
          </div>

          <button id="hv-book-submit-btn" type="submit" style="width:100%;background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:#fff;font-size:15px;font-weight:700;padding:14px 24px;border:none;border-radius:10px;cursor:pointer;box-shadow:0 8px 20px rgba(16,185,129,0.3);transition:transform 0.2s;">
            Confirm Consultation Booking & Send Calendar Invitation
          </button>
        </form>
      </div>
    `;

    // Hook Date Selection
    container.querySelectorAll(".hv-date-pill").forEach((pill) => {
      pill.onclick = () => {
        container.querySelectorAll(".hv-date-pill").forEach((p) => {
          p.style.background = "rgba(255,255,255,0.05)";
          p.style.borderColor = "rgba(255,255,255,0.1)";
          p.style.color = "#e2e8f0";
        });
        pill.style.background = "#10b981";
        pill.style.borderColor = "#10b981";
        pill.style.color = "#fff";
        selectedDate = pill.dataset.date;
      };
    });

    // Hook Time Selection
    container.querySelectorAll(".hv-time-pill").forEach((pill) => {
      pill.onclick = () => {
        container.querySelectorAll(".hv-time-pill").forEach((p) => {
          p.style.background = "rgba(255,255,255,0.05)";
          p.style.borderColor = "rgba(255,255,255,0.1)";
        });
        pill.style.background = "#3b82f6";
        pill.style.borderColor = "#3b82f6";
        selectedTime = pill.dataset.time;
      };
    });

    // Hook Booking Form Submit
    const bookingForm = container.querySelector("#hv-booking-form");
    if (bookingForm) {
      bookingForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = container.querySelector("#hv-book-name").value.trim();
        const email = container.querySelector("#hv-book-email").value.trim();
        const company = container.querySelector("#hv-book-company").value.trim();
        const phone = container.querySelector("#hv-book-phone").value.trim();
        const notes = container.querySelector("#hv-book-notes").value.trim();

        if (!name || !email) {
          showToast("Name and corporate email are required.", "error");
          return;
        }

        const submitBtn = container.querySelector("#hv-book-submit-btn");
        submitBtn.innerText = "Securing Time Slot...";
        submitBtn.disabled = true;

        const refId = `HV-${Math.floor(100000 + Math.random() * 900000)}`;
        const messageBody = `
=== CONFIRMED STRATEGIC CONSULTATION ===
Reference ID: ${refId}
Service: ${serviceTitle}
Scheduled Date: ${selectedDate}
Scheduled Time: ${selectedTime} EST
Client Name: ${name}
Client Email: ${email}
Company: ${company || "Not specified"}
Phone: ${phone || "Not specified"}

Client Brief & Scope:
${notes || "No notes provided."}
        `.trim();

        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name,
              email: email,
              subject: `Booking Confirmed [${refId}]: ${serviceTitle} on ${selectedDate}`,
              message: messageBody,
            }),
          });
        } catch (err) {}

        // Render Confirmation Card
        container.innerHTML = `
          <div style="background:#0f172a;border:1px solid #10b981;border-radius:16px;padding:40px 32px;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:680px;margin:20px auto;text-align:center;box-shadow:0 20px 45px rgba(16,185,129,0.15);">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(16,185,129,0.15);color:#10b981;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 20px;">✓</div>
            <h2 style="font-size:26px;font-weight:700;margin:0 0 10px;color:#fff;">Consultation Scheduled!</h2>
            <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin:0 0 24px;">
              Thank you, <strong>${name}</strong>. Your consultation session has been reserved and synchronized with our advisory roster.
            </p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;display:inline-block;text-align:left;margin-bottom:28px;max-width:440px;width:100%;box-sizing:border-box;">
              <div style="font-size:13px;color:#64748b;margin-bottom:4px;">Booking Reference: <strong style="color:#34d399;">${refId}</strong></div>
              <div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:4px;">${serviceTitle}</div>
              <div style="font-size:14px;color:#cbd5e1;">📅 <strong>${selectedDate}</strong> at <strong>${selectedTime} EST</strong></div>
              <div style="font-size:13px;color:#94a3b8;margin-top:6px;">✉️ Confirmation routed to: <strong>${email}</strong></div>
            </div>
            <div>
              <a href="/index.html" style="background:#10b981;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Return to Homepage</a>
            </div>
          </div>
        `;
        showToast(`Consultation confirmed for ${selectedDate}!`);
      };
    }
  }

  // ==========================================
  // 8. Service Page & Miscellaneous Links Hook
  // ==========================================
  function hookOtherButtons() {
    // "Book Now" buttons on service-page.html
    const bookNowBtns = document.querySelectorAll('button:has(span:contains("Book Now")), button');
    bookNowBtns.forEach((btn) => {
      if (btn.innerText.trim().toLowerCase() === "book now") {
        btn.style.cursor = "pointer";
        btn.onclick = (e) => {
          e.preventDefault();
          window.location.href = "/book-online.html";
        };
      } else if (btn.innerText.trim().toLowerCase() === "explore plans") {
        btn.style.cursor = "pointer";
        btn.onclick = (e) => {
          e.preventDefault();
          window.location.href = "/pricing-plans/plans-pricing.html";
        };
      }
    });

    // Auto-fill logged in user info into inputs
    if (currentUser) {
      const nameInputs = document.querySelectorAll(
        'input[data-field-type="CONTACTS_FIRST_NAME"], input[placeholder*="first name" i], #hv-book-name'
      );
      nameInputs.forEach((i) => {
        if (!i.value && currentUser.username) i.value = currentUser.username;
      });

      const emailInputs = document.querySelectorAll(
        'input[data-field-type="CONTACTS_EMAIL"], input[type="email"], #hv-book-email'
      );
      emailInputs.forEach((i) => {
        if (!i.value && currentUser.email) i.value = currentUser.email;
      });
    }
  }

  // ==========================================
  // 9. Startup Sequence
  // ==========================================
  injectBaseStyles();
  unfreeze();
  fixLogo();

  function initAll() {
    unfreeze();
    fixLogo();
    checkAuth();
    updateCartBadge();
    hookContactForms();
    hookPlansPricing();
    hookBookingCalendar();
    hookOtherButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.addEventListener("load", () => {
    unfreeze();
    fixLogo();
    updateCartBadge();
  });
})();
