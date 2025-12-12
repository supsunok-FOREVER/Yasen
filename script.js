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

// Загружаем данные из JSON файла
async function loadAppData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        appData = {
            stepsData: data.stepsData || {},
            stepsOrder: data.stepsOrder || [],
            mainSteps: data.mainSteps || [],
            uiTexts: data.uiTexts || {},
            icons: data.icons || {},
            uiClasses: data.uiClasses || {}
        };
        
        console.log('Данные успешно загружены из data.json');
        initApp();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные приложения. Пожалуйста, обновите страницу.');
    }
}

// Инициализация приложения
function initApp() {
    // ========== ИНИЦИАЛИЗАЦИЯ DOM ЭЛЕМЕНТОВ ==========
    const menuSteps = document.querySelectorAll('.menu-step');
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
    
    const mobileInfoPanel = document.getElementById('mobileInfoPanel');
    const mobilePanelTitle = document.getElementById('mobilePanelTitle');
    const mobileParameterDetails = document.getElementById('mobileParameterDetails');
    const closeMobileInfoBtn = document.querySelector('.btn-close-mobile-info');

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
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

    // ========== ГЛАВНАЯ ФУНКЦИЯ ==========
    function goToStep(stepId) {
        if (!appData.stepsData[stepId]) {
            console.error('Шаг не найден:', stepId);
            return;
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
        
        // 5. Обновляем навигацию        updateNavigation();
        
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
    
    testContent.classList.remove('active');
    testContent.classList.add('hidden');
    
    const stepData = appData.stepsData[stepId];
    
    if (stepId === 'home') {
        homeContent.classList.remove('hidden');
        homeContent.classList.add('active');
        renderHomeContent();
    } else if (stepId === 'test') {
        testContent.classList.remove('hidden');
        testContent.classList.add('active');
        renderTestContent();
    } else {
        // Для остальных шагов показываем сетку
        houseGrid.classList.remove('hidden');
        houseGrid.classList.add('active');
        renderStepOptions(stepId, stepData);
    }
}

    function renderHomeContent() {
        const stepData = appData.stepsData.home;
        
        // Создаем структуру для компактных шагов
        const compactStepsContainer = homeContent.querySelector('.compact-steps');
        if (compactStepsContainer && stepData.compactSteps) {
            // Разделяем шаги на две колонки
            const stepsColumns = [
                stepData.compactSteps.slice(0, 3),
                stepData.compactSteps.slice(3, 6)
            ];
            
            compactStepsContainer.innerHTML = '';
            
            stepsColumns.forEach(columnSteps => {
                const columnDiv = document.createElement('div');
                columnDiv.className = getUIClass('home', 'stepsColumn') || 'steps-column';
                
                columnSteps.forEach(step => {
                    const stepDiv = document.createElement('div');
                    stepDiv.className = `${getUIClass('home', 'compactStep') || 'compact-step'} clickable-step`;
                    stepDiv.dataset.step = step.step;
                    
                    stepDiv.innerHTML = `
                        <div class="${getUIClass('home', 'stepIndicator') || 'step-indicator'}">
                            <div class="${getUIClass('home', 'stepIcon') || 'step-icon'}">
                                <i class="fas ${step.icon}"></i>
                            </div>
                        </div>
                        <div class="${getUIClass('home', 'stepContent') || 'step-content'}">
                            <h3>${step.title}</h3>
                            <p>${step.description}</p>
                        </div>
                    `;
                    
                    columnDiv.appendChild(stepDiv);
                });
                
                compactStepsContainer.appendChild(columnDiv);
            });
        }
        
        // Добавляем анимацию
        setTimeout(() => {
            const compactSteps = homeContent.querySelectorAll('.compact-step');
            compactSteps.forEach((step, index) => {
                step.style.animationDelay = `${index * 0.1}s`;
                step.classList.add('fade-in');
            });
        }, 100);
        
        // Обработчики кликов для компактных шагов
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
                <i class="fas ${option.icon}"></i>
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

         const existingContent = testContent.querySelector('.test-drive-container, .button-container');
          if (existingContent) {
        // Если контент уже отрендерен, просто выходим
        // Или, если хотите перерендерить, удалите старый контент:
        testContent.innerHTML = '';
    }
        // Основной контейнер
        const mainContainer = document.createElement('div');
        mainContainer.className = getUIClass('testDrive', 'container') || 'test-drive-container';
        
        // Заголовок
        const title = document.createElement('h3');
        const storeIcon = document.createElement('i');
        storeIcon.className = `fas ${getIcon('store')}`;
        title.appendChild(storeIcon);
        title.appendChild(document.createTextNode(` ${appData.uiTexts.shopInvitation || 'Мы приглашаем вас в Наши магазины'}`));
        mainContainer.appendChild(title);
        
        // Контейнер для магазинов
        const shopList = document.createElement('div');
        shopList.className = getUIClass('testDrive', 'shopList') || 'shop-list';
        
        // Группируем магазины по 2
        for (let i = 0; i < stepData.shops.length; i += 2) {
            const shopGroup = document.createElement('div');
            shopGroup.className = getUIClass('testDrive', 'shopGroup') || 'shop-group';
            
            // Если это не первая группа, добавляем отступ сверху через CSS класс
            if (i > 0) {
                shopGroup.style.marginTop = '25px';
            }
            
            const groupShops = stepData.shops.slice(i, i + 2);
            groupShops.forEach(shop => {
                const shopCard = createShopCard(shop);
                shopGroup.appendChild(shopCard);
            });
            
            shopList.appendChild(shopGroup);
        }
        
        mainContainer.appendChild(shopList);
        testContent.appendChild(mainContainer);
        
        // Кнопка записи
        const buttonContainer = document.createElement('div');
        buttonContainer.className = getUIClass('testDrive', 'buttonContainer') || 'button-container';
        
        const bookBtn = document.createElement('button');
        bookBtn.className = `btn-primary ${getUIClass('testDrive', 'bookButton') || 'book-test-drive-btn'}`;
        bookBtn.id = 'bookTestDrive';
        
        const calendarIcon = document.createElement('i');
        calendarIcon.className = `fas ${getIcon('calendarCheck')}`;
        bookBtn.appendChild(calendarIcon);
        bookBtn.appendChild(document.createTextNode(` ${getUIText('bookTestDriveButton')}`));
        
        buttonContainer.appendChild(bookBtn);
        testContent.appendChild(buttonContainer);
        
        // Обработчик кнопки
        if (stepData.phoneNumber) {
            bookBtn.addEventListener('click', function() {
                alert(stepData.confirmationMessage || getUIText('confirmationMessage'));
                
                const confirmCallMessage = (stepData.confirmCallMessage || getUIText('confirmCallMessage'))
                    .replace('{{phoneNumber}}', stepData.phoneNumber);
                
                const confirmCall = confirm(confirmCallMessage);
                
                if (confirmCall) {
                    window.location.href = `tel:${stepData.phoneNumber}`;
                }
            });
        }
    }

    function createShopCard(shop) {
        const card = document.createElement('div');
        card.className = getUIClass('testDrive', 'shopCard') || 'shop-card';
        
        // Название магазина
        const name = document.createElement('h4');
        name.className = getUIClass('testDrive', 'shopName') || 'shop-name';
        
        const mapIcon = document.createElement('i');
        mapIcon.className = `fas ${getIcon('mapMarker')}`;
        name.appendChild(mapIcon);
        name.appendChild(document.createTextNode(` ${shop.name}`));
        card.appendChild(name);
        
        // Адрес
        const address = document.createElement('p');
        address.className = getUIClass('testDrive', 'shopAddress') || 'shop-address';
        address.textContent = shop.address;
        card.appendChild(address);
        
        // Метро (если есть)
        if (shop.metro) {
            const metro = document.createElement('p');
            metro.className = getUIClass('testDrive', 'shopMetro') || 'shop-metro';
            
            const metroIcon = document.createElement('i');
            metroIcon.className = `fas ${getIcon('subway')}`;
            metro.appendChild(metroIcon);
            metro.appendChild(document.createTextNode(` ${shop.metro}`));
            
            card.appendChild(metro);
        }
        
        // Часы работы
        const hours = document.createElement('p');
        hours.className = getUIClass('testDrive', 'shopHours') || 'shop-hours';
        
        const clockIcon = document.createElement('i');
        clockIcon.className = `fas ${getIcon('clock')}`;
        hours.appendChild(clockIcon);
        hours.appendChild(document.createTextNode(` ${shop.hours}`));
        
        card.appendChild(hours);
        
        // Телефон
        const phone = document.createElement('p');
        phone.className = getUIClass('testDrive', 'shopPhone') || 'shop-phone';
        
        const phoneIcon = document.createElement('i');
        phoneIcon.className = `fas ${getIcon('phone')}`;
        phone.appendChild(phoneIcon);
        phone.appendChild(document.createTextNode(` ${shop.phone}`));
        
        card.appendChild(phone);
        
        return card;
    }

    function updateInfoPanel(stepId) {
            if (window.innerWidth <= 480) {
        return;}
        const stepData = appData.stepsData[stepId];
        if (!stepData) return;
        
        if (stepId === 'home') {
            panelTitle.innerHTML = `<i class="fas ${getIcon('home')}"></i> ${stepData.title}`;
            panelSubtitle.textContent = stepData.subtitle || '';
            stepExplanation.innerHTML = `<p>${stepData.explanation}</p>`;
            parameterDetails.innerHTML = '';
            return;
        }
        
        panelTitle.innerHTML = `<i class="fas ${getIcon('info')}"></i> ${stepData.title}`;
        panelSubtitle.textContent = stepData.subtitle || '';
        stepExplanation.innerHTML = `<p>${stepData.explanation}</p>`;
        
        if (appState.selections[stepId]) {
            const selected = appState.selections[stepId];
            parameterDetails.innerHTML = `
                <h4>${selected.title}</h4>
                <p>${selected.desc}</p>
                ${stepId === 'fabric' ? 
                    `<p class="fabric-note">
                        <i class="fas ${getIcon('handPointRight')}"></i> ${getUIText('touchFabricNote')}
                    </p>` : 
                    ''}
            `;
        } else {
            parameterDetails.innerHTML = `<p>${getUIText('noSelectionMessage')}</p>`;
        }
    }

function selectOption(stepId, optionData) {
    appState.selections[stepId] = optionData;

    document.querySelectorAll(`[data-step="${stepId}"]`).forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.optionId === optionData.id) {
            card.classList.add('selected');
        }
    });

    parameterDetails.innerHTML = `
        <h4>${optionData.title}</h4>
        <p>${optionData.desc}</p>
        ${stepId === 'fabric' ? 
            `<p class="fabric-note">
                <i class="fas ${getIcon('handPointRight')}"></i> ${getUIText('touchFabricNote')}
            </p>` : ''
        }
    `;

    // Мобильная панель — только для телефонов
    if (window.innerWidth <= 480) {
        mobilePanelTitle.textContent = optionData.title;
        mobileParameterDetails.innerHTML = `
            <p>${optionData.desc}</p>
            ${stepId === 'fabric' ? 
                `<p class="fabric-note">
                    <i class="fas ${getIcon('handPointRight')}"></i> ${getUIText('touchFabricNote')}
                </p>` : ''
            }
        `;
        mobileInfoPanel.classList.add('show');
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
            prevBtn.innerHTML = `<i class="fas ${getIcon('arrowLeft')}"></i> <span>${getUIText('backButton')}</span>`;

            // Кнопка "Далее"
            let nextDisabled = false;

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
                }
            }

            nextBtn.disabled = nextDisabled;

            // Текст кнопки "Далее"
            nextBtn.innerHTML = currentStep === 'decor'
                ? `<span>${getUIText('toTestDriveButton')}</span> <i class="fas ${getIcon('arrowRight')}"></i>`
                : `<span>${getUIText('nextButton')}</span> <i class="fas ${getIcon('arrowRight')}"></i>`;

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

            // Кнопка финала
            const allMainStepsSelected = appData.mainSteps.every(step => !!appState.selections[step]);
            finalButton.disabled = !allMainStepsSelected;
            finalButton.innerHTML = `<i class="fas ${getIcon('calendarCheck')}"></i> ${getUIText('finalButton')}`;

            // Кнопка сброса
            resetButton.innerHTML = `<i class="fas ${getIcon('redo')}"></i> ${getUIText('resetButton')}`;

            // Заголовок карточки выбора
            const selectionCardTitle = document.querySelector('.selection-card-header h3');
            if (selectionCardTitle) {
                selectionCardTitle.textContent = getUIText('selectionCardTitle');
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
        const currentIndex = appData.stepsOrder.indexOf(appState.currentStep);
        if (currentIndex < appData.stepsOrder.length - 1) {
            goToStep(appData.stepsOrder[currentIndex + 1]);
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
            goToStep('test');
        } else {
            alert(getUIText('completeAllStepsAlert'));
        }
    });

    // Закрытие мобильной панели
    if (closeMobileInfoBtn) {
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
            !event.target.closest('.option-card')) {
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

    // ========== ЗАПУСК ==========
    goToStep('home');
}


// Загружаем данные и запускаем приложение
document.addEventListener('DOMContentLoaded', function() {
    loadAppData();
});