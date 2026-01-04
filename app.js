/****************************************************
 * R DIVISION – TELOC EYE
 * Frontend App Logic (FINAL – STABLE)
 ****************************************************/

let DASHBOARD_DATA = null;
let cliChart = null;
let lpChart = null;

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

/* ===============================
   LOAD DASHBOARD JSON
================================ */
async function loadDashboard() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API response not OK");

    DASHBOARD_DATA = await res.json();

    renderSnapshotDate();
    renderKPIs();
    initCLISelector();
    initLPSelector();

  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard data");
  }
}

/* ===============================
   SNAPSHOT DATE
================================ */
function renderSnapshotDate() {
  const el = document.getElementById("snapshotDate");
  if (el && DASHBOARD_DATA.snapshot_date) {
    el.textContent = DASHBOARD_DATA.snapshot_date;
  }
}

/* ===============================
   KPI CARDS
================================ */
function renderKPIs() {
  document.getElementById("spmCount").textContent =
    DASHBOARD_DATA.kpi.spm ?? "–";

  document.getElementById("cvvrsCount").textContent =
    DASHBOARD_DATA.kpi.cvvrs ?? "–";

  document.getElementById("telocCount").textContent =
    DASHBOARD_DATA.kpi.teloc ?? "–";

  document.getElementById("bulkCount").textContent =
    DASHBOARD_DATA.kpi.bulk ?? "–";
}

/* ===============================
   CLI PERFORMANCE
   Source: spm.csv + cvvrs.csv
================================ */
function initCLISelector() {
  const sel = document.getElementById("cliSelect");
  sel.innerHTML = "";

  const cliSet = new Set();
  DASHBOARD_DATA.cli_performance.forEach(r => cliSet.add(r.cli));

  cliSet.forEach(cli => {
    const opt = document.createElement("option");
    opt.value = cli;
    opt.textContent = cli;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    renderCLIChart(sel.value);
  });

  // default first CLI
  if (sel.options.length > 0) {
    renderCLIChart(sel.options[0].value);
  }
}

function renderCLIChart(cliName) {
  const rows = DASHBOARD_DATA.cli_performance.filter(
    r => r.cli === cliName
  );

  const labels = rows.map(r => r.system);
  const totals = rows.map(r => r.total);
  const issues = rows.map(r => r.issues);

  if (cliChart) cliChart.destroy();

  cliChart = new Chart(
    document.getElementById("cliChart"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total Analyses",
            data: totals
          },
          {
            label: "Irregularities",
            data: issues
          }
        ]
      },
      options: {
        responsive: true
      }
    }
  );
}

/* ===============================
   LP PERFORMANCE
   Source: spm + cvvrs + teloc
   (Continuous monitoring)
================================ */
function initLPSelector() {
  const sel = document.getElementById("lpSelect");
  sel.innerHTML = "";

  const lpSet = new Set();
  DASHBOARD_DATA.lp_performance.forEach(r => lpSet.add(r.lp));

  lpSet.forEach(lp => {
    const opt = document.createElement("option");
    opt.value = lp;
    opt.textContent = lp;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    renderLPChart(sel.value);
  });

  if (sel.options.length > 0) {
    renderLPChart(sel.options[0].value);
  }
}

function renderLPChart(lpName) {
  const rows = DASHBOARD_DATA.lp_performance.filter(
    r => r.lp === lpName
  );

  const labels = rows.map(r => r.metric);
  const values = rows.map(r => r.value);

  if (lpChart) lpChart.destroy();

  lpChart = new Chart(
    document.getElementById("lpChart"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "LP Performance",
            data: values
          }
        ]
      },
      options: {
        responsive: true
      }
    }
  );
}
