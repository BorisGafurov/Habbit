'use strict'

import data from './data.json' assert{type:'json'};

let habbits = data;
let globalActiveHabbitId;

// Данные с HTML
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        headerText: document.querySelector('.header__text'),
        progressPercentage: document.querySelector('.progress__percentage'),
        progressStripActive: document.querySelector('.progress__strip_active')
    },
    contentDays: {
        currentDay: document.querySelector('.main'),
        nextDays: document.querySelector('.div__input:last-of-type')
    }
}


// Рендер меню 
function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existed) {
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('button__menu');
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img class="img__button_menu" src="image/${habbit.icon}.svg" alt="${habbit.name}">`
             if (activeHabbit.id === habbit.id) { 
            element.classList.add('active__img_button_menu');
            } 
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {  
            existed.classList.add('active__img_button_menu');
        } else {
            existed.classList.remove('active__img_button_menu');
        }
    }
}

// Рендер шапки
function rerenderHeader(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    page.header.headerText.innerText = activeHabbit.name;
    const daysCompleted = activeHabbit.days.length;
    const target = activeHabbit.target;
    const progress = daysCompleted / target * 100 > 100
        ? 100
        : daysCompleted / target * 100;
    page.header.progressPercentage.innerText = progress.toFixed(0) + '%';
    page.header.progressStripActive.setAttribute('style', `width: ${progress}%`);
}

// Рендер дней
    function rerenderDays(activeHabbit) {
        page.contentDays.currentDay.innerHTML = '';
        const promises = [];
        for (const day in activeHabbit.days) {
            const element = document.createElement('div');
            element.classList.add('div__input');
            element.setAttribute('style', `grid-row: ${Number(day) + 1}`);
            element.innerHTML = 
            `<div class="div__form_day">День ${Number(day) + 1} </div> 
            <div class="comment__div">${[activeHabbit.days[day].comment]}
             <button class="comment__icon_delete">
                <img src="image/delete.svg" alt="Удалить">
             </button>
            </div>`;
            const deleteIcon = element.querySelector('.comment__icon_delete');
            deleteIcon.addEventListener('click', createDelete(activeHabbit.id, Number(day)));
            promises.push(new Promise(resolve => {
                page.contentDays.currentDay.appendChild(element);
                resolve();
            }));
        };
        
        const newDayForm = document.createElement('div');
        newDayForm.classList.add('div__input');       
    newDayForm.innerHTML = 
    `<div class="div__form_day">День ${activeHabbit.days.length + 1}</div>
        <div class="comment__div">
        <form class="form__day form__active">
            <input name='comment' class="comment__input " type="text" name="comment" placeholder="Комментарий">
            <div class="comment__icon">
                <img  src="image/Vector.svg" alt="Комментарий">
            </div>
            <button class="done" type="submit">Готово</button>
        </div>
    </form>`;
    const form = newDayForm.querySelector('.form__day');
    form.addEventListener('submit', addDays);
    page.contentDays.currentDay.appendChild(newDayForm);
    Promise.all(promises).then(() => {});
    }


// Работа с днями
function addDays(event) {
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form);
    const comment = data.get('comment');
    form['comment'].classList.remove('error');
    if ( comment === '') {
        form['comment'].classList.add('error');
        return;
    }
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment }])
            }
        }
        return habbit;
    });
    form['comment'].value = '';
    rerender(globalActiveHabbitId);
    
}

function createDelete (habbitId, dayIndex) {
    return function (event) {
        deleteDay(habbitId, dayIndex)
    }
}

function deleteDay(habbitId, dayIndex) {
    const activeHabbit = habbits.find(habbit => habbit.id === habbitId);
    activeHabbit.days.splice(dayIndex, 1);
    rerender(habbitId);
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit);
    rerenderDays(activeHabbit);
} 

// Init

(() => {
    rerender(habbits[0].id);
}) ();
