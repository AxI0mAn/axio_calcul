
/**
* файл src/lib/action/calculatorActions.js
* Функции, вызываемые кнопками. Связывают mathCore и appState.
* Нажатие цифры
* Нажатие оператора (+, -, *, /)
* Нажатие "="
* Очистка (клавиша С) 
*/
import { appState } from '../store/appState.svelte.js';
import { evaluateExpression, isLastCharOperator } from './mathCore.js';
import { float_toFixed } from './base.js';

/**
* Нажатие цифры
*/
export function addDigit(digit) {
  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
  } else {
    appState.display = appState.display === '0' ? digit : appState.display + digit;
  }
}

/**
* Нажатие оператора (+, -, *, /)
*/
export function addOperator(op) {
  // Если результат только что был вычислен, продолжаем от него
  if (appState.expression === '' && appState.display !== '0') {
    appState.expression = appState.display + op;
  } else if (isLastCharOperator(appState.expression) && appState.isNewInput) {
    // Если нажали два оператора подряд, заменяем последний
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    // Добавляем текущее число и оператор в выражение
    appState.expression += appState.display + op;
  }
  appState.isNewInput = true;
}

/**
* Нажатие "="
*/
export function performCalculation() {
  // Если в выражении пусто — вычислять нечего
  if (appState.expression === '') return;

  let finalExpr = '';

  // ПРОВЕРКА: Если мы только что нажали оператор (+, -, *...) 
  // и НЕ ввели новое число (isNewInput === true)
  if (appState.isNewInput) {
    // Отрезаем последний символ-оператор из цепочки (например, "5+" -> "5")
    finalExpr = appState.expression.slice(0, -1);
  } else {
    // Обычный ввод: приклеиваем то, что набрано на табло (например, "5+" + "3")
    finalExpr = appState.expression + appState.display;
  }

  const result = evaluateExpression(finalExpr);
  const toHistory = `${finalExpr}=${result}`;

  // Добавляем в историю
  appState.historySession.push(toHistory);

  // Обновляем дисплей
  appState.display = `${float_toFixed(result)}`;
  appState.expression = '';    // Сбрасываем цепочку
  appState.isNewInput = true;  // Результат — это теперь "новое число" для следующего ввода
}


/**
* Очистка (клавиша С)
*/
export function clear() {
  appState.reset();
}


// console.log('История обновлена, текущая длина:', appState.historySession.length);
// console.log(`show appState:`)
// console.log({
//   'display': appState.display,
//   'M1 ': appState.M1,
//   'M2': appState.M2,
//   'M3 ': appState.M3,
//   'M4 ': appState.M4,
//   'historySession': $state.snapshot(appState.historySession), // ПРИМЕНЯЕМ snapshot Т.К. МУТИРУЕМ МАССИВ  appState.historySession.push(toHistory);
//   'isNewInput': appState.isNewInput,
//   'expression': appState.expression,
//   'numToFix': appState.numToFix,
// })