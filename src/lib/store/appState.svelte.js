/**
 * текущее состояние калькулятора appState.svelte.js
 */

import { appStore } from "./appStore.svelte";

class AppState {
  /** @type {string} */
  display = $state('0'); // Текущий ввод или результат на экране.
  /** @type {string} */
  expression = $state('');// Текущая строящаяся цепочка (например "37+3")
  /** @type {boolean} */
  isNewInput = $state(true);// Флаг= $state() нужно ли заменить display при вводе цифры
  /** @type {string} */
  corner = $state('deg'); // Флаг как работаем с тригонометрией
  /** @type {number} */
  numToFix = $state(appStore.toFix); //Количество знаков после запятой для результата вычисления
  /** @type {string} */
  now_mode = $state('amoca'); // Режим калькулятора - отображается в окне div class="now_mode"

  /** @type {number} */
  M1 = $state(null); // значение сохранённое в ячейке памяти калькулятора М1
  /** @type {number} */
  M2 = $state(null); // значение сохранённое в ячейке памяти калькулятора М2
  /** @type {number} */
  M3 = $state(null); // значение сохранённое в ячейке памяти калькулятора М3
  /** @type {number} */
  M4 = $state(null); // значение сохранённое в ячейке памяти калькулятора М4
  /** @type {boolean} */
  isMemoModalOpen = $state(false); // флаг для открытия модалки, если все ячейки памяти заняты
  /** @type {number} */
  pendingMemoryValue = $state(null); // Сюда положим число из истории, пока юзер выбирает слот

  /** @type {Array} */
  historySession = $state([]); // Массив строк завершенных вычислений в этой сессии. 
  // Новый элемент (цепочка = результат) добавляется в historySession при нажатии на [=]
  // в historySession элемент добавляется функцией function performCalculation() 

  // Метод для очистки
  reset = () => {
    this.display = '0';
    this.expression = '';
    this.isNewInput = true;
  }

  //метод для записи данных в ячейку памяти 
  memoryUpdate(slot, data) {
    // slot — это строка 'M1', 'M2' и т.д.
    if (slot in this) {
      this[slot] = data;
    }
  }

  get firstEmptySlot() {
    if (this.M1 === null) { return 'M1'; } else
      if (this.M2 === null) { return 'M2'; } else
        if (this.M3 === null) { return 'M3'; } else
          if (this.M4 === null) { return 'M4'; } else
            return null; // Все заняты -> вызываем модалку
  }

  // Помощник для получения значения из истории (число после "=")
  extractResult(entry) {
    const parts = entry.split('=');
    return parts.length > 1 ? parts[parts.length - 1].trim() : entry;
  }

  // Метод для очистки всей памяти (для кнопки CLEAR ALL)
  clearAllMemory() {
    this.M1 = null;
    this.M2 = null;
    this.M3 = null;
    this.M4 = null;
    this.isMemoModalOpen = false;
  }
}

export const appState = new AppState;
