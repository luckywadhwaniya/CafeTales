const API_URL = "contact_api.php";

const form = document.getElementById("contactForm");
const info = document.getElementById("contactInfo");
const tableBody = document.querySelector("#msgTable tbody");

const nameEl = document.getElementById("cName");
const emailEl = document.getElementById("cEmail");
const phoneEl = document.getElementById("cPhone");
const msgEl = document.getElementById("cMsg");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

// Helper: Escape HTML to prevent XSS
function escapeHtml(str){
  if (!str) return "";
  return String(str)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

// Helper: Clear validation classes
function clearValidation(){
  [...form.elements].forEach(el => el.classList?.remove("is-invalid","is-valid"));
}

// Helper: Validate Form inputs
function validate(){
  let ok = true;

  if(!nameEl.value.trim()){ nameEl.classList.add("is-invalid"); ok=false; }
  else nameEl.classList.add("is-valid");

  if(!emailRegex.test(emailEl.value.trim())){ emailEl.classList.add("is-invalid"); ok=false; }
  else emailEl.classList.add("is-valid");

  if(!phoneRegex.test(phoneEl.value.trim())){ phoneEl.classList.add("is-invalid"); ok=false; }
  else phoneEl.classList.add("is-valid");

  if(!msgEl.value.trim()){ msgEl.classList.add("is-invalid"); ok=false; }
  else msgEl.classList.add("is-valid");

  return ok;
}

// --- MAIN FUNCTION: Render List from Database ---
async function render(){
  try {
    const response = await fetch(API_URL);
    const list = await response.json();

    tableBody.innerHTML = "";

    if(list.length === 0){
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No saved messages.</td></tr>`;
      return;
    }

    list.forEach((m, i)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td>${escapeHtml(m.message).slice(0,60)}...</td>
        <td><button class="btn btn-sm btn-outline-danger" data-id="${m.id}">Delete</button></td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    info.textContent = "Error loading data.";
  }
}

// --- EVENT: Show Messages Button ---
document.getElementById("showMessages").addEventListener("click", render);

// --- EVENT: Delete Button Click ---
tableBody.addEventListener("click", async (e)=>{
  const btn = e.target.closest("button[data-id]");
  if(!btn) return;
  
  if(!confirm("Are you sure you want to delete this message?")) return;

  const id = btn.dataset.id;

  try {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id })
    });
    
    const result = await res.json();
    if(result.status === "success"){
      info.textContent = "Message deleted.";
      render(); // Refresh the table
    } else {
      alert("Failed to delete.");
    }
  } catch (err) {
    console.error(err);
  }
});

// --- EVENT: Form Submit ---
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  clearValidation();
  info.textContent = "Sending...";

  if(!validate()){
    info.textContent = "Fix highlighted fields.";
    return;
  }

  const formData = {
    name: nameEl.value.trim(),
    email: emailEl.value.trim(),
    phone: phoneEl.value.trim(),
    message: msgEl.value.trim()
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if(result.status === "success") {
      form.reset();
      clearValidation();
      info.textContent = "Saved to database successfully!";
      // Check if table is visible, if so, refresh it
      if(tableBody.innerHTML.trim() !== "") render();
    } else {
      info.textContent = "Database Error: " + (result.message || "Unknown error");
    }

  } catch (error) {
    console.error(error);
    info.textContent = "Network error. Could not save.";
  }
});