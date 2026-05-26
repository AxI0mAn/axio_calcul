// src/lib/utils/btnMemo.js
import { appState } from '../store/appState.svelte.js';

/**
 * Логика работы кнопок памяти M1-M4
 * @param {string} slot - Имя ячейки ('M1', 'M2', 'M3', 'M4')
 * @param {boolean} isDoubleClick - Флаг двойного клика (копирование без удаления)
 * @param {string|null} sourceData - Данные из истории (если записываем из модалки)
 */
export function btnMemo(slot, isDoubleClick = false, sourceData = null) {
  // --- ПРОВЕРКА НА ERROR ---
  // Если мы пытаемся сохранить слово ERROR из истории
  if (sourceData && appState.extractResult(sourceData) === 'ERROR') {
    console.warn('Попытка сохранить ERROR из истории заблокирована');
    return;
  }
  // Если мы пытаемся сохранить слово ERROR из текущего дисплея
  if (!sourceData && appState.display === 'ERROR' && appState[slot] === null) {
    console.warn('Попытка сохранить ERROR с дисплея заблокирована');
    return;
  }

  const currentValueInMemo = appState[slot];
  const currentDisplay = String(appState.display);
  const lastChar = currentDisplay.slice(-1);
  const sqrtSym = String.fromCharCode(8730); //  Определяем символ корня √
  const endsWithSqrt = appState.display.endsWith(sqrtSym) || appState.display.endsWith(sqrtSym + '('); // Проверяем, заканчивается ли дисплей оператором или корнем 
  // Проверяем, является ли последний символ оператором
  const isOperator = ['+', '-', '*', '/'].includes(lastChar);

  // --- СЦЕНАРИЙ 1: Двойной клик (Извлечение копии без удаления) ---
  if (isDoubleClick && slot && !sourceData) {
    if (currentValueInMemo !== null) {
      let val = String(currentValueInMemo);
      // Сначала очищаем от пробелов
      let cleanVal = val.trim();
      // Если в конце конструкция с "M", извлекаем само число
      if (cleanVal.at(-2) === 'M') {
        cleanVal = String(parseFloat(cleanVal));
      }
      // Проверяем на отрицательность и берем в скобки
      if (parseFloat(cleanVal) < 0) {
        val = `(${cleanVal})`;
      } else {
        val = cleanVal;
      }
      if (isOperator) {
        appState.display = currentDisplay + val;
      } else {
        appState.display = val;
      }

      appState.isNewInput = false; // Блокируем склейку для следующего ввода
    }
    return;
  }

  // --- СЦЕНАРИЙ 2: Запись из ИСТОРИИ (Длинное нажатие на строку истории) ---
  if (sourceData) {
    const valueToSave = appState.extractResult(sourceData);
    const targetSlot = appState.firstEmptySlot;
    if (targetSlot) {
      appState.memoryUpdate(targetSlot, valueToSave);
      appState.historySession.push(`${valueToSave} → ${targetSlot}`);
    } else {
      appState.pendingMemoryValue = valueToSave;
      appState.isMemoModalOpen = true;
    }
    return;
  }

  // СЦЕНАРИЙ 3: Работа внутри МОДАЛКИ
  if (appState.isMemoModalOpen && appState.pendingMemoryValue) {
    appState.memoryUpdate(slot, appState.pendingMemoryValue);
    appState.historySession.push(`${appState.pendingMemoryValue} → ${slot}`);
    appState.isMemoModalOpen = false;
    appState.pendingMemoryValue = null;
    return;
  }


  // --- СЦЕНАРИЙ 4: КЛИК ПО КНОПКЕ ПАМЯТИ ---
  if (currentValueInMemo === null) {
    // ЗАПИСЬ: Сохраняем и блокируем склейку
    appState.memoryUpdate(slot, appState.display);
    appState.historySession.push(`${appState.display} → ${slot}`);
    appState.isNewInput = true;
  } else {
    // ВЫДАЧА (ИЗВЛЕЧЕНИЕ)
    let val = String(currentValueInMemo);
    const lastChar = String(appState.display).slice(-1);
    // const preLastChar = val.slice(-1);
    const isOperator = ['+', '-', '*', '/'].includes(lastChar);

    // избавляемся от -> М* и отрицательное число берём в скобки
    // Сначала очищаем от пробелов
    let cleanVal = val.trim();
    //  Если в конце конструкция с "M", извлекаем само число
    if (cleanVal.at(-2) === 'M') {
      // parseFloat сам заберет "-206" или "206" из начала строки
      cleanVal = String(parseFloat(cleanVal));
    }
    // Теперь проверяем на отрицательность (parseFloat преобразует строку в число для сравнения)
    if (parseFloat(cleanVal) < 0) {
      val = `(${cleanVal})`;
    } else {
      val = cleanVal;
    }

    // ЗОЛОТОЕ ПРАВИЛО:
    // 1. Если на экране оператор (30+) — ПРИКЛЕИВАЕМ (30+1)
    // 2. Если на экране 0 или флаг нового ввода (после "=" или записи) — ЗАМЕНЯЕМ
    // 3. Если на экране просто другое число (121) БЕЗ оператора — ЗАМЕНЯЕМ (предотвращаем конкатенацию)
    // 4. Если строка на экране заканчивается как  String.fromCharCode(8730) или "√(" ,то не заменить а добавить цифры из памяти

    if (isOperator || endsWithSqrt) {
      appState.display = currentDisplay + val;
    } else {
      appState.display = val;
    }

    // После того как число извлечено:
    // Мы ставим false, чтобы кнопка [+] увидела это число и смогла его забрать в expression.
    appState.isNewInput = false;

    // Очищаем память, если это не двойной клик
    if (!isDoubleClick) {
      appState.memoryUpdate(slot, null);
    }
  }
} 