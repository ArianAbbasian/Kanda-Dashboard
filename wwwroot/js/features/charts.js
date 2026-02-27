let pieChartRoles, pieChartProvinces, barChartUsers;
let chartsInitialized = false; // فلگ جدید

// Multi Color Generator
function generateDistinctColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 360 / count) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}

// ==================== Getting All Filtered Users From Server ====================
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
// متغیر برای جلوگیری از اجرای همزمان
let isUpdatingAdminChart = false;

async function UpdateAdminUsersPieChart() {
    if (isUpdatingAdminChart) {
        console.log('⚠️ نمودار ادمین در حال به‌روزرسانی است، صرف‌نظر می‌شود');
        return;
    }
    isUpdatingAdminChart = true;

    const canvas = document.getElementById('pieChartRoles');
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        isUpdatingAdminChart = false;
        return;
    }

    // نابود کردن نمونه قبلی
    if (pieChartRoles) {
        pieChartRoles.destroy();
        pieChartRoles = null;
    }

    // تأخیر کوتاه برای اطمینان از آزاد شدن کامل canvas
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        // دریافت کاربران فیلتر شده
        const users = await fetchAllFilteredUsers();

        // شمارش نوع کاربران
        const userTypeCount = {};
        users.forEach(u => {
            const userType = u.userType;
            userTypeCount[userType] = (userTypeCount[userType] || 0) + 1;
        });

        const labels = Object.keys(userTypeCount);
        const data = Object.values(userTypeCount);

        pieChartRoles = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels.map(l => {
                    if (l === 'admin') return 'مدیر';
                    if (l === 'special') return 'کاربر ویژه';
                    if (l === 'plus') return 'کاربر پلاس';
                    if (l === 'user') return 'کاربر عادی';
                    return l;
                }),
                datasets: [{
                    data: data,
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
        console.log('✅ نمودار ادمین با موفقیت به‌روز شد');
    } catch (error) {
        console.error('❌ خطا در ساخت نمودار ادمین:', error);
    } finally {
        isUpdatingAdminChart = false;
    }
}

// ==================== PIE CHART 2 ====================
async function updatePieChart() {
    try {
        const users = await fetchAllFilteredUsers();
        const canvas = document.getElementById('pieChartProvinces');
        const noDataDiv = document.getElementById('pieChartNoData');
        const ctx = canvas?.getContext('2d');

        if (pieChartProvinces) {
            pieChartProvinces.destroy();
            pieChartProvinces = null;
        }

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
            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

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

        if (barChartUsers) {
            barChartUsers.destroy();
            barChartUsers = null;
        }

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
            if (canvas) canvas.style.display = 'none';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

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
    if (chartsInitialized) {
        return;
    }

    chartsInitialized = true;
    UpdateAdminUsersPieChart();
    updatePieChart();
    updateBarChart();
}