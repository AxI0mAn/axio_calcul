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
  // Если мы пытаемся сохранить данные из истории
  if (sourceData && appState.extractResult(sourceData) === 'ERROR') {
    console.warn('Попытка сохранить ERROR из истории заблокирована');
    return;
  }
  // Если мы пытаемся сохранить текущий дисплей
  if (!sourceData && appState.display === 'ERROR' && appState[slot] === null) {
    console.warn('Попытка сохранить ERROR с дисплея заблокирована');
    return;
  }
  const currentValueInMemo = appState[slot];
  const currentDisplay = String(appState.display);
  const lastChar = currentDisplay.slice(-1);

  // Проверяем, является ли последний символ оператором
  const isOperator = ['+', '-', '*', '/'].includes(lastChar);

  // --- СЦЕНАРИЙ 1: Двойной клик (Извлечение копии без удаления) ---
  if (isDoubleClick && slot && !sourceData) {
    if (currentValueInMemo !== null) {
      const val = String(currentValueInMemo);

      if (isOperator) {
        appState.display = currentDisplay + val;
      } else {
        appState.display = val;
      }

      appState.isNewInput = true; // Блокируем склейку для следующего ввода
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
    const val = String(currentValueInMemo);
    const lastChar = String(appState.display).slice(-1);
    const isOperator = ['+', '-', '*', '/'].includes(lastChar);

    // ЗОЛОТОЕ ПРАВИЛО:
    // 1. Если на экране оператор (30+) — ПРИКЛЕИВАЕМ (30+1)
    // 2. Если на экране 0 или флаг нового ввода (после "=" или записи) — ЗАМЕНЯЕМ
    // 3. Если на экране просто другое число (121) БЕЗ оператора — ЗАМЕНЯЕМ (предотвращаем конкатенацию)
    if (isOperator) {
      appState.display += val;
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