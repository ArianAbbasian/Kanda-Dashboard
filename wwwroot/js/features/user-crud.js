const deleteUrl = '/User/DeleteUser';
const editUrl = '/User/UpdateUser';
let currentUsername = document.getElementById('currentUsername')?.value;

// ==================== Deleting User ====================
async function deleteHandler(event) {
    const button = event.target;
    const row = button.closest('tr');
    const userId = row.dataset.userId;
    const username = row.querySelector('td:nth-child(4)')?.textContent || 'این کاربر';

    try {
        
        const confirmed = await confirm.delete(`آیا از حذف کاربر "${username}" اطمینان دارید؟`, 'حذف کاربر');

        if (!confirmed) {
            return; 
        }

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
                toast.success('حساب کاربری شما حذف شد. در حال انتقال به صفحه ورود...', 'موفقیت');
                setTimeout(() => {
                    window.location.href = '/Auth/Login';
                }, 2000);
            } else {
                toast.success(result.message, 'موفقیت');
                if (window.refreshUsers) window.refreshUsers();
            }
        } else {
            toast.error(result.message, 'خطا');
        }
    } catch (error) {
        console.error('خطا در حذف کاربر:', error);
        toast.error('خطا در ارتباط با سرور', 'خطا');
    }
}

// ==================== Editing User ====================
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
            toast.error(data.message, 'خطا');
        }
    } catch (error) {
        console.log("Problem in Getting Single User Data => ", error);
        toast.error('خطا در دریافت اطلاعات کاربر', 'خطا');
    }
}

// ==================== Openup Edit Modal====================
async function openEditModal(user) {

    document.getElementById('editProvince').innerHTML = '<option value="">-- انتخاب استان --</option>';
    document.getElementById('editCity').innerHTML = '<option value="">-- ابتدا استان را انتخاب کنید --</option>';
    const userTypeSelect = document.getElementById('editUserType');
    if (userTypeSelect) {
        const userType = user.userType || user.UserType || 'user';
        console.log('User type for modal:', userType); // برای دیباگ
        userTypeSelect.value = userType;
    }

    // Filling Inputs 
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFirstName').value = user.firstName || user.FirstName;
    document.getElementById('editLastName').value = user.lastName || user.LastName;
    document.getElementById('editUsername').value = user.username || user.Username;
    document.getElementById('editEmail').value = user.email || user.Email;
    document.getElementById('editPhone').value = user.phone || user.Phone;
    document.getElementById('editPassword').value = '';

    // Filling Provinces
    await loadProvinces('editProvince', user.provinceId);

    // Filling Cities
    if (user.provinceId) {
        await loadCities('editCity', user.provinceId, user.cityId);
    }

    document.getElementById('editModal').style.display = 'block';
}

// ==================== Sending New User Data => Server ====================
async function submitEditForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const provinceSelect = document.getElementById('editProvince');
    const citySelect = document.getElementById('editCity');
    const userTypeSelect = document.getElementById('editUserType');

    const userNewData = {
        Id: parseInt(formData.get('Id')),
        FirstName: formData.get('FirstName'),
        LastName: formData.get('LastName'),
        Username: formData.get('Username'),
        Email: formData.get('Email'),
        Phone: formData.get('Phone'),
        Password: formData.get('Password'),
        ProvinceId: provinceSelect.value ? parseInt(provinceSelect.value) : null,
        CityId: citySelect.value ? parseInt(citySelect.value) : null,
        UserType: userTypeSelect.value
    };

    const confirmed = await confirm.warning('آیا از ذخیره تغییرات اطمینان دارید؟', 'ویرایش اطلاعات');

    if (!confirmed) {
        return;
    }


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
            toast.success(result.message, 'موفقیت');
            document.getElementById('editModal').style.display = 'none';
            if (window.refreshUsers) window.refreshUsers();
        } else {
            toast.error(result.message, 'خطا');
        }
    } catch (error) {
        console.log("Error in Editing User => ", error);
        toast.error('خطا در ویرایش کاربر', 'خطا');
    }
}

// ==================== Modal Settings ====================
function initModal() {

    document.querySelector('.close')?.addEventListener('click', function () {
        document.getElementById('editModal').style.display = 'none';
    });

    document.getElementById('editProvince')?.addEventListener('change', function () {
        loadCities('editCity', this.value);
    });

    document.getElementById('editForm')?.addEventListener('submit', submitEditForm);
}