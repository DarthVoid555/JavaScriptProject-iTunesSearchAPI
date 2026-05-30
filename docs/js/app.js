import WelcomeScreen from './welcome.js';
import MusicAPI from './data.js';
import UI from './ui.js';

window.MusicAPI = MusicAPI;

const welcomeDiv = document.getElementById('welcome-screen');
const mainDiv = document.getElementById('main-screen');

const ui = new UI();

new WelcomeScreen((name) => {
  welcomeDiv.classList.add('hidden');
  mainDiv.classList.remove('hidden');
  ui.setUserName(name);
});