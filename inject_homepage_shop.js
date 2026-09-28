const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "frontend", "www.huonvision.com", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// 1. Add "Shop" to navigation bar
const navTarget = '<ul class="_container_s6hzk_173">';
const shopNavItem = `<li class="_listItem_1sfgg_1" data-part="menu-item" data-animation-name="none" data-item-depth="0"><div class="_itemWrapper_1sfgg_10"><div class="item _labelContainer_1sfgg_18" data-part="menu-item-content" data-interactive="true"><a data-testid="linkElement" data-part="menu-item-link" href="/shop" target="_self" class=""><span class="_labelWrapper_1sfgg_101"><span class="item-label _label_1sfgg_18" data-part="label" style="color: #38bdf8; font-weight: 700;">Shop</span></span></a></div></div><span class="_divider_1sfgg_231"></span></li>`;

if (!html.includes('href="/shop"')) {
  // Insert right after the Home menu item
  const homeEndPattern = 'Home</span></span></a></div></div><span class="_divider_1sfgg_231"></span></li>';
  if (html.includes(homeEndPattern)) {
    html = html.replace(homeEndPattern, homeEndPattern + shopNavItem);
    console.log("✓ Added Shop navigation link after Home");
  } else {
    html = html.replace(navTarget, navTarget + shopNavItem);
    console.log("✓ Added Shop navigation link at start of nav");
  }
} else {
  console.log("Shop link already exists in navigation");
}

// 2. Build the Shop Section HTML
const shopSection = `
<!-- ================================================================= -->
<!-- HUONVISION HOME RENOVATION & REMODELING SHOP SECTION -->
<!-- ================================================================= -->
<section id="hv-renovation-shop" style="background: radial-gradient(circle at 50% 0%, #172554 0%, #090e1a 50%, #030712 100%); padding: 100px 24px 120px; border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -120px; left: 15%; width: 450px; height: 450px; background: rgba(56, 189, 248, 0.08); filter: blur(140px); pointer-events: none; border-radius: 50%;"></div>
  <div style="position: absolute; bottom: -100px; right: 10%; width: 500px; height: 500px; background: rgba(16, 185, 129, 0.08); filter: blur(150px); pointer-events: none; border-radius: 50%;"></div>

  <div style="max-width: 1280px; margin: 0 auto; position: relative; z-index: 2;">
    <!-- Section Header -->
    <div style="text-align: center; max-width: 840px; margin: 0 auto 50px;">
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 10px #38bdf8;"></span>
        Commercial &amp; Residential Solutions
      </div>
      <h2 style="font-size: clamp(30px, 4vw, 48px); font-weight: 800; line-height: 1.18; letter-spacing: -0.02em; margin: 0 0 18px; color: #ffffff;">
        Home Renovation &amp; Remodeling Essentials
      </h2>
      <p style="font-size: clamp(15px, 1.7vw, 18px); line-height: 1.6; color: #94a3b8; margin: 0 auto 28px;">
        Source premier architectural materials and luxury furnishings directly from industry-leading manufacturers. From structural GAF roofing and precision Andersen windows to Kohler fixtures and handcrafted living sectionals.
      </p>

      <!-- Category Filter Quick Links -->
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
        <a href="/shop?category=roofing" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🏠 Roofing</a>
        <a href="/shop?category=flooring" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🪵 Flooring &amp; Tile</a>
        <a href="/shop?category=windows-doors" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🪟 Windows &amp; Doors</a>
        <a href="/shop?category=paints-finishes" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🎨 Paints &amp; Finishes</a>
        <a href="/shop?category=kitchen-bath" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🚿 Kitchen &amp; Bath</a>
        <a href="/shop?category=furniture" style="padding: 7px 15px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s;">🛋️ Furniture &amp; Couches</a>
      </div>
    </div>

    <!-- Product Grid (6 Featured Items) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 28px; margin-bottom: 50px;">

      <!-- Card 1: West Elm Harmony Sectional -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/west-elm-harmony-sectional.jpg" alt="West Elm Harmony 3-Piece Modular Sectional Sofa" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">West Elm</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">Save $300</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Furniture &amp; Couches</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (92)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d40" style="color: inherit; text-decoration: none;">West Elm Harmony 3-Piece Modular Sectional Sofa</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            Ultra-plush down-blend cushions with high-resiliency foam core, upholstered in performance chenille over kiln-dried hardwood.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            📐 118" x 78" L-Shape • In Stock (15 units)
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Renovation Price</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$2,199.00</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$2,499.00</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d40" data-name="West Elm Harmony 3-Piece Modular Sectional Sofa" data-price="2199.00" data-image="/images/products/west-elm-harmony-sectional.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Andersen 400 Series Window -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/andersen-400-series-window.jpg" alt="Andersen 400 Series Tilt-Wash Double-Hung Window" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">Andersen Windows</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">Energy Star®</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Windows &amp; Doors</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (74)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d36" style="color: inherit; text-decoration: none;">Andersen 400 Series Tilt-Wash Double-Hung Window</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            Perma-Shield vinyl exterior cladding with High-Performance Low-E4 glass and solid pine interior wood finish.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            📐 Multi-Size Options • Low-E4 Double Pane
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Renovation Price</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$349.00</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$385.00</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d36" data-name="Andersen 400 Series Tilt-Wash Double-Hung Window" data-price="349.00" data-image="/images/products/andersen-400-series-window.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Card 3: GAF Timberline HDZ Shingles -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/gaf-timberline-hdz-shingles.jpg" alt="GAF Timberline HDZ Architectural Roofing Shingles" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">GAF Roofing</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">#1 in USA</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Roofing</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (128)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d31" style="color: inherit; text-decoration: none;">GAF Timberline HDZ Architectural Roofing Shingles</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            LayerLock Technology and StrikeZone nailing area delivering Dura Grip sealant protection against up to 130 mph winds.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            📦 32.8 sq ft / Bundle • Charcoal &amp; Pewter
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Per Bundle</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$38.99</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$42.50</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d31" data-name="GAF Timberline HDZ Architectural Roofing Shingles" data-price="38.99" data-image="/images/products/gaf-timberline-hdz-shingles.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Card 4: Shaw Floors Floorté Vinyl Plank -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/shaw-floorte-vinyl-plank.jpg" alt="Shaw Floors Floorté Pro Luxury Vinyl Plank" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">Shaw Floors</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">Waterproof</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Flooring &amp; Tile</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (86)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d33" style="color: inherit; text-decoration: none;">Shaw Floors Floorté Pro Luxury Waterproof Vinyl Plank</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            Commercial-grade 100% waterproof rigid core luxury vinyl with attached acoustic sound dampening pad.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            📦 23.64 sq ft / Case • Scratch Resistant
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Per Case</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$59.99</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$68.99</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d33" data-name="Shaw Floors Floorté Pro Luxury Waterproof Vinyl Plank" data-price="59.99" data-image="/images/products/shaw-floorte-vinyl-plank.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Card 5: Kohler Artifacts Faucet -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/kohler-artifacts-faucet.jpg" alt="Kohler Artifacts Gentleman's Single-Hole Bathroom Faucet" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">Kohler</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">Solid Brass</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Kitchen &amp; Bath</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (47)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d3c" style="color: inherit; text-decoration: none;">Kohler Artifacts Gentleman's Single-Hole Bathroom Faucet</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            Vintage Edwardian elegance re-imagined. Solid brass build with ceramic disc valves in Vibrant Moderne Brass.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            ✨ Vibrant Moderne Brass • Single Hole Mount
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Renovation Price</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$519.00</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$585.00</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d3c" data-name="Kohler Artifacts Gentleman's Single-Hole Bathroom Faucet" data-price="519.00" data-image="/images/products/kohler-artifacts-faucet.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Card 6: Sherwin-Williams Emerald Paint -->
      <div class="hv-product-card" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #0b1120; overflow: hidden;">
          <img src="/images/products/sherwin-williams-emerald-paint.jpg" alt="Sherwin-Williams Emerald Interior Acrylic Latex Paint" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 6px;">Sherwin-Williams</span>
          <span style="position: absolute; top: 14px; right: 14px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 6px;">Self-Priming</span>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Paints &amp; Finishes</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">★ 4.9 (164)</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #f1f5f9; line-height: 1.35; margin: 0 0 10px; min-height: 48px;">
            <a href="/product/6abac248a13021eb6bf73d39" style="color: inherit; text-decoration: none;">Sherwin-Williams Emerald Interior Acrylic Latex Paint</a>
          </h3>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; flex-grow: 1;">
            Top-tier stain-blocking paint &amp; primer in one with antimicrobial agents that inhibit mold &amp; mildew growth.
          </p>
          <div style="padding: 9px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #cbd5e1; margin-bottom: 18px;">
            🖌️ 1 Gallon • Pure White, Repose Gray &amp; More
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Per Gallon</div>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 22px; font-weight: 800; color: #34d399;">$69.99</span>
                <span style="font-size: 14px; color: #64748b; text-decoration: line-through;">$78.99</span>
              </div>
            </div>
            <button class="hv-add-to-cart-btn" data-product-id="6abac248a13021eb6bf73d39" data-name="Sherwin-Williams Emerald Interior Acrylic Latex Paint" data-price="69.99" data-image="/images/products/sherwin-williams-emerald-paint.jpg" style="padding: 10px 18px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Showcase Banner & Link to All Products -->
    <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 36px 40px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
      <div style="max-width: 600px;">
        <h4 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 8px;">Explore 20+ Commercial &amp; Residential Products</h4>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0;">
          Browse our complete catalog featuring Owens Corning, Bruce Hardwood, Pella, Moen, Benjamin Moore, Pottery Barn, and Lutron Smart Home Automation.
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <a href="/shop" style="padding: 14px 28px; background: #38bdf8; color: #090e1a; font-size: 15px; font-weight: 800; border-radius: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.35); transition: transform 0.2s, background 0.2s;" onmouseover="this.style.transform='scale(1.04)';this.style.background='#7dd3fc';" onmouseout="this.style.transform='scale(1)';this.style.background='#38bdf8';">
          <span>View All 20+ Products</span>
          <span style="font-size: 18px;">→</span>
        </a>
      </div>
    </div>
  </div>
</section>
`;

// 3. Insert Shop Section before comp-mhs1bc6l (contact section)
const insertTarget = '<section id="comp-mhs1bc6l"';
if (html.includes('id="hv-renovation-shop"')) {
  console.log("Shop section already exists in index.html, updating...");
  const startIdx = html.indexOf('<section id="hv-renovation-shop"');
  const endIdx = html.indexOf(insertTarget);
  html = html.substring(0, startIdx) + shopSection + html.substring(endIdx);
} else if (html.includes(insertTarget)) {
  html = html.replace(insertTarget, shopSection + insertTarget);
  console.log("✓ Successfully inserted Shop section before contact section");
} else {
  console.error("Could not find insert target comp-mhs1bc6l in index.html");
  process.exit(1);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("✓ Successfully wrote updated index.html! File size:", fs.statSync(indexPath).size);
