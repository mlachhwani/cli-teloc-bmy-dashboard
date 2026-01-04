/*************************************************
 * R DIVISION – TELOC EYE
 * STEP-C3 : Frontend Controller
 * Source: Apps Script JSON API
 *************************************************/

let RAW_DATA = null;
let cliChart = null;
let lpChart = null;

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

/* ===============================
   LOAD API DATA
================================ */
async function loadDashboard() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    RAW_DATA = data;

    console.log("API Loaded ✔", data);

    fillSnapshotDate(data.generated_at);
    fillKPICards(data.cards);
    buildCLISection(data);
    buildLPSection(data);

  } catch (err) {
    console.error("API ERROR", err);
    alert("Failed to load dashboard data");
  }
}

/* ===============================
   TOP DATE
================================ */
function fillSnapshotDate(dateStr) {
  const el = document.getElementById("snapshotDate");
  if (!el) return;

  const d = new Date(dateStr);
  el.textContent = d.toLocaleDateString("en-GB");
}

/* ===============================
   KPI CARDS
================================ */
function fillKPICards(cards) {
  setText("spmCount", cards.spm.total);
  setText("cvvrsCount", cards.cvvrs.total);
  setText("telocCount", cards.teloc.total);
  setText("bulkCount", cards.bulk.violations_found);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? "–";
}

/* ===============================
   CLI PERFORMANCE
   Source: spm + cvvrs
================================ */
function buildCLISection(data) {

  const cliMap = {};

  // ---- SPM ----
  data.spm_rows?.forEach(r => {
    const cli = r.cli;
    if (!cli) return;

    if (!cliMap[cli]) {
      cliMap[cli] = { analysed: 0, issues: 0 };
    }
    cliMap[cli].analysed++;
    if (r.issue) cliMap[cli].issues++;
  });

  // ---- CVVRS ----
  data.cvvrs_rows?.forEach(r => {
    const cli = r.cli;
    if (!cli) return;

    if (!cliMap[cli]) {
      cliMap[cli] = { analysed: 0, issues: 0 };
    }
    cliMap[cli].analysed++;
    if (r.issue) cliMap[cli].issues++;
  });

  populateSelect("cliSelect", Object.keys(cliMap));

  document.getElementById("cliSelect").onchange = e => {
    drawCLIChart(cliMap, e.target.value);
  };

  // default
  if (Object.keys(cliMap).length > 0) {
    drawCLIChart(cliMap, Object.keys(cliMap)[0]);
  }
}

/* ===============================
   LP PERFORMANCE
   Source: spm + cvvrs + teloc
================================ */
function buildLPSection(data) {

  const lpMap = {};

  function addLP(lp, hasIssue) {
    if (!lp) return;
    if (!lpMap[lp]) {
      lpMap[lp] = { total: 0, clean: 0 };
    }
    lpMap[lp].total++;
    if (!hasIssue) lpMap[lp].clean++;
  }

  data.spm_rows?.forEach(r => addLP(r.lp, r.issue));
  data.cvvrs_rows?.forEach(r => addLP(r.lp, r.issue));
  data.teloc_rows?.forEach(r => addLP(r.lp, r.issue));

  populateSelect("lpSelect", Object.keys(lpMap));

  document.getElementById("lpSelect").onchange = e => {
    drawLPChart(lpMap, e.target.value);
  };

  if (Object.keys(lpMap).length > 0) {
    drawLPChart(lpMap, Object.keys(lpMap)[0]);
  }
}

/* ===============================
   CHARTS
================================ */
function drawCLIChart(map, cli) {
  const ctx = document.getElementById("cliChart");
  if (!ctx) return;

  const d = map[cli];
  if (!d) return;

  if (cliChart) cliChart.destroy();

  cliChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Analysed", "Issues Found"],
      datasets: [{
        data: [d.analysed, d.issues],
        backgroundColor: ["#0b5ed7", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function drawLPChart(map, lp) {
  const ctx = document.getElementById("lpChart");
  if (!ctx) return;

  const d = map[lp];
  if (!d) return;

  if (lpChart) lpChart.destroy();

  lpChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Duties", "Clean Duties"],
      datasets: [{
        data: [d.total, d.clean],
        backgroundColor: ["#6c757d", "#198754"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

/* ===============================
   UTIL
================================ */
function populateSelect(id, list) {
  const sel = document.getElementById(id);
  if (!sel) return;

  sel.innerHTML = "";
  list.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

