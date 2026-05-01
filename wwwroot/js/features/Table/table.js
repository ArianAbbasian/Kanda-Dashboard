let currentPage = 1;
let totalPages = 1;
const pageSize = 5;

// Getting UserName For preventing Self Delete
function getCurrentUsername() {
    return document.getElementById('currentUsername')?.value || '';
}
function getUserTypeDisplay(userType) {
    let text = '', cssClass = '';
    switch (userType) {
        case 'admin':
            text = 'مدیر';
            cssClass = 'user-type-admin';
            break;
        case 'special':
            text = 'ویژه';
            cssClass = 'user-type-special';
            break;
        case 'plus':
            text = 'پلاس';
            cssClass = 'user-type-plus';
            break;
        default:
            text = 'عادی';
            cssClass = 'user-type-normal';
    }
    return { text, cssClass };
}

// Render the table rows
function renderTable(users, page) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    const currentUsername = getCurrentUsername();

    users.forEach((user, index) => {
        const rowNumber = (page - 1) * pageSize + index + 1;
        const isSelf = (user.username === currentUsername);

        const firstName = user.firstName || '---';
        const lastName = user.lastName || '---';
        const username = user.username || '---';
        const email = user.email || '---';
        const phone = user.phone || '---';
        const provinceName = user.provinceName || '---';
        const cityName = user.cityName || '---';

        const userType = user.userType || 'user';
        const { text: userTypeText, cssClass: userTypeClass } = getUserTypeDisplay(userType);

        const deleteButton = isSelf
            ? '<button class="table-btn delete-btn" disabled style="opacity:0.5; cursor:not-allowed;" title="نمی‌توانید خود را حذف کنید">❌</button>'
            : '<button class="table-btn delete-btn">❌</button>';
        const editButton = '<button class="table-btn edit-btn">✏️</button>';

        const row = `<tr data-user-id="${user.id}">
            <td>${rowNumber}</td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${username}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${provinceName}</td>
            <td>${cityName}</td>
            <td><span class="user-type-badge ${userTypeClass}">${userTypeText}</span></td>
            <td>
                ${editButton}
                ${deleteButton}
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    // Attach event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editHandler);
    });
    document.querySelectorAll('.delete-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', deleteHandler);
    });
}

// Load users from data-fetcher
async function loadTableUsers(page = 1) {
    try {
        const data = await getFilteredUsers(page, pageSize);
        totalPages = data.totalPages;
        currentPage = data.currentPage;

        // Update Count Users
        const badge = document.getElementById('usersCountBadge');
        if (badge && data.totalFilteredUsers !== undefined) {
            badge.innerText = data.totalFilteredUsers;
        }

        const tbody = document.getElementById('tableBody');
        const paginationDiv = document.getElementById('pagination');

        if (!data.users || data.users.length === 0) {
            toast.info('هیچ کاربری با این مشخصات یافت نشد', 'نتیجه جستجو');
            if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="empty-state">هیچ کاربری یافت نشد</td></tr>';
            if (paginationDiv) paginationDiv.style.display = 'none';
            return;
        }

        document.getElementById('usersTable').style.display = '';
        if (paginationDiv) paginationDiv.style.display = '';

        renderTable(data.users, page);
        renderPagination(currentPage, totalPages, (newPage) => {
            loadTableUsers(newPage);
        });

    } catch (error) {
        console.error('خطا در دریافت اطلاعات جدول:', error);
        toast.error('خطا در دریافت اطلاعات', 'خطا');
    }
}
function refreshTable() {
    loadTableUsers(currentPage);
}

// Making Table Functions Globall
window.refreshTable = refreshTable;
window.loadTableUsers = loadTableUsers;