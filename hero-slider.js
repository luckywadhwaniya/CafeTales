// ===============================
// CafeTales Hero Slider (5 slides)
// Video-style: left text + right queue cards (3 visible)
// ===============================

const slides = [
  {
    bg: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=70",
    tag: "Cozy coffee • Fresh bakes • Calm vibes",
    title: "Where every sip tells a story.",
    subtitle: "CafeTales is your modern café experience—premium coffee, handcrafted desserts, and a warm ambience.",
    btn1: { text: "Reserve a Table", href: "reservation.html" },
    btn2: { text: "Explore Menu", href: "menu.html" },
    thumbTitle: "Story Latte",
    thumbSub: "Our signature vibe",
    thumbImg: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&q=70"
  },
  {
    bg: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1800&q=70",
    tag: "Espresso • Cappuccino • Latte",
    title: "Signature brews, made fresh.",
    subtitle: "From bold espresso shots to smooth lattes — crafted with care.",
    btn1: { text: "See Coffee Menu", href: "menu.html" },
    btn2: { text: "Book Your Seat", href: "reservation.html" },
    thumbTitle: "Coffee Craft",
    thumbSub: "Fresh brews daily",
    thumbImg: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=70"
  },
  {
    bg: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=1800&q=70",
    tag: "Desserts • Brownies • Cheesecake",
    title: "Desserts that match the mood.",
    subtitle: "Warm brownies, creamy cheesecake, and seasonal specials.",
    btn1: { text: "View Offers", href: "offers.html" },
    btn2: { text: "Explore Desserts", href: "menu.html" },
    thumbTitle: "Chocolate",
    thumbSub: "Warm & gooey",
    thumbImg: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=70"
  },
  {
    bg: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1800&q=70",
    tag: "Work • Study • Chill",
    title: "A space to focus & unwind.",
    subtitle: "Comfort seating, calm lighting, and a friendly vibe for long stays.",
    btn1: { text: "See Gallery", href: "gallery.html" },
    btn2: { text: "Reserve Now", href: "reservation.html" },
    thumbTitle: "Cafe Space",
    thumbSub: "Study-friendly",
    thumbImg: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=70"
  },
  {
    bg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=70",
    tag: "Open Mic • Games • Community",
    title: "Events that bring people together.",
    subtitle: "Open mic nights, board games, and weekend vibes—join us!",
    btn1: { text: "View Events", href: "events.html" },
    btn2: { text: "Contact Us", href: "contact.html" },
    thumbTitle: "Community",
    thumbSub: "Fun nights",
    thumbImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=70"
  }
];

// --- DOM ---
const bgStack = document.getElementById("bgStack");
const thumbs = document.getElementById("thumbs");
const dots = document.getElementById("dots");

const slideTag = document.getElementById("slideTag");
const slideTitle = document.getElementById("slideTitle");
const slideSubtitle = document.getElementById("slideSubtitle");
const slideBtn1 = document.getElementById("slideBtn1");
const slideBtn2 = document.getElementById("slideBtn2");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const curEl = document.getElementById("cur");
const totalEl = document.getElementById("total");

let index = 0;
let timer = null;

totalEl.textContent = String(slides.length).padStart(2, "0");

// --- Helpers ---
function safePad2(n){ return String(n).padStart(2, "0"); }

function buildBackgrounds(){
  bgStack.innerHTML = slides.map((s, i) => `
    <div class="bg-slide ${i===0 ? "active" : ""}" data-i="${i}"
      style="background-image:url('${s.bg}')"></div>
  `).join("");
}

function buildDots(){
  dots.innerHTML = slides.map((_, i) => `
    <div class="dot ${i===0 ? "active" : ""}" data-i="${i}"></div>
  `).join("");
}

function renderThumbs(activeIndex){
  // show active + next 2 (3 cards total)
  const visible = [];
  for(let k=0; k<3; k++){
    visible.push((activeIndex + k) % slides.length);
  }

  thumbs.innerHTML = visible.map((idx) => {
    const s = slides[idx];
    return `
      <div class="thumb ${idx===activeIndex ? "active" : ""}" data-i="${idx}">
        <img src="${s.thumbImg}" alt="${s.thumbTitle}">
        <div class="t-body">
          <div class="t-title">${s.thumbTitle}</div>
          <div class="t-sub">${s.thumbSub}</div>
        </div>
      </div>
    `;
  }).join("");
}

function applyContent(i){
  const s = slides[i];
  slideTag.textContent = s.tag;
  slideTitle.textContent = s.title;
  slideSubtitle.textContent = s.subtitle;

  slideBtn1.textContent = s.btn1.text;
  slideBtn1.href = s.btn1.href;

  slideBtn2.textContent = s.btn2.text;
  slideBtn2.href = s.btn2.href;

  curEl.textContent = safePad2(i + 1);
}

function setActive(i){
  const bgs = [...document.querySelectorAll(".bg-slide")];
  const d = [...document.querySelectorAll(".dot")];

  bgs.forEach(x => x.classList.remove("active"));
  d.forEach(x => x.classList.remove("active"));

  bgs[i].classList.add("active");
  d[i].classList.add("active");

  applyContent(i);
  renderThumbs(i);
}

function next(){
  index = (index + 1) % slides.length;
  setActive(index);
  restartAuto();
}

function prev(){
  index = (index - 1 + slides.length) % slides.length;
  setActive(index);
  restartAuto();
}

function restartAuto(){
  clearInterval(timer);
  timer = setInterval(() => {
    index = (index + 1) % slides.length;
    setActive(index);
  }, 3500);
}

// --- Init ---
buildBackgrounds();
buildDots();
setActive(0);
restartAuto();

// --- Events ---
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Click on thumb card
thumbs.addEventListener("click", (e) => {
  const card = e.target.closest(".thumb");
  if(!card) return;
  index = Number(card.dataset.i);
  setActive(index);
  restartAuto();
});

// Click dot
dots.addEventListener("click", (e) => {
  const dot = e.target.closest(".dot");
  if(!dot) return;
  index = Number(dot.dataset.i);
  setActive(index);
  restartAuto();
});

// Pause autoplay when mouse is over hero (nice UX)
const hero = document.querySelector(".hero-slider");
if(hero){
  hero.addEventListener("mouseenter", ()=> clearInterval(timer));
  hero.addEventListener("mouseleave", restartAuto);
}
