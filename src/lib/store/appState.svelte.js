/**
 * текущее состояние калькулятора appState.svelte.js
 */

class AppState {

  display = $state('0'); // Текущий ввод или результат на экране.
  expression = $state('');// Текущая строящаяся цепочка (например "37+3")
  isNewInput = $state(true);// Флаг= $state() нужно ли заменить display при вводе цифры

  numToFix = $state(6); //Количество знаков после запятой для результата вычисления
  now_mode = $state('arithmetic'); // Режим калькулятора - отображается в окне div class="now_mode"

  M1 = $state(null); // значение сохранённое в ячейке памяти калькулятора М1
  M2 = $state(null); // значение сохранённое в ячейке памяти калькулятора М2
  M3 = $state(null); // значение сохранённое в ячейке памяти калькулятора М3
  M4 = $state(null); // значение сохранённое в ячейке памяти калькулятора М4

  historySession = $state([]); // Массив строк завершенных вычислений в этой сессии. 
  // Новый элемент (цепочка = результат) добавляется в historySession при нажатии на [=]
  // в historySession элемент добавляется функцией function performCalculation() 

  // Метод для полной очистки
  reset = () => {
    this.display = '0';
    this.expression = '';
    this.isNewInput = true;
  }

  //метод для записи данных в ячейку памяти 
  memorySet(slot, data) {
    // slot — это строка 'M1', 'M2' и т.д.
    if (slot in this) {
      this[slot] = data;
    }
  }
}
// ИСПОЛЬЗУЙ ИМЕНОВАННЫЙ ЭКСПОРТ
export const appState = new AppState;

// export default appState;