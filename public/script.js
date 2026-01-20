async function updateDashboard() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('stats').innerText = JSON.stringify(stats, null, 2);
    } catch (err) {
        console.error('Failed to fetch stats:', err);
    }
}


setInterval(updateDashboard, 10000);
updateDashboard();
