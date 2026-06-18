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
  // Если внутри нет знака ÷, значит, пользователь не вводил дробь — числитель ещё не готов к закрытию
  if (!inside.includes(MARKERS.DIV)) return false;
  // Проверяем баланс скобок
  let openParens = 0, closeParens = 0;
  for (const ch of inside) {
    if (ch === '(') openParens++;
    if (ch === ')') closeParens++;
    if (ch === MARKERS.COMPLEX_END) return false; // уже закрыт
  }
  if (openParens > closeParens) return false;
  // Проверяем, что после последнего ÷ есть завершённый операнд
  const lastChar = display.slice(-1);
  return /[\d)]/.test(lastChar);
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
  return /[\d)]/.test(lastChar);
}
// --------------------------------------------

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

    appState.display += '.';
    return;
  }

  // КРИТИЧЕСКИЙ МОМЕНТ ДЛЯ СТЕПЕНИ: 
  // Если на дисплее уже есть знак '^', то ВСЕ последующие цифры 
  // мы принудительно переводим в верхний индекс (superscript)!
  if (appState.display.includes('^')) {
    const parts = appState.display.split('^');
    // Гарантируем, что parts[1] существует и является строкой, даже если split дал сбой
    if (parts[1] === undefined) parts[1] = '';
    parts[1] += toSuperscript(digit);
    appState.display = parts[0] + '^' + parts[1];
  } else {
    // Обычный ввод числа
    if (appState.display === '0') {
      appState.display = digit;
    } else {
      appState.display += digit;
    }
  }
}

// ---- операторы + - * / ÷ √ ^ ---- 
export function addOperatorFraction(op) {
  clearErrorIfNeeded();
  // === -📝=TODO=📝- ===
  console.log('[DEBUG] addOperatorFraction called with op =', op, 'display =', appState.display, 'expression =', appState.expression);

  const lastChar = appState.display.slice(-1);

  // 1. Защита для корня √
  if (op === '√') {
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
    if (appState.display === '0' && appState.expression === '') return;
    // Запрещаем ставить степень после операторов, точек, открывающих скобок или если степень уже есть
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    appState.display += '^';
    appState.isNewInput = false;
    return;
  }

  // 3. Защита для знака деления ÷
  if (op === '÷') {
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

  // 4. Обычные операторы (+ - * /)
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    if (op === '-') {
      appState.display = op;
      appState.isNewInput = false;
    }
    return;
  }

  if (/[\+\-\*\/÷\^\.√]$/.test(appState.display) && !appState.isNewInput) return;

  const fullExpr = (appState.expression || '') + (appState.display || '');
  // === -📝=TODO=📝- ===
  console.log('[LOG-20.2] Проверка закрытия целой части: fullExpr=', fullExpr, 'display=', appState.display);
  console.log('[LOG-20.2] !hasUnclosedComplexMarker=', !hasUnclosedComplexMarker(fullExpr));
  console.log('[LOG-20.2] hasUnclosedWholePart=', hasUnclosedWholePart(fullExpr));
  console.log('[LOG-20.2] isWholePartReadyToClose=', isWholePartReadyToClose(fullExpr, appState.display));
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

  // Если на экране уже дробь, то ничего делать не нужно
  if (appState.display.includes('÷') || appState.display.includes('⥑')) {
    return;
  }

  // Фиксируем исходное значение для записи в историю сессии
  const originalDisplay = appState.display;

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

  // Фиксируем исходное значение для записи в историю сессии
  const originalDisplay = appState.display;
  const expr = appState.display;

  try {
    let normalized = expr.replace(/⥑/g, ' ').replace(/÷/g, '/').replace(/⥏/g, '');
    const frac = new FractionJS(normalized);
    const decimal = frac.valueOf();

    const resultStr = String(decimal);

    // ДОПОЛНЕНИЕ: Запись операции перевода в историю сессии
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, resultStr]
    });

    appState.display = resultStr;
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

    // ВСЕГДА создаём сложную скобку (⥾) для группировки числителя/знаменателя.
    // Целая часть (⥑) не должна создаваться через обычную скобку.
    const marker = MARKERS.COMPLEX_NUM_START;

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
    const fullExpr = (appState.expression || '') + (appState.display || '');
    const stack = getUnclosedMarkersStack(fullExpr); // только сложные маркеры

    // Если есть незакрытые сложные маркеры – закрываем последний
    if (stack.length > 0) {
      appState.display += MARKERS.COMPLEX_END;
      appState.isNewInput = false;
      return;
    }

    // Если сложных нет, проверяем наличие незакрытой целой части (⥑ без ⥏)
    const lastWholeStartIdx = fullExpr.lastIndexOf(MARKERS.WHOLE_START);
    let hasUnclosedWhole = false;
    if (lastWholeStartIdx !== -1) {
      const afterWhole = fullExpr.substring(lastWholeStartIdx + 1);
      if (!afterWhole.includes(MARKERS.WHOLE_END)) {
        hasUnclosedWhole = true;
      }
    }

    if (hasUnclosedWhole) {
      // Закрываем целую часть
      appState.display += MARKERS.WHOLE_END;
      appState.isNewInput = false;
      return;
    }

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
 * Вставляет явный знак умножения '*' в местах неявного умножения.
 * Поддерживает обычные скобки () и маркеры ⥑, ⥾ (открывающие) и ⥏, ⥿ (закрывающие).
 * 
 * Правила:
 * - число( или число⥑/⥾ → число*(
 * - )( или ⥏/⥿)( → )*(
 * - )число или ⥏/⥿)число → )*число
 * - )число( → )*число*(
 * 
 * Не вставляет, если после закрывающей скобки идёт '÷' (обрабатывается на шаге 10).
 *
 * @param {string} expr - исходное выражение (может содержать маркеры)
 * @returns {string} - выражение с явными '*'
 */
function insertImplicitMultiplication(expr) {
  if (!expr) return expr;

  // Определяем группы символов для открывающих и закрывающих скобок (включая маркеры)
  const openBrackets = `\\(${MARKERS.WHOLE_START}${MARKERS.COMPLEX_NUM_START}`;
  const closeBrackets = `\\)${MARKERS.WHOLE_END}${MARKERS.COMPLEX_END}`;

  let result = expr;

  // 1. число или закрывающая скобка, за которыми идёт открывающая скобка -> вставляем *
  const pattern1 = new RegExp(`(\\d|[${closeBrackets}])([${openBrackets}])`, 'g');
  result = result.replace(pattern1, '$1*$2');

  // 2. )число( — между ними вставляем * после числа и перед открывающей скобкой
  const pattern2 = new RegExp(`([${closeBrackets}])(\\d+)([${openBrackets}])`, 'g');
  result = result.replace(pattern2, '$1*$2*$3');

  // 3. )число в конце или перед чем-то, кроме '÷' -> вставляем * после )
  const pattern3 = new RegExp(`([${closeBrackets}])(\\d+)(?![÷])`, 'g');
  result = result.replace(pattern3, '$1*$2');

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
function transformMixedFractionWithDivision(expr) {
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
          // const replacement = fullNum + '+' + bracketPart + '÷';
          const replacement = '(' + fullNum + '+' + bracketPart + ')' + '÷';
          result = result.slice(0, numStart - (sign ? 1 : 0)) + replacement + result.slice(closePos + 2);
          i = numStart - (sign ? 1 : 0) + replacement.length;
          continue;
        }
      }
    }
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
function transformMixedNumberWithoutDivision(expr) {
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
        // Проверяем, не идёт ли после закрывающего маркера символ ÷ (случай шага 10)
        const nextChar = (closePos + 1 < result.length) ? result[closePos + 1] : '';
        const followedByDiv = (nextChar === '÷');

        if (isSimpleFraction && !followedByDiv) {
          // Формируем замену
          const numberWithoutSign = numberPart.startsWith('-') ? numberPart.slice(1) : numberPart;
          const sign = numberPart.startsWith('-') ? '-' : '';
          const bracketPart = result.slice(openPos, closePos + 1); // включает ⥑...⥏

          let replacement;
          if (sign === '-') {
            // Отрицательное: -(число+дробь)
            replacement = `-1(${numberWithoutSign}+${content})`;
          } else {
            // Положительное: число+(дробь)
            replacement = `${numberPart}+${bracketPart}`;
          }

          // Заменяем в строке
          result = result.slice(0, numStart) + replacement + result.slice(closePos + 1);
          // Сдвигаем указатель на конец замены
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
 * Работает с маркерами ⥑ и ⥏.
 * 
 * Пример: "-3⥑1÷2⥏÷4" → "-(3+⥑1÷2⥏)÷4"
 * 
 * Проверяет, что внутри маркеров ровно одна операция '÷' и нет других операторов.
 * Если условие не выполнено – оставляет строку без изменений.
 *
 * @param {string} expr - выражение с маркерами
 * @returns {string} - преобразованное выражение
 */
function transformNegativeMixedNumber(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.WHOLE_START;   // '⥑'
  const CLOSE = MARKERS.WHOLE_END;    // '⥏'

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
    const match = result.slice(i).match(/^-(\d+)⥑/);
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1];
      const numStart = i;
      const openPos = i + fullMatch.length - 1;
      const closePos = findMatchingCloseMarker(result, openPos);
      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;
        const nextChar = (closePos + 1 < result.length) ? result[closePos + 1] : '';
        const followedByDiv = (nextChar === '÷');

        if (isSimpleFraction && followedByDiv) {
          const bracketPart = result.slice(openPos, closePos + 1);
          const restAfterDiv = result.slice(closePos + 1); // начинается с ÷ и далее
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
 * Ищет паттерн: -?(\d+)⥾(дробь)⥿, где внутри ⥾...⥿ ровно одна операция '÷' и нет других операторов.
 * Заменяет на: -?(\d+)+⥾(дробь)⥿ (т.е. добавляет '+' между числом и открывающей скобкой).
 * Если после ⥿ идёт '÷', преобразование не выполняется (это обрабатывается отдельно).
 * @param {string} expr - выражение с маркерами
 * @returns {string} - преобразованное выражение
 */
function transformMixedNumberWithComplexBrackets(expr) {
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
    // Ищем паттерн: необязательный минус, затем цифры, затем OPEN
    let match = result.slice(i).match(/^(-?\d+)⥾/);
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1];
      const numStart = i;
      const openPos = i + fullMatch.length - 1;
      const closePos = findMatchingClose(result, openPos);
      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;
        const nextChar = (closePos + 1 < result.length) ? result[closePos + 1] : '';
        const followedByDiv = (nextChar === '÷');

        if (isSimpleFraction && !followedByDiv) {
          // Заменяем "число⥾" на "число+⥾"
          const replacement = numberPart + '+' + OPEN;
          result = result.slice(0, numStart) + replacement + result.slice(numStart + fullMatch.length);
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
    return;
  }

  // === АВТОДОПОЛНЕНИЕ ПУСТЫХ СКОБОК ===
  const fixedDisplay = autoCompleteEmptyBrackets(appState.display);
  if (fixedDisplay !== appState.display) {
    appState.display = fixedDisplay;
  }

  // Собираем полное выражение
  let fullExpr = (appState.expression || '') + (appState.display || '');
  fullExpr = autoCompleteEmptyBrackets(fullExpr);

  // === АВТОЗАКРЫТИЕ НЕЗАКРЫТЫХ МАРКЕРОВ (⥾/⥿ и ⥑/⥏) ===
  // 1. Закрываем все незакрытые сложные скобки (числители)
  let stack = getUnclosedMarkersStack(fullExpr);
  while (stack.length > 0) {
    fullExpr += MARKERS.COMPLEX_END;
    stack.pop();
  }

  // 2. Закрываем все незакрытые целые части
  let openWhole = (fullExpr.match(/⥑/g) || []).length;
  let closeWhole = (fullExpr.match(/⥏/g) || []).length;
  while (openWhole > closeWhole) {
    fullExpr += MARKERS.WHOLE_END;
    closeWhole++;
  }

  // === ШАГ 10.5: трансформация смешанных чисел без знаменателя ===
  fullExpr = transformMixedNumberWithoutDivision(fullExpr);
  // === -📝=TODO=📝- ===
  console.log('[LOG-EVAL] После автозакрытия fullExpr =', fullExpr);

  // === ОБРАБОТКА ОТРИЦАТЕЛЬНЫХ СМЕШАННЫХ ЧИСЕЛ С ДЕЛЕНИЕМ (шаг 10.6) ===
  fullExpr = transformNegativeMixedNumber(fullExpr);

  // === ШАГ 10: трансформация дробей с целой частью и знаменателем ===
  fullExpr = transformMixedFractionWithDivision(fullExpr);

  // === ПРЕОБРАЗОВАНИЕ СМЕШАННЫХ ДРОБЕЙ С МАРКЕРАМИ ⥾...⥿ ===
  fullExpr = transformMixedNumberWithComplexBrackets(fullExpr);

  // === ШАГ 8: вставка неявного умножения (дважды) ===
  fullExpr = insertImplicitMultiplication(fullExpr);
  fullExpr = insertImplicitMultiplication(fullExpr);

  // === ПРЕОБРАЗОВАНИЕ МАРКЕРОВ В ОБЫЧНЫЕ СКОБКИ ===
  fullExpr = stripMarkers(fullExpr);

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
    // 1. Переводим всю строку в чистый текстовый вид для математического ядра
    // (например, конвертируем superscript-символы степени: "2^³" -> "2^3")
    let cleanExpr = fromSuperscript(fullExpr);

    console.log("Исходная строка перед фиксом скобок:", cleanExpr);

    // 2. ИЗОЛЯЦИЯ ПРИОРИТЕТОВ СТЕПЕНИ ДЛЯ ЯДРА
    // Если пользователь ввел "1÷4^2", ядро без скобок посчитает это как (1÷4)^2.
    // Чтобы этого не происходило, мы заменяем конструкции "число÷число^степень" 
    // или "число÷(выражение)^степень" на изолированные скобки.

    // Случай А: Число ÷ Число ^ Любое выражение (включая дробные степени вроде 2÷3)
    if (cleanExpr.includes('÷') && cleanExpr.includes('^')) {
      // Сначала изолируем сам показатель степени, если там идет деление без скобок: "5^2÷3" -> "5^(2÷3)"
      cleanExpr = cleanExpr.replace(/\^([\d.÷]+)/g, '^($1)');

      // Теперь изолируем всю правую часть деления (основание вместе со степенью): "1÷5^(2÷3)" -> "1÷(5^(2÷3))"
      cleanExpr = cleanExpr.replace(/(\d+)÷(\d+)\^([(\d.÷)]+)/g, '$1÷($2^$3)');
    }

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
    let finalStepsArray = [fullExpr, displayStr];

    if (appState.stepsFraction) {
      // Генерируем подробную цепочку шагов, передавая подготовленное cleanExpr и готовый результат
      finalStepsArray = generateSteps(cleanExpr, resultFraction);
    }

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

    // В случае ошибки при включенных шагах — получаем шаги до места сбоя + "ERROR"
    let errorStepsArray = [fullExpr, 'ERROR'];
    if (appState.stepsFraction) {
      errorStepsArray = generateSteps(fromSuperscript(fullExpr));
      if (errorStepsArray[errorStepsArray.length - 1] !== 'ERROR') {
        errorStepsArray.push('ERROR');
      }
    }

    appState.historySession.push({
      type: 'fractionSteps',
      steps: errorStepsArray
    });

    // 2. КАК ДОЛЖНО БЫТЬ: переводим главный дисплей в режим ожидания (выводим "0")
    appState.display = '0';

    // 3. Очищаем верхнюю строку цепочки выражений
    appState.expression = '';

    // 4. Выставляем флаг, что следующий ввод сотрет этот ноль и начнется заново
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


if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testTransformMixed = function (expr) {
    const result = transformMixedNumberWithoutDivision(expr);
    console.log('Вход:  ', expr);
    console.log('Выход: ', result);
    return result;
  };
}
