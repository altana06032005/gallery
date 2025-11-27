import './style.css';
import { GameManager } from './game/GameManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  const game = new GameManager(app);
  game.start();
});
