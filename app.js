/* ======================================
   R DIVISION – TELOC EYE
   Frontend Controller (FINAL)
   ====================================== */

let cliChart = null;
let lpChart = null;

/* ---------- SAFE DOM READY ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

/* ---------- MAIN LOADER ---------- */
async function loadDashboard() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API fetch failed");

    const json = await res.json();
    console.log("API JSON:", json);

    processData(json);

  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard data");
  }
}

/* ---------- CORE PROCESSOR ---------- */
function processData(data) {

  /* Snapshot Date */
  document.getElementById("snapshotDate").innerText =
    data.snapshot_date || "–";

  /* KPI CARDS */
  document.getElementById("spmCount").innerText =
    data.kpi?.spm || "–";

  document.getElementById("cvvrsCount").innerText =
    data.kpi?.cvvrs || "–";

  document.getElementById("telocCount").innerText =
    data.kpi?.teloc || "–";

  document.getElementById("bulkCount").innerText =
    data.kpi?.bulk || "–";

  /* DROPDOWNS */
  populateDropdown("cliSelect", data.cli_performance);
  populateDropdown("lpSelect", data.lp_performance);

  /* DEFAULT CHARTS */
  if (data.cli_performance.length > 0) {
    drawCliChart(data.cli_performance[0]);
  }

  if (data.lp_performance.length > 0) {
    drawLpChart(data.lp_performance[0]);
  }

  /* CHANGE EVENTS */
  document.getElementById("cliSelect").onchange = e => {
    const obj = data.cli_performance.find(
      x => x.name === e.target.value
    );
    if (obj) drawCliChart(obj);
  };

  document.getElementById("lpSelect").onchange = e => {
    const obj = data.lp_performance.find(
      x => x.name === e.target.value
    );
    if (obj) drawLpChart(obj);
  };
}

/* ---------- DROPDOWN HELPER ---------- */
function populateDropdown(id, list) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";

  list.forEach((item, i) => {
    const opt = document.createElement("option");
    opt.value = item.name;
    opt.textContent = item.name;
    if (i === 0) opt.selected = true;
    sel.appendChild(opt);
  });
}

/* ---------- CLI CHART ---------- */
function drawCliChart(obj) {
  if (cliChart) cliChart.destroy();

  cliChart = new Chart(
    document.getElementById("cliChart"),
    {
      type: "bar",
      data: {
        labels: ["Analyses", "Issues"],
        datasets: [{
          label: obj.name,
          data: [obj.total, obj.issues]
        }]
      },
      options: {
        responsive: true
      }
    }
  );
}

/* ---------- LP CHART ---------- */
function drawLpChart(obj) {
  if (lpChart) lpChart.destroy();

  lpChart = new Chart(
    document.getElementById("lpChart"),
    {
      type: "bar",
      data: {
        labels: ["Clean", "Issues"],
        datasets: [{
          label: obj.name,
          data: [obj.clean, obj.issues]
        }]
      },
      options: {
        responsive: true
      }
    }
  );
}
