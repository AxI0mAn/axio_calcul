
/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionVisualParser.js
 * fractionVisualParser.js — токенизатор, который различает простые дроби число÷число и смешанные целое⥑числитель÷знаменатель⥏, а также обрабатывает операторы.
 * Преобразует строку с математическими выражениями и спецсимволами в массив токенов для рендеринга двухэтажных дробей и плоских выражений.
 */

import { toSuperscript } from "$lib/utils/toSuperscript";

// Специальные символы 
export const MARKERS = {
  WHOLE_START: '\u2951', // ⥑
  WHOLE_END: '\u294F',   // ⥏
  COMPLEX_NUM_START: '\u297E', // ⥾
  COMPLEX_END: '\u297F',       // ⥿
  DIV: '÷'
};

// ---- вспомогательные функции для работы с маркерами ----
export function isWholeStartMarker(char) {
  return char === MARKERS.WHOLE_START;
}

export function isWholeEndMarker(char) {
  return char === MARKERS.WHOLE_END;
}

export function isComplexStartMarker(char) {
  return char === MARKERS.COMPLEX_NUM_START;
}

export function isComplexEndMarker(char) {
  return char === MARKERS.COMPLEX_END;
}

export function getMarkerType(char) {
  if (char === MARKERS.WHOLE_START) return 'WHOLE_START';
  if (char === MARKERS.WHOLE_END) return 'WHOLE_END';
  if (char === MARKERS.COMPLEX_NUM_START) return 'COMPLEX_NUM_START';
  if (char === MARKERS.COMPLEX_END) return 'COMPLEX_END';
  return null;
}

/**
 * Преобразует все вхождения '^цифры' в строке в верхний индекс (юникод).
 * Например, "4^7" -> "4⁷", "3^5" -> "3⁵".
 */
function convertPowerToSuperscript(str) {
  if (!str) return str;
  return str.replace(/\^(\d+)/g, (match, p1) => toSuperscript(p1));
}

/**
 * Возвращает массив незакрытых маркеров сложных выражений (⥾) в порядке их открытия.
 * Игнорирует маркеры целой части (⥑, ⥏).
 * @param {string} expr - строка с маркерами
 * @returns {string[]} массив незакрытых маркеров (например, ['⥾', '⥾'] или [])
 */
export function getUnclosedMarkersStack(expr) {
  const stack = [];
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    // Открывающий маркер сложного выражения ⥾ — кладём в стек
    if (ch === MARKERS.COMPLEX_NUM_START) {
      stack.push(ch);
    }
    // Закрывающий маркер сложного выражения ⥿ — выталкиваем последний открытый, если он есть
    else if (ch === MARKERS.COMPLEX_END) {
      if (stack.length > 0 && stack[stack.length - 1] === MARKERS.COMPLEX_NUM_START) {
        stack.pop();
      }
      // Если стек пуст или несоответствие — игнорируем (не добавляем ничего, сохраняем текущий стек)
    }
    // Маркеры целой части (⥑, ⥏) и любые другие символы игнорируем
  }
  return stack;
}

/**
 * Проверяет, является ли строка числом (целым, десятичным или незавершенным с точкой на конце)
 * @param {string} str
 * @returns {boolean}
 */
function isNumber(str) {
  // Добавлена поддержка незавершенного ввода вида "1."
  return /^-?\d+\.?\d*$/.test(str);
}

/**
 * Разбирает смешанную дробь вида "целое⥑числитель÷знаменатель⥏"
 * @param {string} str
 * @returns {{ whole: string, num: string, den: string } | null}
 */
function parseMixedFraction(str) {
  const wholeStart = str.indexOf(MARKERS.WHOLE_START);
  const wholeEnd = str.indexOf(MARKERS.WHOLE_END);
  if (wholeStart === -1 || wholeEnd === -1) return null;

  const wholePart = str.substring(0, wholeStart);
  const inner = str.substring(wholeStart + 1, wholeEnd);
  const divIndex = inner.indexOf(MARKERS.DIV);
  if (divIndex === -1) return null;

  const numPart = inner.substring(0, divIndex);
  const denPart = inner.substring(divIndex + 1);

  return {
    whole: wholePart,
    num: convertPowerToSuperscript(numPart),
    den: convertPowerToSuperscript(denPart)
  };
}

/**
 * Разбирает простую дробь "числитель÷знаменатель"
 * @param {string} str
 * @returns {{ num: string, den: string } | null}
 */
function parseSimpleFraction(str) {
  const divIndex = str.indexOf(MARKERS.DIV);
  if (divIndex === -1) return null;
  let numPart = str.substring(0, divIndex);
  let denPart = str.substring(divIndex + 1);
  if (numPart.includes(MARKERS.DIV) || denPart.includes(MARKERS.DIV)) return null;
  // Преобразуем степени в верхние индексы
  numPart = convertPowerToSuperscript(numPart);
  denPart = convertPowerToSuperscript(denPart);
  return { num: numPart, den: denPart };
}

/**
 * Удаляет технические маркеры из строки для плоского отображения
 * @param {string} str
 * @returns {string}
 */
export function stripMarkers(str) {
  return str.replace(/[⥑⥾]/g, '(')
    .replace(/[⥏⥿]/g, ')');
}

/**
 * console.log(parseExpressionToTokens("3(1÷2)")
 * Основная функция: преобразует выражение в массив токенов для рендеринга.
 * Каждый токен: { type: 'text', value: string } или { type: 'fraction', whole?: string, num: string, den: string }
 * @param {string} expression
 * @returns {Array<{type: string, value?: string, whole?: string, num?: string, den?: string}>}
 */
export function parseExpressionToTokens(expression) {
  // =====  Обработка ERROR =====
  if (expression === 'ERROR') {
    return [{ type: 'text', value: 'ERROR' }];
  }

  if (!expression || expression.trim() === '') return [];

  // ===== ВРЕМЕННЫЙ ДЕБАГ ШАГА 11.16 =====
  console.log('🔍 [ДЕБАГ-11.16] === parseExpressionToTokens ===');
  console.log('🔍 [ДЕБАГ-11.16] Входное выражение:', JSON.stringify(expression));
  console.log('🔍 [ДЕБАГ-11.16] Длина выражения:', expression.length);
  console.log('🔍 [ДЕБАГ-11.16] Символы по порядку:', expression.split('').map((ch, idx) => `${idx}:${ch}(${ch.charCodeAt(0)})`).join(', '));
  // ===== КОНЕЦ ДЕБАГА =====

  const tokens = [];
  let i = 0;
  const len = expression.length;

  while (i < len) {
    const ch = expression[i];

    // 0. ПЕРВООЧЕРЕДНАЯ ОБРАБОТКА МАРКЕРОВ – преобразуем их в обычные скобки для отображения
    if (ch === MARKERS.WHOLE_START || ch === MARKERS.COMPLEX_NUM_START) {
      tokens.push({ type: 'text', value: '(' });
      i++;
      continue;
    }
    if (ch === MARKERS.WHOLE_END || ch === MARKERS.COMPLEX_END) {
      tokens.push({ type: 'text', value: ')' });
      i++;
      continue;
    }


    // 1. Смешанная дробь: целое⥑числитель÷знаменатель⥏
    if (ch === MARKERS.WHOLE_START) {
      const endIdx = expression.indexOf(MARKERS.WHOLE_END, i);
      if (endIdx !== -1) {
        let startWhole = i - 1;
        while (startWhole >= 0 && expression[startWhole].match(/[\d\-]/)) {
          startWhole--;
        }
        startWhole++;
        const fullMixed = expression.substring(startWhole, endIdx + 1);
        const parsed = parseMixedFraction(fullMixed);
        if (parsed) {
          tokens.push({
            type: 'fraction',
            whole: parsed.whole,
            num: parsed.num,
            den: parsed.den
          });
          i = endIdx + 1;
          continue;
        }
      }
    }

    // 2. Числа, простые дроби и смешанные дроби с динамическим окном (Случай 1)
    if (ch.match(/\d/) || (ch === '-' && (i === 0 || '+*/=([√÷'.includes(expression[i - 1])))) {
      let j = i;
      while (j < len && (
        expression[j].match(/[\d.]/) ||
        expression[j] === MARKERS.DIV ||
        (expression[j] === '-' && j === i)
      )) {
        j++;
      }

      // =====   Блокируем сбор дроби, если после ÷ идет ( =====
      // Проверяем, не является ли это оператором деления со скобками
      let candidate = expression.substring(i, j);
      const divIndex = candidate.indexOf(MARKERS.DIV);

      // Если найден ÷, проверяем, что за ним следует в выражении
      if (divIndex !== -1) {
        const afterDiv = candidate.substring(divIndex + 1);
        // Если после ÷ пусто или только цифры, проверяем следующий символ
        if (afterDiv === '' || /^\d*\.?\d*$/.test(afterDiv)) {
          const nextChar = j < len ? expression[j] : '';
          // Если следующий символ — '(', значит это оператор деления, а не дробь
          if (nextChar === '(' || nextChar === MARKERS.COMPLEX_NUM_START) {
            // Не даем собрать дробь — оставляем как текст
            tokens.push({ type: 'text', value: candidate });
            i = j;
            continue;
          }
        }
      }

      // === LOOKAHEAD ОКНО ДЛЯ СЛУЧАЯ 1 (Незакрытые скобки) ===
      // Если сразу за числом идёт открывающая скобка '('
      if (j < len && expression[j] === '(') {

        // Крах двойной скобки здесь устранен, так как она вынесена наверх в начало главного цикла.
        // Оставляем логику для одиночной скобки из Шага 1, 3 и защиты Шага 5:

        // === ЗАЩИТА ШАГА 5 (Случай 6: Пустые скобки или мгновенный обрыв) ===
        if (j + 1 >= len || (expression[j + 1] === ')' && (j + 2 >= len || !expression.includes('÷')))) {
          const baseNum = expression.substring(i, j);
          tokens.push({ type: 'text', value: baseNum });
          tokens.push({ type: 'text', value: expression[j] });

          if (expression[j + 1] === ')') {
            tokens.push({ type: 'text', value: ')' });
            i = j + 2;
          } else {
            i = j + 1;
          }
          continue;
        }
        // === КОНЕЦ ЗАЩИТЫ ШАГА 5 ===

        let k = j + 1;
        let bracketContent = '';
        let openCount = 1;

        while (k < len) {
          if (expression[k] === '(') openCount++;
          if (expression[k] === ')') {
            openCount--;
            if (openCount === 0) { k++; break; }
          }
          bracketContent += expression[k];
          k++;
        }

        const hasSingleDiv = (bracketContent.match(/÷/g) || []).length === 1;
        const hasOtherOps = /[\+\-\*\/]/.test(bracketContent);

        if (hasSingleDiv && !hasOtherOps) {
          // === КЕЙС ШАГА 1 ===
          const parts = bracketContent.split('÷');
          const cleanNum = parts[0].replace(/[\(\)]/g, '').trim();
          const cleanDen = parts[1].replace(/[\(\)]/g, '').trim();
          const wholePart = expression.substring(i, j);

          tokens.push({
            type: 'fraction',
            whole: wholePart,
            num: cleanNum,
            den: cleanDen || '?'
          });

          i = k;
          continue;
        }
        else if (hasOtherOps || (bracketContent.match(/÷/g) || []).length > 1) {
          // === КЕЙС ШАГА 3 (Случай 3: Сложное выражение в скобках) ===
          const multiplier = expression.substring(i, j);
          tokens.push({ type: 'text', value: multiplier });
          tokens.push({ type: 'text', value: '*' });
          i = j;
          continue;
        }
      }
      // === КОНЕЦ LOOKAHEAD ОКНО ===

      if (j < len && expression[j] === MARKERS.WHOLE_START) {
        const endIdx = expression.indexOf(MARKERS.WHOLE_END, j);
        if (endIdx !== -1) {
          const fullMixed = expression.substring(i, endIdx + 1);
          const parsed = parseMixedFraction(fullMixed);
          if (parsed) {
            tokens.push({
              type: 'fraction',
              whole: parsed.whole,
              num: parsed.num,
              den: parsed.den
            });
            i = endIdx + 1;
            continue;
          }
        }
      }

      candidate = expression.substring(i, j);

      // ---- Проверка на дробь, где числитель содержит степень (например, 4^7÷3^5) ----
      if (j < len && expression[j] === '^') {
        let k = j + 1;
        let exponent = '';
        while (k < len && /[\d.]/.test(expression[k])) {
          exponent += expression[k];
          k++;
        }
        if (k < len && expression[k] === '÷') {
          // Собираем знаменатель (может содержать степень)
          let denStart = k + 1;
          let denEnd = denStart;
          // Сначала собираем число (цифры и точка)
          while (denEnd < len && /[\d.]/.test(expression[denEnd])) {
            denEnd++;
          }
          let denom = expression.substring(denStart, denEnd);
          // Проверяем, не идёт ли после числа знак '^' (степень знаменателя)
          if (denEnd < len && expression[denEnd] === '^') {
            let expStart = denEnd + 1;
            let expEnd = expStart;
            while (expEnd < len && /[\d.]/.test(expression[expEnd])) {
              expEnd++;
            }
            const expDen = expression.substring(expStart, expEnd);
            // Добавляем степень к знаменателю
            denom += toSuperscript(expDen);
            denEnd = expEnd;
          }
          const base = candidate; // число до '^'
          const numerator = base + toSuperscript(exponent);
          tokens.push({
            type: 'fraction',
            whole: undefined,
            num: numerator,
            den: denom
          });
          i = denEnd;
          continue;
        }
        // Если после показателя нет '÷', то не создаём дробь, идём дальше
      }

      if (candidate.includes(MARKERS.DIV) &&
        !candidate.includes(MARKERS.WHOLE_START) &&
        !candidate.includes(MARKERS.COMPLEX_NUM_START)) {

        // ===== Блокируем парсинг как дробь =====
        // Случай 1: "число÷(" — заканчивается на ÷ и следующий символ (
        const endsWithDiv = candidate.endsWith(MARKERS.DIV);
        const nextChar = j < len ? expression[j] : '';
        const isFollowedByOpenParen = nextChar === '(';

        // Случай 2: "(число÷(" — содержит паттерн ÷( 
        const hasDivFollowedByParen = candidate.includes(MARKERS.DIV + '(');

        // Если это признаки оператора деления со скобками, а не дроби
        if ((endsWithDiv && isFollowedByOpenParen) || hasDivFollowedByParen) {
          // Это НЕ дробь, а текст — отправляем как есть
          tokens.push({ type: 'text', value: candidate });
          i = j;
          continue;
        }

        // Иначе — пробуем распарсить как простую дробь (например, 3÷5)
        const parsed = parseSimpleFraction(candidate);
        if (parsed) {
          tokens.push({
            type: 'fraction',
            whole: undefined,
            num: parsed.num,
            den: parsed.den
          });
          i = j;
          continue;
        }
      }

      if (isNumber(candidate)) {
        tokens.push({ type: 'text', value: candidate });

        // === LOOKAHEAD ДЛЯ СЛУЧАЯ 2 (Скрытое умножение перед скобкой) ===
        if (candidate !== '-' && j < len && expression[j] === '(') {
          let k = j + 1;
          let bracketContent = '';
          let openCount = 1;

          while (k < len) {
            if (expression[k] === '(') openCount++;
            if (expression[k] === ')') {
              openCount--;
              if (openCount === 0) break;
            }
            bracketContent += expression[k];
            k++;
          }

          if (!bracketContent.includes('÷')) {
            tokens.push({ type: 'text', value: '*' });
          }
        }
        // === КОНЕЦ LOOKAHEAD ДЛЯ СЛУЧАЯ 2 ===

        i = j;
        continue;
      }
    }

    // 2.5. Обработка маркеров целой части и сложных выражений как видимых скобок
    if (ch === MARKERS.WHOLE_START || ch === MARKERS.COMPLEX_NUM_START) {
      // Отображаем как открывающую скобку '('
      tokens.push({ type: 'text', value: '(' });
      i++;
      continue;
    }
    if (ch === MARKERS.WHOLE_END || ch === MARKERS.COMPLEX_END) {
      // Отображаем как закрывающую скобку ')'
      tokens.push({ type: 'text', value: ')' });
      i++;
      continue;
    }

    // 3. ОБРАБОТКА СТЕПЕНИ (Изолированная и безопасная)
    if (ch === '^') {
      let j = i + 1;
      let exponentBuf = '';
      let parenDepth = 0;

      while (j < len) {
        const currentChar = expression[j];

        // Обработка открывающей скобки
        if (currentChar === '(') {
          parenDepth++;
          exponentBuf += currentChar;
          j++;
          continue;
        }
        // Обработка закрывающей скобки
        if (currentChar === ')') {
          parenDepth--;
          exponentBuf += currentChar;
          j++;
          if (parenDepth === 0) {
            // Закрывающая скобка завершила показатель – выходим из цикла
            break;
          }
          continue;
        }
        // Если мы внутри скобок (parenDepth > 0), разрешаем любые символы
        if (parenDepth > 0) {
          exponentBuf += currentChar;
          j++;
          continue;
        }
        // На нулевом уровне (вне скобок) разрешаем только цифры, точку и суперскрипт-символы
        if (/[\d.]/.test(currentChar) || '⁰¹²³⁴⁵⁶⁷⁸⁹⁻˙'.includes(currentChar)) {
          exponentBuf += currentChar;
          j++;
          continue;
        }
        // Любой другой символ на нулевом уровне – останавливаем сбор
        break;
      }

      if (exponentBuf.length > 0) {
        tokens.push({
          type: 'superscript',
          value: exponentBuf  // оставляем как есть (суперскрипт-символы уже присутствуют)
        });
      } else {
        tokens.push({
          type: 'text',
          value: '^'
        });
      }

      i = j;
      continue;
    }
    // 4. Обычные операторы и скобки
    if ('+-*/=()√÷'.includes(ch)) {
      tokens.push({ type: 'text', value: ch });
      i++;
      continue;
    }

    // 5. Предохранитель для пропуска неизвестных символов/пробелов
    i++;
  }

  // Склеиваем соседние текстовые токены, но ОСТАВЛЯЕМ операторы и скобки изолированными
  const merged = [];
  for (let k = 0; k < tokens.length; k++) {
    const current = tokens[k];
    const isIsolatedChar = (val) => /[\+\-\*\/÷\(\)\^=√]/.test(val);

    if (
      current.type === 'text' &&
      merged.length &&
      merged[merged.length - 1].type === 'text' &&
      !isIsolatedChar(current.value) &&
      !isIsolatedChar(merged[merged.length - 1].value)
    ) {
      merged[merged.length - 1] = {
        ...merged[merged.length - 1],
        value: merged[merged.length - 1].value + current.value
      };
    } else {
      merged.push({ ...current });
    }
  }
  return merged;
}