// script.js

let appData = {
    stepsData: {},
    stepsOrder: [],
    mainSteps: [],
    uiTexts: {},
    icons: {},
    uiClasses: {}
};

const appState = {
    currentStep: 'home',
    selections: {}
};

// ========== ФУНКЦИЯ ЗАГРУЗКИ ДАННЫХ ==========

function loadAppData() {
    return new Promise((resolve, reject) => {
        try {
            const request = new XMLHttpRequest();
            request.open('GET', 'data.json', true);
            
            request.onload = function() {
                if (request.status === 200) {
                    try {
                        const data = JSON.parse(request.responseText);
                        
                        appData = {
                            stepsData: data.stepsData || {},
                            stepsOrder: data.stepsOrder || [],
                            mainSteps: data.mainSteps || [],
                            uiTexts: data.uiTexts || {},
                            icons: data.icons || {},
                            uiClasses: data.uiClasses || {}
                        };
                        
                        console.log('Данные успешно загружены из data.json');
                        resolve();
                    } catch (parseError) {
                        console.error('Ошибка парсинга JSON:', parseError);
                        reject(parseError);
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${request.status}`));
                }
            };
            
            request.onerror = function() {
                reject(new Error('Network error loading data.json'));
            };
            
            request.ontimeout = function() {
                reject(new Error('Request timeout loading data.json'));
            };
            
            request.send();
        } catch (error) {
            console.error('Ошибка инициализации запроса:', error);
            reject(error);
        }
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

function getSvgIcon(iconName, altText = '') {
    if (!iconName) return '';
    
    // Всегда возвращаем img тег
    return `<img src="icons/${iconName}" alt="${altText}" class="svg-icon">`;
}

function getUIText(key, replacements = {}) {
    let text = appData.uiTexts[key] || '';
    for (const [key, value] of Object.entries(replacements)) {
        text = text.replace(`{{${key}}}`, value);
    }
    return text;
}

function getIcon(key) {
    return appData.icons[key] || '';
}

function getUIClass(section, element) {
    return appData.uiClasses?.[section]?.[element] || '';
}

// ========== ФУНКЦИЯ ДЛЯ ОБРАБОТКИ ЗВОНКА ==========

function handleFinalCall() {
    const stepData = appData.stepsData.test;
    if (!stepData || !stepData.phoneNumber) {
        alert("Контактная информация не найдена");
        return false;
    }
    
    // Показываем подтверждение
    alert(stepData.confirmationMessage || getUIText('confirmationMessage'));
    
    // Формируем сообщение для подтверждения звонка
    const confirmCallMessage = (stepData.confirmCallMessage || getUIText('confirmCallMessage'))
        .replace('{{phoneNumber}}', stepData.phoneNumber);
    
    // Спрашиваем подтверждение
    const confirmCall = confirm(confirmCallMessage);
    
    // Если подтвердили - звоним
    if (confirmCall) {
        window.location.href = `tel:${stepData.phoneNumber}`;
        return true;
    }
    
    return false;
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========

function initApp() {
    console.log('Инициализация приложения...');
    
    // ========== ИНИЦИАЛИЗАЦИЯ DOM ЭЛЕМЕНТОВ ==========
    const menuSteps = document.querySelectorAll('.menu-step');
    const homeContent = document.getElementById('homeContent');
    const houseGrid = document.getElementById('houseGrid');
    const shopsGrid = document.getElementById('shopsGrid');
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
    
    const mobileInfoPanel = document.getElementById('mobileInfoPanel');
    const mobilePanelTitle = document.getElementById('mobilePanelTitle');
    const mobileParameterDetails = document.getElementById('mobileParameterDetails');
    const closeMobileInfoBtn = document.querySelector('.btn-close-mobile-info');

    // ========== ГЛАВНАЯ ФУНКЦИЯ ==========
    function goToStep(stepId) {
        if (!appData.stepsData[stepId]) {
            console.error('Шаг не найден:', stepId);
            return;
        }

        // Закрываем мобильную панель при смене шага
        if (window.innerWidth <= 480 && mobileInfoPanel && mobileInfoPanel.classList.contains('show')) {
            mobileInfoPanel.classList.remove('show');
            mobileInfoPanel.style.display = 'none';
            document.body.classList.remove('mobile-info-open');
        }

        // 1. Обновляем состояние
        appState.currentStep = stepId;
        
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
        updateNavigation();
        
        // 6. Обновляем карточку выбора
        updateSelectionCard();
        
        // 7. Прокручиваем к началу контента на мобильных
        if (window.innerWidth <= 1200) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function updateMainContent(stepId) {
        // Убираем все классы
        homeContent.classList.remove('active');
        homeContent.classList.add('hidden');
        
        houseGrid.classList.remove('active');
        houseGrid.classList.add('hidden');
        
        shopsGrid.classList.remove('active');
        shopsGrid.classList.add('hidden');
        
        const stepData = appData.stepsData[stepId];
        
        if (stepId === 'home') {
            homeContent.classList.remove('hidden');
            homeContent.classList.add('active');
            renderHomeContent();
        } else if (stepId === 'test') {
            shopsGrid.classList.remove('hidden');
            shopsGrid.classList.add('active');
            renderTestContent();
        } else {
            houseGrid.classList.remove('hidden');
            houseGrid.classList.add('active');
            renderStepOptions(stepId, stepData);
        }
    }

    function renderHomeContent() {
        const stepData = appData.stepsData.home;
        
        // Создаем сетку для главной страницы
        const homeGrid = homeContent.querySelector('#homeGrid');
        if (homeGrid && stepData.compactSteps) {
            homeGrid.innerHTML = '';
            
            stepData.compactSteps.forEach((step, index) => {
                const card = document.createElement('div');
                card.className = 'home-card clickable-step';
                card.dataset.step = step.step;
                
                card.innerHTML = `
                    ${getSvgIcon(step.icon, step.title)}
                    <div class="home-card-title">${step.title}</div>
                    <div class="home-card-desc">${step.description}</div>
                `;
                
                homeGrid.appendChild(card);
            });
        }
        
        // Добавляем анимацию
        setTimeout(() => {
            const homeCards = homeContent.querySelectorAll('.home-card');
            homeCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('fade-in');
            });
        }, 100);
        
        // Обработчики кликов
        setTimeout(() => {
            const clickableSteps = homeContent.querySelectorAll('.clickable-step');
            clickableSteps.forEach(step => {
                step.addEventListener('click', function() {
                    const stepId = this.dataset.step;
                    if (stepId) {
                        goToStep(stepId);
                    }
                });
            });
        }, 100);
    }

    function renderStepOptions(stepId, stepData) {
        houseGrid.innerHTML = '';
        
        if (!stepData.options || stepData.options.length === 0) {
            houseGrid.innerHTML = '<p>Нет доступных опций</p>';
            return;
        }
        
        const colorClasses = appData.uiTexts.colorClasses || ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
        
        stepData.options.forEach((option, index) => {
            const isSelected = appState.selections[stepId]?.id === option.id;
            let positionClass = '';
            
            // Определяем позицию
            if (stepId === 'room' && option.position) {
                positionClass = `house-${option.position}`;
            } else {
                const positions = ['roof', 'left-top', 'right-top', 'left-bottom', 'right-bottom'];
                if (index < positions.length) {
                    positionClass = `house-${positions[index]}`;
                }
            }
            
            const colorClass = option.colorClass || colorClasses[index % colorClasses.length];
            
            const card = document.createElement('div');
            card.className = `${getUIClass('houseGrid', 'optionCard') || 'option-card'} ${positionClass} ${colorClass} ${isSelected ? 'selected' : ''}`;
            card.dataset.optionId = option.id;
            card.dataset.step = stepId;
            
            card.innerHTML = `
                ${getSvgIcon(option.icon, option.title)}
                <div class="${getUIClass('houseGrid', 'optionTitle') || 'option-title'}">${option.title}</div>
                <div class="${getUIClass('houseGrid', 'optionDesc') || 'option-desc'}">${option.desc ? option.desc.substring(0, 80) + '...' : ''}</div>
            `;
            
            card.addEventListener('click', () => selectOption(stepId, option));
            houseGrid.appendChild(card);
        });
        
        // Добавляем анимацию
        setTimeout(() => {
            const optionCards = houseGrid.querySelectorAll('.option-card');
            optionCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('fade-in');
            });
        }, 100);
    }

    function renderTestContent() {
        const stepData = appData.stepsData.test;
        
        shopsGrid.innerHTML = '';
        
        stepData.shops.forEach((shop, index) => {
            const shopCard = document.createElement('div');
            shopCard.className = 'shop-card-grid';
            
            shopCard.innerHTML = `<h4 class="shop-card-header">
                ${getSvgIcon(getIcon('mapMarker'), 'Местоположение')} ${shop.name}
                </h4>
                <p>${getSvgIcon('map-pin.svg', 'Адрес')} ${shop.address}</p>
                ${shop.metro ? `<p>${getSvgIcon(getIcon('subway'), 'Метро')} ${shop.metro}</p>` : ''}
                <p class="shop-hours-grid">
                    ${getSvgIcon(getIcon('clock'), 'Часы работы')} ${shop.hours}
                </p>
                <p>${getSvgIcon(getIcon('phone'), 'Телефон')} ${shop.phone}</p>
            `;
                        
            shopsGrid.appendChild(shopCard);
        });
    }

    function updateInfoPanel(stepId) {
        const stepData = appData.stepsData[stepId];
        if (!stepData) return;
        
        // Обновляем только для десктопа
        if (window.innerWidth > 480) {
            if (stepId === 'home') {
                panelTitle.innerHTML = `${getSvgIcon(getIcon('home'), 'Главная')} ${stepData.title}`;
                parameterDetails.innerHTML = '';
                return;
            }
            
            panelTitle.innerHTML = `${getSvgIcon(getIcon('info'), 'Информация')} ${stepData.title}`;
            stepExplanation.innerHTML = `<p>${stepData.explanation}</p>`;
            
            if (appState.selections[stepId]) {
                const selected = appState.selections[stepId];
                parameterDetails.innerHTML = `
                    <h4>${selected.title}</h4>
                    <p>${selected.desc}</p>
                    ${stepId === 'fabric' ? 
                        `<p class="fabric-note">
                            ${getSvgIcon(getIcon('handPointRight'), 'Примечание')} ${getUIText('touchFabricNote')}
                        </p>` : 
                        ''}
                `;
            } else {
                parameterDetails.innerHTML = `<p>${getUIText('noSelectionMessage')}</p>`;
            }
        }
    }

    function selectOption(stepId, optionData) {
        appState.selections[stepId] = optionData;

        // Обновляем выделение карточек
        document.querySelectorAll(`[data-step="${stepId}"]`).forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.optionId === optionData.id) {
                card.classList.add('selected');
            }
        });

        // Обновляем десктопную панель (если видима)
        if (window.innerWidth > 480) {
            parameterDetails.innerHTML = `
                <h4>${optionData.title}</h4>
                <p>${optionData.desc}</p>
                ${stepId === 'fabric' ? 
                    `<p class="fabric-note">
                        ${getSvgIcon(getIcon('handPointRight'), 'Примечание')} ${getUIText('touchFabricNote')}
                    </p>` : ''
                }
            `;
        }

        // Мобильная панель — показываем всегда на мобилках при выборе
        if (window.innerWidth <= 480) {
            mobilePanelTitle.textContent = optionData.title;
            mobileParameterDetails.innerHTML = `
                <p>${optionData.desc}</p>
                ${stepId === 'fabric' ? 
                    `<p class="fabric-note">
                        ${getSvgIcon(getIcon('handPointRight'), 'Примечание')} ${getUIText('touchFabricNote')}
                    </p>` : ''
                }
            `;
            mobileInfoPanel.classList.add('show');
            mobileInfoPanel.style.display = 'block';
            document.body.classList.add('mobile-info-open');
        }

        updateNavigation();
        updateSelectionCard();
    }

    // ========== НАВИГАЦИЯ ==========
    function updateNavigation() {
        const stepIndex = appData.stepsOrder.indexOf(appState.currentStep);
        const currentStep = appState.currentStep;

        // === УПРАВЛЕНИЕ НАВИГАЦИЕЙ .panel-navigation ===
        const panelNav = document.querySelector('.panel-navigation');

        if (panelNav) {
            if (window.innerWidth > 480) {
                const isHomeOrTest = currentStep === 'home' || currentStep === 'test';
                panelNav.style.display = isHomeOrTest ? 'none' : 'flex';
            } else {
                panelNav.style.display = 'none';
            }
        }

        // Кнопка "Назад"
        prevBtn.disabled = stepIndex <= 0;
        prevBtn.innerHTML = `<span>${getUIText('backButton')}</span>`;

        // Кнопка "Далее"
        let nextDisabled = false;
        let nextButtonText = getUIText('nextButton');
        let nextButtonIcon = getIcon('arrowRight');

        if (currentStep === 'home') {
            nextDisabled = false;
        } else if (currentStep === 'test') {
            nextDisabled = true;
        } else if (appData.mainSteps.includes(currentStep)) {
            const isCurrentStepSelected = !!appState.selections[currentStep];
            nextDisabled = !isCurrentStepSelected;

            if (currentStep === 'decor') {
                const allPreviousSelected = appData.mainSteps.every(step =>
                    step === 'decor' ? true : !!appState.selections[step]
                );
                nextDisabled = !allPreviousSelected;
                
                // Если все выбрано - меняем текст кнопки на "Позвонить"
                if (allPreviousSelected) {
                    nextButtonText = getUIText('callButton') || 'Позвонить';
                    nextButtonIcon = getIcon('phone') || 'phone.svg';
                } else {
                    nextButtonText = getUIText('toTestDriveButton');
                }
            }
        }

        nextBtn.disabled = nextDisabled;
        nextBtn.innerHTML = `<span>${nextButtonText}</span>`;

        // Номер шага
        let displayStepNum;
        if (currentStep === 'home') {
            displayStepNum = 0;
        } else if (currentStep === 'test') {
            displayStepNum = appData.mainSteps.length + 1;
        } else {
            displayStepNum = appData.mainSteps.indexOf(currentStep) + 1;
        }
        currentStepNum.textContent = displayStepNum;

        // Обновляем текст счетчика шагов
        const stepCounterElement = document.querySelector('.step-counter');
        if (stepCounterElement) {
            stepCounterElement.innerHTML = getUIText('stepCounter', {
                current: displayStepNum,
                total: appData.mainSteps.length + 1
            });
        }

        // Кнопка финала - проверяем, все ли выбрано
        const allMainStepsSelected = appData.mainSteps.every(step => !!appState.selections[step]);
        finalButton.disabled = !allMainStepsSelected;
        finalButton.innerHTML = `${getSvgIcon(getIcon('calendarCheck'), 'Заказ')} ${getUIText('finalButton')}`;

        // Кнопка сброса
        resetButton.innerHTML = `${getSvgIcon(getIcon('redo'), 'Сбросить')} ${getUIText('resetButton')}`;

        // Заголовок карточки выбора
        const selectionCardTitle = document.querySelector('.selection-card-header h3');
        if (selectionCardTitle) {
            selectionCardTitle.textContent = getUIText('selectionCardTitle');
        }

        // Обновляем иконку в заголовке карточки выбора
        const selectionCardIcon = document.querySelector('.selection-card-header .svg-icon');
        if (selectionCardIcon) {
            selectionCardIcon.outerHTML = getSvgIcon(getIcon('clipboard'), 'Подборка');
        }
    }

    function updateSelectionCard() {
        selectionTags.innerHTML = '';
        
        const hasSelections = appData.mainSteps.some(step => !!appState.selections[step]);
        
        if (!hasSelections) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>Выберите параметры, чтобы увидеть их здесь</p>';
            selectionTags.appendChild(emptyState);
            return;
        }
          
        appData.mainSteps.forEach((stepId, index) => {
            if (appState.selections[stepId]) {
                const selection = appState.selections[stepId];
                
                const tag = document.createElement('div');
                tag.className = 'selection-tag';
                tag.innerHTML = `
                    <div class="tag-step">${index + 1}</div>
                    <span>${selection.title}</span>
                `;
                
                tag.addEventListener('click', () => {
                    goToStep(stepId);
                });
                
                selectionTags.appendChild(tag);
            }
        });
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
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
        const currentIndex = appData.stepsOrder.indexOf(appState.currentStep);
        if (currentIndex > 0) {
            goToStep(appData.stepsOrder[currentIndex - 1]);
        }
    });

    nextBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (appState.currentStep === 'decor') {
            // Проверяем, все ли шаги выбраны
            const allMainStepsSelected = appData.mainSteps.every(step => 
                step === 'decor' ? true : !!appState.selections[step]
            );
            
            if (allMainStepsSelected) {
                // Запускаем процесс звонка
                const callMade = handleFinalCall();
                if (!callMade) {
                    // Если звонок не сделан, все равно переходим к магазинам
                    goToStep('test');
                }
            } else {
                alert(getUIText('completeAllStepsAlert'));
            }
        } else {
            const currentIndex = appData.stepsOrder.indexOf(appState.currentStep);
            if (currentIndex < appData.stepsOrder.length - 1) {
                goToStep(appData.stepsOrder[currentIndex + 1]);
            }
        }
    });

    resetButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm(getUIText('resetConfirmation'))) {
            appState.selections = {};
            goToStep('home');
        }
    });

    if (startButton) {
        startButton.addEventListener('click', function(event) {
            event.preventDefault();
            goToStep('room');
        });
    }

    finalButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Проверяем, все ли шаги выбраны
        const allMainStepsSelected = appData.mainSteps.every(step => !!appState.selections[step]);
        
        if (allMainStepsSelected) {
            // Используем ту же функцию для звонка
            handleFinalCall();
        } else {
            // Если не все шаги выбраны - показываем предупреждение
            alert(getUIText('completeAllStepsAlert'));
        }
    });

    // Закрытие мобильной панели
    if (closeMobileInfoBtn) {
        closeMobileInfoBtn.innerHTML = getSvgIcon(getIcon('times'), 'Закрыть');
        closeMobileInfoBtn.addEventListener('click', function() {
            mobileInfoPanel.classList.remove('show');
            mobileInfoPanel.style.display = 'none';
            document.body.classList.remove('mobile-info-open');
        });
    }

    // Закрытие мобильной панели при клике вне её
    document.addEventListener('click', function(event) {
        if (mobileInfoPanel && mobileInfoPanel.classList.contains('show') && 
            !mobileInfoPanel.contains(event.target) && 
            !event.target.closest('.option-card') &&
            !event.target.closest('.home-card') &&
            !event.target.closest('.menu-step')) {
            mobileInfoPanel.classList.remove('show');
            mobileInfoPanel.style.display = 'none';
            document.body.classList.remove('mobile-info-open');
        }
    });

    // Закрытие мобильной панели по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileInfoPanel && mobileInfoPanel.classList.contains('show')) {
            mobileInfoPanel.classList.remove('show');
            mobileInfoPanel.style.display = 'none';
            document.body.classList.remove('mobile-info-open');
        }
    });

    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        updateNavigation();
        
        // Закрываем мобильную панель при переходе на десктоп
        if (window.innerWidth > 1200 && mobileInfoPanel && mobileInfoPanel.classList.contains('show')) {
            mobileInfoPanel.classList.remove('show');
            mobileInfoPanel.style.display = 'none';
            document.body.classList.remove('mobile-info-open');
        }
    });

    // ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
    console.log('Запуск приложения...');
    goToStep('home');
}

// ========== ЗАГРУЗКА ДАННЫХ И ЗАПУСК ПРИЛОЖЕНИЯ ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаю загрузку данных...');
    
    loadAppData()
        .then(() => {
            console.log('Данные загружены, инициализирую приложение...');
            initApp();
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            alert('Не удалось загрузить данные приложения. Пожалуйста, обновите страницу или запустите через локальный сервер.');
        });
});
