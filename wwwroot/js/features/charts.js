let pieChartRoles, pieChartProvinces, barChartUsers;
// Color Generator
function generateDistinctColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 360 / count) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}

// ==================== Getting All Users From Server ====================
async function fetchAllFilteredUsers() {
    const filters = window.filterState || {};
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.username) params.append('username', filters.username);
    if (filters.email) params.append('email', filters.email);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);
    if (filters.cityId) params.append('cityId', filters.cityId);
    params.append('pageSize', '1000'); 

    const url = `/User/GetFilteredUsers?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.users || [];
}

// ==================== PIE CHART 1 ====================
function UpdateAdminUsersPieChart() {
    const ctx = document.getElementById('pieChartRoles')?.getContext('2d');
    if (!ctx) return;
    if (pieChartRoles) pieChartRoles.destroy();

    pieChartRoles = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['کاربران عادی', 'مدیران', 'کاربران ویژه', 'کاربران پلاس'],
            datasets: [{
                data: [55, 5, 15, 25],
                backgroundColor: ['#3498db', '#e74c3c', '#e59f2e', '#a63bdd'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: { font: { family: 'IRANYekan' } }
                }
            },
            maintainAspectRatio: true,
            aspectRatio: 1,
        }
    });
}

// ==================== PIE CHART 2 ====================
async function updatePieChart() {
    try {
        const users = await fetchAllFilteredUsers();
        const canvas = document.getElementById('pieChartProvinces');
        const noDataDiv = document.getElementById('pieChartNoData');
        const ctx = canvas?.getContext('2d');


        if (noDataDiv) noDataDiv.style.display = 'none';
        if (canvas) canvas.style.display = 'block';

        // Group By Province Name
        const provinceCount = {};
        users.forEach(u => {
            const province = u.provinceName || 'نامشخص';
            provinceCount[province] = (provinceCount[province] || 0) + 1;
        });

        const labels = Object.keys(provinceCount);
        const data = Object.values(provinceCount);

        if (labels.length === 0) {
            if (pieChartProvinces) {
                pieChartProvinces.destroy();
                pieChartProvinces = null;
            }
            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

        if (pieChartProvinces) pieChartProvinces.destroy();

        const colors = generateDistinctColors(labels.length);
        pieChartProvinces = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', rtl: true, labels: { font: { family: 'IRANYekan' } } },
                    title: {
                        display: true,
                    }
                }
            }
        });
    } catch (error) {
        console.error('خطا در به‌روزرسانی نمودار پای:', error);
    }
}

// ==================== BAR CHART ====================
async function updateBarChart() {
    try {
        const users = await fetchAllFilteredUsers();
        const filters = window.filterState || {};
        const canvas = document.getElementById('barChartUsers');
        const noDataDiv = document.getElementById('barChartNoData');
        const ctx = canvas?.getContext('2d');


        if (noDataDiv) noDataDiv.style.display = 'none';
        if (canvas) canvas.style.display = 'block';

        let labels, data;
        if (filters.provinceId) {

            const cityCount = {};
            users.forEach(u => {
                if (u.provinceId == filters.provinceId) {
                    const city = u.cityName || 'نامشخص';
                    cityCount[city] = (cityCount[city] || 0) + 1;
                }
            });
            labels = Object.keys(cityCount);
            data = Object.values(cityCount);
        } else {

            const provinceCount = {};
            users.forEach(u => {
                const province = u.provinceName || 'نامشخص';
                provinceCount[province] = (provinceCount[province] || 0) + 1;
            });
            labels = Object.keys(provinceCount);
            data = Object.values(provinceCount);
        }

        if (labels.length === 0) {

            if (barChartUsers) {
                barChartUsers.destroy();
                barChartUsers = null;
            }

            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

        if (barChartUsers) barChartUsers.destroy();

        barChartUsers = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: '#3498db',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#ecf0f1' } },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (error) {
        console.error('خطا در به‌روزرسانی نمودار میله‌ای:', error);
    }
}
function loadCharts() {
    UpdateAdminUsersPieChart();
    updatePieChart();
    updateBarChart();
}