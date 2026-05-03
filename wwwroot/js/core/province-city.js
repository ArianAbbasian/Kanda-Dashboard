// Provinces Func =>

async function loadProvinces(selectElementId, selectedValue = '') {
    try {
        const response = await fetch('/User/GetProvinces');
        const provinces = await response.json();

        const select = document.getElementById(selectElementId);
        if (!select) return;

        if (selectElementId.includes('edit')) {
            select.innerHTML = '<option value="">-- انتخاب استان --</option>';
        } else if (selectElementId.includes('filter')) {
            select.innerHTML = '<option value="">همه استان‌ها</option>';
        } else {
            select.innerHTML = '<option value="">انتخاب کنید</option>';
        }

        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            if (selectedValue && province.id == selectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Loading Cities
        if (selectedValue) {
            const citySelectId = selectElementId.replace('Province', 'City');
            await loadCities(citySelectId, selectedValue);
        }
    } catch (error) {
        console.error('خطا در دریافت استان‌ها:', error);
    }
}

// Cities Func =>

async function loadCities(selectElementId, provinceId, selectedValue = '') {
    const citySelect = document.getElementById(selectElementId);
    if (!citySelect) return;

    if (!provinceId || provinceId === '') {
        if (selectElementId.includes('edit')) {
            citySelect.innerHTML = '<option value="">-- ابتدا استان را انتخاب کنید --</option>';
        } else if (selectElementId.includes('filter')) {
            citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید</option>';
        } else {
            citySelect.innerHTML = '<option value="">انتخاب کنید</option>';
        }
        citySelect.disabled = true;
        return;
    }

    try {
        const response = await fetch(`/User/GetCities?provinceId=${provinceId}`);
        const cities = await response.json();

        if (selectElementId.includes('edit')) {
            citySelect.innerHTML = '<option value="">-- انتخاب شهر --</option>';
        } else if (selectElementId.includes('filter')) {
            citySelect.innerHTML = '<option value="">همه شهرها</option>';
        } else {
            citySelect.innerHTML = '<option value="">انتخاب کنید</option>';
        }

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            if (selectedValue && city.id == selectedValue) {
                option.selected = true;
            }
            citySelect.appendChild(option);
        });

        citySelect.disabled = false;
    } catch (error) {
        console.error('خطا در دریافت شهرها:', error);
        citySelect.innerHTML = '<option value="">خطا در دریافت شهرها</option>';
    }
}