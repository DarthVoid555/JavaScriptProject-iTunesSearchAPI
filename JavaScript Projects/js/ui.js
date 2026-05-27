export default class UI {
  constructor() {
    this.results = [];
    this.filteredResults = [];

    this.searchInput = document.getElementById('search-input');
    this.searchBtn = document.getElementById('search-btn');
    this.sortSelect = document.getElementById('sort-select');
    this.previewFilter = document.getElementById('preview-filter');
    this.statsBtn = document.getElementById('stats-btn');
    this.resultsContainer = document.getElementById('results-container');
    this.greetingElem = document.getElementById('greeting');
    this.noResults = document.getElementById('no-results');

    this.searchBtn.addEventListener('click', () => this.doSearch());
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.doSearch();
    });
    this.sortSelect.addEventListener('change', () => this.applyFiltersAndSort());
    this.previewFilter.addEventListener('change', () => this.applyFiltersAndSort());
    this.statsBtn.addEventListener('click', () => this.showStats());
  }

  setUserName(name) {
    this.greetingElem.textContent = `Привет, ${name}!`;
  }

  async doSearch() {
    const term = this.searchInput.value.trim();
    if (!term) {
      alert('Введите запрос для поиска.');
      return;
    }
    try {
      const data = await MusicAPI.search(term);
      this.results = data.results;
      this.applyFiltersAndSort();
    } catch (error) {
      this.resultsContainer.innerHTML = '<p>Ошибка при загрузке данных. Попробуйте позже.</p>';
    }
  }

  applyFiltersAndSort() {
    let filtered = [...this.results];

    //фильтрация по превью
    if (this.previewFilter.checked) {
      filtered = filtered.filter(track => track.previewUrl);
    }

    //сортировка
    const sortBy = this.sortSelect.value;
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.trackName.localeCompare(b.trackName));
    } else if (sortBy === 'artist') {
      filtered.sort((a, b) => a.artistName.localeCompare(b.artistName));
    } else if (sortBy === 'album') {
      filtered.sort((a, b) => (a.collectionName || '').localeCompare(b.collectionName || ''));
    }

    this.filteredResults = filtered;
    this.renderResults();
  }

  renderResults() {
    if (this.filteredResults.length === 0) {
      this.resultsContainer.innerHTML = '<p>Ничего не найдено.</p>';
      return;
    }

    let html = '<table><thead><tr><th>#</th><th>Обложка</th><th>Название</th><th>Исполнитель</th><th>Альбом</th><th>Длительность</th><th></th></tr></thead><tbody>';

    this.filteredResults.forEach((track, index) => {
      const trackNumber = index + 1;
      const artwork = track.artworkUrl100 ? `<img class="album-art" src="${track.artworkUrl100}" alt="обложка">` : '—';
      const trackName = track.trackName || 'Неизвестно';
      const artist = track.artistName || 'Неизвестен';
      const album = track.collectionName || '—';
      const duration = this.formatTime(track.trackTimeMillis);
      const previewBtn = track.previewUrl
        ? `<button class="preview-btn" data-preview="${track.previewUrl}">▶️</button>`
        : '';

      html += `<tr>
        <td>${trackNumber}</td>
        <td>${artwork}</td>
        <td>${trackName}</td>
        <td>${artist}</td>
        <td>${album}</td>
        <td>${duration}</td>
        <td>${previewBtn}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    this.resultsContainer.innerHTML = html;

    //обработчики на кнопки проигрывания
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.preview;
        const audio = new Audio(url);
        audio.play();
      });
    });
  }

  formatTime(millis) {
    if (!millis) return '—';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  showStats() {
    const total = this.filteredResults.length;
    if (total === 0) {
      alert('Нет данных для статистики.');
      return;
    }

    let totalDuration = 0;
    let countWithDuration = 0;
    this.filteredResults.forEach(track => {
      if (track.trackTimeMillis) {
        totalDuration += track.trackTimeMillis;
        countWithDuration++;
      }
    });

    const avgMillis = countWithDuration ? totalDuration / countWithDuration : 0;
    const avgFormatted = this.formatTime(avgMillis);

    alert(`Найдено треков: ${total}\nСредняя длительность: ${avgFormatted}`);
  }
}