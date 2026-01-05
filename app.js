/* ===============================
   APP.JS - FINAL SYNCED VERSION
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  try {
    if (typeof API_URL === 'undefined') throw new Error("API_URL Missing");

    const res = await fetch(API_URL);
    const data = await res.json();
    
    // 1. Snapshot
    const snap = data.current_snapshot || {};
    document.getElementById("snapshotDate").innerText = new Date(data.generated_at).toLocaleString();
    document.getElementById("spmCount").innerText = snap.spm_rows || 0;
    document.getElementById("cvvrsCount").innerText = snap.cvvrs_rows || 0;
    document.getElementById("telocCount").innerText = snap.teloc_rows || 0;
    document.getElementById("bulkCount").innerText = snap.bulk_rows || 0;

    // 2. CLI Chart
    setupDropdown("cliSelect", data.cli_current_month, drawCLIChart);
    // 3. LP Chart
    setupDropdown("lpSelect", data.lp_health, drawLPChart);

  } catch (err) {
    console.error(err);
    alert("Dashboard Load Failed: " + err.message);
  }
}

function setupDropdown(id, dataObj, drawFunc) {
  const select = document.getElementById(id);
  const keys = Object.keys(dataObj || {});
  if (keys.length === 0) {
    select.innerHTML = "<option>No Data</option>";
    return;
  }
  select.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
  select.onchange = () => drawFunc(dataObj[select.value]);
  drawFunc(dataObj[keys[0]]);
}

let cliChart, lpChart;

function drawCLIChart(obj) {
  const ctx = document.getElementById("cliChart").getContext('2d');
  if (cliChart) cliChart.destroy();
  cliChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Total Analyses", "Issues Found"],
      datasets: [{
        label: "Count",
        data: [obj.analyses, obj.issues],
        backgroundColor: ["#0b3c5d", "#c62828"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function drawLPChart(obj) {
  const ctx = document.getElementById("lpChart").getContext('2d');
  if (lpChart) lpChart.destroy();
  lpChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Issues", "Clean Status"],
      datasets: [{
        data: [obj.involved, obj.clean ? 1 : 0],
        backgroundColor: ["#c62828", "#2e7d32"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
