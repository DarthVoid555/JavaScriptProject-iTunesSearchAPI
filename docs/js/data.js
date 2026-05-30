const API_URL = 'https://itunes.apple.com/search';

export default class MusicAPI {
  static async search(term) {
    const params = new URLSearchParams({
      term,
      entity: 'song',
      limit: 50
    });
    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error('Ошибка сети');
    return response.json();
  }
}