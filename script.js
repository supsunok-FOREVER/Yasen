document.addEventListener('DOMContentLoaded', function() {
    // ========== БАЗА ДАННЫХ ==========
    const stepsData = {
        home: {
            title: "Добро пожаловать!",
            subtitle: "7 шагов к идеальному дивану",
            explanation: "Продуманный путь выбора от определения задачи до тест-драйва в салоне."
        },
        room: {
            title: "Выберите комнату",
            subtitle: "Для каждой комнаты нужен свой диван",
            explanation: "Комната определяет размер, функцию и стиль будущего дивана.",
            options: [
                { 
                    id: 'hallway', 
                    title: 'Прихожая', 
                    icon: 'fa-home',
                    desc: 'Первое впечатление о доме. Часто ставят узкие банкетки или диваны с ящиком для хранения.',
                    position: 'roof',
                    colorClass: 'color-hallway'
                },
                { 
                    id: 'kitchen', 
                    title: 'Кухня', 
                    icon: 'fa-utensils', 
                    desc: 'Диван для кухни должен быть компактным, устойчивым к загрязнениям и влаге.',
                    position: 'left-top',
                    colorClass: 'color-kitchen'
                },
                { 
                    id: 'living', 
                    title: 'Гостиная', 
                    icon: 'fa-couch',
                    desc: 'Главная комната для отдыха. Нужен стильный, комфортный диван, часто с функцией спального места.',
                    position: 'right-top',
                    colorClass: 'color-living'
                },
                { 
                    id: 'kids', 
                    title: 'Детская', 
                    icon: 'fa-child',
                    desc: 'Игривое и безопасное пространство. Диван должен быть прочным, с немаркой тканью.',
                    position: 'left-bottom',
                    colorClass: 'color-kids'
                },
                { 
                    id: 'bedroom', 
                    title: 'Спальня', 
                    icon: 'fa-bed',
                    desc: 'Личное пространство для релаксации. Диван должен быть удобным для чтения и уединения.',
                    position: 'right-bottom',
                    colorClass: 'color-bedroom'
                }
            ]
        },
        model: {
            title: "Выберите модель",
            subtitle: "Форма и конфигурация дивана",
            explanation: "Модель определяет вместимость и то, как диван впишется в геометрию комнаты.",
            options: [
                { id: 'model1', title: 'Модель 1', icon: 'fa-square', 
                  desc: 'Прямой диван для размещения у стены. Идеален для небольших пространств.' },
                { id: 'model2', title: 'Модель 2', icon: 'fa-th-large',
                  desc: 'Угловой диван. Максимально использует угол комнаты, больше посадочных мест.' },
                { id: 'model3', title: 'Модель 3', icon: 'fa-puzzle-piece',
                  desc: 'Модульная система. Можно менять конфигурацию под любые задачи.' },
                { id: 'model4', title: 'Модель 4', icon: 'fa-star',
                  desc: 'Еврософа. Компактная модель с лаконичным дизайном.' },
                { id: 'model5', title: 'Модель 5', icon: 'fa-moon',
                  desc: 'Диван-кровать. Основной акцент на удобство раскладывания.' }
            ]
        },
        mechanism: {
            title: "Выберите механизм",
            subtitle: "Способ трансформации дивана",
            explanation: "Механизм — это сердце дивана, если нужно спальное место.",
            options: [
                { id: 'mechanism1', title: 'Механизм 1', icon: 'fa-book-open', 
                  desc: 'Еврокнижка. Надёжный и простой механизм для ежедневного сна.' },
                { id: 'mechanism2', title: 'Механизм 2', icon: 'fa-arrow-right',
                  desc: 'Выкатной. Спальное место выкатывается из-под сиденья.' },
                { id: 'mechanism3', title: 'Механизм 3', icon: 'fa-fish',
                  desc: 'Дельфин. Чаще используется в угловых диванах.' },
                { id: 'mechanism4', title: 'Механизм 4', icon: 'fa-comments',
                  desc: 'Клик-кляк. Позволяет фиксировать спинку в нескольких положениях.' },
                { id: 'mechanism5', title: 'Механизм 5', icon: 'fa-times-circle',
                  desc: 'Без механизма. Стационарный диван, не для трансформации.' }
            ]
        },
        filling: {
            title: "Выберите наполнитель",
            subtitle: "Внутреннее наполнение дивана",
            explanation: "Наполнитель определяет мягкость, упругость и долговечность дивана.",
            options: [
                { id: 'filling1', title: 'Наполнитель 1', icon: 'fa-layer-group', 
                  desc: 'ППУ (Стретчпен). Современный, упругий материал с эффектом памяти.' },
                { id: 'filling2', title: 'Наполнитель 2', icon: 'fa-bolt',
                  desc: 'Пружинный блок. Классическое решение для ортопедической поддержки.' },
                { id: 'filling3', title: 'Наполнитель 3', icon: 'fa-feather',
                  desc: 'Латекс. Натуральный материал, гипоаллергенный и дышащий.' },
                { id: 'filling4', title: 'Наполнитель 4', icon: 'fa-cloud',
                  desc: 'Холлофайбер. Мягкий и объёмный синтетический материал.' },
                { id: 'filling5', title: 'Наполнитель 5', icon: 'fa-heart',
                  desc: 'Пух/перо. Классический наполнитель для максимальной мягкости.' }
            ]
        },
        fabric: {
            title: "Выберите ткань",
            subtitle: "Обивочный материал дивана",
            explanation: "Ткань определяет тактильные ощущения, износостойкость и внешний вид.",
            options: [
                { id: 'fabric1', title: 'Ткань 1', icon: 'fa-th', 
                  desc: 'Рогожка. Прочная фактурная ткань из натуральных волокон.' },
                { id: 'fabric2', title: 'Ткань 2', icon: 'fa-soft',
                  desc: 'Велюр. Мягкая, приятная на ощупь ткань с коротким ворсом.' },
                { id: 'fabric3', title: 'Ткань 3', icon: 'fa-paw',
                  desc: 'Антикоготь. Высокотехнологичная ткань с повышенной стойкостью.' },
                { id: 'fabric4', title: 'Ткань 4', icon: 'fa-braille',
                  desc: 'Шенилл. Плотная, мягкая ткань, хорошо скрывает загрязнения.' },
                { id: 'fabric5', title: 'Ткань 5', icon: 'fa-ring',
                  desc: 'Кожа. Натуральный материал premium-класса, элегантный и долговечный.' }
            ]
        },
        decor: {
            title: "Выберите декор",
            subtitle: "Детали оформления дивана",
            explanation: "Декор создаёт характер дивана и адаптирует его под ваш стиль.",
            options: [
                { id: 'decor1', title: 'Декор 1', icon: 'fa-cube', 
                  desc: 'Подушки спинки. Классические квадратные или валики.' },
                { id: 'decor2', title: 'Декор 2', icon: 'fa-hand-paper',
                  desc: 'Подлокотники. Мягкие, жёсткие или с функциональными полками.' },
                { id: 'decor3', title: 'Декор 3', icon: 'fa-shoe-prints',
                  desc: 'Ножки. Деревянные, металлические, пластиковые.' },
                { id: 'decor4', title: 'Декор 4', icon: 'fa-bezier-curve',
                  desc: 'Стежка. Каретная стяжка или фигурные швы.' },
                { id: 'decor5', title: 'Декор 5', icon: 'fa-border-style',
                  desc: 'Кант. Контрастная окантовка по краям дивана.' }
            ]
        },
        test: {
            title: "Запишитесь на тест-драйв!",
            subtitle: "Финальный шаг — встреча в салоне",
            explanation: "Вы прошли все шаги онлайн. Теперь самое важное — ощутить диван вживую.",
            options: []
        }
    };

    // Порядок шагов
    const stepsOrder = ['home', 'room', 'model', 'mechanism', 'filling', 'fabric', 'decor', 'test'];
    
    // Состояние
    const appState = {
        currentStep: 'home',
        selections: {}
    };

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    const menuSteps = document.querySelectorAll('.menu-step');
    const mazeArea = document.getElementById('mazeArea');
    const homeContent = document.getElementById('homeContent');
    const houseGrid = document.getElementById('houseGrid');
    const testContent = document.getElementById('testContent');
    const panelTitle = document.getElementById('panelTitle');
    const panelSubtitle = document.getElementById('panelSubtitle');
    const stepExplanation = document.getElementById('stepExplanation');
    const parameterDetails = document.getElementById('parameterDetails');
    const selectionTags = document.getElementById('selectionTags');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finalButton = document.getElementById('finalButton');
    const resetButton = document.getElementById('resetButton');
    const startButton = document.getElementById('startButton');
    const currentStepNum = document.getElementById('currentStepNum');
    const logoYasen = document.getElementById('logoYasen');
    const mobileInfoPanel = document.getElementById('mobileInfoPanel');
    const mobilePanelTitle = document.getElementById('mobilePanelTitle');
    const mobileParameterDetails = document.getElementById('mobileParameterDetails');
    const closeMobileInfoBtn = document.querySelector('.btn-close-mobile-info');

    // Логотип
    //'ЯСЕНЬ'.split('').forEach(letter => {
    //    const span = document.createElement('span');
    //    span.textContent = letter;
     //   logoYasen.appendChild(span);
    //});

    // ========== ГЛАВНАЯ ФУНКЦИЯ ==========
    function goToStep(stepId) {
        if (!stepsData[stepId]) return;
        
        // 1. Обновляем состояние
        appState.currentStep = stepId;
        const stepIndex = stepsOrder.indexOf(stepId);
        
        // 2. Обновляем меню
        menuSteps.forEach(step => {
            step.classList.remove('active');
            if (step.dataset.step === stepId) step.classList.add('active');
        });
        
        // 3. Обновляем центральную область
        updateMainContent(stepId);
        
        // 4. Обновляем правую панель
        updateInfoPanel(stepId);
        
        // 5. Обновляем навигацию
        updateNavigation(stepIndex);
        
        // 6. Обновляем карточку выбора
        updateSelectionCard();
        
        // 7. Анимация кота
        updateCatPosition(stepId);
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    function updateMainContent(stepId) {
        // Скрываем всё
        homeContent.style.display = 'none';
        houseGrid.style.display = 'none';
        testContent.style.display = 'none';
        
        if (stepId === 'home') {
            homeContent.style.display = 'block';
        } else if (stepId === 'test') {
            testContent.style.display = 'block';
            testContent.innerHTML = `
                <h2 style="color: #8B4513; margin-bottom: 20px;"><i class="fas fa-flag-checkered"></i> Готово!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 30px; max-width: 500px; margin: 0 auto 30px;">
                    Вы выбрали все параметры. Теперь самое важное — <strong>ощутить диван вживую</strong> в нашем салоне.
                </p>
                <button class="btn-primary" id="bookTestDrive" style="font-size: 1.1rem; padding: 15px 30px;">
                    <i class="fas fa-calendar-alt"></i> Записаться на тест-драйв
                </button>
            `;
            
            const bookBtn = document.getElementById('bookTestDrive');
            if (bookBtn) {
                bookBtn.addEventListener('click', function() {
                    alert('Форма записи на тест-драйв. Все ваши выборы сохранены.');
                });
            }
        } else {
            // Для остальных шагов показываем сетку
            houseGrid.style.display = 'grid';
            houseGrid.innerHTML = '';
            
            const stepData = stepsData[stepId];
            const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
            
            stepData.options.forEach((option, index) => {
                const isSelected = appState.selections[stepId]?.id === option.id;
                let positionClass = '';
                
                // Определяем позицию
                if (stepId === 'room' && option.position) {
                    positionClass = `house-${option.position}`;
                } else {
                    if (index === 0) positionClass = 'house-roof';
                    else if (index === 1) positionClass = 'house-left-top';
                    else if (index === 2) positionClass = 'house-right-top';
                    else if (index === 3) positionClass = 'house-left-bottom';
                    else if (index === 4) positionClass = 'house-right-bottom';
                }
                
                const colorClass = option.colorClass || colorClasses[index % colorClasses.length];
                
                const card = document.createElement('div');
                card.className = `option-card ${positionClass} ${colorClass} ${isSelected ? 'selected' : ''}`;
                card.dataset.optionId = option.id;
                card.dataset.step = stepId;
                
                card.innerHTML = `
                    <i class="fas ${option.icon}"></i>
                    <div class="option-title">${option.title}</div>
                    <div class="option-desc">${option.desc.substring(0, 60)}...</div>
                `;
                
                // Добавляем кота в прихожую
                if (stepId === 'room' && option.id === 'hallway') {
                    const catDiv = document.createElement('div');
                    catDiv.className = 'cat';
                    catDiv.textContent = '=^..^=';
                    catDiv.id = 'catGuide';
                    card.appendChild(catDiv);
                }
                
                houseGrid.appendChild(card);
            });
            
            // Обработчики кликов
            houseGrid.querySelectorAll('.option-card').forEach(card => {
                card.addEventListener('click', function() {
                    const stepId = this.dataset.step;
                    const optionId = this.dataset.optionId;
                    const stepData = stepsData[stepId];
                    const optionData = stepData.options.find(o => o.id === optionId);
                    if (optionData) {
                        selectOption(stepId, optionData);
                    }
                });
            });
        }
    }

    function updateInfoPanel(stepId) {
        const stepData = stepsData[stepId];
        
        if (stepId === 'home') {
            panelTitle.innerHTML = `<i class="fas fa-home"></i> ${stepData.title}`;
            panelSubtitle.textContent = stepData.subtitle;
            stepExplanation.innerHTML = `<p>${stepData.explanation}</p>`;
            parameterDetails.innerHTML = '<p>Нажмите "Начать выбор дивана" чтобы перейти к первому шагу.</p>';
            return;
        }
        
        panelTitle.innerHTML = `<i class="fas fa-info-circle"></i> ${stepData.title}`;
        panelSubtitle.textContent = stepData.subtitle;
        stepExplanation.innerHTML = `<p>${stepData.explanation}</p>`;
        
        if (appState.selections[stepId]) {
            const selected = appState.selections[stepId];
            parameterDetails.innerHTML = `
                <h4>${selected.title}</h4>
                <p>${selected.desc}</p>
                ${stepId === 'fabric' ? 
                    '<p style="margin-top: 10px; color: #8B4513; font-style: italic;"><i class="fas fa-hand-point-right"></i> Обязательно прикоснитесь к тканям в салоне!</p>' : 
                    ''}
            `;
        } else {
            parameterDetails.innerHTML = `<p>Выберите параметр в центральной сетке, чтобы увидеть его подробное описание.</p>`;
        }
    }

    function selectOption(stepId, optionData) {
        // Сохраняем выбор
        appState.selections[stepId] = optionData;
        
        // Визуально выделяем
        document.querySelectorAll(`[data-step="${stepId}"]`).forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.optionId === optionData.id) {
                card.classList.add('selected');
            }
        });
        
        // Обновляем панель информации
        const stepData = stepsData[stepId];
        const detailsHTML = `
            <h4>${optionData.title}</h4>
            <p>${optionData.desc}</p>
            ${stepId === 'fabric' ? 
                '<p style="margin-top: 10px; color: #8B4513; font-style: italic;"><i class="fas fa-hand-point-right"></i> Обязательно прикоснитесь к тканям в салоне!</p>' : 
                ''}
        `;
        
        parameterDetails.innerHTML = detailsHTML;
        
        // Обновляем мобильную панель
        if (window.innerWidth <= 1200) {
            mobilePanelTitle.textContent = optionData.title;
            mobileParameterDetails.innerHTML = `<p>${optionData.desc}</p>`;
            mobileInfoPanel.style.display = 'block';
        }
        
        updateSelectionCard();
    }

    function updateNavigation(stepIndex) {
        const isMobile = window.innerWidth <= 1200;
        
        prevBtn.disabled = (stepIndex === 0);
        nextBtn.disabled = (stepIndex === stepsOrder.length - 1);
        
        if (stepIndex === stepsOrder.length - 2) {
            nextBtn.innerHTML = 'К тест-драйву <i class="fas fa-arrow-right"></i>';
        } else {
            nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
        }
        
        // Обновляем номер шага (исключая home из счётчика)
        const displayStepNum = stepIndex === 0 ? 0 : stepIndex;
        currentStepNum.textContent = displayStepNum;
        
        // Проверяем, все ли шаги выбраны (кроме home)
        const mainSteps = stepsOrder.slice(1, -1); // Все кроме 'home' и 'test'
        const allSelected = mainSteps.every(step => appState.selections[step]);
        finalButton.disabled = !allSelected;
        
        // На мобильных скрываем навигацию на home и test
        if (isMobile) {
            const isHomeOrTest = stepsOrder[stepIndex] === 'home' || stepsOrder[stepIndex] === 'test';
            document.querySelector('.panel-navigation').style.display = isHomeOrTest ? 'none' : 'flex';
        }
    }

    function updateSelectionCard() {
        selectionTags.innerHTML = '';
        
        if (Object.keys(appState.selections).length === 0) {
            selectionTags.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard"></i>
                    <p>Начните выбирать параметры</p>
                </div>`;
            return;
        }
        
        stepsOrder.slice(1, -1).forEach(stepId => {
            if (appState.selections[stepId]) {
                const selection = appState.selections[stepId];
                const stepIndex = stepsOrder.indexOf(stepId);
                
                const tag = document.createElement('div');
                tag.className = 'selection-tag';
                tag.innerHTML = `
                    <div class="tag-step">${stepIndex}</div>
                    <span>${selection.title}</span>
                `;
                
                tag.addEventListener('click', () => {
                    goToStep(stepId);
                });
                
                selectionTags.appendChild(tag);
            }
        });
    }

    function updateCatPosition(stepId) {
        const cat = document.getElementById('catGuide');
        if (cat && stepId === 'room') {
            cat.style.transform = 'scaleX(-1)';
            setTimeout(() => {
                cat.textContent = ['=^..^=', '=^._.^=', '=^-.-^=', '=^o.o^='][Math.floor(Math.random() * 4)];
                cat.style.transform = 'scaleX(1)';
            }, 300);
        }
    }

    // ========== ОБРАБОТЧИКИ ==========
    menuSteps.forEach(step => {
        step.addEventListener('click', function(event) {
            event.preventDefault();
            const stepId = this.dataset.step;
            if (stepId && stepId !== appState.currentStep) {
                goToStep(stepId);
            }
        });
    });

    prevBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const currentIndex = stepsOrder.indexOf(appState.currentStep);
        if (currentIndex > 0) {
            goToStep(stepsOrder[currentIndex - 1]);
        }
    });

    nextBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const currentIndex = stepsOrder.indexOf(appState.currentStep);
        if (currentIndex < stepsOrder.length - 1) {
            goToStep(stepsOrder[currentIndex + 1]);
        }
    });

    resetButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm('Очистить все выборы?')) {
            appState.selections = {};
            goToStep('home');
        }
    });

    startButton.addEventListener('click', function(event) {
        event.preventDefault();
        goToStep('room');
    });

    finalButton.addEventListener('click', function(event) {
        event.preventDefault();
        goToStep('test');
    });

    closeMobileInfoBtn?.addEventListener('click', function() {
        mobileInfoPanel.style.display = 'none';
    });

    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        const currentStep = appState.currentStep;
        updateNavigation(stepsOrder.indexOf(currentStep));
    });

    // ========== ЗАПУСК ==========
    goToStep('home');
});