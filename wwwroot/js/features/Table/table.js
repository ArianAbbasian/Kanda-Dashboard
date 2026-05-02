let currentPage = 1;
let totalPages = 1;
const pageSize = 5;
let selectedUserIds = [];
const SELECTED_USERS_LS_KEY = 'selectedUserIds';
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
    const selectedUserIdsInStorage = getSelectedUserIdsFromLocalStorage(); // Get IDs from localStorage

    // Ensure selectAllCheckbox exists before interacting with it
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.onclick = null; // Clear previous listeners
    }

    users.forEach((user, index) => {
        const rowNumber = (page - 1) * pageSize + index + 1;
        const isSelf = (user.username === currentUsername);
        const isSelected = selectedUserIdsInStorage.includes(user.id.toString()); // Check if this user is selected

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

        // Add the checkbox cell, pre-checked if selected in localStorage
        const row = `<tr data-user-id="${user.id}" ${isSelected ? 'class="selected-row"' : ''}>
            <td><input type="checkbox" class="row-select-checkbox" data-user-id="${user.id}" ${isSelected ? 'checked' : ''}></td>
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


    document.querySelectorAll('.row-select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleRowSelection);
    });


    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editHandler);
    });
    document.querySelectorAll('.delete-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', deleteHandler);
    });


    if (selectAllCheckbox) {
        selectAllCheckbox.removeEventListener('change', handleSelectAll);
        selectAllCheckbox.addEventListener('change', handleSelectAll);
        updateSelectAllCheckboxState(); 
    }
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
            clearLocalStorageSelection(); 
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

// handle individual row selection
function handleRowSelection(event) {
    const checkbox = event.target;
    const userId = checkbox.getAttribute('data-user-id');
    const row = checkbox.closest('tr');

    if (checkbox.checked) {
        row.classList.add('selected-row');
        addUserIdToLocalStorage(userId); // Save to localStorage
    } else {
        row.classList.remove('selected-row');
        removeUserIdFromLocalStorage(userId); // Remove from localStorage
    }

    updateSelectAllCheckboxState(); // Update the "select all" checkbox state
}

function handleSelectAll(event) {
    const isChecked = event.target.checked;
    const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
    const userIdsToUpdate = [];

    rowCheckboxes.forEach(checkbox => {
        if (checkbox.checked !== isChecked) { // Only process if state needs changing
            checkbox.checked = isChecked;
            const userId = checkbox.getAttribute('data-user-id');
            const row = checkbox.closest('tr');
            if (isChecked) {
                row.classList.add('selected-row');
                userIdsToUpdate.push(userId); // Add to list for localStorage update
            } else {
                row.classList.remove('selected-row');
            }
            // Manually trigger change event if needed for other listeners, though handleRowSelection is called per row.
            // For selectAll, we directly manipulate DOM and then update localStorage once.
        }
    });

    // Update localStorage based on the "select all" action
    if (isChecked) {
        const allCurrentIds = getSelectedUserIdsFromLocalStorage();
        userIdsToUpdate.forEach(id => {
            if (!allCurrentIds.includes(id)) {
                allCurrentIds.push(id);
            }
        });
        saveSelectedUserIdsToLocalStorage(allCurrentIds);
    } else {
        // If unchecking "select all", remove all currently selected user IDs from localStorage
        // This assumes the current page's checkboxes were all selected.
        // A more robust approach might involve removing only those that were selected THIS session.
        // For simplicity here, we clear all and re-add those not deselected.
        const currentIds = getSelectedUserIdsFromLocalStorage();
        const deselectedIds = Array.from(rowCheckboxes).filter(cb => !cb.checked).map(cb => cb.getAttribute('data-user-id'));
        const finalIds = currentIds.filter(id => !deselectedIds.includes(id));
        saveSelectedUserIdsToLocalStorage(finalIds);

        // Alternative: If "select all" unchecks, simply clear all localStorage entries.
        // clearLocalStorageSelection();
    }
}

function updateSelectAllCheckboxState() {
    const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (!selectAllCheckbox) return;

    if (rowCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        return;
    }

    let allChecked = true;
    rowCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });
    selectAllCheckbox.checked = allChecked;
}

function updateSelectAllCheckboxState() {
    const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (!selectAllCheckbox) return;

    let allChecked = true;
    rowCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });
    selectAllCheckbox.checked = allChecked;
}

function addUserIdToSelection(userId) {
    if (!selectedUserIds.includes(userId)) {
        selectedUserIds.push(userId);
    }
}

function removeUserIdFromSelection(userId) {
    selectedUserIds = selectedUserIds.filter(id => id !== userId);
}

function getSelectedUserIds() {
    // If you want to get IDs directly from checkboxes:
    const selectedCheckboxes = document.querySelectorAll('.row-select-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-user-id'));
    // Or return the managed array:
    // return selectedUserIds;
}

// You might want to clear the selection when loading new data or navigating pages
function clearSelection() {
    selectedUserIds = [];
    document.querySelectorAll('.row-select-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('tr.selected-row').forEach(row => row.classList.remove('selected-row'));
    updateSelectAllCheckboxState();
}

// ------------------------------------------------ Local Storage ------------------------------------------------
function getSelectedUserIdsFromLocalStorage() {
    const storedIds = localStorage.getItem(SELECTED_USERS_LS_KEY);
    try {
        return storedIds ? JSON.parse(storedIds) : [];
    } catch (e) {
        console.error("Error parsing localStorage data:", e);
        return [];
    }
}
function saveSelectedUserIdsToLocalStorage(userIds) {
    localStorage.setItem(SELECTED_USERS_LS_KEY, JSON.stringify(userIds));
    updateSelectedUserCount();
}
function addUserIdToLocalStorage(userId) {
    const userIds = getSelectedUserIdsFromLocalStorage();
    if (!userIds.includes(userId)) {
        userIds.push(userId);
        saveSelectedUserIdsToLocalStorage(userIds);
    }
}
function removeUserIdFromLocalStorage(userId) {
    const userIds = getSelectedUserIdsFromLocalStorage();
    const updatedUserIds = userIds.filter(id => id !== userId);
    saveSelectedUserIdsToLocalStorage(updatedUserIds);
}
function clearLocalStorageSelection() {
    localStorage.removeItem(SELECTED_USERS_LS_KEY);
    updateSelectedUserCount()
}
function updateMarkerStyle(marker, userId) {
    const selectedUserIds = getSelectedUserIdsFromLocalStorage();
    if (selectedUserIds.includes(String(userId))) {
        marker.setStyle(SelectedMarkerStyle);
    } else {
        marker.setStyle(originalMarkerStyle);
    }
}
function findMarkerByUserId(userId) {
    let foundMarker = null;
    vectorSource.forEachFeature((feature) => {
        if (feature.values_.user && String(feature.values_.user.id) === String(userId)) {
            foundMarker = feature;
        }
    });
    return foundMarker;
}

// Making Table Functions Globall
window.refreshTable = refreshTable;
window.loadTableUsers = loadTableUsers;