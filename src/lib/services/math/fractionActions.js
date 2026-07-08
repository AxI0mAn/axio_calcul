/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionActions.js
 * Обработчики кнопок для страницы дробей.
 */

/* eslint-disable no-unused-vars */
import { appState } from '$lib/store/appState.svelte.js';
import { Fraction, evaluateFractionExpression } from './fractionCore.js';
import { MARKERS, getUnclosedMarkersStack, stripMarkers } from './fractionVisualParser.js';
import { generateSteps } from './fractionSteps.js';
import { toSuperscript, fromSuperscript } from "$lib/utils/toSuperscript";
import FractionJS from 'fraction.js';

// ---- Локальное состояние для режима степени ----
let isPowerMode = false; // флаг, активен ли ввод показателя степени.
let powerDepth = 0; // счётчик незакрытых скобок внутри показателя степени.

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

// ---- вспомогательные функции для проверки готовности маркеров к закрытию ----
/**
 * Проверяет, есть ли незакрытая сложная скобка (⥾) в выражении.
 */
function hasUnclosedComplexMarker(expr) {
  const stack = getUnclosedMarkersStack(expr);
  return stack.length > 0;
}

/**
 * Проверяет, есть ли незакрытая целая часть (⥑ без ⥏).
 */
function hasUnclosedWholePart(expr) {
  const open = (expr.match(/⥑/g) || []).length;
  const close = (expr.match(/⥏/g) || []).length;
  return open > close;
}

/**
 * Проверяет, завершён ли ввод числителя (внутри последней открытой ⥾).
 * Условия: нет незакрытых круглых скобок внутри и последний символ display — цифра или ')'.
 */
function isNumeratorReadyToClose(expr, display) {
  const lastOpen = expr.lastIndexOf(MARKERS.COMPLEX_NUM_START);
  if (lastOpen === -1) return false;
  const inside = expr.substring(lastOpen + 1);
  let openParens = 0, closeParens = 0;
  for (const ch of inside) {
    if (ch === '(') openParens++;
    if (ch === ')') closeParens++;
    if (ch === MARKERS.COMPLEX_END) return false; // уже закрыт
  }
  if (openParens > closeParens) return false; // есть незакрытые скобки внутри
  // Дополнительное условие: последний символ display — ')' (явное закрытие)
  const lastChar = display.slice(-1);
  return lastChar === ')';
}

/**
 * Проверяет, завершена ли целая часть (внутри последней открытой ⥑).
 * Аналогично, но для маркера ⥑.
 */
function isWholePartReadyToClose(expr, display) {
  const lastOpen = expr.lastIndexOf(MARKERS.WHOLE_START);
  if (lastOpen === -1) return false;
  const inside = expr.substring(lastOpen + 1);
  let openParens = 0, closeParens = 0;
  for (const ch of inside) {
    if (ch === '(') openParens++;
    if (ch === ')') closeParens++;
    if (ch === MARKERS.WHOLE_END) return false;
  }
  if (openParens > closeParens) return false;
  const lastChar = display.slice(-1);
  return lastChar === ')';
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
    // Защита: нельзя поставить точку, если строка пустая, уже содержит точку или заканчивается на спецсимвол
    if (appState.display === '' || /[\.^÷√\(\)]$/.test(appState.display)) return;

    // Защита от второй точки в текущем вводимом числе (с учетом знаков)
    const currentParts = appState.display.split(/[\+\-\*\/÷\^\(]/);
    const lastPart = currentParts[currentParts.length - 1];
    if (lastPart.includes('.')) return;


    // В режиме степени точка добавляется как обычный символ (без суперскрипта)
    if (isPowerMode) {
      appState.display += '.';
      return;
    }
    appState.display += '.';
    return;
  }

  // ---- В режиме степени все цифры добавляются как обычные символы ----
  if (isPowerMode) {
    appState.display += digit;
    return;
  }

  if (appState.display === '0') {
    appState.display = digit;
  } else {
    appState.display += digit;
  }
}

// ---- операторы + - * / ÷ √ ^ ---- 
export function addOperatorFraction(op) {
  clearErrorIfNeeded();

  // ---- Если активен режим степени и есть незакрытые скобки, оператор добавляется внутрь показателя ----
  if (isPowerMode && powerDepth > 0) {
    appState.display += op;
    appState.isNewInput = false;
    return;
  }

  const lastChar = appState.display.slice(-1);

  // 1. Защита для корня √
  if (op === '√') {
    // Если мы в режиме степени, добавляем корень внутрь показателя
    if (isPowerMode) {
      appState.display += '√';
      appState.isNewInput = false;
      return true;
    }
    // Единственная защита — от точки прямо перед корнем
    if (lastChar === '.') return false;

    if (appState.display === '0' || appState.isNewInput) {
      appState.display = '√';
    } else {
      appState.display += '√';
    }
    appState.isNewInput = false;
    return true; // Всегда разрешаем добавить скобку ( в BtnBlockOpFraction
  }

  // 2. Защита для знака степени ^
  if (op === '^') {
    // Если дисплей равен '0' и expression не пуст, значит мы только что завершили операцию
    // и пытаемся начать новую степень без скобок – запрещаем, чтобы избежать неоднозначных конструкций типа 2^3^4. 
    // Теперь пользователь должен использовать скобки для вложенных степеней (например, 2^(3^4))
    if (appState.display === '0' && appState.expression !== '') {
      return;
    }
    if (appState.display === '0' && appState.expression === '') return;
    // Запрещаем ставить степень после операторов, точек, открывающих скобок или если степень уже есть
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    appState.display += '^';
    appState.isNewInput = false;
    // ---- Включаем режим степени ----
    isPowerMode = true;
    powerDepth = 0;
    return;
  }

  // 2.5. ЛОГИКА для бинарных операторов при активном режиме степени ----
  const isBinaryOp = ['+', '-', '*', '/', '÷'].includes(op);
  if (isPowerMode && isBinaryOp) {
    if (powerDepth > 0) {
      // Есть незакрытые скобки внутри показателя → оператор добавляется внутрь
      appState.display += op;
      appState.isNewInput = false;
      return;
    } else {
      // powerDepth === 0 → завершаем степень
      isPowerMode = false;
      // После завершения степени продолжаем выполнение, чтобы добавить оператор в expression
      // (код ниже обработает оператор как обычно)
    }
  }

  // 3. Защита для знака деления ÷
  if (op === '÷') {

    // Проверяем, содержит ли display признаки степени (верхние индексы или '^')
    const hasPower = /[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(appState.display) || appState.display.includes('^');
    if (hasPower) {
      // Если числитель содержит степень, оставляем всё в display, добавляем ÷ и не переносим в expression
      appState.display += '÷';
      appState.isNewInput = false;
      return;
    }

    if (appState.display === '0' && appState.expression === '') return;
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    const fullExpr = (appState.expression || '') + (appState.display || '');
    if (hasUnclosedComplexMarker(fullExpr) && isNumeratorReadyToClose(fullExpr, appState.display)) {
      appState.display += MARKERS.COMPLEX_END; // ⥿
    }
    appState.display += '÷';
    appState.isNewInput = false;
    return;
  }

  // 4. Обработка обычных операторов (+ - * /) с завершением степени
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    if (op === '-') {
      appState.display = op;
      appState.isNewInput = false;
    }
    return;
  }

  // Если активен режим степени и нет незакрытых скобок, завершаем степень
  if (isPowerMode && powerDepth === 0) {
    appState.expression += appState.display + op;
    appState.display = '0';
    appState.isNewInput = true;
    isPowerMode = false;
    return;
  }


  if (/[\+\-\*\/÷\^\.√]$/.test(appState.display) && !appState.isNewInput) return;

  const fullExpr = (appState.expression || '') + (appState.display || '');

  // Закрываем целую часть, если знаменатель закрыт, целая часть открыта и завершена
  if (!hasUnclosedComplexMarker(fullExpr) &&
    hasUnclosedWholePart(fullExpr) &&
    isWholePartReadyToClose(fullExpr, appState.display)) {
    appState.display += MARKERS.WHOLE_END; // ⥏
  }

  if (appState.isNewInput && appState.expression !== '') {
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    appState.expression += appState.display + op;
  }
  appState.display = '0';
  appState.isNewInput = true;
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
export function decimalToFraction() {
  clearErrorIfNeeded();

  // Убираем внешние скобки, если они есть вокруг десятичного числа
  function extractNumberFromDisplay(str) {
    const trimmed = str.trim();
    // Поддерживает: (0.5), (-0.5), (.5), (-.5), (5), (-5)
    const match = trimmed.match(/^\((-?\d*\.?\d+)\)$/);
    if (match) {
      return match[1];
    }
    return trimmed;
  }

  // Если на экране уже дробь, то ничего делать не нужно
  if (appState.display.includes('÷') || appState.display.includes('⥑')) {
    return;
  }

  // Фиксируем исходное значение для записи в историю сессии
  const originalDisplay = appState.display;

  const numberStr = extractNumberFromDisplay(appState.display);
  let value = parseFloat(numberStr);
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

    // ДОПОЛНЕНИЕ: Запись операции перевода в историю сессии
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, resultStr]
    });

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

  if (isError()) return;

  const originalDisplay = appState.display;
  const expr = appState.display;

  // ===== ОБРАБОТКА ДЕЛЕНИЯ НА НОЛЬ (единая точка) =====
  if (/[÷/]0(?=\D|$|\))/.test(expr)) {
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [expr, 'ERROR']
    });
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  try {
    // Нормализация: маркеры → скобки
    let normalized = expr
      .replace(/⥾/g, '(')
      .replace(/⥿/g, ')')
      .replace(/⥑/g, '(')
      .replace(/⥏/g, ')');

    // Распознаем смешанную дробь: "7(1÷5)" → "7 1/5"
    const mixedMatch = normalized.match(/^(-?)(\d+)\((\d+)[÷/](\d+)\)$/);
    if (mixedMatch) {
      const sign = mixedMatch[1] === '-' ? '-' : '';
      const whole = mixedMatch[2];
      const num = mixedMatch[3];
      const den = mixedMatch[4];

      // Проверка на деление на ноль (дублирующая, но оставляем для безопасности)
      if (parseInt(den) === 0) {
        throw new Error('Division by zero');
      }

      normalized = `${sign}${whole} ${num}/${den}`;
    } else {
      // Простая дробь: "3÷4" → "3/4"
      normalized = normalized.replace(/÷/g, '/');
    }

    const frac = new FractionJS(normalized);
    const decimal = frac.valueOf();
    const resultStr = String(decimal);

    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, resultStr]
    });

    appState.display = resultStr;
    appState.isNewInput = true;
  } catch (e) {
    console.error('fractionToDecimal error:', e);

    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, 'ERROR']
    });

    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
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

// ---- скобки ----
/**
* Обработчик нажатия скобок ( и ) для дробного калькулятора.
* Поддерживает маркеры целой части (⥑, ⥏) и сложных выражений (⥾, ⥿).
* @param {string} bracket - '(' или ')'
*/
export function addBracketFraction(bracket) {
  clearErrorIfNeeded();

  // ======================== ОТКРЫВАЮЩАЯ СКОБКА '(' ========================
  if (bracket === '(') {
    // ---- Если активен режим степени, добавляем обычную скобку в показатель ----
    if (isPowerMode) {
      appState.display += '(';
      powerDepth++;
      appState.isNewInput = false;
      return;
    }

    let lastChar = '';
    let shouldReplace = false;

    if (appState.isNewInput || appState.display === '0' || appState.display === '') {
      shouldReplace = true;
      if (appState.expression && appState.expression.length > 0) {
        lastChar = appState.expression.slice(-1);
      } else {
        lastChar = '';
      }
    } else {
      lastChar = appState.display.slice(-1);
    }

    // Определяем, какой маркер использовать:
    // - Если перед скобкой стоит число И внутри скобок на верхнем уровне будет не более одной ÷
    //   и нет других операторов → это смешанная дробь → ⥑
    // - Иначе → сложное выражение → ⥾
    let marker = MARKERS.COMPLEX_NUM_START; // ⥾ по умолчанию

    // Проверяем, что перед скобкой стоит число (целое, без операторов)
    const displayBeforeBracket = appState.display;
    if (displayBeforeBracket && /^-?\d+$/.test(displayBeforeBracket)) {
      // Это потенциально смешанная дробь.
      // Нужно проверить, что внутри скобок на верхнем уровне не более одной ÷
      // и нет других операторов (+ - *).
      // Мы не можем знать, что будет введено внутри скобок заранее,
      // поэтому мы используем ⥑ (целая часть) по умолчанию для числа перед скобкой.
      // Если внутри окажется сложное выражение, трансформации (transformMixedNumberWithComplexBrackets)
      // преобразуют это в умножение.
      marker = MARKERS.WHOLE_START; // ⥑
    }

    if (shouldReplace) {
      appState.display = marker;
    } else {
      appState.display += marker;
    }

    appState.isNewInput = false;
    return;
  }

  // ======================== ЗАКРЫВАЮЩАЯ СКОБКА ')' ========================
  if (bracket === ')') {

    // ---- Если активен режим степени, обрабатываем скобку внутри показателя ----
    if (isPowerMode) {
      appState.display += ')';
      powerDepth--;
      if (powerDepth < 0) powerDepth = 0; // защита от отрицательной глубины
      if (powerDepth === 0) {
        isPowerMode = false; // завершаем степень после закрытия всех скобок
      }
      appState.isNewInput = false;
      return;
    }

    const fullExpr = (appState.expression || '') + (appState.display || '');

    // Определяем, какой маркер был открыт последним (сложный ⥾ или целая часть ⥑)
    const lastComplexIdx = fullExpr.lastIndexOf(MARKERS.COMPLEX_NUM_START);
    const lastWholeIdx = fullExpr.lastIndexOf(MARKERS.WHOLE_START);

    // Проверяем, не закрыт ли уже последний маркер
    let lastComplexClosed = false;
    let lastWholeClosed = false;

    if (lastComplexIdx !== -1) {
      const afterComplex = fullExpr.substring(lastComplexIdx + 1);
      lastComplexClosed = afterComplex.includes(MARKERS.COMPLEX_END);
    }

    if (lastWholeIdx !== -1) {
      const afterWhole = fullExpr.substring(lastWholeIdx + 1);
      lastWholeClosed = afterWhole.includes(MARKERS.WHOLE_END);
    }

    // Определяем, какой маркер открыт последним и еще не закрыт
    const lastOpenComplex = lastComplexIdx !== -1 && !lastComplexClosed;
    const lastOpenWhole = lastWholeIdx !== -1 && !lastWholeClosed;

    // ===== ВРЕМЕННЫЙ ДЕБАГ ШАГА 11.19 (LIFO) =====
    console.log('🔍 [ДЕБАГ-11.19] === АНАЛИЗ ЗАКРЫТИЯ ===');
    console.log('🔍 [ДЕБАГ-11.19] fullExpr:', JSON.stringify(fullExpr));
    console.log('🔍 [ДЕБАГ-11.19] lastComplexIdx:', lastComplexIdx, 'lastWholeIdx:', lastWholeIdx);
    console.log('🔍 [ДЕБАГ-11.19] lastOpenComplex:', lastOpenComplex, 'lastOpenWhole:', lastOpenWhole);
    // ===== КОНЕЦ ДЕБАГА =====

    if (lastOpenComplex && lastOpenWhole) {
      // Оба открыты — закрываем тот, который был открыт позже
      if (lastComplexIdx > lastWholeIdx) {
        // Сложный маркер открыт позже → закрываем его
        appState.display += MARKERS.COMPLEX_END;
      } else {
        // Целая часть открыта позже → закрываем ее
        appState.display += MARKERS.WHOLE_END;
      }
    } else if (lastOpenComplex) {
      // Только сложный маркер открыт → закрываем его
      appState.display += MARKERS.COMPLEX_END;
    } else if (lastOpenWhole) {
      // Только целая часть открыта → закрываем ее
      appState.display += MARKERS.WHOLE_END;
    } else {
      // Нет незакрытых маркеров → скобка игнорируется
      return;
    }

    appState.isNewInput = false;

    // Если стек пуст и нет незакрытой целой части – ничего не делаем (игнорируем лишнюю закрывающую скобку)
    // Это предотвращает появление непарной ')' в выражениях типа 3+4)
    return;
  }
}

/**
 * Автодополнение пустых или незавершённых скобок в выражении.
 * - Удаляет пары пустых скобок: "3()" → "3"
 * - Удаляет конечный оператор (кроме ÷) внутри скобок: "(1÷2+)" → "(1÷2)"
 * - Не трогает ошибочные конструкции вида "(1÷)" или "(÷2)" (оставляет для дальнейшей обработки)
 *
 * @param {string} expr - исходное выражение с круглыми скобками
 * @returns {string} - выражение с исправленными скобками
 */
export function autoCompleteEmptyBrackets(expr) {
  let result = expr;
  let changed = false;

  do {
    changed = false;
    result = result.replace(/\(([^()]*)\)/g, (match, content) => {
      // Случай 1: пустое содержимое -> удаляем пару скобок
      if (content === "") {
        changed = true;
        return "";
      }

      // Случай 2: содержимое состоит только из операторов (кроме ÷? разрешим любые, но ÷ сам по себе не оператор, а разделитель)
      // Удаляем такие скобки полностью, так как внутри нет чисел
      if (/^[\+\-\*\/÷]+$/.test(content)) {
        changed = true;
        return "";
      }

      // Случай 3: содержимое заканчивается на оператор + - * / (не на ÷)
      // и после удаления этого оператора содержимое не пусто и не состоит только из операторов
      if (/[\+\-\*\/]$/.test(content)) {
        const trimmed = content.slice(0, -1);
        if (trimmed !== "" && !/^[\+\-\*\/÷]+$/.test(trimmed)) {
          changed = true;
          return "(" + trimmed + ")";
        }
      }

      // Все остальные случаи (в том числе (1÷), (÷2), (1÷2)) – без изменений
      return match;
    });
  } while (changed);

  return result;
}

/**
 * Вставляет явный знак умножения '*' или сложения '+' в местах неявных операций.
 * Правила:
 * - Если перед '(' стоит число и внутри скобок есть '÷' или '/', а после закрывающей скобки НЕТ деления → вставляем '+'.
 * - Во всех остальных случаях (перед '(' стоит ')' или внутри нет деления или после есть деление) → вставляем '*'.
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - выражение с явными операторами
 */
export function insertImplicitMultiplication(expr) {
  if (!expr) return expr;

  // Вспомогательная функция: найти парную закрывающую скобку
  function findMatchingClose(str, openPos) {
    let depth = 1;
    for (let i = openPos + 1; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  // Вспомогательная: проверяет, есть ли внутри скобок (на любом уровне) знак деления
  function hasDivisionInside(str, openPos, closePos) {
    const inside = str.substring(openPos + 1, closePos);
    return /[÷\/]/.test(inside);
  }

  // Вспомогательная: проверяет, есть ли после закрывающей скобки (пропуская пробелы) знак деления
  function hasDivisionAfter(str, closePos) {
    let i = closePos + 1;
    while (i < str.length && str[i] === ' ') i++;
    return i < str.length && /[÷\/]/.test(str[i]);
  }

  let result = expr;
  let i = 0;

  // Проход 1: вставка операторов перед открывающими скобками
  while (i < result.length) {
    if (result[i] === '(') {
      // Определяем предыдущий значимый символ (не пробел)
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx] === ' ') prevIdx--;
      if (prevIdx < 0) { i++; continue; }
      const prevChar = result[prevIdx];

      // Проверяем, является ли prevChar числом или ')'
      const isNumber = /\d/.test(prevChar);
      const isClosingBracket = prevChar === ')';

      if (isNumber || isClosingBracket) {
        // Находим парную закрывающую скобку
        const closePos = findMatchingClose(result, i);
        if (closePos === -1) { i++; continue; }

        // Проверяем, есть ли деление внутри
        const hasDivInside = hasDivisionInside(result, i, closePos);
        // Проверяем, есть ли деление после
        const hasDivAfter = hasDivisionAfter(result, closePos);

        let operator = '*';
        // Проверяем, является ли содержимое скобок простой дробью (ровно одна ÷ и нет других операторов)
        const insideContent = result.substring(i + 1, closePos);
        const divCount = (insideContent.match(/[÷\/]/g) || []).length;
        const hasOtherOps = /[\+\-\*]/.test(insideContent);
        const isSimpleFraction = (divCount === 1) && !hasOtherOps;

        // Вставляем '+' только если это смешанная дробь (число + простая дробь)
        if (isNumber && isSimpleFraction && !hasDivAfter) {
          operator = '+';
        }
        // Если isClosingBracket — всегда '*'

        // Проверяем, что между prevIdx и i нет другого оператора (кроме пробелов)
        let hasOpBetween = false;
        for (let k = prevIdx + 1; k < i; k++) {
          if (result[k] !== ' ' && /[+\-*/÷^()]/.test(result[k])) {
            hasOpBetween = true;
            break;
          }
        }

        if (!hasOpBetween) {
          // Вставляем оператор перед '('
          result = result.slice(0, i) + operator + result.slice(i);
          i += 2; // пропускаем оператор и '('
          continue;
        }
      }
    }
    i++;
  }

  // Проход 2: вставка '*' между ')' и числом (например, (1÷4)3...)
  result = result.replace(/\)(\d+)/g, ')*$1');

  return result;
}

/**
 * Вставляет '+' или '*' между числом/закрывающей скобкой и открывающей скобкой
 * в зависимости от того, стоит ли после соответствующей закрывающей скобки знак '÷' или '/'.
 * Если после закрывающей скобки есть деление → вставляем '*', иначе → '+'.
 * Для отрицательных чисел вида -A(...) → преобразует в -(A+...), если вставляется '+'.
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - выражение с явными операторами
 */
export function processImplicitOperators(expr) {
  if (!expr) return expr;

  // Вспомогательная функция: найти позицию парной закрывающей скобки
  function findMatchingClose(str, openPos) {
    let depth = 1;
    for (let i = openPos + 1; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') depth--;
      if (depth === 0) return i;
    }
    return -1;
  }

  let result = expr;
  let i = 0;
  while (i < result.length) {
    // Ищем открывающую скобку, перед которой стоит число или ')'
    if (result[i] === '(') {
      // Проверяем предыдущий символ (не пробел)
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx] === ' ') prevIdx--;
      if (prevIdx < 0) { i++; continue; }
      const prevChar = result[prevIdx];
      // Предыдущий символ должен быть цифрой или ')'
      if (!/\d/.test(prevChar) && prevChar !== ')') { i++; continue; }

      // Находим закрывающую скобку для текущей открывающей
      const closePos = findMatchingClose(result, i);
      if (closePos === -1) { i++; continue; }

      // Проверяем, есть ли после закрывающей скобки (пропуская пробелы) знак деления
      let nextIdx = closePos + 1;
      while (nextIdx < result.length && result[nextIdx] === ' ') nextIdx++;
      const hasDivision = nextIdx < result.length && (result[nextIdx] === '÷' || result[nextIdx] === '/');

      // Определяем, нужно ли вставлять оператор (если между предыдущим и '(' нет оператора)
      // Проверяем, что между prevIdx и i нет других операторов (кроме пробелов)
      let hasOp = false;
      for (let k = prevIdx + 1; k < i; k++) {
        if (result[k] !== ' ' && /[+\-*/÷^()]/.test(result[k])) {
          hasOp = true;
          break;
        }
      }
      if (hasOp) { i++; continue; }

      // Если предыдущий символ - цифра, собираем число (может быть с минусом)
      let numberStart = prevIdx;
      let numberEnd = i; // позиция перед '('
      // Ищем начало числа, учитывая унарный минус
      let start = numberStart;
      if (/\d/.test(result[numberStart])) {
        while (start > 0 && /[\d.]/.test(result[start - 1])) start--;
        // Если перед числом стоит '-', и это унарный (перед ним не цифра и не ')')
        if (start > 0 && result[start - 1] === '-') {
          const beforeMinus = start - 2;
          if (beforeMinus < 0 || !/[\d)]/.test(result[beforeMinus])) {
            start--;
          }
        }
      } else if (result[numberStart] === ')') {
        // Если предыдущий символ - ')', то оператор будет вставлен перед '('
        // В этом случае мы не обрабатываем отрицательное число отдельно
        // просто вставляем оператор
        const op = hasDivision ? '*' : '+';
        // Вставляем оператор между ')' и '('
        result = result.slice(0, i) + op + result.slice(i);
        // Сдвигаем указатель на 2 символа (оператор + '(')
        i += 2;
        continue;
      }

      // Если мы дошли сюда, значит перед '(' стоит число (возможно с минусом)
      const numberStr = result.slice(start, i);
      // Проверяем, является ли это число целым или десятичным (без операторов)
      if (!/^-?\d+\.?\d*$/.test(numberStr)) { i++; continue; }

      // Определяем, есть ли унарный минус перед числом
      const hasUnaryMinus = numberStr.startsWith('-') && (start === 0 || !/[\d)]/.test(result[start - 1]));

      if (hasDivision) {
        // Вставляем '*' между числом и '('
        const op = '*';
        result = result.slice(0, i) + op + result.slice(i);
        i += 2; // пропускаем '*' и '('
      } else {
        // Вставляем '+'
        if (hasUnaryMinus) {
          // Преобразуем -A( ... ) в -(A+ ... )
          // Удаляем минус и число, вставляем '-(число+'
          const numWithoutMinus = numberStr.slice(1);
          const beforeMinus = start - 1;
          // Заменяем часть строки
          const prefix = result.slice(0, beforeMinus);
          const suffix = result.slice(i); // начинается с '('
          // Формируем: prefix + '-( ' + numWithoutMinus + '+' + suffix
          result = prefix + '-(' + numWithoutMinus + '+' + suffix;
          // Сдвигаем указатель на позицию после вставленного '+'
          i = beforeMinus + 2 + numWithoutMinus.length + 1; // перед '(' уже есть, но мы сдвигаем
          // Теперь нужно продолжить, но наша структура изменилась, проще начать заново
          // или перезапустить цикл с начала для простоты.
          // Перезапускаем цикл с начала
          i = 0;
          continue;
        } else {
          // Вставляем '+' между числом и '('
          const op = '+';
          result = result.slice(0, i) + op + result.slice(i);
          i += 2; // пропускаем '+' и '('
        }
      }
    } else {
      i++;
    }
  }

  return result;
}


/**
 * Преобразует смешанные дроби вида [−]число(выражение)÷ в [−]число+(выражение)÷
 * Поддерживает обычные скобки () и маркеры ⥑/⥾ (открывающие) и ⥏/⥿ (закрывающие).
 * Ищет сбалансированные скобки, следующие сразу за целым числом (с опциональным минусом),
 * и проверяет, что после закрывающей скобки идёт символ '÷'.
 *
 * @param {string} expr - выражение (может содержать маркеры)
 * @returns {string} - преобразованное выражение
 */
export function transformMixedFractionWithDivision(expr) {
  if (!expr) return expr;

  const openBrackets = ['(', MARKERS.WHOLE_START, MARKERS.COMPLEX_NUM_START];
  const closeBrackets = [')', MARKERS.WHOLE_END, MARKERS.COMPLEX_END];

  function findMatchingClose(str, startIdx) {
    const openChar = str[startIdx];
    const openIndex = openBrackets.indexOf(openChar);
    if (openIndex === -1) return -1;
    const closeChar = closeBrackets[openIndex];
    let stack = 1;
    let idx = startIdx + 1;
    while (idx < str.length && stack > 0) {
      const ch = str[idx];
      if (ch === openChar) stack++;
      else if (ch === closeChar) stack--;
      idx++;
    }
    return stack === 0 ? idx - 1 : -1;
  }

  let result = expr;
  let i = 0;
  while (i < result.length) {
    // Пропускаем возможный знак минуса перед числом
    let sign = '';
    if (result[i] === '-') {
      sign = '-';
      i++;
    }
    // Ищем цифры числа
    if (i < result.length && /\d/.test(result[i])) {
      let numStart = i;
      while (i < result.length && /\d/.test(result[i])) i++;
      let numEnd = i;
      // Восстанавливаем полное число с учётом знака
      const fullNum = sign + result.slice(numStart, numEnd);
      // Проверяем, что после числа идёт открывающая скобка
      if (numEnd < result.length && openBrackets.includes(result[numEnd])) {
        let openPos = numEnd;
        let closePos = findMatchingClose(result, openPos);
        if (closePos !== -1 && closePos + 1 < result.length && result[closePos + 1] === '÷') {
          // Если число отрицательное – пропускаем, т.к. оно уже обработано в transformNegativeMixedNumber
          if (fullNum.startsWith('-')) {
            i++;
            continue;
          }
          const bracketPart = result.slice(openPos, closePos + 1);
          // Проверяем, является ли выражение в скобках смешанной дробью
          // (ровно одна ÷ на верхнем уровне и нет других операторов)
          const openChar = result[openPos];
          const closeChar = closeBrackets[openBrackets.indexOf(openChar)];
          const bracketContent = result.slice(openPos + 1, closePos);

          // Анализируем верхний уровень вложенности
          let divCountOnTopLevel = 0;
          let hasOtherOpsOnTopLevel = false;
          let depth = 0;
          const OPEN_MARKER = MARKERS.COMPLEX_NUM_START;
          const CLOSE_MARKER = MARKERS.COMPLEX_END;

          for (let k = 0; k < bracketContent.length; k++) {
            const ch = bracketContent[k];
            if (ch === OPEN_MARKER) depth++;
            else if (ch === CLOSE_MARKER) depth--;
            else if (depth === 0) {
              if (ch === '÷') divCountOnTopLevel++;
              else if (/[\+\-\*]/.test(ch)) hasOtherOpsOnTopLevel = true;
            }
          }

          const isSimpleFraction = (divCountOnTopLevel === 1) && !hasOtherOpsOnTopLevel;

          // Если это смешанная дробь, НЕ вставляем *, иначе вставляем
          const replacement = isSimpleFraction
            ? fullNum + bracketPart + '÷'  // БЕЗ *
            : fullNum + '*' + bracketPart + '÷';  // С *
          result = result.slice(0, numStart - (sign ? 1 : 0)) + replacement + result.slice(closePos + 2);
          i = numStart - (sign ? 1 : 0) + replacement.length;
          continue;
        }
      }
    }

    // ===== ИСПРАВЛЕНИЕ: Обработка деления смешанной дроби =====
    // Паттерн: число⥑дробь⥏÷число → (число+дробь)÷число
    // Ищем паттерн: целая часть + маркеры ⥑...⥏, за которыми идет ÷ и число
    const mixedDivisionMatch = result.slice(i).match(/^(\d+)⥑([^⥏]+)⥏÷(\d+)/);
    if (mixedDivisionMatch) {
      const whole = mixedDivisionMatch[1];
      const fraction = mixedDivisionMatch[2];
      const divisor = mixedDivisionMatch[3];
      const fullMatch = mixedDivisionMatch[0];
      const replacement = '(' + whole + '+' + fraction + ')÷' + divisor;
      result = result.slice(0, i) + replacement + result.slice(i + fullMatch.length);
      i = i + replacement.length;
      continue;
    }
    // ===== КОНЕЦ ИСПРАВЛЕНИЯ =====

    i++;
  }
  return result;
}

/**
 * Преобразует смешанные числа без знаменателя вида число⥑дробь⥏ в число+⥑дробь⥏.
 * Работает с маркерами целой части ⥑ и ⥏.
 * 
 * Паттерн: -?(\d+)⥑ ... ⥏ , где внутри между ⥑ и ⥏ ровно одна операция '÷' и нет других операторов.
 * 
 * Пример: "2⥑1÷2⥏+3⥑1÷3⥏" → "2+⥑1÷2⥏+3+⥑1÷3⥏"
 *         "-2⥑1÷2⥏+3⥑1÷3⥏" → "-(2+⥑1÷2⥏)+3+⥑1÷3⥏"
 * 
 * Если внутри есть другие операторы, или после ⥏ идёт ÷, или нет ÷ внутри – преобразование не выполняется.
 *
 * @param {string} expr - выражение с маркерами ⥑ и ⥏
 * @returns {string} - преобразованное выражение
 */
export function transformMixedNumberWithoutDivision(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.WHOLE_START;   // '⥑'
  const CLOSE = MARKERS.WHOLE_END;    // '⥏'

  // Вспомогательная функция для поиска парного закрывающего маркера
  function findMatchingCloseMarker(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // Ищем паттерн: необязательный минус, затем цифры, затем OPEN
    let match = result.slice(i).match(/^(-?\d+)⥑/);
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1]; // может содержать минус
      const numStart = i;
      const openPos = i + fullMatch.length - 1; // позиция символа ⥑
      const closePos = findMatchingCloseMarker(result, openPos);
      if (closePos !== -1) {
        // Содержимое между ⥑ и ⥏
        const content = result.slice(openPos + 1, closePos);
        // Проверяем условия: ровно один ÷, нет других операторов + - *
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;
        // =====  Если это смешанная дробь, преобразуем ВСЕГДА =====
        // Даже если после закрывающей скобки идет ÷, это все равно смешанная дробь
        // Например: 2(3÷6)÷7 → 2+(3÷6)÷7 → затем обработается деление
        if (isSimpleFraction) {
          // Заменяем "число⥾дробь⥿" на "число+дробь" (БЕЗ дополнительных скобок)
          const bracketPart = result.slice(openPos, closePos + 1);
          const replacement = numberPart + '+' + bracketPart;
          result = result.slice(0, numStart) + replacement + result.slice(closePos + 1);
          i = numStart + replacement.length;
          continue;
        }
      }
      // Если не подошло, пропускаем этот фрагмент
      i += fullMatch.length;
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Преобразует -число(выражение)÷ в -(число+выражение)÷.
 * Поддерживает маркеры целой части (⥑...⥏) и сложных выражений (⥾...⥿).
 * 
 * Пример: "-3⥾1÷2⥿÷4" → "-1(3+⥾1÷2⥿)÷4" → после stripMarkers: "-(3+(1÷2))÷4"
 * 
 * Проверяет, что внутри маркеров ровно одна операция '÷' и нет других операторов.
 * Если условие не выполнено – оставляет строку без изменений.
 */
export function transformNegativeMixedNumber(expr) {
  if (!expr) return expr;

  const OPEN_MARKERS = [MARKERS.WHOLE_START, MARKERS.COMPLEX_NUM_START];
  const CLOSE_MARKERS = [MARKERS.WHOLE_END, MARKERS.COMPLEX_END];

  function findMatchingClose(str, startIdx, openChar, closeChar) {
    if (str[startIdx] !== openChar) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === openChar) stack++;
      else if (str[i] === closeChar) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // Ищем паттерн: минус, затем цифры, затем открывающий маркер (⥑ или ⥾)
    const match = result.slice(i).match(/^-(\d+)(⥑|⥾)/);
    if (match) {
      const numberPart = match[1];
      const openMarker = match[2];
      const closeMarker = (openMarker === MARKERS.WHOLE_START) ? MARKERS.WHOLE_END : MARKERS.COMPLEX_END;
      const fullMatch = match[0];
      const numStart = i;
      const openPos = i + fullMatch.length - 1; // позиция открывающего маркера
      const closePos = findMatchingClose(result, openPos, openMarker, closeMarker);
      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);
        // Проверяем, что внутри ровно одна операция '÷' и нет других операторов
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;
        // Проверяем, не идёт ли после закрывающего маркера символ '÷' или '/'
        const nextChar = (closePos + 1 < result.length) ? result[closePos + 1] : '';
        const followedByDiv = (nextChar === '÷' || nextChar === '/');

        if (isSimpleFraction && followedByDiv) {
          const bracketPart = result.slice(openPos, closePos + 1);
          const restAfterDiv = result.slice(closePos + 1); // начинается с ÷ или / и далее
          // Преобразуем в -(число+дробь)÷...
          const replacement = `-1(${numberPart}+${bracketPart})${restAfterDiv}`;
          result = result.slice(0, numStart) + replacement;
          i = numStart + replacement.length;
          continue;
        }
      }
      i += fullMatch.length;
    } else {
      i++;
    }
  }
  return result;
}

/**
 * Преобразует смешанные числа с маркерами ⥾...⥿ в число+дробь.
 * Анализирует верхний уровень вложенности: если внутри ⥾...⥿ ровно одна операция '÷' 
 * на верхнем уровне (не внутри вложенных скобок), то это смешанная дробь.
 * 
 * Правило 1: число⥾дробь⥿ → число+дробь (без дополнительных скобок)
 * 
 * Пример: 4⥾⥾4-3⥿÷3⥿ → 4+((4-3)÷3)
 * 
 * @param {string} expr - выражение с маркерами
 * @returns {string} - преобразованное выражение
 */
export function transformMixedNumberWithComplexBrackets(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.COMPLEX_NUM_START;   // '⥾'
  const CLOSE = MARKERS.COMPLEX_END;        // '⥿'

  function findMatchingClose(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // Ищем паттерн: число + ⥾
    // Ищем паттерн: число + ⥾ (число может быть после оператора)
    let match = result.slice(i).match(/(\d+)⥾/);
    // Или с учетом возможного минуса
    if (!match) {
      match = result.slice(i).match(/(-?\d+)⥾/);
    }
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1];
      const numStart = i;
      const openPos = i + fullMatch.length - 1;
      const closePos = findMatchingClose(result, openPos);

      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);

        // ===== ИСПРАВЛЕНИЕ ШАГА 3: Анализируем ТОЛЬКО верхний уровень =====
        // Считаем операции ÷ на верхнем уровне (не внутри вложенных ⥾...⥿)
        let divCountOnTopLevel = 0;
        let hasOtherOpsOnTopLevel = false;
        let depth = 0;

        for (let k = 0; k < content.length; k++) {
          const ch = content[k];
          if (ch === OPEN) {
            depth++;
          } else if (ch === CLOSE) {
            depth--;
          } else if (depth === 0) {
            // Мы на верхнем уровне внутри ⥾...⥿
            if (ch === '÷') {
              divCountOnTopLevel++;
            } else if (/[\+\-\*]/.test(ch)) {
              hasOtherOpsOnTopLevel = true;
            }
          }
        }

        // Условие: ровно одна операция ÷ на верхнем уровне и нет других операторов
        const isSimpleFraction = (divCountOnTopLevel === 1) && !hasOtherOpsOnTopLevel;

        // =====   Если это смешанная дробь, преобразуем ВСЕГДА =====
        // Даже если после закрывающей скобки идет ÷, это все равно смешанная дробь
        // Пример: 2(3÷6)÷7 → 2+(3÷6)÷7 → затем обработается деление

        if (isSimpleFraction) {
          // Заменяем "число⥾дробь⥿" на "число+дробь" (БЕЗ дополнительных скобок)
          const bracketPart = result.slice(openPos, closePos + 1);
          const replacement = numberPart + '+' + bracketPart;
          result = result.slice(0, numStart) + replacement + result.slice(closePos + 1);
          i = numStart + replacement.length;
          continue;
        }
      }
      i += fullMatch.length;
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Обрабатывает случай, когда перед смешанной дробью стоит явный оператор.
 * Правило 2: оператор + смешанная дробь → оператор(число+дробь)
 * 
 * Примеры:
 * - 2*3(4÷5) → 2*(3+(4÷5))
 * - 3 * 4(1÷2) → 3 * (4+(1÷2))
 * 
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - преобразованное выражение
 */
export function wrapMixedNumberWithOperator(expr) {
  if (!expr) return expr;

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // ===== ИСПРАВЛЕНИЕ: Ищем паттерн число*число+(выражение) =====
    // Пример: 2*3+(4÷5) → 2*(3+(4÷5))
    // Ищем: цифры, затем оператор (*, /, +, -), затем цифры, затем +(выражение)
    const match = result.slice(i).match(/(\d+)([*/÷+\-])(\d+)\+\(([^)]+)\)/);
    if (match) {
      const firstNumber = match[1];      // 2
      const operator = match[2];          // *
      const secondNumber = match[3];      // 3
      const fractionPart = match[4];      // 4÷5
      const fullMatch = match[0];         // 2*3+(4÷5)

      // Проверяем, что внутри скобок есть ровно одна операция ÷
      const divCount = (fractionPart.match(/÷/g) || []).length;
      const hasOtherOps = /[\+\-\*]/.test(fractionPart.replace(/÷/g, ''));

      if (divCount === 1 && !hasOtherOps) {
        // Это смешанная дробь → оборачиваем второе число и дробь в скобки
        // 2*3+(4÷5) → 2*(3+(4÷5))
        const replacement = firstNumber + operator + '(' + secondNumber + '+' + '(' + fractionPart + ')' + ')';
        result = result.slice(0, i) + replacement + result.slice(i + fullMatch.length);
        i = i + replacement.length;
        continue;
      }
    }
    i++;
  }

  return result;
}

/**
 * Форматирует выражение для отображения в истории.
 * Вставляет '*' между числом и скобкой, если внутри скобок не простая дробь.
 * Заменяет маркеры ⥾/⥿ и ⥑/⥏ на обычные скобки.
 * @param {string} expr - выражение с маркерами (после автозакрытия)
 * @returns {string} - отформатированное выражение для истории
 */
function formatHistoryExpr(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.COMPLEX_NUM_START;   // '⥾'
  const CLOSE = MARKERS.COMPLEX_END;        // '⥿'

  function findMatchingClose(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = '';
  let i = 0;
  while (i < expr.length) {
    const match = expr.slice(i).match(/^(\d+)⥾/);
    if (match) {
      const number = match[1];
      const openPos = i + match[0].length - 1;
      const closePos = findMatchingClose(expr, openPos);
      if (closePos !== -1) {
        const content = expr.slice(openPos + 1, closePos);
        const divCount = (content.match(/÷/g) || []).length;
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = divCount === 1 && !hasOtherOps;

        if (!isSimpleFraction) {
          // Вставляем '*' между числом и открывающей скобкой
          result += number + '*' + OPEN;
          i += number.length + 1; // пропускаем число и OPEN
          continue;
        }
      }
    }
    result += expr[i];
    i++;
  }

  // Заменяем маркеры на обычные скобки
  return result
    .replace(/⥾/g, '(')
    .replace(/⥿/g, ')')
    .replace(/⥑/g, '(')
    .replace(/⥏/g, ')');
}

/**
 * Преобразует все смешанные дроби вида "число+(число÷число)" в неправильные дроби "(число*знаменатель+числитель)÷знаменатель"
 * Пример: "4+(3÷4)" → "(4*4+3)÷4" → "19÷4"
 */
function convertMixedToImproper(expr) {
  // Ищем паттерн: число+(числитель÷знаменатель)
  return expr.replace(/(\d+)\+\((\d+)÷(\d+)\)/g, (match, whole, num, den) => {
    const improperNum = parseInt(whole) * parseInt(den) + parseInt(num);
    return `(${improperNum}÷${den})`;
  });
}

/**
 * Равно (вычисление финального выражения).
 * Собирает цепочку из expression и display, автоматически закрывает скобки,
 * передает выражение в математическое ядро и управляет выводом результата или ERROR.
 */
export function evaluateFraction() {
  // Если калькулятор уже находится в состоянии ошибки, нажатие "=" сбрасывает его в "0"
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
    isPowerMode = false;
    powerDepth = 0;
    return;
  }

  // ---- Сбрасываем режим степени перед вычислением ----
  isPowerMode = false;
  powerDepth = 0;

  // === АВТОДОПОЛНЕНИЕ ПУСТЫХ СКОБОК ===
  const fixedDisplay = autoCompleteEmptyBrackets(appState.display);
  if (fixedDisplay !== appState.display) {
    appState.display = fixedDisplay;
  }

  // Собираем полное выражение
  let fullExpr = (appState.expression || '') + (appState.display || '');
  fullExpr = autoCompleteEmptyBrackets(fullExpr);

  // === АВТОЗАКРЫТИЕ МАРКЕРОВ (оставляем как есть) ===
  let stack = getUnclosedMarkersStack(fullExpr);
  while (stack.length > 0) {
    fullExpr += MARKERS.COMPLEX_END;
    stack.pop();
  }
  let openWhole = (fullExpr.match(/⥑/g) || []).length;
  let closeWhole = (fullExpr.match(/⥏/g) || []).length;
  while (openWhole > closeWhole) {
    fullExpr += MARKERS.WHOLE_END;
    closeWhole++;
  }


  // === ТРАНСФОРМАЦИИ (все существующие) === 
  // 1. Обрабатываем смешанные числа с маркерами целой части (⥑...⥏)
  fullExpr = transformMixedNumberWithoutDivision(fullExpr);
  // 2. Обрабатываем отрицательные смешанные числа
  fullExpr = transformNegativeMixedNumber(fullExpr);
  // 3. Обрабатываем смешанные дроби с оператором ÷ после скобок
  fullExpr = transformMixedFractionWithDivision(fullExpr);
  // 4. Обрабатываем сложные скобки ⥾...⥿ (Правило 1: число+дробь)
  fullExpr = transformMixedNumberWithComplexBrackets(fullExpr);
  // 6. Преобразуем маркеры в обычные скобки
  fullExpr = stripMarkers(fullExpr);
  // 5. Обрабатываем случаи с оператором перед смешанной дробью (Правило 2: оператор(число+дробь))
  fullExpr = wrapMixedNumberWithOperator(fullExpr);
  // ===== ИСПРАВЛЕНИЕ ШАГА 3: Обработка деления смешанной дроби =====
  // После stripMarkers, выражение вида "2+(3÷6)÷7" должно стать "(2+(3÷6))÷7"
  // Ищем паттерн: число+(выражение)÷число
  const mixedDivisionPattern = /(\d+)\+\(([^)]+)\)÷(\d+)/g;
  fullExpr = fullExpr.replace(mixedDivisionPattern, (match, whole, fraction, divisor) => {
    return '(' + whole + '+' + fraction + ')÷' + divisor;
  });

  // Форматирование истории с компактным видом смешанных дробей =====
  // Преобразуем "4+(3÷4)" → "4(3÷4)" для истории
  let historyDisplayExpr = fullExpr;
  // Сначала заменяем маркеры на скобки (если они есть)
  historyDisplayExpr = formatHistoryExpr(historyDisplayExpr);
  // Затем сворачиваем смешанные дроби: "число+(дробь)" → "число(дробь)"
  historyDisplayExpr = historyDisplayExpr.replace(/(\d+)\+\(([^)]+)\)/g, '$1($2)');

  // 7. Вставляем неявные операторы для оставшихся случаев (Правила 3, 4, 5)
  fullExpr = insertImplicitMultiplication(fullExpr);
  fullExpr = fullExpr.replace(/\)(\d+)/g, ')*$1');
  fullExpr = insertImplicitMultiplication(fullExpr);

  // === АВТОЗАКРЫТИЕ ВСЕХ НЕЗАКРЫТЫХ СКОБОК ===
  // Считаем количество открывающих и закрывающих скобок во всей строке
  const openBrackets = (fullExpr.match(/\(/g) || []).length;
  const closeBrackets = (fullExpr.match(/\)/g) || []).length;

  // Если есть незакрытые скобки (например, при вводе вложенных корней вида "√(√(64"),
  // калькулятор автоматически дописывает их в конец строки перед расчетом
  if (openBrackets > closeBrackets) {
    const missingCount = openBrackets - closeBrackets;
    const bracketsToAdd = ')'.repeat(missingCount);

    fullExpr += bracketsToAdd;
  }

  try {
    // 8. Переносим целые части в числитель дроби
    fullExpr = convertMixedToImproper(fullExpr);

    // 1. Переводим всю строку в чистый текстовый вид для математического ядра
    // (например, конвертируем superscript-символы степени: "2^³" -> "2^3")
    let cleanExpr = fromSuperscript(fullExpr);

    console.log("Исходная строка перед фиксом скобок:", cleanExpr);

    // 2. ИЗОЛЯЦИЯ ПРИОРИТЕТОВ СТЕПЕНИ ДЛЯ ЯДРА
    // Если пользователь ввел "1÷4^2", ядро без скобок посчитает это как (1÷4)^2.
    // Чтобы этого не происходило, мы заменяем конструкции "число÷число^степень" 
    // или "число÷(выражение)^степень" на изолированные скобки.

    // Убираем возможные дубликаты двойных скобок вокруг степеней, если они случайно возникли
    cleanExpr = cleanExpr.replace(/\^\(\(([^)]+)\)\)/g, '^($1)');

    console.log("Строка, отправляемая в ядро (ФИКС СКОБОК):", cleanExpr);

    // 3. ВЫЧИСЛЕНИЕ
    // Отправляем полностью сбалансированное и подготовленное выражение в парсер ядра
    const resultFraction = evaluateFractionExpression(cleanExpr);

    // Жесткая проверка на деление на ноль на уровне результата
    if (resultFraction.den === 0) throw new Error('Division by zero');

    // 4. ФОРМАТИРОВАНИЕ РЕЗУЛЬТАТА
    // Переводим полученную правильную дробь в смешанный вид для отображения
    const mixed = resultFraction.toMixed();
    let displayStr;

    if (mixed.whole !== 0 && mixed.num !== 0) {
      // Смешанная дробь с маркерами начала и конца дробной части (целое⥑числитель÷знаменатель⥏)
      displayStr = `${mixed.whole}⥑${Math.abs(mixed.num)}÷${mixed.den}⥏`;
    } else if (mixed.whole !== 0) {
      // Только целое число
      displayStr = `${mixed.whole}`;
    } else {
      // Для отрицательной чистой дроби знак определяется числителем resultFraction
      const sign = resultFraction.num < 0 ? '-' : '';
      displayStr = `${sign}${Math.abs(mixed.num)}÷${mixed.den}`;
    }

    // 5. ЗАПИСЬ В ИСТОРИЮ СЕССИИ
    // Проверяем флаг подробных шагов из appState
    let finalStepsArray = [historyDisplayExpr, displayStr];

    if (appState.stepsFraction) {
      // Генерируем подробную цепочку шагов, передавая подготовленное cleanExpr и готовый результат
      finalStepsArray = generateSteps(cleanExpr, resultFraction);
    }

    // === -📝=TODO=📝- ===
    // ===== ВРЕМЕННАЯ ОТЛАДКА =====
    // console.log('📊 [DEBUG] Шаги для выражения:', cleanExpr);
    // console.log('📊 [DEBUG] Массив шагов:', finalStepsArray);
    // =============================


    appState.historySession.push({
      type: 'fractionSteps',
      steps: finalStepsArray
    });

    // Обновляем состояние дисплея для пользователя
    appState.display = displayStr;
    appState.expression = '';
    appState.isNewInput = true;

  } catch (err) {
    console.error('Evaluation error:', err);

    // =====   Обработка деления на ноль в смешанной дроби =====
    // Проверяем, является ли ошибка делением на ноль
    const isDivisionByZero = err.message && (
      err.message.includes('Division by zero') ||
      err.message.includes('division by zero')
    );

    // Формируем массив шагов для истории
    let errorStepsArray = [historyDisplayExpr, 'ERROR'];
    if (appState.stepsFraction) {
      errorStepsArray = generateSteps(fromSuperscript(fullExpr));
      if (errorStepsArray[errorStepsArray.length - 1] !== 'ERROR') {
        errorStepsArray.push('ERROR');
      }
    }

    // Записываем ошибку в историю
    appState.historySession.push({
      type: 'fractionSteps',
      steps: errorStepsArray
    });

    // =====  Отображаем ERROR на дисплее =====
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
  isPowerMode = false;
  powerDepth = 0;
}

// ---- backspace ⌫ ----
/**
 * Обработчик кнопки backspace.
 * Защищает структуру дроби: если expression заканчивается на '÷',
 * удаление происходит только из display (знаменатель).
 * Если display пуст, удаление блокируется.
 * В остальных случаях – стандартное удаление из display.
 */
export function backspaceFraction() {
  // Обработка состояния ошибки
  if (isError()) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }

  // ---- Если активен режим степени, обрабатываем удаление специально ----
  if (isPowerMode) {
    // Удаляем последний символ из display
    if (appState.display.length > 1) {
      appState.display = appState.display.slice(0, -1);
    } else {
      appState.display = '';
    }

    // Пересчитываем powerDepth на основе оставшегося показателя
    const lastIndex = appState.display.lastIndexOf('^');
    if (lastIndex === -1) {
      // Если '^' удалён — сбрасываем режим
      isPowerMode = false;
      powerDepth = 0;
      return;
    }

    const afterPower = appState.display.substring(lastIndex + 1);
    // Считаем баланс скобок в показателе
    let depth = 0;
    for (const ch of afterPower) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (depth < 0) depth = 0; // защита от отрицательной глубины
    }
    powerDepth = depth;

    // Если показатель пуст (после '^' ничего нет) — сбрасываем режим
    if (afterPower === '') {
      isPowerMode = false;
      powerDepth = 0;
    } else {
      // Иначе режим остаётся активным
      isPowerMode = true;
    }
    return;
  }


  // === ЗАЩИТА СТРУКТУРЫ ДРОБИ ===
  // Если expression оканчивается на '÷', значит мы находимся в режиме ввода знаменателя
  if (appState.expression.endsWith('÷')) {
    // Если display пуст (ничего не введено в знаменателе) – блокируем удаление
    if (appState.display === '' || appState.display === '0') {
      return; // ничего не делаем
    }
    // Удаляем символ из display (знаменатель)
    if (appState.display.length > 1) {
      appState.display = appState.display.slice(0, -1);
    } else {
      appState.display = ''; // знаменатель стал пустым, но не ставим '0', чтобы пользователь мог ввести цифры
    }
    return;
  }

  // === СТАНДАРТНОЕ УДАЛЕНИЕ (все остальные случаи) ===
  if (appState.display.length > 1) {
    appState.display = appState.display.slice(0, -1);
  } else {
    appState.display = '';
    appState.isNewInput = true;
  }
}



