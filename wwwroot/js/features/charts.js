let pieChartRoles, pieChartProvinces, barChartUsers;
let isUpdatingAdminChart = false;
let isUpdatingPieProvinces = false;
let isUpdatingBarChart = false;

function generateDistinctColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 360 / count) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}

// ==================== PIE CHART 1: User Types ====================
async function UpdateAdminUsersPieChart() {
    if (isUpdatingAdminChart) return;
    isUpdatingAdminChart = true;

    const ctx = document.getElementById('pieChartRoles')?.getContext('2d');
    if (!ctx) {
        isUpdatingAdminChart = false;
        return;
    }

    try {
        if (pieChartRoles) {
            pieChartRoles.destroy();
            pieChartRoles = null;
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        const data = await getFilteredUsers(1, 1000);
        const users = data.users || [];

        const userTypeCount = {};
        users.forEach(u => {
            const type = u.userType || 'user';
            userTypeCount[type] = (userTypeCount[type] || 0) + 1;
        });

        const labels = Object.keys(userTypeCount);
        const values = Object.values(userTypeCount);
        const persianLabels = labels.map(l => {
            if (l === 'admin') return 'مدیر';
            if (l === 'special') return 'کاربر ویژه';
            if (l === 'plus') return 'کاربر پلاس';
            return 'کاربر عادی';
        });

        pieChartRoles = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: persianLabels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#FF304F', '#FF9F1C', '#2A9D8F', '#8338EC'],
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
    } catch (error) {
        console.error('خطا در نمودار تنوع کاربران:', error);
    } finally {
        isUpdatingAdminChart = false;
    }
}

// ==================== PIE CHART 2: Provinces Distribution ====================
async function updatePieChart() {
    if (isUpdatingPieProvinces) return;
    isUpdatingPieProvinces = true;

    const canvas = document.getElementById('pieChartProvinces');
    const noDataDiv = document.getElementById('pieChartNoData');
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        isUpdatingPieProvinces = false;
        return;
    }

    try {
        if (pieChartProvinces) {
            pieChartProvinces.destroy();
            pieChartProvinces = null;
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        const data = await getFilteredUsers(1, 1000);
        const users = data.users || [];

        const provinceCount = {};
        users.forEach(u => {
            const province = u.provinceName || 'نامشخص';
            provinceCount[province] = (provinceCount[province] || 0) + 1;
        });

        const labels = Object.keys(provinceCount);
        const values = Object.values(provinceCount);

        if (labels.length === 0) {
            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

        if (noDataDiv) noDataDiv.style.display = 'none';
        if (canvas) canvas.style.display = 'block';

        const colors = generateDistinctColors(labels.length);
        pieChartProvinces = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true,
                        labels: { font: { family: 'IRANYekan' } }
                    }
                }
            }
        });
    } catch (error) {
        console.error('خطا در نمودار استان‌ها:', error);
    } finally {
        isUpdatingPieProvinces = false;
    }
}

// ==================== BAR CHART ====================
async function updateBarChart() {
    if (isUpdatingBarChart) return;
    isUpdatingBarChart = true;

    const canvas = document.getElementById('barChartUsers');
    const noDataDiv = document.getElementById('barChartNoData');
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        isUpdatingBarChart = false;
        return;
    }

    try {
        if (barChartUsers) {
            barChartUsers.destroy();
            barChartUsers = null;
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        const data = await getFilteredUsers(1, 1000);
        const users = data.users || [];
        const filters = window.filterState || {};

        let labels, values;
        if (filters.provinceId) {
            const cityCount = {};
            users.forEach(u => {
                if (u.provinceId == filters.provinceId) {
                    const city = u.cityName || 'نامشخص';
                    cityCount[city] = (cityCount[city] || 0) + 1;
                }
            });
            labels = Object.keys(cityCount);
            values = Object.values(cityCount);
        } else {
            const provinceCount = {};
            users.forEach(u => {
                const province = u.provinceName || 'نامشخص';
                provinceCount[province] = (provinceCount[province] || 0) + 1;
            });
            labels = Object.keys(provinceCount);
            values = Object.values(provinceCount);
        }

        if (labels.length === 0) {
            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

        if (noDataDiv) noDataDiv.style.display = 'none';
        if (canvas) canvas.style.display = 'block';

        barChartUsers = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: filters.provinceId ? 'تعداد در هر شهر' : 'تعداد در هر استان',
                    data: values,
                    backgroundColor: '#3498db',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#ecf0f1' } },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (error) {
        console.error('خطا در نمودار میله‌ای:', error);
    } finally {
        isUpdatingBarChart = false;
    }
}

// ==================== Start ====================
function loadCharts() {
    UpdateAdminUsersPieChart();
    updatePieChart();
    updateBarChart();
}