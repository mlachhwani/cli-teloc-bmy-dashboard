/* ===============================
   APP.JS - CSP COMPATIBLE VERSION
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("System Initializing...");
  loadDashboard();
});

async function loadDashboard() {
  try {
    if (typeof API_URL === 'undefined') {
      throw new Error("API_URL Missing in config.js");
    }

    console.log("Fetching data from API...");
    const res = await fetch(API_URL);
    
    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
    
    const data = await res.json();
    console.log("Data successfully received", data);
    
    // 1. Snapshot Update
    if (data.generated_at) {
      document.getElementById("snapshotDate").innerText = new Date(data.generated_at).toLocaleString();
    }

    const snap = data.current_snapshot || {};
    document.getElementById("spmCount").innerText = snap.spm_rows ?? 0;
    document.getElementById("cvvrsCount").innerText = snap.cvvrs_rows ?? 0;
    document.getElementById("telocCount").innerText = snap.teloc_rows ?? 0;
    document.getElementById("bulkCount").innerText = snap.bulk_rows ?? 0;

    // 2. CLI Chart & Dropdown
    if (data.cli_current_month) {
      setupDropdown("cliSelect", data.cli_current_month, drawCLIChart);
    }

    // 3. LP Chart & Dropdown
    if (data.lp_health) {
      setupDropdown("lpSelect", data.lp_health, drawLPChart);
    }

  } catch (err) {
    console.error("Critical Error:", err);
    alert("Dashboard Error: " + err.message);
    document.getElementById("snapshotDate").innerText = "Error Loading Data";
  }
}

function setupDropdown(id, dataObj, drawFunc) {
  const select = document.getElementById(id);
  const keys = Object.keys(dataObj || {});
  
  if (keys.length === 0) {
    select.innerHTML = "<option>No Data Available</option>";
    return;
  }
  
  select.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
  
  select.onchange = () => {
    const selectedData = dataObj[select.value];
    drawFunc(selectedData);
  };

  // Initial Draw
  drawFunc(dataObj[keys[0]]);
}

// Global Chart instances
let cliChart = null;
let lpChart = null;

// Common Chart Options to avoid CSP issues (Disabling animations & eval-like logic)
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false, // Prevents CSP eval errors
  layout: { padding: 10 },
  plugins: {
    legend: { display: true, position: 'bottom' }
  }
};

function drawCLIChart(obj) {
  const canvas = document.getElementById("cliChart");
  if (!canvas || !obj) return;
  const ctx = canvas.getContext('2d');

  if (cliChart) {
    cliChart.destroy();
  }

  cliChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Total Analyses", "Issues Found"],
      datasets: [{
        label: "Performance Metrics",
        data: [obj.analyses || 0, obj.issues || 0],
        backgroundColor: ["#0b3c5d", "#c62828"],
        borderColor: ["#0b3c5d", "#c62828"],
        borderWidth: 1
      }]
    },
    options: commonChartOptions
  });
}

function drawLPChart(obj) {
  const canvas = document.getElementById("lpChart");
  if (!canvas || !obj) return;
  const ctx = canvas.getContext('2d');

  if (lpChart) {
    lpChart.destroy();
  }

  lpChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Issues", "Clean Status"],
      datasets: [{
        data: [obj.involved || 0, obj.clean ? 1 : 0],
        backgroundColor: ["#c62828", "#2e7d32"]
      }]
    },
    options: commonChartOptions
  });
}
