/* eslint-disable no-unused-vars */
/**
 * fractionActions.js
 * Обработчики кнопок для страницы дробей.
 * Исправлено: ввод точки, преобразование десятичных, вычитание, обработка ошибок.
 */

import { appState } from '$lib/store/appState.svelte.js';
import { Fraction, evaluateFractionExpression } from './fractionCore.js';
import FractionJS from 'fraction.js';



function isError() {
  return appState.display === 'ERROR';
}

function clearErrorIfNeeded() {
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
  }
}

// ---- цифры и точка ----
export function addDigitFraction(digit) {
  clearErrorIfNeeded();

  if (digit === '.') {
    // Нельзя ставить вторую точку
    if (appState.display.includes('.')) return;
    // Если сейчас 0 или новый ввод – начинаем с "0."
    if (appState.isNewInput || appState.display === '0') {
      appState.display = '0.';
      appState.isNewInput = false;
      return;
    }
    appState.display += '.';
    appState.isNewInput = false;
    return;
  }

  // Обычная цифра
  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
  } else {
    appState.display = appState.display === '0' ? digit : appState.display + digit;
  }
}

// ---- операторы + - * / ÷ ----
export function addOperatorFraction(op) {
  clearErrorIfNeeded();

  // Специальная обработка для унарного префиксного корня
  if (op === '√') {
    if (appState.display === '0' || appState.isNewInput) {
      appState.display = '√';
    } else {
      appState.display += '√';
    }
    appState.isNewInput = false;
    return;
  }

  // Специальная обработка для ÷ (символ дроби)
  if (op === '÷') {
    // Нельзя начать с ÷
    if (appState.display === '0' && appState.expression === '') return;
    appState.display += '÷';
    appState.isNewInput = false;
    return;
  }

  // Обычные операторы + - * /
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    appState.display = op;
    appState.isNewInput = false;
    return;
  }

  if (appState.isNewInput && appState.expression !== '') {
    // Заменяем последний оператор
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    appState.expression += appState.display + op;
  }
  appState.display = '0';
  appState.isNewInput = true;
}

// ---- скобки ----
export function addBracketFraction(bracket) {
  clearErrorIfNeeded();

  if (bracket === '(') {
    // Если текущий display – число и expression пуст, значит, это начало целой части смешанной дроби
    if (appState.expression === '' && /^-?\d+$/.test(appState.display)) {
      // Просто добавляем скобку – она будет заменена на маркеры при закрытии
      appState.display += '(';
    } else {
      // Обычное открытие скобки
      if (appState.isNewInput || appState.display === '0') {
        appState.display = '(';
      } else {
        appState.display += '(';
      }
    }
    appState.isNewInput = false;
  }
  else if (bracket === ')') {
    // Попытка закрыть скобку – нужно проверить, не образует ли это смешанную дробь
    const current = appState.display;
    // Ищем шаблон: число + ( + выражение + )
    const mixedMatch = current.match(/^(-?\d+)\(([^()]+)\)$/);
    if (mixedMatch) {
      const whole = mixedMatch[1];
      const inner = mixedMatch[2];
      // Внутри должно быть "числитель÷знаменатель"
      if (inner.includes('÷')) {
        const parts = inner.split('÷');
        if (parts.length === 2 && parts[0].match(/^\d+$/) && parts[1].match(/^\d+$/)) {
          // Заменяем на смешанную дробь с маркерами
          appState.display = `${whole}⥑${parts[0]}÷${parts[1]}⥏`;
          appState.isNewInput = false;
          return;
        }
      }
    }
    // Если не подошло – просто добавляем закрывающую скобку
    appState.display += ')';
    appState.isNewInput = false;
  }
}

// ---- смена знака +/- ----
export function toggleSignFraction() {
  clearErrorIfNeeded();
  let current = appState.display;
  if (current === '0') return;

  // Простое число
  if (/^-?\d+(\.\d+)?$/.test(current)) {
    appState.display = current.startsWith('-') ? current.slice(1) : '-' + current;
    appState.isNewInput = false;
    return;
  }
  // Простая дробь (-?)(\d+)÷(\d+)
  const simpleMatch = current.match(/^(-?)(\d+)÷(\d+)$/);
  if (simpleMatch) {
    const sign = simpleMatch[1];
    const num = simpleMatch[2];
    const den = simpleMatch[3];
    appState.display = (sign === '-' ? '' : '-') + num + '÷' + den;
    appState.isNewInput = false;
    return;
  }
  // Смешанная дробь (-?)(\d+)⥑(\d+)÷(\d+)⥏
  const mixedMatch = current.match(/^(-?)(\d+)⥑(\d+)÷(\d+)⥏$/);
  if (mixedMatch) {
    const sign = mixedMatch[1];
    const whole = mixedMatch[2];
    const num = mixedMatch[3];
    const den = mixedMatch[4];
    appState.display = (sign === '-' ? '' : '-') + whole + '⥑' + num + '÷' + den + '⥏';
    appState.isNewInput = false;
  }
}

// ---- преобразование десятичной -> обычная ( .: ) ----
export function decimalToFraction() {
  clearErrorIfNeeded();
  let value = parseFloat(appState.display);
  if (isNaN(value)) {
    appState.display = 'ERROR';
    return;
  }
  try {
    const frac = new FractionJS(value);
    let num = Number(frac.n);
    let den = Number(frac.d);

    const whole = Math.floor(Math.abs(num) / den);
    const remainder = Math.abs(num) % den;
    const sign = num < 0 ? -1 : 1;

    let resultStr;
    if (whole !== 0 && remainder !== 0) {
      resultStr = `${sign * whole}⥑${remainder}÷${den}⥏`;
    } else if (whole !== 0) {
      resultStr = `${sign * whole}`;
    } else {
      resultStr = `${num}÷${den}`;
    }
    appState.display = resultStr;
    appState.isNewInput = false;
  } catch (e) {
    console.error(e);
    appState.display = 'ERROR';
  }
}


// ---- преобразование обычной -> десятичная ( :. ) ----
export function fractionToDecimal() {
  clearErrorIfNeeded();
  const expr = appState.display;
  try {
    // Явно удаляем ВСЕ маркеры, включая закрывающий ⥏
    let normalized = expr.replace(/⥑/g, ' ').replace(/÷/g, '/').replace(/⥏/g, '');
    const frac = new FractionJS(normalized);
    const decimal = frac.valueOf();
    appState.display = String(decimal);
    appState.isNewInput = false;
  } catch (e) {
    console.error(e);
    appState.display = 'ERROR';
  }
}



// ---- равно (вычисление) ----
export function evaluateFraction() {
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  const fullExpr = (appState.expression + appState.display).trim();
  if (fullExpr === '') return;

  let resultFraction;
  try {
    resultFraction = evaluateFractionExpression(fullExpr);
  } catch (err) {
    console.error('Evaluation error:', err);
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // Знаменатель не может быть 0
  if (resultFraction.den === 0) {
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // Если числитель 0 – показываем 0
  if (resultFraction.num === 0) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
    // запись в историю
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [fullExpr, '0'],
      result: { whole: 0, num: 0, den: 1 }
    });
    return;
  }

  // Формируем историю (пока без детализации шагов)
  const steps = [fullExpr, resultFraction.toMixedString()];
  appState.historySession.push({
    type: 'fractionSteps',
    steps: steps,
    result: resultFraction.toMixed()
  });

  // Отображаем результат
  const mixed = resultFraction.toMixed();
  let displayStr;
  if (mixed.whole !== 0 && mixed.num !== 0) {
    displayStr = `${mixed.whole}⥑${mixed.num}÷${mixed.den}⥏`;
  } else if (mixed.whole !== 0) {
    displayStr = `${mixed.whole}`;
  } else {
    displayStr = `${mixed.num}÷${mixed.den}`;
  }
  appState.display = displayStr;
  appState.expression = '';
  appState.isNewInput = true;
}

// ---- очистка C ----
export function clearFraction() {
  appState.display = '0';
  appState.expression = '';
  appState.isNewInput = true;
}

// ---- backspace ⌫ ----
export function backspaceFraction() {
  if (isError()) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }
  if (appState.display.length > 1) {
    appState.display = appState.display.slice(0, -1);
  } else {
    appState.display = '0';
    appState.isNewInput = true;
  }
}