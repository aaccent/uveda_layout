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

const lockPaddingElements = document.querySelector(".header__wrapper");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("_lock")
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

function getVhUnit() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function getScrollWidthValue() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${paddingValue / 16}rem`);
}

window.addEventListener('resize', getVhUnit);
getVhUnit()

getScrollWidthValue()
// document.addEventListener("DOMContentLoaded", () => {
// })

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
    const consultationButtonEls = headerEl.querySelectorAll(".header__button")

    const consultationPopupEl = document.querySelector(".popup--consultation");

    Array.from(consultationButtonEls).forEach(buttonEl => {
        buttonEl.addEventListener("click", e => {
            openPopup(consultationPopupEl)
        })
    })

    function documentActions(e) {
        const targetEl = e.target;
    
        if (
            !targetEl.closest(".header__search") 
            && headerEl.classList.contains("_form-show")
            && window.innerWidth > 1080
        ) {
            closeSearchButtonEl.click()
        }
    }

    document.addEventListener("click", documentActions)

    // Header
    const callback = function(entries, observer) {
        // элемент в видимой части экрана
        // в данном случае это headerEl
        if (entries[0].isIntersecting) {
            headerEl.classList.add("header--black")
        } else {
            // элемент пропал с видимой части экрана
            headerEl.classList.remove("header--black")
        }
    }

    const headerObserver = new IntersectionObserver(callback)
    if (headerEl.classList.contains("header--black")) {
        headerObserver.observe(headerEl)
    }

    searchButtonEl.addEventListener("click", e => {
        const wrapperEl = e.currentTarget.closest(".header__inner-wrapper")

        if (window.innerWidth <= 1080) {
            if (!burgerMenuEl.classList.contains("header__burger--open")) {
                if (headerEl.classList.contains("_form-show")) {
                    unlockBody()
                } else {
                    lockBody()
                }
            }
            headerEl.classList.toggle("_form-show")
        } else if (!headerEl.classList.contains("_form-show")) {
            headerEl.classList.add("_form-show")
            menuEl.closest(".header__main").style.overflow = "hidden"
            searchBoxEl.style.justifyContent = "flex-start"
            wrapperEl.addEventListener("transitionend", () => {
                // gap transition
                searchBlockEl.style.display = "flex"
                setTimeout(() => searchBlockEl.style.opacity = "1", 0)
            }, { once: true })
        }
    })

    closeSearchButtonEl.addEventListener("click", () => {
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
                    menuBlockEl.style.overflow = ""
                }
            }, { once: true })
        }
    })

    burgerMenuEl.addEventListener("click", () => {
        if (burgerMenuEl.classList.contains("header__burger--open")) {
            unlockBody()
            Array.from(menuEl.querySelectorAll(".header__menu-item--submenu-open")).forEach(el => {
                el.classList.remove("header__menu-item--submenu-open")
                el.querySelector(".header__submenu").style.height=""
            })
        } else {
            lockBody()
            // window.scrollTo(0,0)
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
            menuEl.closest(".header__main").style.overflow = "hidden"
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

    const faqItemHeaderEls = document.querySelectorAll(".accordion__col > *:first-child");
    
    function replaceAccordionButtons(e) {
        const accordionButtonEls = Array.from(document.querySelectorAll(".accordion__button"))
        if (e.matches) {    
            accordionButtonEls.forEach(buttonEl => {
                buttonEl.parentElement.previousElementSibling.firstElementChild.after(buttonEl)
            })
        } else {
            accordionButtonEls.forEach(buttonEl => {
                buttonEl.parentElement.nextElementSibling.append(buttonEl)
            })
        }
    }
    phoneMediaQuery.addEventListener("change", replaceAccordionButtons)
    faqItemHeaderEls.forEach(faqItemHeaderEl => {
        let timeoutId;
        faqItemHeaderEl.addEventListener("click", e => {
            const faqItemEl = faqItemHeaderEl.closest(".accordion");
            const faqItemBodyEl = faqItemEl.querySelector(".accordion__body");
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

    // article text
    if (document.querySelector(".article")) {
        const articleEl = document.querySelector(".article");
        const articleTextEl = articleEl.querySelector(".article__text");
        const readMoreButtonEl = articleEl.querySelector(".article__more");
        const maxHeight = parseFloat(getComputedStyle(articleTextEl).maxHeight)
    
        function changeElemHeight(elem) {
            const buttonTextEl = elem.querySelector("span")
            const className = elem.classList[1];
            if (elem.classList.contains(className + "--open")) {
                elem.classList.remove(className + "--open")
                buttonTextEl.innerHTML = "Читать полностью"
            } else {
                elem.classList.add(className + "--open")
                buttonTextEl.innerHTML = "Свернуть текст"
            }
        }
    
        function checkElemHeight(elem) {
            const className = elem.classList[1];
            const textEl = articleTextEl;
            const readMoreEl = readMoreButtonEl;
    
            if (textEl.offsetHeight < textEl.scrollHeight) {
                !elem.classList.contains(className + "--hide") && elem.classList.add(className + "--hide")
            } else {
                if (!elem.classList.contains(className + "--open")) {
                    // elem.className = className
                    elem.classList.remove(`${className}--hide`);
                } else if (textEl.offsetHeight <= maxHeight) {
                    // elem.className = className
                    elem.classList.remove(`${className}--hide`);
                    elem.classList.remove(`${className}--open`);
                    readMoreEl.querySelector("span").innerHTML = "Читать полностью"
                }
            } 
        }

    
        checkElemHeight(articleEl);
    
        readMoreButtonEl.addEventListener("click", () => changeElemHeight(articleEl))
    
        window.addEventListener("resize", () => {
            checkElemHeight(articleEl)
        })
    }

    if (window.Swiper) {
        // hero
        new Swiper(".hero__swiper", {
            slidesPerView: 1,
            speed: 800,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: '.swiper-pagination',
            },
        })
        //stocks
        new Swiper(".stocks__swiper", {
            // slidesPerView: "auto",
            slidesPerView: 1.1,
            spaceBetween: 10,
            breakpoints: {  
                577: {
                    slidesPerView: 1.5
                },
                769: {
                    slidesPerView: 2,
                    spaceBetween: 16
                },
                993: {
                    slidesPerView: 2.5,
                },
                1281: {
                    slidesPerView: 3,
                }
            },
            navigation: {
                nextEl: ".stocks .swiper-button-next",
                prevEl: " .stocks .swiper-button-prev",
            },
            pagination: {
                el: ".stocks .swiper-pagination",
            },
        })
        //products
        new Swiper(".products__swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            breakpoints: {
                577: {
                    spaceBetween: 16,

                }
            },
            navigation: {
                nextEl: ".products .swiper-button-next",
                prevEl: " .products .swiper-button-prev",
            },
            pagination: {
                el: ".products .swiper-pagination",
            },
        })
        // partners 
        new Swiper(".trust-us__swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            freeMode: true,
            // freeMode: {
            //     enabled: true,
            //     sticky: true,
            //   },
            breakpoints: {
                577: {
                    spaceBetween: 15,

                }
            },
        })
        // licenses 
        new Swiper(".licenses__swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
            breakpoints: {
                577: {
                    spaceBetween: 16,
                }
            },
            navigation: {
                nextEl: ".licenses .swiper-button-next",
                prevEl: ".licenses .swiper-button-prev",
            },
            pagination: {
                el: ".licenses .swiper-pagination",
            },
        })
        // single product
        let productInfoThumbSwiper = new Swiper(".product-info__thumb-swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
        })

        let productInfoSwiper = new Swiper(".product-info__swiper", {
            slidesPerView: 1,
            spaceBetween: 10,
            breakpoints: {
                577: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    speed: 800,
                    loop: true,
                    effect: "fade",
                    crossFade: true,
                }
            },
            thumbs: {
                swiper: productInfoThumbSwiper,
            },
        })
        // gallery
        let galleryThumbSwiper = new Swiper(".gallery__thumb-swiper", {
            slidesPerView: "auto",
            spaceBetween: 10,
        })

        let galleryInfoSwiper = new Swiper(".gallery__swiper", {
            slidesPerView: 1,
            speed: 800,
            loop: true,
            effect: "fade",
            crossFade: true,
            thumbs: {
                swiper: galleryThumbSwiper,
            },
            pagination: {
                el: ".swiper-pagination",
            },
        })

        // productInfoThumbSwiper.controller.control = productInfoSwiper
        // productInfoSwiper.controller.control = productInfoThumbSwiper
    }

    // yandex map

    function init(mapContainerSelector) {
        function setMapPin() {
            let myCollection = new ymaps.GeoObjectCollection();
            let coords = mapEl?.dataset.mark?.split(',').map(Number) || [55.7954692462696,49.10686513125719];
            // создание и установка пинов
            myCollection.add(new ymaps.Placemark(coords, {
                iconLayout: "default#image",
                iconImageHref: imagesSrc.pinImage,
                iconImageSize: [60, 60],
            }));
            // добавление пинов на карту
            map.geoObjects.add(myCollection);
        }

        async function getCoords () {
            setTimeout(() => {
                setMapPin()
            }, 2000)
        }
        
        let mapEl = document.getElementById(mapContainerSelector);
        let center = mapEl?.dataset.center?.split(',').map(Number) || [55.79551291555022,49.10679244528347];

        // создание карты
        let map = new ymaps.Map(mapContainerSelector, {
            center,
            controls: [],
            zoom: 14,
        }, {  autoFitToViewport: 'always' })
        
        let imagesSrc = mapEl.dataset
        
        getCoords()
        
        // zoom ctrl + mouse wheel
        let ctrlKey = false
        let body = document.getElementsByTagName('body')[0];
        map.behaviors.disable(['scrollZoom', 'drag']);
        body.onkeydown = callbackDown;
        body.onkeyup = callbackUp;
        function callbackDown(e){
            if(e.keyCode === 17 && !ctrlKey){
                ctrlKey = true
                map.behaviors.enable(['scrollZoom']);
            }
        }
        function callbackUp(e){
            if(e.keyCode === 17){
                ctrlKey = false
                map.behaviors.disable(['scrollZoom']);
            }
        }
    }

    // ymaps.ready(() => init("map"));

    if (document.getElementById("map")) {
        ymaps.ready(() => init("map"));
    }

    // sidebar panel
    if (document.querySelector(".products-layout")) {
        const filterEls = document.querySelectorAll(".products-layout .filter")

        Array.from(filterEls).forEach(filterEl => filterEl.addEventListener("click", (e) => {
            if (!e.target.closest(".filter__header")) {
                return
            }

            filterEl.classList.toggle("filter--open")
        }))
    }

    // single product page
    if (document.querySelector(".product-info")) {
        const seriesListEl = document.querySelector(".product-info__series-list")
        seriesListEl.addEventListener("click", e => {
            const seriesClass = 'product-info__series-item'
            if (
                !e.target.closest(`.${seriesClass}`) ||
                e.target.closest(`.${seriesClass}--active`)
            ) {
                return
            }

            e.currentTarget.querySelector(`.${seriesClass}--active`).classList.remove(`${seriesClass}--active`)
            e.target.closest(`.${seriesClass}`).classList.add(`${seriesClass}--active`)
        })
    }
}