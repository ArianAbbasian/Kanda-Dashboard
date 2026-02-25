const apiUrl = '/User/GetUsers';
const deleteUrl = '/User/DeleteUser';
const editUrl = '/User/UpdateUser';
let currentPage = 1;
let totalPages = 1;
const pageSize = 5;

// reading UserName from hidden element
const currentUsername = document.getElementById('currentUsername')?.value;

// ==================== Fetching / Getting  Users ====================
async function loadUsers(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        totalPages = data.totalPages;
        currentPage = data.currentPage;

        renderTable(data.users, page);
        renderPagination(currentPage, totalPages, loadUsers);
    } catch (error) {
        console.error('خطا در دریافت اطلاعات:', error);
    }
}

// ==================== Showing the Table / Buttons Event Listeners =====================
function renderTable(users, page) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    users.forEach((user, index) => {
        const rowNumber = (page - 1) * pageSize + index + 1;
        const isSelf = (user.username === currentUsername);
        // Delete Button (If its the user Loged in then the Button is Desabled)
        const deleteButton = isSelf
            ? '<button class="table-btn delete-btn" disabled style="opacity:0.5; cursor:not-allowed;" title="نمی‌توانید خود را حذف کنید">❌</button>'
            : '<button class="table-btn delete-btn">❌</button>';
        // Edit Button (To Open the Edit Modal)
        const editButton = '<button class="table-btn edit-btn">✏️</button>';

        const provinceName = user.provinceName || '---';
        const cityName = user.cityName || '---';
        const row = `<tr data-user-id="${user.id}">
            <td>${rowNumber}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${provinceName}</td>
            <td>${cityName}</td>
            <td>
                ${editButton}
                ${deleteButton}
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editHandler);
    });

    document.querySelectorAll('.delete-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', deleteHandler);
    });
}

// ==================== Delete User Function ====================
async function deleteHandler(event) {
    const button = event.target;
    const row = button.closest('tr');
    const userId = row.dataset.userId;

    if (!confirm(' از حذف این کاربر اطمینان دارید؟')) {
        return;
    }

    try {
        const response = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${userId}`
        });
        const result = await response.json();
        if (result.success) {
            if (result.selfDeleted) {
                alert('حساب کاربری شما حذف شد. به صفحه ورود هدایت می‌شوید.');
                window.location.href = '/Auth/Login';
            } else {
                alert(result.message);
                loadUsers(currentPage);
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('خطا در حذف کاربر:', error);
        alert('خطا در ارتباط با سرور');
    }
}

// ==================== Edit Function (Filling Edit Modal Inputs) ====================
async function editHandler(event) {
    const button = event.target;
    const row = button.closest('tr');
    const userId = row.dataset.userId;

    try {
        const response = await fetch(`/User/GetUser?id=${userId}`);
        const data = await response.json();

        if (data.success) {
            openEditModal(data.user);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.log("Problem in Getting Single User Data => ", error);
        alert("Trouble in Getting User");
    }
}

// ==================== Edit Modal ====================
async function openEditModal(user) {

    document.getElementById('editProvince').innerHTML = '<option value="">-- انتخاب استان --</option>';
    document.getElementById('editCity').innerHTML = '<option value="">-- ابتدا استان را انتخاب کنید --</option>';
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone;
    document.getElementById('editPassword').value = '';

    await loadProvinces();

    if (user.provinceId) {
        document.getElementById('editProvince').value = user.provinceId;
        await loadCities(user.provinceId);


        if (user.cityId) {
            document.getElementById('editCity').value = user.cityId;
        }
    }
    document.getElementById('editModal').style.display = 'block';
}

// Modal Close Button
document.querySelector('.close')?.addEventListener('click', function () {
    document.getElementById('editModal').style.display = 'none';
});

// Sending Edited Form
document.getElementById('editForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const provinceSelect = document.getElementById('editProvince');
    const citySelect = document.getElementById('editCity');

    const userNewData = {
        Id: parseInt(formData.get('Id')),
        FirstName: formData.get('FirstName'),
        LastName: formData.get('LastName'),
        Username: formData.get('Username'),
        Email: formData.get('Email'),
        Phone: formData.get('Phone'),
        Password: formData.get('Password'),
        ProvinceId: provinceSelect.value ? parseInt(provinceSelect.value) : null,
        CityId: citySelect.value ? parseInt(citySelect.value) : null
    };

    try {
        const response = await fetch(editUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userNewData)
        });
        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('editModal').style.display = 'none';
            loadUsers(currentPage);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.log("Error in Editing User => ", error);
        alert("Problem in Editing User !");
    }
});

// ====================  City and Province Management  ====================

async function loadProvinces() {
    try {
        const response = await fetch('/User/GetProvinces');
        const provinces = await response.json();
        const select = document.getElementById('editProvince');
        select.innerHTML = '<option value="">-- انتخاب استان --</option>';
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('خطا در دریافت استان‌ها:', error);
    }
    
}

async function loadCities(provinceId) {
    if (!provinceId) {
        document.getElementById('editCity').innerHTML = '<option value="">-- ابتدا استان را انتخاب کنید --</option>';
        return;
    }
    try {
        const response = await fetch(`/User/GetCities?provinceId=${provinceId}`);
        const cities = await response.json();
        const select = document.getElementById('editCity');
        select.innerHTML = '<option value="">-- انتخاب شهر --</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('خطا در دریافت شهرها:', error);
    }
}

// Changing Province Event Listener
document.getElementById('editProvince')?.addEventListener('change', function () {
    loadCities(this.value);
});

// ==================== Start ====================
document.addEventListener('DOMContentLoaded', () => loadUsers(1));