const apiUrl = '/User/GetFilteredUsers';
let currentPage = 1;
let totalPages = 1;
const pageSize = 5;

// ==================== Loading USers ====================
async function loadUsers(page, customFilters = null) {
    try {
        const filters = customFilters || (window.filterState || {});

        let url = `${apiUrl}?page=${page}&pageSize=${pageSize}`;

        if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
        if (filters.username) url += `&username=${encodeURIComponent(filters.username)}`;
        if (filters.email) url += `&email=${encodeURIComponent(filters.email)}`;
        if (filters.provinceId) url += `&provinceId=${filters.provinceId}`;
        if (filters.cityId) url += `&cityId=${filters.cityId}`;

        const response = await fetch(url);
        const data = await response.json();

        totalPages = data.totalPages;
        currentPage = data.currentPage;

        // ===== badge updating =====
        const badge = document.getElementById('usersCountBadge');
        if (badge && data.totalFilteredUsers !== undefined) {
            badge.innerText = data.totalFilteredUsers;
        }

        if (!data.users || data.users.length === 0) {
            toast.info('هیچ کاربری با این مشخصات یافت نشد', 'نتیجه جستجو');

            const tbody = document.getElementById('tableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="empty-state">هیچ کاربری یافت نشد</td></tr>';

            const pagination = document.getElementById('pagination');
            if (pagination) pagination.style.display = 'none';

            return;
        }

        document.getElementById('usersTable').style.display = '';
        document.getElementById('pagination').style.display = '';

        renderTable(data.users, page);
        renderPagination(currentPage, totalPages, (newPage) => {
            loadUsers(newPage, filters);
        });

    } catch (error) {
        console.error('خطا در دریافت اطلاعات:', error);
        toast.error('خطا در دریافت اطلاعات', 'خطا');
    }
}

// ==================== Showing Table ====================
function renderTable(users, page) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const rowNumber = (page - 1) * pageSize + index + 1;
        const isSelf = (user.username === currentUsername);


        const userEmail = user.email || user.Email || '---';
        const userPhone = user.phone || user.Phone || '---';
        const firstName = user.firstName || user.FirstName || '---';
        const lastName = user.lastName || user.LastName || '---';
        const username = user.username || user.Username || '---';

        const deleteButton = isSelf
            ? '<button class="table-btn delete-btn" disabled style="opacity:0.5; cursor:not-allowed;" title="نمی‌توانید خود را حذف کنید">❌</button>'
            : '<button class="table-btn delete-btn">❌</button>';
        const editButton = '<button class="table-btn edit-btn">✏️</button>';

        const provinceName = user.provinceName || user.ProvinceName || '---';
        const cityName = user.cityName || user.CityName || '---';

        const row = `<tr data-user-id="${user.id}">
            <td>${rowNumber}</td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${username}</td>
            <td>${userEmail}</td>
            <td>${userPhone}</td>
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


window.refreshUsers = () => loadUsers(currentPage);



// ==================== START ====================
document.addEventListener('DOMContentLoaded', function () {


    // Entry Loading (USERS)
    loadUsers(1);

    // Modal Activion
    if (typeof initModal === 'function') initModal();

    // Filter Activion
    if (typeof initFilter === 'function') {
        initFilter((page, filters) => loadUsers(page, filters));
    }

    // Tabs Activion
    if (typeof initTabs === 'function') initTabs();
    

    
});