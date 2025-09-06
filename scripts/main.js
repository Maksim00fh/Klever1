// Файл: main.js
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
    const menuItems = document.querySelector('.menu-items');
    
    if (menuScroll && scrollLeftBtn && scrollRightBtn) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
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
            menuScroll.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            menuScroll.scrollBy({ left: 300, behavior: 'smooth' });
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
            menuScroll.classList.remove('dragging');
        });
        
        menuScroll.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - menuScroll.offsetLeft;
            const walk = (x - startX) * 2;
            menuScroll.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        // Проверяем кнопки при загрузке и прокрутке
        checkScrollButtons();
        menuScroll.addEventListener('scroll', checkScrollButtons);
        
        // Адаптация для мобильных устройств
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
    
    // Запускаем анимацию при скролле
    animateOnScroll();
    
    // Обработка формы бронирования
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
    });
});