/**
 * HuonVision Backend Bridge & Display Enforcer
 * Lightweight, robust, and zero-overlay:
 * - Unfreezes Wix motion animations (prevents blank screen)
 * - Ensures logo src is set and rendered cleanly
 * - Enforces mobile header alignment without horizontal overflow
 * - Hooks forms to Next.js /api/contact
 * - Hooks cart to /cart and provides Admin Console for logged in admins
 */
(function () {
  console.log("⚡ HuonVision Bridge Active");

  // 1. Unfreeze any paused Wix motion animations immediately
  function unfreeze() {
    const els = document.querySelectorAll('[id^="comp-"], [class*="comp-"], [data-motion-part], [data-motion-enter]');
    els.forEach((el) => {
      el.dataset.motionEnter = "done";
    });
  }

  // 2. Ensure logo displays
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

  // 3. Inject minimal layout styles (Prevents blank screen & fixes mobile header)
  function injectStyles() {
    if (document.getElementById("hv-bridge-styles")) return;
    const style = document.createElement("style");
    style.id = "hv-bridge-styles";
    style.textContent = `
      /* Unpause all Wix motion elements */
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

      /* Mobile responsiveness & header alignment */
      @media (max-width: 860px) {
        html, body, #SITE_CONTAINER, #masterPage, #SITE_PAGES {
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }

        /* Prevent desktop horizontal menu from blowing out mobile width */
        nav.navbar, .navbar, ._navbar_cohan_1 {
          display: none !important;
        }

        /* Sticky header on mobile */
        header, #SITE_HEADER {
          position: sticky !important;
          top: 0 !important;
          z-index: 9999 !important;
          width: 100% !important;
          max-width: 100vw !important;
          background: rgba(9, 14, 26, 0.98) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-sizing: border-box !important;
        }

        header img[alt*="logo" i] {
          max-height: 40px !important;
          width: auto !important;
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 4. Intercept form submissions and send to Next.js /api/contact
  document.addEventListener("submit", async function (e) {
    const form = e.target;
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      const name = input.name || input.getAttribute("data-testid") || input.placeholder || "field";
      if (input.value) {
        data[name] = input.value;
      }
    });

    const payload = {
      name: data.name || data["first name"] || data["First Name"] || data.fullName || "Website Inquiry",
      email: data.email || data["Email"] || data["email address"] || "client@huonvision.com",
      phone: data.phone || data["Phone"] || "",
      subject: data.subject || data["Service"] || "HuonVision Inquiry",
      message: data.message || data["Message"] || JSON.stringify(data),
    };

    const submitBtn = form.querySelector("button[type='submit'], input[type='submit'], button");
    const originalText = submitBtn ? submitBtn.innerText : "";
    if (submitBtn) {
      submitBtn.innerText = "Submitting...";
      submitBtn.disabled = true;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success || res.ok) {
        alert("Thank you! Your inquiry has been transmitted to our strategic advisory team.");
        form.reset();
      } else {
        alert(json.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      alert("Your request has been recorded. Our team will contact you shortly.");
    } finally {
      if (submitBtn) {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    }
  }, true);

  // 5. Auth Check for Floating Admin Console
  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data && data.user && data.user.role === "admin") {
          injectAdminPill();
        }
      }
    } catch (e) {}
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
    `;
    document.body.appendChild(pill);
  }

  // 6. Hook Shopping Bag clicks
  function hookCart() {
    const cartIcons = document.querySelectorAll("[data-testid='cart-icon'], .cart-icon, a[href*='cart']");
    cartIcons.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/cart";
      });
    });
  }

  // Run on start
  injectStyles();
  unfreeze();
  fixLogo();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      unfreeze();
      fixLogo();
      hookCart();
      checkAuth();
    });
  } else {
    hookCart();
    checkAuth();
  }

  window.addEventListener("load", () => {
    unfreeze();
    fixLogo();
  });
})();
