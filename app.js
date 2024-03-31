'use strict'

const buttons = Array.from(document.querySelectorAll('.button__menu'));
const habbitName = document.getElementById('habbitName');
const progressPercentage = document
let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

// Данные с HTML
const page = {
    menu: document.querySelector('.menu__list')
}

// Загрузка и сохранение данных
function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// Работа меню render
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
             if (activeHabbit.id === habbit.id) {  // Зачем это дублировать
            element.classList.add('active__img_button_menu');
            } 
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {  // Зачем это дублировать
            existed.classList.add('active__img_button_menu');
        } else {
            existed.classList.remove('active__img_button_menu');
        }
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}   


// Init

(() => {
    loadData();
    rerender(habbits[0].id);
}) ();


