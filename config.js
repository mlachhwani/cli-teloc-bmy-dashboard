/* ===============================
   R DIVISION – TELOC EYE
   Frontend Controller (FINAL)
   =============================== */

let DASHBOARD_DATA = null;
let cliChart = null;
let lpChart = null;

/* ========= LOAD DASHBOARD ========= */
document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API failed");

    DASHBOARD_DATA = await res.json();

    console.log("API JSON:", DASHBOARD_DATA);

    renderSnapshotDate();
    renderKPIs();
    populateCLISelector();
    populateLPSelector();

  } catch (err) {
    alert("Failed to load dashboard data");
    console.error(err);
  }
}

/* ========= SNAPSHOT DATE ========= */
function renderSnapshotDate() {
  const el = document.getElementById("snapshotDate");
  el.textContent = DASHBOARD_DATA.snapshot_date || "–";
}

/* ========= KPI CARDS ========= */
function renderKPIs() {
  document.getElementById("spmCount").textContent =
    DASHBOARD_DATA.kpi.spm || 0;

  document.getElementById("cvvrsCount").textContent =
    DASHBOARD_DATA.kpi.cvvrs || 0;

  document.getElementById("telocCount").textContent =
    DASHBOARD_DATA.kpi.teloc || 0;

  document.getElementById("bulkCount").textContent =
    DASHBOARD_DATA.kpi.bulk || 0;
}

/* ========= CLI SELECTOR ========= */
function populateCLISelector() {
  const sel = document.getElementById("cliSelect");
  sel.innerHTML = "";

  DASHBOARD_DATA.cli_performance.forEach(cli => {
    const opt = document.createElement("option");
    opt.value = cli.cli;
    opt.textContent = cli.cli;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    renderCLIChart(sel.value);
  });

  if (sel.value) renderCLIChart(sel.value);
}

/* ========= LP SELECTOR ========= */
function populateLPSelector() {
  const sel = document.getElementById("lpSelect");
  sel.innerHTML = "";

  DASHBOARD_DATA.lp_performance.forEach(lp => {
    const opt = document.createElement("option");
    opt.value = lp.lp;
    opt.textContent = lp.lp;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    renderLPChart(sel.value);
  });

  if (sel.value) renderLPChart(sel.value);
}

/* ========= CLI BAR CHART ========= */
function renderCLIChart(cliName) {
  const ctx = document.getElementById("cliChart").getContext("2d");

  const rows = DASHBOARD_DATA.cli_performance
    .filter(r => r.cli === cliName);

  const labels = rows.map(r => r.system);
  const issues = rows.map(r => r.issues);
  const total = rows.map(r => r.total);

  if (cliChart) cliChart.destroy();

  cliChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Issues",
          data: issues
        },
        {
          label: "Total Checks",
          data: total
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" }
      }
    }
  });
}

/* ========= LP BAR CHART ========= */
function renderLPChart(lpName) {
  const ctx = document.getElementById("lpChart").getContext("2d");

  const rows = DASHBOARD_DATA.lp_performance
    .filter(r => r.lp === lpName);

  const labels = rows.map(r => r.system);
  const clean = rows.map(r => r.clean);
  const total = rows.map(r => r.total);

  if (lpChart) lpChart.destroy();

  lpChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Clean Runs",
          data: clean
        },
        {
          label: "Total Runs",
          data: total
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" }
      }
    }
  });
}

