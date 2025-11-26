import './style.css';
import { SceneManager } from './scene.js';
import { UIManager } from './ui.js';
import { GameManager } from './game.js';

const canvas = document.querySelector('#bg-canvas');

// Initialize Managers
const scene = new SceneManager(canvas);
const ui = new UIManager();
const game = new GameManager(scene, ui);
