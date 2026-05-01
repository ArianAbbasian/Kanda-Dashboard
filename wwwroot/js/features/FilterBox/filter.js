window.filterState = {
    name: '',
    username: '',
    email: '',
    userType: '',
    provinceId: '',
    cityId: ''
};

function getFilterValues() {
    return {
        name: document.getElementById('filterName')?.value || '',
        username: document.getElementById('filterUsername')?.value || '',
        email: document.getElementById('filterEmail')?.value || '',
        userType: document.getElementById('filterUserType')?.value || '',
        provinceId: document.getElementById('filterProvince')?.value || '',
        cityId: document.getElementById('filterCity')?.value || ''
    };
}

function updateFilterState() {
    window.filterState = getFilterValues();
    return window.filterState;
}
    
function applyFilters(callback) {
    const filters = updateFilterState();

    if (typeof updatePieChart === 'function') updatePieChart();
    if (typeof updateBarChart === 'function') updateBarChart();
    if (typeof loadMap === 'function') {
        loadMap();
    }
    if (typeof loadMap === 'function') loadMap();
    if (typeof UpdateAdminUsersPieChart === 'function') UpdateAdminUsersPieChart();
    if (typeof window.refreshProvinceChartsIfActive === 'function') {
        window.refreshProvinceChartsIfActive();
    }
    
    if (callback) callback(1, filters);
    window.clearPolygonFilter();
}

function resetFilters(callback) {
    document.getElementById('filterName').value = '';
    document.getElementById('filterUsername').value = '';
    document.getElementById('filterUserType').value = '';

    const provinceSelect = document.getElementById('filterProvince');
    provinceSelect.value = '';

    const citySelect = document.getElementById('filterCity');
    citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید</option>';
    citySelect.disabled = true;

    window.filterState = {
        name: '',
        username: '',
        email: '',
        userType: '',
        provinceId: '',
        cityId: ''
    };


    if (typeof updatePieChart === 'function') updatePieChart();
    if (typeof updateBarChart === 'function') updateBarChart();
    if (typeof loadMap === 'function') loadMap();
    if (typeof UpdateAdminUsersPieChart === 'function') UpdateAdminUsersPieChart();
    if (typeof window.refreshProvinceChartsIfActive === 'function') {
        window.refreshProvinceChartsIfActive();
    }

    if (callback) callback(1, {});
    window.clearPolygonFilter();
}

function initFilter(onFilterChange) {
    loadProvinces('filterProvince');

    document.getElementById('filterProvince').addEventListener('change', function () {
        loadCities('filterCity', this.value);
        window.filterState.provinceId = this.value;
        if (typeof updateBarChart === 'function') updateBarChart();
    });

    document.getElementById('applyFilterBtn').addEventListener('click', function () {
        applyFilters(onFilterChange);
    });

    document.getElementById('resetFilterBtn').addEventListener('click', function () {
        resetFilters(onFilterChange);
    });

    document.querySelectorAll('.filter-input').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                applyFilters(onFilterChange);
            }
        });
    });
}

function buildFilteredUrl(baseUrl, page, pageSize) {
    let url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;
    const f = window.filterState;
    if (f.name) url += `&name=${encodeURIComponent(f.name)}`;
    if (f.username) url += `&username=${encodeURIComponent(f.username)}`;
    if (f.email) url += `&email=${encodeURIComponent(f.email)}`;
    if (f.userType) url += `&userType=${encodeURIComponent(f.userType)}`;
    if (f.provinceId) url += `&provinceId=${f.provinceId}`;
    if (f.cityId) url += `&cityId=${f.cityId}`;
    console.log('URLLLLLL',url);
    return url;
}
