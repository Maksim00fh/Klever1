// Файл: main.js
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Блокировка прокрутки тела при открытом меню
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }));
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Определяем скорость прокрутки
                const scrollSpeed = this.classList.contains('scroll-slow') ? 2000 : 1000;
                
                smoothScrollTo(targetPosition, scrollSpeed);
                
                // Закрываем меню на мобильных устройствах
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Функция плавной прокрутки с регулируемой скоростью
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Фильтрация меню
    function initMenuFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuItems = document.querySelectorAll('.menu-item');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Удаляем активный класс со всех кнопок
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс к нажатой кнопке
                button.classList.add('active');
                
                // Получаем категорию из data-атрибута
                const category = button.getAttribute('data-category');
                
                // Фильтруем элементы меню
                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (category === 'all' || category === itemCategory) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Инициализируем фильтрацию меню
    initMenuFilter();
    
    // Прокрутка меню
    const menuScroll = document.querySelector('.menu-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-btn.left');
    const scrollRightBtn = document.querySelector('.scroll-btn.right');
    
    if (menuScroll && scrollLeftBtn && scrollRightBtn) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let scrollTimeout;
        
        // Проверка видимости кнопок прокрутки
        function checkScrollButtons() {
            if (menuScroll.scrollLeft <= 10) {
                scrollLeftBtn.classList.add('hidden');
            } else {
                scrollLeftBtn.classList.remove('hidden');
            }
            
            if (menuScroll.scrollLeft >= menuScroll.scrollWidth - menuScroll.offsetWidth - 10) {
                scrollRightBtn.classList.add('hidden');
            } else {
                scrollRightBtn.classList.remove('hidden');
            }
        }
        
        // Обработчики для кнопок прокрутки
        scrollLeftBtn.addEventListener('click', () => {
            menuScroll.scrollBy({ left: -320, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            menuScroll.scrollBy({ left: 320, behavior: 'smooth' });
        });
        
        // Drag to scroll
        menuScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            menuScroll.classList.add('dragging');
            startX = e.pageX - menuScroll.offsetLeft;
            scrollLeft = menuScroll.scrollLeft;
        });
        
        menuScroll.addEventListener('mouseleave', () => {
            isDown = false;
            menuScroll.classList.remove('dragging');
        });
        
        menuScroll.addEventListener('mouseup', () => {
            isDown = false;
            menuScroll.classList.remove('dragging');
            
            // Включение snap эффекта после перетаскивания
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                menuScroll.classList.remove('dragging');
                const itemWidth = document.querySelector('.menu-item').offsetWidth + 30;
                const snapPosition = Math.round(menuScroll.scrollLeft / itemWidth) * itemWidth;
                menuScroll.scrollTo({ left: snapPosition, behavior: 'smooth' });
            }, 100);
        });
        
        menuScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - menuScroll.offsetLeft;
            const walk = (x - startX) * 2;
            menuScroll.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        menuScroll.addEventListener('touchstart', (e) => {
            isDown = true;
            menuScroll.classList.add('dragging');
            startX = e.touches[0].pageX - menuScroll.offsetLeft;
            scrollLeft = menuScroll.scrollLeft;
        }, { passive: true });
        
        menuScroll.addEventListener('touchend', () => {
            isDown = false;
            
            // Включение snap эффекта после перетаскивания
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                menuScroll.classList.remove('dragging');
                const itemWidth = document.querySelector('.menu-item').offsetWidth + 30;
                const snapPosition = Math.round(menuScroll.scrollLeft / itemWidth) * itemWidth;
                menuScroll.scrollTo({ left: snapPosition, behavior: 'smooth' });
            }, 100);
        });
        
        menuScroll.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - menuScroll.offsetLeft;
            const walk = (x - startX) * 2;
            menuScroll.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        // Snap to items on scroll end
        menuScroll.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!menuScroll.classList.contains('dragging')) {
                    const itemWidth = document.querySelector('.menu-item').offsetWidth + 30;
                    const snapPosition = Math.round(menuScroll.scrollLeft / itemWidth) * itemWidth;
                    menuScroll.scrollTo({ left: snapPosition, behavior: 'smooth' });
                }
            }, 100);
            
            checkScrollButtons();
        });
        
        // Проверяем кнопки при загрузке
        checkScrollButtons();
        
        // Адаптация для мобильных устройств
        if ('ontouchstart' in window) {
            menuScroll.style.cursor = 'grab';
        }
        
        // Обработка изменения размера окна
        window.addEventListener('resize', checkScrollButtons);
    }
    
    // Анимация появления элементов при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.about, .menu, .gallery, .contact, .feature, .menu-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
    // Запускаем анимацию при скролле
    animateOnScroll();
    
    // Обработка формы бронирования
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        // Установка минимальной даты (сегодня)
        const today = new Date().toISOString().split('T')[0];
        reservationForm.querySelector('input[type="date"]').setAttribute('min', today);
        
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация телефона
            const phoneInput = this.querySelector('input[type="tel"]');
            const phonePattern = /^[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}$/;
            
            if (!phonePattern.test(phoneInput.value)) {
                alert('Пожалуйста, введите телефон в формате: +7 (999) 999-99-99');
                phoneInput.focus();
                return;
            }
            
            // Здесь можно добавить отправку данных на сервер
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время для подтверждения бронирования.');
            this.reset();
        });
    }
    
    // Изменение прозрачности хедера при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
    });
    
    // Предзагрузка критических ресурсов
    function preloadCriticalResources() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.getAttribute('src')) {
                const image = new Image();
                image.src = img.getAttribute('src');
            }
        });
    }
    
    // Запускаем предзагрузку после загрузки страницы
    window.addEventListener('load', function() {
        setTimeout(preloadCriticalResources, 1000);
    });
    
    // Обработка изменения ориентации устройства
    let portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", function(e) {
        if (e.matches) {
            // Портретный режим
            console.log("Портретный режим");
        } else {
            // Альбомный режим
            console.log("Альбомный режим");
        }
        
        // Перепроверяем видимость кнопок прокрутки меню
        if (menuScroll) {
            setTimeout(checkScrollButtons, 300);
        }
    });
    
    // Улучшение для тач-устройств
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
        
        // Увеличиваем область клика для элементов навигации на мобильных
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.style.padding = '10px 0';
        });
    } else {
        document.documentElement.classList.add('no-touch-device');
    }
    
    // Предотвращение масштабирования при двойном тапе (для улучшения UX на мобильных)
    let lastTap = 0;
    document.addEventListener('touchend', function(event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            event.preventDefault();
        }
        lastTap = currentTime;
    });
});
