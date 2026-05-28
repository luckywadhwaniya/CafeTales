/* ==========================================================================
   CafeTales Reservation (STRONG VALIDATION + DB INTEGRATION)
   ========================================================================== */

const form = document.getElementById("reserveForm");
const msg = document.getElementById("msg");
const slotInfo = document.getElementById("slotInfo");

const nameEl = document.getElementById("name");
const phoneEl = document.getElementById("phone");
const emailEl = document.getElementById("email");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const areaEl = document.getElementById("seating");
const guestsEl = document.getElementById("guests");
const notesEl = document.getElementById("notes");

let slotAvailable = true; // will be updated by checkAvailability()

// ✅ Set min date = today (no past booking)
function setMinDateToday() {
  if (!dateEl) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateEl.min = `${yyyy}-${mm}-${dd}`;
}

// ✅ Helpers for bootstrap validation UI
function setInvalid(el, message) {
  if (!el) return;
  el.classList.add("is-invalid");
  el.classList.remove("is-valid");
  if (message) {
    const fb = el.parentElement?.querySelector(".invalid-feedback");
    if (fb) fb.textContent = message;
  }
}
function setValid(el) {
  if (!el) return;
  el.classList.remove("is-invalid");
  el.classList.add("is-valid");
}

// ✅ Field validations (strong)
function validateName() {
  const v = (nameEl.value || "").trim();
  const ok = /^[A-Za-z ]{3,40}$/.test(v);
  ok ? setValid(nameEl) : setInvalid(nameEl, "Enter valid name (only letters, min 3).");
  return ok;
}

// ✅ UPDATED: Indian mobile validation (must start 6-9)
function validatePhone() {
  const v = (phoneEl.value || "").trim();
  const ok = /^[6-9][0-9]{9}$/.test(v);
  ok ? setValid(phoneEl) : setInvalid(phoneEl, "Enter valid Indian mobile (10 digits, starts 6-9).");
  return ok;
}

function validateEmail() {
  const v = (emailEl.value || "").trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  ok ? setValid(emailEl) : setInvalid(emailEl, "Enter a valid email.");
  return ok;
}

function validateDate() {
  const v = dateEl.value;
  if (!v) { setInvalid(dateEl, "Please select a date."); return false; }

  // must be today or future
  const selected = new Date(v + "T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);

  const ok = selected >= today;
  ok ? setValid(dateEl) : setInvalid(dateEl, "Past date not allowed.");
  return ok;
}

function validateArea() {
  const ok = !!areaEl.value;
  ok ? setValid(areaEl) : setInvalid(areaEl, "Please select seating area.");
  return ok;
}

function validateTime() {
  const ok = !!timeEl.value;
  ok ? setValid(timeEl) : setInvalid(timeEl, "Please select time slot.");
  return ok;
}

function validateGuests() {
  const v = parseInt(guestsEl.value, 10);
  const ok = Number.isInteger(v) && v >= 1 && v <= 10;
  ok ? setValid(guestsEl) : setInvalid(guestsEl, "Guests must be between 1 and 10.");
  return ok;
}

function validateNotes() {
  const v = (notesEl.value || "");
  const ok = v.length <= 150;
  if (!ok) setInvalid(notesEl, "Max 150 characters allowed.");
  else {
    notesEl.classList.remove("is-invalid");
  }
  return ok;
}

function validateAllFields() {
  const a = validateName();
  const b = validatePhone();
  const c = validateEmail();
  const d = validateDate();
  const e = validateArea();
  const f = validateTime();
  const g = validateGuests();
  const h = validateNotes();

  // Slot must be available (not full)
  if (!slotAvailable) {
    setInvalid(timeEl, "This slot is full. Please choose another.");
    return false;
  }
  return a && b && c && d && e && f && g && h;
}

// ✅ Live validation events
[nameEl, phoneEl, emailEl, dateEl, timeEl, areaEl, guestsEl, notesEl].forEach(el => {
  if (!el) return;
  el.addEventListener("input", () => {
    if (el === nameEl) validateName();
    if (el === phoneEl) validatePhone();
    if (el === emailEl) validateEmail();
    if (el === guestsEl) validateGuests();
    if (el === notesEl) validateNotes();
  });
});

if (dateEl) dateEl.addEventListener("change", () => { validateDate(); checkAvailability(); });
if (timeEl) timeEl.addEventListener("change", () => { validateTime(); checkAvailability(); });
if (areaEl) areaEl.addEventListener("change", () => { validateArea(); checkAvailability(); });

// 1) ON LOAD: CHECK LOGIN & AUTO FILL
document.addEventListener("DOMContentLoaded", async () => {
  setMinDateToday();

  const userSession = JSON.parse(localStorage.getItem("cafetales_session_v3"));
  const container = document.querySelector(".glass");

  if (!userSession) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h3 class="mb-3">🔒 Login Required</h3>
        <p class="text-muted mb-4">You must be logged in to reserve a table.</p>
        <a href="login.html" class="ct-btn px-5">Login Now</a>
      </div>
    `;
    return;
  }

  try {
    const fd = new FormData();
    fd.append("action", "get_user_details");
    fd.append("user_id", userSession.id);

    const res = await fetch("api.php", { method: "POST", body: fd });
    const data = await res.json();

    if (data.success) {
      nameEl.value = data.user.full_name || "";
      emailEl.value = data.user.email || "";
      if (data.user.phone_number) phoneEl.value = data.user.phone_number;
    }
  } catch (err) {
    console.warn("Auto-fill failed, using local session data.");
    nameEl.value = userSession.name || "";
    emailEl.value = userSession.email || "";
  }
});

// 2) REAL-TIME AVAILABILITY
async function checkAvailability() {
  if (!dateEl.value || !timeEl.value || !areaEl.value) return;

  if (slotInfo) slotInfo.innerHTML = "<small class='text-muted'>Checking...</small>";

  const fd = new FormData();
  fd.append("action", "check_availability");
  fd.append("date", dateEl.value);
  fd.append("time", timeEl.value);
  fd.append("area", areaEl.value);

  try {
    const res = await fetch("api.php", { method: "POST", body: fd });
    const data = await res.json();

    if (slotInfo) {
      if (data.left <= 0) {
        slotAvailable = false;
        slotInfo.innerHTML = `<span class="badge bg-danger">SLOT FULL</span>`;
        setInvalid(timeEl, "This slot is full. Please choose another.");
      } else {
        slotAvailable = true;
        slotInfo.innerHTML = `<span class="badge bg-success">${data.left} tables available</span>`;
        if (timeEl.value) setValid(timeEl);
      }
    }
  } catch (err) {
    console.error(err);
    slotAvailable = false;
    if (slotInfo) slotInfo.innerHTML = `<span class="badge bg-warning text-dark">Server error. Try again.</span>`;
  }
}

// 3) SUBMIT BOOKING (BLOCK if any field invalid/empty)
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.innerHTML = "";

    const userSession = JSON.parse(localStorage.getItem("cafetales_session_v3"));
    if (!userSession) {
      alert("Session expired. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const ok = validateAllFields();
    if (!ok) {
      msg.innerHTML = `<div class="alert alert-danger mt-3">⚠️ Please fix the highlighted fields.</div>`;
      return;
    }

    await checkAvailability();
    if (!slotAvailable) {
      msg.innerHTML = `<div class="alert alert-danger mt-3">⚠️ Slot full. Choose another time/area.</div>`;
      return;
    }

    const btn = form.querySelector("button");
    const originalText = btn.textContent;

    const fd = new FormData();
    fd.append("action", "reserve");
    fd.append("user_id", userSession.id);
    fd.append("name", nameEl.value.trim());
    fd.append("phone", phoneEl.value.trim());
    fd.append("email", emailEl.value.trim());
    fd.append("date", dateEl.value);
    fd.append("time", timeEl.value);
    fd.append("guests", guestsEl.value);
    fd.append("area", areaEl.value);
    fd.append("notes", (notesEl.value || "").trim());

    try {
      btn.disabled = true;
      btn.textContent = "Booking...";

      const res = await fetch("api.php", { method: "POST", body: fd });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e2) {
        console.error("PHP Error:", text);
        throw new Error("Server Error: " + text.substring(0, 80));
      }

      if (data.success) {
        msg.innerHTML = `<div class="alert alert-success mt-3">✅ Confirmed! ID: #${data.id}</div>`;
        form.reset();
        if (slotInfo) slotInfo.innerHTML = "";
        slotAvailable = true;

        [nameEl, phoneEl, emailEl, dateEl, timeEl, areaEl, guestsEl].forEach(el => {
          if (!el) return;
          el.classList.remove("is-valid", "is-invalid");
        });

        document.dispatchEvent(new Event("DOMContentLoaded"));
      } else {
        msg.innerHTML = `<div class="alert alert-danger mt-3">⚠️ Error: ${data.message}</div>`;
      }
    } catch (err) {
      alert(err.message);
      msg.innerHTML = `<div class="alert alert-danger mt-3">Connection Failed</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}