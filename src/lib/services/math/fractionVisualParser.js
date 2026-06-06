/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionVisualParser.js
 * fractionVisualParser.js — токенизатор, который различает простые дроби число÷число и смешанные целое⥑числитель÷знаменатель⥏, а также обрабатывает операторы.
 * Преобразует строку с математическими выражениями и спецсимволами в массив токенов для рендеринга двухэтажных дробей и плоских выражений.
 */

import { fromSuperscript } from "$lib/utils/toSuperscript";

// Специальные символы (определены в ТЗ)
const MARKERS = {
  WHOLE_START: '\u2951', // ⥑
  WHOLE_END: '\u294F',   // ⥏
  COMPLEX_NUM_START: '\u297E', // ⥾
  COMPLEX_END: '\u297F',       // ⥿
  DIV: '÷'
};

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
    num: numPart,
    den: denPart
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
  const numPart = str.substring(0, divIndex);
  const denPart = str.substring(divIndex + 1);
  // Не должно быть вложенных маркеров внутри
  if (numPart.includes(MARKERS.DIV) || denPart.includes(MARKERS.DIV)) return null;
  return { num: numPart, den: denPart };
}

/**
 * Удаляет технические маркеры из строки для плоского отображения
 * @param {string} str
 * @returns {string}
 */
export function stripMarkers(str) {
  return str
    .replace(new RegExp(`[${MARKERS.WHOLE_START}${MARKERS.WHOLE_END}${MARKERS.COMPLEX_NUM_START}${MARKERS.COMPLEX_END}]`, 'g'), '')
    ; //.replace(/÷/g, '/'); // если .replace(/÷/g, '/'); то вместо ÷ будет /
}

/**
 * console.log(parseExpressionToTokens("3(1÷2)")
 * Основная функция: преобразует выражение в массив токенов для рендеринга.
 * Каждый токен: { type: 'text', value: string } или { type: 'fraction', whole?: string, num: string, den: string }
 * @param {string} expression
 * @returns {Array<{type: string, value?: string, whole?: string, num?: string, den?: string}>}
 */
export function parseExpressionToTokens(expression) {
  if (!expression || expression.trim() === '') return [];

  const tokens = [];
  let i = 0;
  const len = expression.length;

  while (i < len) {
    const ch = expression[i];

    // =========================================================================
    // ПРОВЕРКА НА СОСТАВНУЮ ДРОБЬ (С ЦЕЛОЙ ЧАСТЬЮ ИЛИ БЕЗ): паттерн (( числитель ))
    // =========================================================================
    if (ch === '(' && i + 1 < len && expression[i + 1] === '(') {
      // 1. Динамически вычисляем целую часть перед текущей позицией '((', если она есть
      let j = i - 1;
      while (j >= 0 && (expression[j].match(/[\d.]/) || expression[j] === '-')) {
        // Прерываем сбор целой части, если упёрлись в оператор (кроме унарного минуса на старте)
        if (expression[j] === '-' && j > 0 && !'+*/=([√÷'.includes(expression[j - 1])) {
          break;
        }
        j--;
      }
      let wholePart = expression.substring(j + 1, i).trim();

      let k = i + 2; // Пропускаем стартовые технологические скобки '(('
      let numeratorBuf = '';
      let numBracketBalance = 2;
      let closedNumIdx = -1;

      // Шаг 1: Ищем физическое закрытие технологических скобок числителя )) по балансу
      while (k < len) {
        const numChar = expression[k];

        if (numChar === '(') numBracketBalance++;
        if (numChar === ')') numBracketBalance--;

        // Записываем символ в буфер числителя ТОЛЬКО если это внутренний контент,
        // а не финальная закрывающая скобка числителя ))
        if (numBracketBalance > 0 || numChar !== ')') {
          numeratorBuf += numChar;
        }

        if (numBracketBalance === 0) {
          closedNumIdx = k; // closedNumIdx указывает строго на вторую закрывающую скобку ')'
          k++; // Сдвигаем k за пределы числителя
          break;
        }
        k++;
      }

      // Шаг 2: Ищем знак деления строго НАЧИНАЯ с позиции сразу за закрывающей скобкой числителя
      let hasMainDiv = false;
      let divPosition = -1;

      if (closedNumIdx !== -1) {
        // Начинаем сканирование со следующего символа после ')'
        for (let scan = closedNumIdx + 1; scan < len; scan++) {
          const scanChar = expression[scan];

          if (scanChar === '÷' || scanChar === '/') {
            hasMainDiv = true;
            divPosition = scan; // Зафиксировали точную позицию знака деления
            break;
          }

          // Разрешаем проходить ТОЛЬКО через пробелы или открывающиеся скобки знаменателя
          if (scanChar !== ' ' && scanChar !== '(') {
            break;
          }
        }
      }

      // Шаг 3: Если знак деления обнаружен — строим двухэтажный токен дроби
      if (hasMainDiv && divPosition !== -1) {
        let cleanNum = numeratorBuf.trim();
        if (cleanNum.endsWith(')')) cleanNum = cleanNum.slice(0, -1).trim();

        // Знаменатель — это строго всё, что находится ПОСЛЕ найденного знака деления
        let denominatorBuf = expression.substring(divPosition + 1).trim();
        let cleanDen = denominatorBuf;

        // УМНАЯ ОЧИСТКА ЗНАМЕНАТЕЛЯ: убираем только внешние скобки, если они ЕСТЬ.
        // Если там просто число "5", этот код ничего не тронет и сохранит его.
        if (cleanDen.startsWith('((') && cleanDen.endsWith('))')) {
          cleanDen = cleanDen.substring(2, cleanDen.length - 2);
        } else if (cleanDen.startsWith('(') && cleanDen.endsWith(')')) {
          cleanDen = cleanDen.substring(1, cleanDen.length - 1);
        }

        cleanDen = cleanDen.trim();

        // Если знаменатель пустой (только что нажали ÷)
        if (!cleanDen || cleanDen.length === 0 || /^[\(\s]+$/.test(cleanDen)) {
          cleanDen = '?';
        }

        // Удаляем целую часть из текста, если она была перед скобками
        if (wholePart.length > 0) {
          let charsToRemove = wholePart.length;
          while (charsToRemove > 0 && tokens.length > 0) {
            let lastToken = tokens[tokens.length - 1];
            if (lastToken.type === 'text') {
              if (lastToken.value.length <= charsToRemove) {
                charsToRemove -= lastToken.value.length;
                tokens.pop();
              } else {
                lastToken.value = lastToken.value.substring(0, lastToken.value.length - charsToRemove);
                charsToRemove = 0;
              }
            } else {
              break;
            }
          }
        }

        // Пушим единый токен двухэтажной дроби
        tokens.push({
          type: 'fraction',
          whole: wholePart || undefined, // Будет числом для "7((2+8))÷..." и undefined для остальные кейсов
          num: cleanNum || '?',
          den: cleanDen
        });

        // 1. Вычисляем полную длину строки от начала целой части (или первой скобки) до конца знаменателя
        // divPosition + 1 дает позицию начала знаменателя, прибавляем к ней полную длину строки знаменателя
        i = divPosition + 1 + denominatorBuf.length;

        continue;
      }
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

      const candidate = expression.substring(i, j);

      if (candidate.includes(MARKERS.DIV) &&
        !candidate.includes(MARKERS.WHOLE_START) &&
        !candidate.includes(MARKERS.COMPLEX_NUM_START)) {
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

    // 3. ОБРАБОТКА СТЕПЕНИ (Изолированная и безопасная)
    if (ch === '^') {
      let j = i + 1;
      let exponentBuf = '';

      while (j < len && (
        /[\d.()÷]/.test(expression[j]) ||
        '⁰¹²³⁴⁵⁶⁷⁸⁹⁻˙'.includes(expression[j])
      )) {
        exponentBuf += expression[j];
        j++;
      }

      if (exponentBuf.length > 0) {
        tokens.push({
          type: 'superscript',
          value: fromSuperscript(exponentBuf)
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




// Экспортируем алиас для совместимости с DisFraction (ожидает parseExpressionToHtml)
export const parseExpressionToHtml = parseExpressionToTokens;