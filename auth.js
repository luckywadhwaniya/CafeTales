/* ==========================================================================
   CafeTales Authentication (CONNECTED TO PHP DATABASE)
   ========================================================================== */

const SESSION_KEY = "cafetales_session_v3";

class AuthService {
  
  // 1. REGISTER: Sends Name, Email, Password to PHP
  static async register(userData) {
    const formData = new FormData();
    formData.append("action", "register");       // Tells PHP: "I want to register"
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Send to server
    const response = await fetch("auth_api.php", { 
      method: "POST", 
      body: formData 
    });
    
    // Return the answer (JSON)
    return await response.json(); 
  }

  // 2. LOGIN: Sends Email, Password to PHP
  static async login(credentials) {
    const formData = new FormData();
    formData.append("action", "login");          // Tells PHP: "I want to login"
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    const response = await fetch("auth_api.php", { 
      method: "POST", 
      body: formData 
    });
    
    const result = await response.json();

    // If login worked, save the user details to browser memory (for "Profile" features)
    if (result.success) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    }
    
    return result;
  }

  // 3. LOGOUT: Clears browser memory
  static logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }
}

/* ==========================================================================
   UI LOGIC: Handling Button Clicks
   ========================================================================== */

const regForm = document.getElementById("regForm");
const logForm = document.getElementById("logForm");
const logoutBtn = document.getElementById("logoutBtn");

// --- Helper to show messages ---
const showMsg = (elementId, text, isError) => {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = isError ? "ms-2 text-danger small" : "ms-2 text-success small";
};

// --- A. REGISTER BUTTON CLICKED ---
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page reload

    const btn = regForm.querySelector("button");
    const name = document.getElementById("rName").value;
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPass").value;

    try {
      btn.disabled = true; 
      btn.textContent = "Creating...";
      
      // Call the Class above
      const result = await AuthService.register({ name, email, password });

      if (result.success) {
        showMsg("rMsg", "Account created! Please Login.", false);
        regForm.reset();
        // Switch to Login Tab automatically
        setTimeout(() => document.getElementById("showLogin").click(), 1500);
      } else {
        showMsg("rMsg", result.message, true); // Show error from Database
      }

    } catch (err) {
      showMsg("rMsg", "Server Error. Is XAMPP running?", true);
    } finally {
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });
}

// --- B. LOGIN BUTTON CLICKED ---
if (logForm) {
  logForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = logForm.querySelector("button");
    const email = document.getElementById("lEmail").value;
    const password = document.getElementById("lPass").value;

    try {
      btn.disabled = true;
      btn.textContent = "Verifying...";

      // Call the Class above
      const result = await AuthService.login({ email, password });

      if (result.success) {
        showMsg("lMsg", "Login Success! Redirecting...", false);
        
        // CHECK ROLE: If Admin -> Go to Admin Panel. If User -> Go Home.
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = "admin.html";
          } else {
            window.location.href = "index.html";
          }
        }, 1000);

      } else {
        showMsg("lMsg", result.message, true); // e.g., "Invalid Password"
      }

    } catch (err) {
      console.error(err);
      showMsg("lMsg", "Connection Error. Is XAMPP running?", true);
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });
}

// --- C. LOGOUT BUTTON ---
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => AuthService.logout());
}

// --- D. TOGGLE BUTTONS (Login <-> Register) ---
const showRegBtn = document.getElementById("showRegister");
const showLogBtn = document.getElementById("showLogin");

if(showRegBtn && showLogBtn){
  showRegBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "block";
  });

  showLogBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  });
}