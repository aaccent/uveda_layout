function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Валидация российского номер
function validateRuPhone(str) {
    return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(str);
}

function resetForm(form) {
    form.reset();
    form.classList.remove("form--sending")
    form.querySelectorAll(".form__control").forEach(controlEl => controlEl.className = "form__control")
    form.querySelectorAll("input, textarea").forEach(inputEl => inputEl.disabled = false)
}

function addError(input, message) {
    input.closest(".form__field").classList.add("form__field--error")
    input.closest(".form__field").querySelector(".form__error-text").innerHTML = message
}

function showError(emailInput) {
    // first, set form attribut noValidate to true
    emailInput.closest(".form__control").classList.add("form__control--error")

    if (emailInput.valid.valueMissing) {
        // field is empty
        emailInput.classList(".form__control").querySelector(".form__error-text").innerHTML = "Обязятельное поле, введите почту"
    } else if (emailInput.valid.typeMismatch) {
        // field doesn't contain an email address
        emailInput.classList(".form__control").querySelector(".form__error-text").innerHTML = "Введите почту"
    } else if (email.valid.tooShort) {
        // If the data is too short,
        // display the following error message.
        emailInput.classList(".form__control").querySelector(".form__error-text").innerHTML = `Email should be at least ${emailInput.minLength} characters; you entered ${emailInput.value.length}.`
    } else if (emailInput.valid.pattetnMismatch) {
        // field doesn't equal the pattern
    }
}

function validateForm(form) {    
    const reqFiedls = form.querySelectorAll("[class$='input--required']")

    let errors = 0;
    for (let i = 0; i < reqFiedls.length; i++) {
        if (reqFiedls[i].getAttribute("name") === "name") {
            if (reqFiedls[i].value.trim() === "") {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }
        }
        if (reqFiedls[i].getAttribute("name") === "phone") {
            if (reqFiedls[i].value.trim() === "" || reqFiedls[i].value.length < 18) {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }
        }
        const emailField = form.querySelector("input[type='email']")

        if (reqFiedls[i].getAttribute("name") === "mail") {
            if (reqFiedls[i].value.trim() === "" || (reqFiedls[i].value.trim !== "" && !validateEmail(emailField.value))) {
                reqFiedls[i].closest(".form__control").classList.add("form__control--error");
                errors++;
            }

            // if (!reqFiedls[i].checkValidity) {
            //     showError(reqFiedls[i])
            // }
        }

    }

    if (errors) {
        console.log("Fill req fields");
    } else {
        form.classList.add("form--sending")
        form.querySelectorAll("input, textarea").forEach(formField => formField.disabled = true)
        setTimeout(() => {
            // changeContentPage(form)
            resetForm(form)
        }, 200)
    }
}

const inputEls = document.querySelectorAll(".form__input")
const phoneInputEls = document.querySelectorAll(".form__input[name='phone']")
const nameInputEls = document.querySelectorAll(".form__input[name='name']")
const inputControlClass = "form__field"

Array.from(inputEls).forEach(inputEl => {
    let inputControlEl = inputEl.closest("." + inputControlClass)

    inputEl.addEventListener("input", () => {
        if (inputControlEl.classList.contains(inputControlClass + "--error")) {
            inputControlEl.classList.remove(inputControlClass + "--error")
        }
    })

    inputEl.addEventListener("change", () => {
        if (inputEl.value.trim() !== "") {
            inputControlEl.classList.add("form__control--filled")
        } else {
            inputControlEl.classList.remove("form__control--filled")
        }
    })
})

Array.from(phoneInputEls).forEach(inputEl => {
    inputEl.addEventListener("keypress", (e) => {
        const length = e.target.value.length;

        if (e.charCode < 48 || e.charCode > 57 || length > 17) {
            e.preventDefault();
            return;
        }

        switch (length) {
            case 0: 
                e.target.value = "+7 (" ;
                break;               
            case 7:
                e.target.value += ")-";
                break;
            case 12:
            case 15:
                e.target.value += "-";
                break;
            default:
                break;
        }
    })
    inputEl.addEventListener("input", e => {e.target.value.length === 4 && (e.target.value = "")})
})

Array.from(nameInputEls).forEach(inputEl => {
    inputEl.addEventListener("keypress", (e) => {
        if (e.charCode >= 48 && e.charCode <= 57) {
            e.preventDefault();
            return;
        }
    })
})

for (let i = 0; i < document.forms.length; i++) {
    document.forms[i].addEventListener("submit", e => {
        e.preventDefault();
        validateForm(e.target)
    })
}

document.querySelector(".form__file-input")?.addEventListener("change", e => {
    if (e.target.files[0].size > 100 * 1024 * 1024) {
        alert("Размер файла не должен превышать 30 MB")
        return
    }
    const parentEl = e.target.closest(".form__file");
    parentEl.querySelector(".form__file-doc .text").innerHTML = e.target.files[0].name
    parentEl.classList.add("form__file_attached")
    parentEl.querySelector(".form__file-doc button").addEventListener("click", () => {
        e.target.value = "";
        parentEl.classList.remove("form__file_attached")
    }, { once: true })
})