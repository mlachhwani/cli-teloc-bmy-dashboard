console.log("APP.JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");
  loadDashboard();
});

/* ===============================
   MAIN DASHBOARD LOADER
   =============================== */
async function loadDashboard() {
  try {
    if (!window.API_URL) {
      alert("API_URL not found in config.js");
      return;
    }

    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("API DATA RECEIVED", data);

    renderSnapshot(data);
    renderCLI(data);
    renderLP(data);

  } catch (err) {
    console.error("FAILED TO LOAD DASHBOARD", err);
    alert("FAILED TO LOAD");
  }
}

/* ===============================
   SNAPSHOT KPI
   =============================== */
function renderSnapshot(data) {
  document.getElementById("snapshotDate").innerText =
    data.generated_at ? new Date(data.generated_at).toLocaleString() : "NA";

  document.getElementById("spmCount").innerText =
    data.current_snapshot?.spm_rows ?? "–";

  document.getElementById("cvvrsCount").innerText =
    data.current_snapshot?.cvvrs_rows ?? "–";

  document.getElementById("telocCount").innerText =
    data.current_snapshot?.teloc_rows ?? "–";

  document.getElementById("bulkCount").innerText =
    data.current_snapshot?.bulk_rows ?? "–";
}

/* ===============================
   CLI PERFORMANCE
   =============================== */
function renderCLI(data) {
  const cliSelect = document.getElementById("cliSelect");
  cliSelect.innerHTML = "";

  const cliData = data.cli_current_month || {};
  const clis = Object.keys(cliData);

  if (clis.length === 0) {
    cliSelect.innerHTML = "<option>No CLI data</option>";
    return;
  }

  clis.forEach(cli => {
    const opt = document.createElement("option");
    opt.value = cli;
    opt.textContent = cli;
    cliSelect.appendChild(opt);
  });

  cliSelect.addEventListener("change", () => {
    drawCLIChart(cliData[cliSelect.value]);
  });

  drawCLIChart(cliData[clis[0]]);
}

let cliChart;
function drawCLIChart(obj) {
  const ctx = document.getElementById("cliChart");
  if (!obj) return;

  if (cliChart) cliChart.destroy();

  cliChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Analyses", "Issues"],
      datasets: [{
        label: "CLI Performance",
        data: [obj.analyses, obj.issues],
        backgroundColor: ["#2e7d32", "#c62828"]
      }]
    }
  });
}

/* ===============================
   LP PERFORMANCE
   =============================== */
function renderLP(data) {
  const lpSelect = document.getElementById("lpSelect");
  lpSelect.innerHTML = "";

  const lpData = data.lp_health || {};
  const lps = Object.keys(lpData);

  if (lps.length === 0) {
    lpSelect.innerHTML = "<option>No LP data</option>";
    return;
  }

  lps.forEach(lp => {
    const opt = document.createElement("option");
    opt.value = lp;
    opt.textContent = lp;
    lpSelect.appendChild(opt);
  });

  lpSelect.addEventListener("change", () => {
    drawLPChart(lpData[lpSelect.value]);
  });

  drawLPChart(lpData[lps[0]]);
}

let lpChart;
function drawLPChart(obj) {
  const ctx = document.getElementById("lpChart");
  if (!obj) return;

  if (lpChart) lpChart.destroy();

  lpChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Involved", "Clean"],
      datasets: [{
        label: "LP Health",
        data: [obj.involved, obj.clean ? 1 : 0],
        backgroundColor: ["#c62828", "#2e7d32"]
      }]
    }
  });
}
