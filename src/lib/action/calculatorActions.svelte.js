
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
import { float_toFixed } from './base';

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
  if (appState.expression === '') return;

  // Формируем финальное выражение
  const finalExpr = appState.expression + appState.display;
  const result = evaluateExpression(finalExpr);
  const toHistory = `${finalExpr}=${result}`;


  // Добавляем в историю (например "2+2*2=6")
  appState.historySession.push(toHistory);

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


  // Обновляем дисплей
  appState.display = `${float_toFixed(result)}`;
  appState.expression = ''; // Очищаем текущую цепочку
  appState.isNewInput = true; // Следующая цифра начнет новый ввод
}


/**
* Очистка (клавиша С)
*/
export function clear() {
  appState.reset();
}