export default class WelcomeScreen {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.nameInput = document.getElementById('name-input');
    this.startBtn = document.getElementById('start-btn');

    this.startBtn.addEventListener('click', () => this.handleStart());
    this.nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleStart();
    });
  }

  handleStart() {
    const name = this.nameInput.value.trim();
    if (name) {
      this.onComplete(name);
    } else {
      alert('Пожалуйста, введите имя.');
    }
  }
}