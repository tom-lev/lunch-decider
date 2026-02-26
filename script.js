// ========================
// LUNCH PICKER — script.js
// ========================

const FOOD_EMOJIS = {
  pizza: "🍕", sushi: "🍣", burger: "🍔", salad: "🥗", falafel: "🧆",
  sandwich: "🥪", pasta: "🍝", tacos: "🌮", ramen: "🍜", curry: "🍛",
  steak: "🥩", chicken: "🍗", fish: "🐟", soup: "🍲", wrap: "🌯",
  default: "🍽️"
};

const DEFAULT_OPTIONS = ["Pizza", "Sushi", "Burger", "Salad", "Falafel", "Sandwich", "Pasta", "Tacos", "Ramen"];

document.addEventListener("DOMContentLoaded", () => {
  const inputGroup   = document.getElementById("inputGroup");
  const addOptionBtn = document.getElementById("addOptionBtn");
  const decideBtn    = document.getElementById("decideBtn");
  const resultCard   = document.getElementById("resultCard");
  const resultDish   = document.getElementById("resultDish");
  const resultEmoji  = document.getElementById("resultEmoji");
  const rePickBtn    = document.getElementById("rePickBtn");
  const chime        = document.getElementById("chime");
  const muteBtn      = document.getElementById("muteBtn");
  const popup        = document.getElementById("errorPopup");
  const popupMsg     = document.getElementById("popupMessage");
  const popupClose   = document.getElementById("popupClose");

  let db = null;
  let firebase = null;
  let currentUser = null;

  // ── MUTE ──────────────────────────────────────────
  let isMuted = localStorage.getItem("muteState") === "true";
  chime.muted = isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    chime.muted = isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    localStorage.setItem("muteState", isMuted);
  });

  // ── POPUP ─────────────────────────────────────────
  function showPopup(msg) {
    popupMsg.textContent = msg;
    popup.classList.add("active");
  }
  popupClose.addEventListener("click", () => popup.classList.remove("active"));
  popup.addEventListener("click", e => { if (e.target === popup) popup.classList.remove("active"); });

  // ── HELPERS ───────────────────────────────────────
  function getInputValues() {
    return Array.from(document.querySelectorAll(".lunch-input")).map(i => i.value.trim()).filter(Boolean);
  }

  function getEmojiForDish(name) {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(FOOD_EMOJIS)) {
      if (key.includes(k)) return v;
    }
    return FOOD_EMOJIS.default;
  }

  function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }

  // ── INPUTS ────────────────────────────────────────
  function createInputRow(value = "") {
    const row = document.createElement("div");
    row.classList.add("input-row");

    const input = document.createElement("input");
    input.setAttribute("list", "lunch-options");
    input.setAttribute("placeholder", "Type a food option…");
    input.classList.add("lunch-input");
    input.value = value;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.type = "button";
    removeBtn.innerHTML = "×";
    removeBtn.addEventListener("click", () => {
      if (document.querySelectorAll(".input-row").length > 2) {
        row.style.opacity = "0";
        row.style.transform = "translateX(-20px)";
        row.style.transition = "opacity 0.2s, transform 0.2s";
        setTimeout(() => row.remove(), 200);
      } else {
        showPopup("You need at least 2 options!");
      }
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    row.style.animation = "fadeUp 0.3s ease both";
    return row;
  }

  // Datalist
  const datalist = document.createElement("datalist");
  datalist.id = "lunch-options";
  DEFAULT_OPTIONS.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o;
    datalist.appendChild(opt);
  });
  document.body.appendChild(datalist);

  // Init 2 rows
  ["", ""].forEach(() => inputGroup.appendChild(createInputRow()));

  addOptionBtn.addEventListener("click", () => {
    inputGroup.appendChild(createInputRow());
    const inputs = document.querySelectorAll(".lunch-input");
    inputs[inputs.length - 1].focus();
  });

  // ── DECISION ──────────────────────────────────────
  decideBtn.addEventListener("click", async () => {
    const options = getInputValues();
    const unique = [...new Set(options.map(o => o.toLowerCase()))]
      .map(lower => options.find(o => o.toLowerCase() === lower));

    if (unique.length < 2) {
      showPopup("Please enter at least 2 different options!");
      return;
    }

    const btnText = decideBtn.querySelector(".btn-text");
    btnText.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span>`;
    decideBtn.disabled = true;
    resultCard.classList.remove("visible");

    await new Promise(r => setTimeout(r, 900 + Math.random() * 400));

    const decision = unique[Math.floor(Math.random() * unique.length)];
    const emoji = getEmojiForDish(decision);

    resultDish.textContent = decision;
    resultEmoji.textContent = emoji;
    resultCard.classList.add("visible");

    btnText.textContent = "Pick for me!";
    decideBtn.disabled = false;

    chime.currentTime = 0;
    chime.play().catch(() => {});

    saveDecision(decision);
  });

  rePickBtn.addEventListener("click", () => {
    resultCard.classList.remove("visible");
    setTimeout(() => decideBtn.click(), 150);
  });

  // ── FIREBASE ──────────────────────────────────────
  window.addEventListener("firebaseReady", async (e) => {
    db = window.__db;
    firebase = window.__firebase;
    currentUser = window.__currentUser;
    if (!db || !currentUser) return;

    await loadStats();
    await loadHistory();
  });

  async function saveDecision(dish) {
    if (!db || !firebase || !currentUser) {
      addHistoryItemToDOM(dish, "just now");
      return;
    }
    try {
      const { collection, addDoc, Timestamp } = firebase;
      // Save under users/{uid}/decisions
      await addDoc(collection(db, "users", currentUser.uid, "decisions"), {
        dish,
        timestamp: Timestamp.now(),
        userDisplayName: currentUser.displayName
      });
      await loadStats();
      await loadHistory();
    } catch (e) {
      console.warn("Firebase write failed:", e);
      addHistoryItemToDOM(dish, "just now");
    }
  }

  async function loadStats() {
    if (!db || !firebase || !currentUser) return;
    try {
      const { collection, getDocs, query, where, Timestamp } = firebase;

      // Total by this user
      const allSnap = await getDocs(collection(db, "users", currentUser.uid, "decisions"));
      document.getElementById("totalDecisions").textContent = allSnap.size;

      // Today's most picked by this user
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayQ = query(
        collection(db, "users", currentUser.uid, "decisions"),
        where("timestamp", ">=", Timestamp.fromDate(todayStart))
      );
      const todaySnap = await getDocs(todayQ);
      const counts = {};
      todaySnap.forEach(doc => {
        const d = doc.data().dish;
        counts[d] = (counts[d] || 0) + 1;
      });
      const topDish = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      document.getElementById("topChoice").textContent = topDish ? topDish[0] : "–";
    } catch (e) {
      console.warn("Stats load failed:", e);
    }
  }

  async function loadHistory() {
    if (!db || !firebase || !currentUser) return;
    try {
      const { collection, getDocs, query, orderBy, limit } = firebase;
      const q = query(
        collection(db, "users", currentUser.uid, "decisions"),
        orderBy("timestamp", "desc"),
        limit(8)
      );
      const snap = await getDocs(q);
      const list = document.getElementById("historyList");
      list.innerHTML = "";

      if (snap.empty) {
        list.innerHTML = `<li class="history-empty">No decisions yet – make your first pick!</li>`;
        document.getElementById("historyCount").textContent = "0";
        return;
      }

      document.getElementById("historyCount").textContent = snap.size;
      snap.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        addHistoryItemToDOM(data.dish, date ? formatTime(date) : "");
      });
    } catch (e) {
      console.warn("History load failed:", e);
    }
  }

  function addHistoryItemToDOM(dish, timeStr) {
    const list = document.getElementById("historyList");
    const existing = list.querySelector(".history-empty");
    if (existing) existing.remove();

    const li = document.createElement("li");
    li.classList.add("history-item");
    li.innerHTML = `
      <span class="h-dish">${getEmojiForDish(dish)} ${dish}</span>
      <span class="h-time">${timeStr}</span>
    `;
    list.insertBefore(li, list.firstChild);
    while (list.children.length > 8) list.removeChild(list.lastChild);
    document.getElementById("historyCount").textContent = list.children.length;
  }
});
