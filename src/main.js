import './style.css';
import { SceneManager } from './scene.js';
import { UIManager } from './ui.js';

// 1. Получаем canvas
const canvas = document.querySelector('#bg-canvas');

// 2. Объявляем переменную scene заранее
let scene;

// 3. Инициализируем UIManager и передаем callback на "назад"
const ui = new UIManager(() => {
    if (scene) scene.resetCamera(); // безопасно, т.к. scene уже объявлена
});

// 4. Инициализируем SceneManager и передаем callback на выбор планеты
scene = new SceneManager(canvas, (planetId) => {
    ui.showCatalog(planetId); // откроет каталог выбранной категории
});


