/* ======================================================
   R DIVISION – TELOC EYE
   STEP-D1 : KPI Cards Binding
   ====================================================== */

console.log("APP.JS LOADED");

/* ---------- DOM READY ---------- */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");
  loadDashboard();
});

/* ---------- MAIN LOADER ---------- */
async function loadDashboard() {
  try {
    const response = await fetch(API_CONFIG.API_URL);

    if (!response.ok) {
      throw new Error("API fetch failed");
    }

    const data = await response.json();
    console.log("API DATA RECEIVED", data);

    bindSnapshot(data);
    bindKPIs(data);

  } catch (err) {
    console.error("DASHBOARD LOAD ERROR", err);
    alert("Failed to load dashboard data");
  }
}

/* ---------- SNAPSHOT DATE ---------- */
function bindSnapshot(data) {
  const snapEl = document.getElementById("snapshotDate");

  if (!data.generated_at) {
    snapEl.textContent = "not available";
    return;
  }

  const d = new Date(data.generated_at);
  snapEl.textContent = d.toLocaleString("en-IN");
}

/* ---------- KPI CARDS ---------- */
function bindKPIs(data) {
  const snap = data.current_snapshot || {};

  setText("spmCount", snap.spm_rows);
  setText("cvvrsCount", snap.cvvrs_rows);
  setText("telocCount", snap.teloc_rows);
  setText("bulkCount", snap.bulk_rows);
}

/* ---------- SAFE SETTER ---------- */
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = (value !== undefined && value !== null) ? value : "–";
}
