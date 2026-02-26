document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (!registerForm) {
        console.log('فرم ثبت‌نام یافت نشد');
        return;
    }

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Client Validation
        if (!$(registerForm).valid()) {
            return;
        }

        const formData = new FormData(this);

        fetch('/Auth/Register', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.redirected) {
                    
                    window.location.href = response.url;
                } else {
                    
                    return response.text().then(html => {
                        

                        window.location.reload();
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.location.reload();
            });
    });
});