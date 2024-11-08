import { isWebp } from "./modules/function.js";

isWebp();

const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}; 

const lockPaddingElements = document.querySelector("header");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("body_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("body_lock")
}

function openPopup(popup = undefined) {
    lockBody()
    if (popup) {
        popup.classList.add("popup--open")
    } else {
        console.log("Give me a popup")
    }
}

function closePopup(popup = null) {
    if (!popup) {
        popup = document.querySelector(".popup--open")
    }

    popup.classList.remove("popup--open");
    popup.addEventListener("transitionend", () =>  {
        if (!document.querySelector(".header__burger--open") && !document.querySelector(".header__submenu--open")) {
            unlockBody() 
        }

    }, {once: true})
}

window.onload = function() {

    // breakpoints
    const desktopMediaQuery = window.matchMedia("(max-width: 1280px)")
    const bigTabletMediaQuery = window.matchMedia("(max-width: 1080px)")
    const tabletMediaQuery = window.matchMedia("(max-width: 992px)")
    const gapMediaQuery = window.matchMedia("(max-width: 768px)")
    const phoneMediaQuery = window.matchMedia("(max-width: 576px)")

    // header
    const headerEl = document.querySelector(".header");
    const burgerMenuEl = headerEl.querySelector(".header__burger");
    const menuEl = headerEl.querySelector(".header__menu-list")
    const searchBoxEl = headerEl.querySelector(".header__search")
    const searchBlockEl = searchBoxEl.querySelector(".header__search-block")
    const searchButtonEl = searchBoxEl.querySelector(".header__search-button")
    const closeSearchButtonEl = searchBoxEl.querySelector(".header__close-search")

    searchButtonEl.addEventListener("click", e => {
        const wrapperEl = e.currentTarget.closest(".header__inner-wrapper")

        if (window.innerWidth <= 1080) {
            headerEl.classList.toggle("_form-show")

        } else if (!headerEl.classList.contains("_form-show")) {
            headerEl.classList.add("_form-show")
            searchBoxEl.style.justifyContent = "flex-start"
            wrapperEl.addEventListener("transitionend", () => {
                // gap transition
                searchBlockEl.style.display = "flex"
                setTimeout(() => searchBlockEl.style.opacity = "1", 0)
            }, { once: true })
        }
    })

    closeSearchButtonEl.addEventListener("click", e => {
        const menuBlockEl = menuEl.closest(".header__main");

        if (headerEl.classList.contains("_form-show")) {
            searchBlockEl.style.opacity = ""
            searchBlockEl.addEventListener("transitionend", () => {
                searchBlockEl.style.display = ""
                headerEl.classList.remove("_form-show")
            }, { once: true })
            // не работает при < 1280
            menuBlockEl.addEventListener("transitionend", () => {
                if (!headerEl.classList.contains("_form-show")) {
                    searchBoxEl.style.justifyContent=""
                }
            }, { once: true })
        }
    })
    // const callback = function(entries, observer) {
    //     // элемент в видимой части экрана
    //     // в данном случае это headerEl
    //     if (entries[0].isIntersecting) {
    //         headerEl.classList.remove("header_scroll")
    //     } else {
    //         // элемент пропал с видимой части экрана
    //         headerEl.classList.add("header_scroll")
    //     }
    // }

    // const headerObserver = new IntersectionObserver(callback)
    // headerObserver.observe(headerEl)

    burgerMenuEl.addEventListener("click", () => {
        if (burgerMenuEl.classList.contains("header__burger--open")) {
            unlockBody()
            Array.from(menuEl.querySelectorAll(".header__menu-item--submenu-open")).forEach(el => {
                el.classList.remove("header__menu-item--submenu-open")
                el.querySelector(".header__submenu").style.height=""
            })
        } else {
            lockBody()
            window.scrollTo(0,0)
        }
        
        burgerMenuEl.classList.toggle("header__burger--open")
        menuEl.closest(".header__main").classList.toggle("header__main--open")
    })

    let timeoutId;
    menuEl.querySelector(".header__menu-item:first-child").addEventListener("click", (e) => {
        // const menuEl = e.currentTarget
        const submenuEl = menuEl.querySelector(".header__submenu")
        const submenuListEl = submenuEl.firstElementChild

        if (e.target.closest(".header__submenu")) {
            return
        }

        if (menuEl.classList.contains("header__menu-item--submenu-open")) {
            let submenuElHeight = submenuEl.scrollHeight;
            submenuEl.style.height = submenuElHeight + "px";
            menuEl.classList.remove("header__menu-item--submenu-open")
            timeoutId = setTimeout(() => submenuEl.style.height = "")
        } else {
            clearTimeout(timeoutId)
            timeoutId = null
            menuEl.classList.add("header__menu-item--submenu-open");
            submenuEl.style.height = submenuListEl.offsetHeight + "px";
            submenuEl.addEventListener("transitionend", () => {
                if (timeoutId) {
                    return
                }
                submenuEl.style.height = "auto"
            }, { once: true })
        }
    })

    function closeBurgerMenu(e) {
        if (!e.matches && burgerMenuEl.classList.contains("header__burger--open")) {
            // Array.from(mobileMenuEl.querySelectorAll(".menu__item._open")).forEach(menuItemEl => {
            //     menuItemEl.classList.remove("_open")
            //     menuItemEl.querySelector(".submenu").style.height = ""
            //     menuItemEl.querySelector(".submenu__menu").style.transform = ""
            // })
            Array.from(menuEl.querySelectorAll(".header__menu-item--submenu-open")).forEach(el => {
                el.classList.remove("header__menu-item--submenu-open")
                el.querySelector(".header__submenu").style.height=""
            })
            menuEl.closest(".header__main").classList.remove("header__main--open") 
            burgerMenuEl.classList.remove("header__burger--open")
            unlockBody()
        }
    }

    function closeSearchBlock(e) {
        if (e.matches) {
            return
        }
        
        if (headerEl.classList.contains("_form-show")) {
            searchBoxEl.style.justifyContent = "flex-start"
            searchBlockEl.style.cssText = `
                display: flex;
                opacity: 1
            `
        } else if (searchBlockEl.style.length) {
            // возможно стоит перенести блок в собитие клика
            searchBoxEl.style = ""
            searchBlockEl.style = ""
        }
    }

    desktopMediaQuery.addEventListener("change", closeBurgerMenu)
    bigTabletMediaQuery.addEventListener("change", closeSearchBlock)

    document.querySelectorAll("input[name='phone']").forEach(inputElement => {
        inputElement.addEventListener("keypress", (e) => {
            const length = e.target.value.length;
            if (e.charCode < 48 || e.charCode > 57 || length > 14) {
                e.preventDefault();
                return;
            }
    
            switch (length) {
                case 0: 
                    e.target.value = "8 " ;
                    break;
                case 5:
                case 9:
                case 12:
                    e.target.value += " ";
                    break;
                default:
                    break;
            }
        })
        inputElement.addEventListener("input", e => {e.target.value.length === 2 && (e.target.value = "")})
    })

    const faqItemHeaderEls = document.querySelectorAll(".accordion__header");
    faqItemHeaderEls.forEach(faqItemHeaderEl => {
        let timeoutId;
        faqItemHeaderEl.addEventListener("click", e => {
            const faqItemEl = faqItemHeaderEl.parentElement;
            const faqItemBodyEl = faqItemHeaderEl.nextElementSibling;
            const faqItemTextEl = faqItemBodyEl.firstElementChild;

            if (faqItemEl.classList.contains("accordion--open")) {
                let faqItemBodyHeight = faqItemBodyEl.scrollHeight;
                faqItemBodyEl.style.height = faqItemBodyHeight + "px";
                faqItemEl.classList.remove("accordion--open")
                timeoutId = setTimeout(() => faqItemBodyEl.style.height = "")
            } else {
                clearTimeout(timeoutId)
                timeoutId = null
                faqItemEl.classList.add("accordion--open");
                faqItemBodyEl.style.height = faqItemTextEl.offsetHeight + "px";
                faqItemBodyEl.addEventListener("transitionend", () => {
                    if (timeoutId) {
                        return
                    }
                    faqItemBodyEl.style.height = "auto"
                }, { once: true })
            }
        })
    })

    // FORMs
    const inputEls = document.querySelectorAll(".form__input")
    const phoneInputEls = document.querySelectorAll(".form__input[name='phone']")
    const nameInputEls = document.querySelectorAll(".form__input[name='name']")
    const inputControlClass = "form__control"

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
        inputEl.addEventListener("input", e => {e.target.value.length === 3 && (e.target.value = "")})
    })

    Array.from(nameInputEls).forEach(inputEl => {
        inputEl.addEventListener("keypress", (e) => {
            const length = e.target.value.length;
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


    // POPUPs
    document.querySelectorAll(".popup__close").forEach(closeEl => {
        let popupEl = closeEl.closest(".popup")
        closeEl.addEventListener("click", () => closePopup(popupEl))
    })
    
    document.querySelectorAll(".popup").forEach(
        popupEl => popupEl.addEventListener("click", e => {
            if (!e.target.closest(".popup__content")) {
                closePopup(popupEl)
            }
        })
    )
    
    document.addEventListener("keydown", (e) => {
        if (e.which === 27) {
            closePopup()
        }
    })
}