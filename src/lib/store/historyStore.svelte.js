/*
 * Этот файл отвечает за работу с localStorage, контроль лимита записей и реактивное состояние «старой» истории.
 * при сворачивании приложения данные синхронизируются с историей, но не пропадают с экрана пользователя.
 * Если пользователь просто свернул и вернулся: Данные сохранились в localStorage (на всякий случай), но в appState всё осталось на экране. Он продолжает считать.
 * Если пользователь свернул и забыл на неделю (или закрыл): Последнее сохранение, сделанное в момент сворачивания, уже лежит в localStorage.
 * Единственный случай, когда сохранение не произойдет: Если телефон мгновенно выключится (села батарейка) или случится критический крах браузера. Но от этого не застраховано ни одно веб-приложение.
 *  
 * Как это тестировать:
      * ❎ Проверка сохранения: Сделайте несколько вычислений (добавьте строки в appState.historySession). 
      Сверните браузер (или переключитесь на другую вкладку). 
      Откройте DevTools -> Application -> Local Storage. 
      Там должна появиться запись app_history с вашими данными.

      *  ❎ Проверка обновления: Вернитесь в приложение, сделайте еще один расчет и снова сверните. 
      В localStorage старая запись должна обновиться (добавится новая строка), а не создаться новая.

      * ❎ Проверка извлечения: Перезагрузите страницу (чтобы appState очистился). 
      Нажмите кнопку, которая вызывает historyStore.loadFromLocal(). 
      Данные из памяти должны появиться в historyStore.all.

      * ❎ Проверка лимита: Установите в appStore.historyLocal маленькое число (например, 2). 
      Сохраните 3 разные сессии (нужно 3 раза перезагрузить страницу и что-то посчитать). 
      Самая первая сессия должна исчезнуть из localStorage.
 */

// src/lib/store/historyStore.svelte.js
import { appStore } from './appStore.svelte';

class HistoryStore {
  /** * Приватное состояние истории. 
   * Используем объект, где ключи — это уникальные ID сессий.
   * @type {Object} 
   */
  #data = $state({});

  constructor() {
    // Автоматически загружаем старые записи при инициализации стора,
    // чтобы новые сохранения не затирали старые.
    this.loadFromLocal();
  }

  loadFromLocal() {
    // Проверка на window обязательна для SvelteKit (SSR)
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('app_history');
    if (saved) {
      try {
        // Мы НЕ перезаписываем объект, а обновляем его содержимое
        this.#data = JSON.parse(saved);
        console.log('HistoryStore: инициализирован данными из локальной памяти');
      } catch (e) {
        console.error('HistoryStore: ошибка инициализации', e);
      }
    }
  }

  /** Геттер для получения всех записей в компонентах */
  get all() {
    return this.#data;
  }

  /**
   * Добавляет или обновляет запись в истории.
   * @param {string} sessionId - Уникальный ID текущей вкладки.
   * @param {string} type - Тип вычислений (general, geometry, time...).
   * @param {string[]} items - Массив строк с вычислениями.
   */
  updateEntry(sessionId, type, items) {
    // 1. Создаем копию текущих данных
    const updated = { ...this.#data };

    // 2. Генерируем уникальный ключ для этой конкретной под-сессии
    const entryKey = `${sessionId}_${type}`;

    // 3. Записываем/Обновляем данные
    updated[entryKey] = {
      type,
      items: [...items],
      updatedAt: new Date().toISOString() // Всегда обновляем дату при сохранении
    };

    // 4. Получаем список ВСЕХ ключей и сортируем их ПО ДАТЕ (от старых к новым)
    // Используем getTime() для надежности сравнения
    const sortedKeys = Object.keys(updated).sort((a, b) => {
      const dateA = new Date(updated[a].updatedAt).getTime();
      const dateB = new Date(updated[b].updatedAt).getTime();
      return dateA - dateB;
    });

    // 5. УДАЛЯЕМ ЛИШНЕЕ
    // Используем цикл while, чтобы гарантированно войти в лимит, 
    // сколько бы записей мы ни добавили за один раз.
    if (sortedKeys.length > appStore.historyLocal) {
      const countToRemove = sortedKeys.length - appStore.historyLocal;
      const keysToDelete = sortedKeys.slice(0, countToRemove);

      keysToDelete.forEach(key => {
        delete updated[key];
      });
    }

    // 6. Сохраняем результат
    this.#data = updated;
    this.persist();
  }

  /** Запись текущего состояния в физическую память */
  persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_history', JSON.stringify(this.#data));
    }
  }
}

export const historyStore = new HistoryStore();