document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const header = document.querySelector('.header');
            if (navMenu.classList.contains('active')) {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            } else {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.querySelector('.header').style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }));
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
                
                const scrollSpeed = this.classList.contains('scroll-slow') ? 2000 : 1000;
                
                smoothScrollTo(targetPosition, scrollSpeed);
            }
        });
    });
    
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
    
    // Фильтрация меню - оптимизированная версия
    function initMenuFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuItems = document.querySelectorAll('.menu-item');
        const menuScroll = document.querySelector('.menu-scroll');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                // Быстрая фильтрация без задержек
                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (category === 'all' || category === itemCategory) {
                        item.classList.remove('hide');
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                        item.classList.add('hide');
                    }
                });
                
                // Прокрутка к началу после фильтрации
                if (menuScroll) {
                    menuScroll.scrollTo({ left: 0, behavior: 'smooth' });
                }
                
                // Обновление видимости кнопок прокрутки
                setTimeout(checkScrollButtons, 300);
            });
        });
    }
    
    // Прокрутка меню с точным позиционированием
    const menuScroll = document.querySelector('.menu-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-btn.left');
    const scrollRightBtn = document.querySelector('.scroll-btn.right');
    const menuItems = document.querySelector('.menu-items');
    
    if (menuScroll && scrollLeftBtn && scrollRightBtn) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let scrollTimeout;
        
        // Вычисление ширины элемента меню для точной прокрутки
        function getScrollAmount() {
            if (!menuItems.children.length) return 330;
            const firstItem = menuItems.children[0];
            const itemStyle = getComputedStyle(firstItem);
            const itemWidth = firstItem.offsetWidth;
            const gap = parseInt(getComputedStyle(menuItems).gap) || 30;
            return itemWidth + gap;
        }
        
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
        
        // Обработчики для кнопок прокрутки с точным позиционированием
        scrollLeftBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            menuScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            menuScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                menuScroll.classList.remove('dragging');
                const scrollAmount = getScrollAmount();
                const snapPosition = Math.round(menuScroll.scrollLeft / scrollAmount) * scrollAmount;
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
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                menuScroll.classList.remove('dragging');
                const scrollAmount = getScrollAmount();
                const snapPosition = Math.round(menuScroll.scrollLeft / scrollAmount) * scrollAmount;
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
                    const scrollAmount = getScrollAmount();
                    const snapPosition = Math.round(menuScroll.scrollLeft / scrollAmount) * scrollAmount;
                    menuScroll.scrollTo({ left: snapPosition, behavior: 'smooth' });
                }
            }, 100);
            
            checkScrollButtons();
        });
        
        // Проверяем кнопки при загрузке и изменении размера
        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);
        
        if ('ontouchstart' in window) {
            menuScroll.style.cursor = 'grab';
        }
    }
    
    // Анимация появления элементов при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.about, .menu, .gallery, .contact, .feature, .menu-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
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
    
    // Обработка формы бронирования
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
    
    // Инициализация функций
    initMenuFilter();
    animateOnScroll();
    
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
    
    window.addEventListener('load', function() {
        setTimeout(preloadCriticalResources, 1000);
    });
});
