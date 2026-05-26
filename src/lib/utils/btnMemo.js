// src/lib/utils/btnMemo.js
import { appState } from '../store/appState.svelte.js';
import { appStore } from '$lib/store/appStore.svelte.js';
import FractionJS from 'fraction.js'; // Используется для красивой конвертации на обычных страницах

/**
 * Вспомогательная функция для перевода сохраненной дроби в десятичный вид с округлением
 */
function convertFractionIfNeeded(val) {
  // Если мы НЕ на странице дробей (isFractionMode === false), а в памяти лежит маркерная дробь
  if (!appState.isFractionMode && (val.includes('÷') || val.includes('\u2951'))) {
    try {
      // Регулярное выражение ищет маркеры \u2951 и \u294F, извлекая: целое (1), числитель (2), знаменатель (3)
      const match = val.match(/(?:(-?\d+)\u2951)?(-?\d+)÷(\d+)\u294F?/);

      if (match) {
        const whole = match[1] ? parseInt(match[1], 10) : 0;
        const num = parseInt(match[2], 10);
        const den = parseInt(match[3], 10);

        // Считаем точное значение с помощью fraction.js
        const sign = whole < 0 ? -1 : 1;
        const fObj = new FractionJS(whole).add(new FractionJS(sign * num, den));

        // Возвращаем чистое десятичное число, округленное по настройкам приложения
        return String(Number(fObj.valueOf().toFixed(appStore.toFix)));
      }
    } catch (e) {
      console.error("Ошибка конвертации дроби из памяти:", e);
    }
  }
  return val;
}

/**
 * Логика работы кнопок памяти M1-M4
 * @param {string} slot - Имя ячейки ('M1', 'M2', 'M3', 'M4')
 * @param {boolean} isDoubleClick - Флаг двойного клика (копирование без удаления)
 * @param {string|null} sourceData - Данные из истории (если записываем из модалки)
 */
export function btnMemo(slot, isDoubleClick = false, sourceData = null) {
  // --- ПРОВЕРКА НА ERROR ---
  if (sourceData && appState.extractResult(sourceData) === 'ERROR') {
    console.warn('Попытка сохранить ERROR из истории заблокирована');
    return;
  }
  if (!sourceData && appState.display === 'ERROR' && appState[slot] === null) {
    console.warn('Попытка сохранить ERROR с дисплея заблокирована');
    return;
  }

  const currentValueInMemo = appState[slot];
  const currentDisplay = String(appState.display);
  const lastChar = currentDisplay.slice(-1);
  const sqrtSym = String.fromCharCode(8730);
  const endsWithSqrt = appState.display.endsWith(sqrtSym) || appState.display.endsWith(sqrtSym + '(');
  const isOperator = ['+', '-', '*', '/'].includes(lastChar);

  // --- СЦЕНАРИЙ 1: Двойной клик (Извлечение копии без удаления) ---
  if (isDoubleClick && slot && !sourceData) {
    if (currentValueInMemo !== null) {
      let val = String(currentValueInMemo);

      // Автоматическая конвертация дроби в float, если ушли с экрана дробей
      val = convertFractionIfNeeded(val);

      let cleanVal = val.trim();
      if (cleanVal.at(-2) === 'M') {
        cleanVal = String(parseFloat(cleanVal));
      }
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

      appState.isNewInput = false;
    }
    return;
  }

  // --- СЦЕНАРИЙ 2: Запись из ИСТОРИИ ---
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
    // Сохраняем значение дисплея "как есть" (если это дробь — она сохранится с невидимыми маркерами)
    appState.memoryUpdate(slot, appState.display);
    appState.historySession.push(`${appState.display} → ${slot}`);
    appState.isNewInput = true;
  } else {
    let val = String(currentValueInMemo);

    // Автоматическая конвертация дроби в float, если ушли с экрана дробей
    val = convertFractionIfNeeded(val);

    let cleanVal = val.trim();
    if (cleanVal.at(-2) === 'M') {
      cleanVal = String(parseFloat(cleanVal));
    }
    if (parseFloat(cleanVal) < 0) {
      val = `(${cleanVal})`;
    } else {
      val = cleanVal;
    }

    if (isOperator || endsWithSqrt) {
      appState.display = currentDisplay + val;
    } else {
      appState.display = val;
    }

    appState.isNewInput = false;

    // Очищаем ячейку после извлечения (обычный клик)
    if (!isDoubleClick) {
      appState.memoryUpdate(slot, null);
    }
  }
}