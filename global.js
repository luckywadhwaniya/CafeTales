/* ==========================================================================
   CafeTales Global Logic
   - Nav Highlight
   - Scroll Animations
   - PROFESSIONAL NAVBAR INJECTION (Cart + User Profile)
   ========================================================================== */

// 1. Navigation Highlighting
(function markActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// 2. Scroll Reveal Animation
const revealItems = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  revealItems.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add("show");
  });
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// 3. AUTH & NAVBAR UI INJECTION
(function initAuthUI() {
  const SESSION_KEY = "cafetales_session_v3";
  let user = null;
  try { user = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { }

  const navList = document.querySelector(".navbar-nav");
  if (!navList) return;

  // A. Remove default Login link if user exists (to prevent duplicates)
  if(user) {
      const loginLink = navList.querySelector('a[href="login.html"]');
      if(loginLink) loginLink.parentElement.remove();
  }

  // B. Create Document Fragment for clean insertion
  const fragment = document.createDocumentFragment();

  // --- C. INJECT CART ICON ---
  const cartLi = document.createElement("li");
  cartLi.className = "nav-item ms-lg-3 d-flex align-items-center";
  cartLi.innerHTML = `
    <a href="cart.html" class="nav-link position-relative btn btn-outline-light rounded-pill px-3 py-1 mt-1 border-0" style="background: rgba(255,255,255,0.05); transition:0.3s;">
      <span style="font-size:1.2rem; vertical-align:middle;">🛒</span> 
      <span id="nav-cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style="display:none; font-size:0.7rem;">0</span>
    </a>
  `;
  fragment.appendChild(cartLi);

  // --- D. INJECT USER PROFILE / LOGIN BUTTON ---
  const userLi = document.createElement("li");
  userLi.className = "nav-item ms-2 d-flex align-items-center";
  
  if (user) {
    // Show User Avatar with Dropdown
    const initials = user.full_name ? user.full_name.substring(0,2).toUpperCase() : "U";
    userLi.innerHTML = `
        <div class="dropdown mt-1">
          <div class="user-avatar shadow-lg" data-bs-toggle="dropdown" 
               style="width:38px; height:38px; font-size:14px; background: linear-gradient(135deg, #ffb703, #ff8c00); color:#000; font-weight:bold; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; border:2px solid rgba(255,255,255,0.2);">
               ${initials}
          </div>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end mt-2 shadow-lg border border-secondary p-2" style="background: rgba(15, 17, 21, 0.95); backdrop-filter: blur(10px);">
            <li><h6 class="dropdown-header text-warning">Hello, ${user.full_name}</h6></li>
            ${user.role === 'admin' ? '<li><a class="dropdown-item rounded" href="admin.html">⚙ Admin Dashboard</a></li>' : ''}
            <li><a class="dropdown-item rounded" href="my_bookings.html">📅 My Bookings</a></li>
            <li><hr class="dropdown-divider bg-secondary"></li>
            <li><a class="dropdown-item text-danger rounded" href="#" id="globalLogout">🚪 Logout</a></li>
          </ul>
        </div>`;
  } 
  fragment.appendChild(userLi);
  
  // Append to Navbar
  navList.appendChild(fragment);

  // E. Handle Logout
  if (user) {
    updateGlobalCartCount(user.id);
    document.addEventListener("click", (e) => {
      if (e.target.id === "globalLogout") {
        e.preventDefault();
        if(confirm("Are you sure you want to logout?")) {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = "index.html";
        }
      }
    });
  }
})();

// Helper: Update Cart Badge Count
async function updateGlobalCartCount(userId) {
    try {
        const fd = new FormData(); 
        fd.append("action", "get_cart"); 
        fd.append("user_id", userId);
        const res = await fetch("api.php", { method: "POST", body: fd });
        const data = await res.json();
        
        // Count total items
        const total = data.reduce((sum, item) => sum + parseInt(item.qty), 0);
        
        const badge = document.getElementById("nav-cart-count");
        if(badge) {
            badge.innerText = total;
            badge.style.display = total > 0 ? "inline-block" : "none";
        }
    } catch(e) { console.error("Cart Count Error", e); }
}