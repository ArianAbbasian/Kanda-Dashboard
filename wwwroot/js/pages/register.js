document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const firstNameInput = document.getElementById("FirstName");
    const lastNameInput = document.getElementById("LastName");
    const usernameInput = document.getElementById("Username");
    const passwordInput = document.getElementById("Password");
    const emailInput = document.getElementById("Email");
    const phoneInput = document.getElementById("Phone");
    const provinceSelect = document.getElementById("ProvinceId");
    const citySelect = document.getElementById("CityId");
    const registerBtn = registerForm?.querySelector('button[type="submit"]');

    const errorElements = {
        FirstName: document.getElementById("FirstName-error"),
        LastName: document.getElementById("LastName-error"),
        Username: document.getElementById("Username-error"),
        Password: document.getElementById("Password-error"),
        Email: document.getElementById("Email-error"),
        Phone: document.getElementById("Phone-error"),
        ProvinceId: document.getElementById("ProvinceId-error"),
        CityId: document.getElementById("CityId-error"),
    };

    const inputs = [firstNameInput, lastNameInput, usernameInput, passwordInput, emailInput, phoneInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener("input", function () {
                const errorSpan = errorElements[this.id];
                if (errorSpan) errorSpan.textContent = '';
            });
        }
    });


    if (typeof loadProvinces === 'function') {
        loadProvinces('ProvinceId');
    }


    if (provinceSelect) {
        provinceSelect.addEventListener('change', function () {
            if (typeof loadCities === 'function') {
                loadCities('CityId', this.value);
            }
            if (errorElements.ProvinceId) errorElements.ProvinceId.textContent = '';
        });
    }

    if (citySelect) {
        citySelect.addEventListener('change', function () {
            if (errorElements.CityId) errorElements.CityId.textContent = '';
        });
    }


    registerForm?.addEventListener("submit", async function (e) {
        e.preventDefault();


        Object.values(errorElements).forEach(el => {
            if (el) el.textContent = '';
        });


        let isValid = true;
        if (!firstNameInput.value.trim()) {
            errorElements.FirstName.textContent = 'نام را وارد کنید';
            isValid = false;
        }
        if (!lastNameInput.value.trim()) {
            errorElements.LastName.textContent = 'نام خانوادگی را وارد کنید';
            isValid = false;
        }
        if (!usernameInput.value.trim()) {
            errorElements.Username.textContent = 'نام کاربری را وارد کنید';
            isValid = false;
        } else if (usernameInput.value.length < 3) {
            errorElements.Username.textContent = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
            isValid = false;
        }
        if (!passwordInput.value) {
            errorElements.Password.textContent = 'رمز عبور را وارد کنید';
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            errorElements.Password.textContent = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
            isValid = false;
        }
        if (!emailInput.value) {
            errorElements.Email.textContent = 'ایمیل را وارد کنید';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            errorElements.Email.textContent = 'ایمیل معتبر نیست';
            isValid = false;
        }
        if (!phoneInput.value) {
            errorElements.Phone.textContent = 'شماره تماس را وارد کنید';
            isValid = false;
        } else if (!/^(\+98|0)?9\d{9}$/.test(phoneInput.value)) {
            errorElements.Phone.textContent = 'شماره تماس معتبر نیست';
            isValid = false;
        }
        if (!provinceSelect.value) {
            errorElements.ProvinceId.textContent = 'استان را انتخاب کنید';
            isValid = false;
        }
        if (!citySelect.value) {
            errorElements.CityId.textContent = 'شهر را انتخاب کنید';
            isValid = false;
        }

        if (!isValid) return;

        if (registerBtn) {
            registerBtn.disabled = true;
            registerBtn.textContent = 'در حال ثبت‌نام...';
        }

        const formData = new FormData(registerForm);

        if (!formData.has('UserType')) {
            formData.append('UserType', 'user');
        }

        try {
            const response = await fetch('/Auth/Register', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {

                window.location.href = result.redirectUrl;
            } else {

                if (result.errors) {
                    for (const [field, messages] of Object.entries(result.errors)) {
                        const errorSpan = errorElements[field];
                        if (errorSpan) {
                            errorSpan.textContent = messages.join(', ');
                        }
                    }
                } else {
                    alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
                }

                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.textContent = 'ثبت نام';
                }
            }
        } catch (error) {
            console.error('خطا:', error);
            alert('خطا در ارتباط با سرور');
            if (registerBtn) {
                registerBtn.disabled = false;
                registerBtn.textContent = 'ثبت نام';
            }
        }
    });
});