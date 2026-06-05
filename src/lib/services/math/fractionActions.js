/* eslint-disable no-unused-vars */
/**
 * fractionActions.js
 * Обработчики кнопок для страницы дробей.
 */

import { appState } from '$lib/store/appState.svelte.js';
import { Fraction, evaluateFractionExpression } from './fractionCore.js';
import { toSuperscript, fromSuperscript } from "$lib/utils/toSuperscript";
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

  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
    return;
  }

  if (digit === '.') {
    if (appState.display.includes('.')) return;
    appState.display += '.';
    return;
  }

  // КРИТИЧЕСКИЙ МОМЕНТ ДЛЯ СТЕПЕНИ: 
  // Если на дисплее уже есть знак '^', то ВСЕ последующие цифры 
  // мы принудительно переводим в верхний индекс (superscript)!
  if (appState.display.includes('^')) {
    const parts = appState.display.split('^');
    parts[1] += toSuperscript(digit); // Конвертируем '2' -> '²'
    appState.display = parts[0] + '^' + parts[1]; // Строка станет например "4^²"
  } else {
    // Обычный ввод числа
    if (appState.display === '0') {
      appState.display = digit;
    } else {
      appState.display += digit;
    }
  }
}

// ---- операторы + - * / ÷ ----
export function addOperatorFraction(op) {
  clearErrorIfNeeded();

  if (op === '√') {
    if (appState.display === '0' || appState.isNewInput) appState.display = '√';
    else appState.display += '√';
    appState.isNewInput = false;
    return;
  }

  // При нажатии на xʸ просто добавляем знак '^' к текущему числу на дисплее
  if (op === '^') {
    if (appState.display === '0' && appState.expression === '') return;
    appState.display += '^';
    appState.isNewInput = false;
    return;
  }

  if (op === '÷') {
    if (appState.display === '0' && appState.expression === '') return;
    appState.display += '÷';
    appState.isNewInput = false;
    return;
  }

  // Обычные операторы (+ - * /)
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    appState.display = op;
    appState.isNewInput = false;
    return;
  }

  if (appState.isNewInput && appState.expression !== '') {
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
    // Если текущий дисплей равен '0' или включен флаг нового ввода, 
    // скобка должна ПОЛНОСТЬЮ заменить ноль, а не приклеиться к нему!
    if (appState.isNewInput || appState.display === '0') {
      appState.display = '(';
    } else {
      // Если пользователь ввел, например, "2" и нажал "(", это превратится в "2("
      // (на Шаге 2 мы научим ядро понимать это как умножение 2 * (...) )
      appState.display += '(';
    }
    appState.isNewInput = false;
    return; // Не забываем return
  }
  else if (bracket === ')') {
    const current = appState.display;
    const mixedMatch = current.match(/^(-?\d+)\(([^()]+)\)$/);
    if (mixedMatch) {
      const whole = mixedMatch[1];
      const inner = mixedMatch[2];
      if (inner.includes('÷')) {
        const parts = inner.split('÷');
        if (parts.length === 2 && parts[0].match(/^\d+$/) && parts[1].match(/^\d+$/)) {
          appState.display = `${whole}⥑${parts[0]}÷${parts[1]}⥏`;
          appState.isNewInput = false;
          return;
        }
      }
    }
    appState.display += ')';
    appState.isNewInput = false;
  }
}

// ---- смена знака +/- ----
export function toggleSignFraction() {
  clearErrorIfNeeded();
  let current = appState.display;
  if (current === '0') return;

  if (/^-?\d+(\.\d+)?$/.test(current)) {
    appState.display = current.startsWith('-') ? current.slice(1) : '-' + current;
    appState.isNewInput = false;
    return;
  }
  const simpleMatch = current.match(/^(-?)(\d+)÷(\d+)$/);
  if (simpleMatch) {
    const sign = simpleMatch[1];
    const num = simpleMatch[2];
    const den = simpleMatch[3];
    appState.display = (sign === '-' ? '' : '-') + num + '÷' + den;
    appState.isNewInput = false;
    return;
  }
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
// ---- преобразование десятичной -> обычная ( .: ) ----
export function decimalToFraction() {
  clearErrorIfNeeded();

  // Если на экране уже дробь, то ничего делать не нужно
  if (appState.display.includes('÷') || appState.display.includes('⥑')) {
    return;
  }

  let value = parseFloat(appState.display);
  if (isNaN(value)) {
    appState.display = 'ERROR';
    return;
  }

  if (value === 0) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }

  try {
    const frac = new FractionJS(value);
    const num = Math.abs(Number(frac.n));
    const den = Math.abs(Number(frac.d));
    const signStr = value < 0 ? '-' : '';

    const whole = Math.floor(num / den);
    const remainder = num % den;

    let resultStr = '';
    if (whole !== 0 && remainder !== 0) {
      resultStr = `${signStr}${whole}⥑${remainder}÷${den}⥏`;
    } else if (whole !== 0) {
      resultStr = `${signStr}${whole}`;
    } else {
      resultStr = `${signStr}${remainder}÷${den}`;
    }

    // КОРРЕКТНЫЙ ФИКС СТЭЙТА:
    appState.display = resultStr;

    // Очищаем expression, чтобы дробь не дублировалась на экране!
    if (appState.expression !== undefined) {
      appState.expression = '';
    }

    // Ставим true, чтобы этот результат вел себя как готовое число,
    // и ввод новых цифр начинался заново, а не приклеивался к дроби
    appState.isNewInput = true;

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

// ---- возведение в квадрат  ----
export function fractionToPower2() {
  clearErrorIfNeeded();

  // Если на экране ничего нет, возводить в квадрат нечего
  if (appState.display === '0' && appState.expression === '') return;

  // Дописываем обычную двойку. Визуальный парсер сам увидит ^2, 
  // скроет птичку ^ и поднимет двойку в superscript!
  appState.display += '^2';
  appState.isNewInput = false;
}

// ---- равно (вычисление) ----
export function evaluateFraction() {
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // автозакрытие скобок для √
  const openDisplayBrackets = (appState.display.match(/\(/g) || []).length;
  const closeDisplayBrackets = (appState.display.match(/\)/g) || []).length;

  if (appState.display.includes('√') && openDisplayBrackets > closeDisplayBrackets) {
    const missingCount = openDisplayBrackets - closeDisplayBrackets;
    const bracketsToAdd = ')'.repeat(missingCount);

    // Дописываем скобки в стейты, чтобы пользователь увидел изменения
    appState.display += bracketsToAdd;
    if (appState.expression !== '') {
      appState.expression += bracketsToAdd;
    }
  }

  // Собираем выражение в том виде, в каком оно есть
  let fullExpr = '';
  if (appState.expression === '') {
    fullExpr = appState.display;
  } else {
    fullExpr = appState.expression + appState.display;
  }
  fullExpr = fullExpr.trim();

  if (fullExpr === '' || fullExpr === '0') return;

  try {
    // 1. Переводим всю строку в чистый текстовый вид (например, из "1÷2^³" в "1÷2^3")
    let cleanExpr = fromSuperscript(fullExpr);

    console.log("Исходная строка перед фиксом скобок:", cleanExpr);

    // 2. ИЗОЛЯЦИЯ ПРИОРИТЕТОВ СТЕПЕНИ ДЛЯ ЯДРА
    // Если пользователь ввел "1÷4^2", ядро без скобок посчитает это как (1÷4)^2.
    // Чтобы этого не происходило, мы заменяем конструкции "число÷число^степень" 
    // или "число÷(выражение)^степень" на изолированные скобки.

    // Случай А: Число ÷ Число ^ Любое выражение (включая дробные степени вроде 2÷3)
    // Пример: "1÷4^2" -> "1÷(4^2)" или "1÷5^2÷3" -> "1÷(5^(2÷3))"
    if (cleanExpr.includes('÷') && cleanExpr.includes('^')) {
      // Сначала изолируем сам показатель степени, если там идет деление без скобок
      // "5^2÷3" -> "5^(2÷3)"
      cleanExpr = cleanExpr.replace(/\^([\d.÷]+)/g, '^($1)');

      // Теперь изолируем всю правую часть деления (основание вместе со степенью)
      // "1÷5^(2÷3)" -> "1÷(5^(2÷3))"
      cleanExpr = cleanExpr.replace(/(\d+)÷(\d+)\^([(\d.÷)]+)/g, '$1÷($2^$3)');
    }

    // Убираем возможные дубликаты двойных скобок вокруг степеней, если они случайно возникли:
    cleanExpr = cleanExpr.replace(/\^\(\(([^)]+)\)\)/g, '^($1)');

    console.log("Строка, отправляемая в ядро (ФИКС СКОБОК):", cleanExpr);

    const resultFraction = evaluateFractionExpression(cleanExpr);

    if (resultFraction.den === 0) throw new Error('Division by zero');

    const mixed = resultFraction.toMixed();
    let displayStr;
    if (mixed.whole !== 0 && mixed.num !== 0) {
      displayStr = `${mixed.whole}⥑${mixed.num}÷${mixed.den}⥏`;
    } else if (mixed.whole !== 0) {
      displayStr = `${mixed.whole}`;
    } else {
      displayStr = `${mixed.num}÷${mixed.den}`;
    }

    appState.historySession.push({
      type: 'fractionSteps',
      steps: [fullExpr, displayStr]
    });

    appState.display = displayStr;
    appState.expression = '';
    appState.isNewInput = true;
  } catch (err) {
    console.error('Evaluation error:', err);
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
  }
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