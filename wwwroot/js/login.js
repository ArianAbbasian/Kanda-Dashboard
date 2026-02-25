document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const FormError = document.getElementById("FormError");

    function isValidUsername(username) {
        return username && username.trim().length >= 3;
    }

    function isValidPassword(password) {
        return password && password.length >= 6;
    }

    function showElement(element) {
        if (element) element.classList.remove("hidden");
    }

    function hideElement(element) {
        if (element) element.classList.add("hidden");
    }

    usernameInput.addEventListener("input", function () {
        if (isValidUsername(this.value)) {
            hideElement(usernameError);
        } else {
            showElement(usernameError);
        }
    });

    passwordInput.addEventListener("input", function () {
        if (isValidPassword(this.value)) {
            hideElement(passwordError);
        } else {
            showElement(passwordError);
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isUsernameValid = isValidUsername(usernameInput.value);
        const isPasswordValid = isValidPassword(passwordInput.value);

        if (!isUsernameValid) showElement(usernameError);
        else hideElement(usernameError);

        if (!isPasswordValid) showElement(passwordError);
        else hideElement(passwordError);

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        const formData = new FormData(this);
        fetch('/Auth/Login', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.redirected) {
                    hideElement(FormError);
                    window.location.href = response.url;
                } else {
                    showElement(FormError);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});