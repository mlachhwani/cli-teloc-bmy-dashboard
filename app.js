console.log("APP.JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");
  loadDashboard();
});

async function loadDashboard() {
  try {
    console.log("Fetching API:", CONFIG.API_URL);

    const res = await fetch(CONFIG.API_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("HTTP ERROR: " + res.status);
    }

    const data = await res.json();
    console.log("API DATA RECEIVED", data);

    // Snapshot date
    document.getElementById("snapshotDate").innerText =
      new Date(data.generated_at).toLocaleString();

    // KPI counts
    document.getElementById("spmCount").innerText =
      data.current_snapshot.spm_rows ?? 0;

    document.getElementById("cvvrsCount").innerText =
      data.current_snapshot.cvvrs_rows ?? 0;

    document.getElementById("telocCount").innerText =
      data.current_snapshot.teloc_rows ?? 0;

    document.getElementById("bulkCount").innerText =
      data.current_snapshot.bulk_rows ?? 0;

  } catch (err) {
    console.error("FAILED TO LOAD DASHBOARD", err);
    alert("FAILED TO LOAD");
  }
}
