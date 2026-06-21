/**
 * src/lib/store/appState.svelte.js - текущее состояние калькулятора 
 */

// import { appStore } from "./appStore.svelte";
import { historyStore } from "./historyStore.svelte";
import { convertFractionToDecimalIfNeeded } from '$lib/utils/convertFractionToDecimalIfNeeded';

class AppState {
  /** @type {string} */
  display = $state('0'); // Текущий ввод или результат на экране.
  /** @type {string} */
  expression = $state('');// Текущая строящаяся цепочка (например "37+3")
  /** @type {boolean} */
  isNewInput = $state(true);// Флаг= $state() нужно ли заменить display при вводе цифры
  /** @type {string} */
  corner = $state('deg'); // Флаг как работаем с тригонометрией deg, rad, grad
  /** @type {boolean} */
  stepsFraction = $state(false); // флаг как работаем с дробями. Раскладываем на шаги вычислений или нет?
  /** @type {number} */
  // numToFix = $state(appStore.toFix); //Количество знаков после запятой для результата вычисления
  /** @type {string} */
  now_mode = $state('amoca'); // Режим калькулятора - отображается в окне div class="now_mode"

  // Метод для переключения режима 
  setMode(mode) {
    this.now_mode = mode;
    ensureDisplayIsDecimalIfNeeded(); // добавить после смены режима
  }

  // ========= ячейки памяти
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
  // ========= ячейки памяти

  /** @type {Array} */
  historySession = $state([]); // Массив строк завершенных вычислений в этой сессии для математики. 
  // Новый элемент (цепочка = результат) добавляется в historySession при нажатии на [=]
  // в historySession элемент добавляется функцией function performCalculation() 

  /** @type {Array} */
  historySessionGeom = $state([]); // Массив строк завершенных вычислений в этой сессии для геометрии.

  /** @type {Array} */
  historySessionTime = $state([]); // Массив строк завершенных вычислений в этой сессии для страниц обработки времени.

  // Метод для очистки
  reset = () => {
    this.display = '0';
    this.expression = '';
    this.isNewInput = true;
  }

  //============== всё что касается работы с ячейками памяти в режиме математики

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

  // Метод для очистки всей памяти (для кнопки CLEAR ALL)
  clearAllMemory() {
    this.M1 = null;
    this.M2 = null;
    this.M3 = null;
    this.M4 = null;
    this.isMemoModalOpen = false;
  }

  // Помощник для получения значения из математической истории (число после "=")
  extractResult(entry) {
    const parts = entry.split('=');
    return parts.length > 1 ? parts[parts.length - 1].trim() : entry;
  }


  //============== всё что касается работы с historyStore


  /** * Уникальный ID для текущей открытой вкладки.
   * Генерируется один раз при загрузке страницы.
   */
  #sessionId = Date.now().toString();

  /** Текущие массивы вычислений в оперативной памяти  - объявлены выше */

  /** * Реестр существующих хранилищ сессий.
   * Позволяет легко добавлять новые типы калькуляторов.
   */
  #registry = [
    { type: 'math', storeName: 'historySession' },
    { type: 'geometry', storeName: 'historySessionGeom' },
    { type: 'time', storeName: 'historySessionTime' }
  ];

  /**
   * Сохраняет все непустые сессии в историю.
   * Вызывается при сворачивании приложения.
   * Массивы НЕ очищаются, чтобы пользователь не потерял данные на экране.
   */
  saveAllActiveSessions() {
    this.#registry.forEach((session) => {
      const currentData = this[session.storeName];

      if (currentData && currentData.length > 0) {
        // Передаем данные в historyStore для синхронизации с localStorage
        historyStore.updateEntry(this.#sessionId, session.type, currentData);
      }
    });
  }
}

export const appState = new AppState;

// если произошёл переход из режима дробей в другой режим, то число в appState.display  преобразуем в десятичную дробь

/**
* Проверяет, находится ли калькулятор в не-дробном режиме и содержит ли дисплей дробь.
* Если оба условия истинны – преобразует display в десятичное число.
* 
* Использование:
* - вызывать при переключении режима (setMode) для актуализации отображения;
* - вызывать при загрузке сохранённого состояния, если режим изменился;
* - может быть использована в других местах, где требуется гарантировать, что display
*   представлен в десятичном виде для не-дробного режима.
*/
function ensureDisplayIsDecimalIfNeeded() {
  // Если режим дробный – оставляем как есть
  if (appState.now_mode === 'FRACTION') return;

  const displayStr = String(appState.display);
  // Если на дисплее нет символов дроби – преобразование не требуется
  if (!displayStr.includes('÷') && !displayStr.includes('⥑')) return;

  // Преобразуем дробь в десятичное число
  appState.display = convertFractionToDecimalIfNeeded(displayStr);
}