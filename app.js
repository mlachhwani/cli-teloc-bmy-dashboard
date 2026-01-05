let currentData = null;
let cliChart = null;

async function loadDashboard() {
    const date = document.getElementById("targetDate").value;
    const url = `${API_URL}&date=${date}`;
    
    try {
        const res = await fetch(url);
        currentData = await res.json();
        renderSnapshot(currentData.snapshot);
        renderCLI(currentData.cli_performance);
        renderLP(currentData.lp_performance);
    } catch (e) { console.error("Load Failed", e); }
}

function renderSnapshot(s) {
    document.getElementById("spm").innerText = s.spm_count;
    document.getElementById("cvvrs").innerText = s.cvvrs_count;
    document.getElementById("teloc").innerText = s.teloc_count;
    document.getElementById("bulk").innerText = s.violations;
}

function renderCLI(data) {
    const select = document.getElementById("cliSelect");
    select.innerHTML = Object.keys(data).map(k => `<option value="${k}">${k}</option>`).join('');
    select.onchange = () => updateCLIChart(data[select.value]);
    if(Object.keys(data).length > 0) updateCLIChart(data[Object.keys(data)[0]]);
}

function updateCLIChart(obj) {
    const ctx = document.getElementById("cliChart").getContext('2d');
    if(cliChart) cliChart.destroy();
    cliChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Analysis Done', 'Irregularities Detected'],
            datasets: [{ data: [obj.done, obj.issues], backgroundColor: ['#1e3a5f', '#e63946'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderLP(data) {
    const body = document.getElementById("lpBody");
    body.innerHTML = Object.keys(data).map(k => `
        <tr>
            <td>${k}</td>
            <td>${data[k].abnormalities}</td>
            <td class="${data[k].status === 'CLEAN' ? 'status-clean' : 'status-risk'}">${data[k].status}</td>
        </tr>
    `).join('');
}

function filterLP() {
    const q = document.getElementById("lpSearch").value.toUpperCase();
    const rows = document.getElementById("lpBody").getElementsByTagName("tr");
    for (let r of rows) {
        r.style.display = r.innerText.toUpperCase().includes(q) ? "" : "none";
    }
}

// Set default date to today
document.getElementById("targetDate").valueAsDate = new Date();
loadDashboard();
