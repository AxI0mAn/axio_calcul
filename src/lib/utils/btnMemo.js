// src/lib/utils/btnMemo.js
import { appState } from '../store/appState.svelte.js';
import { convertFractionToDecimalIfNeeded } from './convertFractionToDecimalIfNeeded.js';


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
  // Проверяем, заканчивается ли дисплей оператором или корнем:
  const endsWithSqrt = appState.display.endsWith(sqrtSym) || appState.display.endsWith(sqrtSym + '(');
  // Проверяем, является ли последний символ оператором:
  const isOperator = ['+', '-', '*', '/'].includes(lastChar);

  // --- СЦЕНАРИЙ 1: Двойной клик (Извлечение копии без удаления) ---
  if (isDoubleClick && slot && !sourceData) {
    if (currentValueInMemo !== null) {
      // Преобразуем дробь в десятичную, если нужно
      let val = String(convertFractionToDecimalIfNeeded(currentValueInMemo));
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
    // 1. Получаем значение из ячейки с преобразованием дроби в десятичную (если нужно)
    let val = String(convertFractionToDecimalIfNeeded(currentValueInMemo));
    // 2. Очищаем от пробелов и суффикса "M*"
    let cleanVal = val.trim();
    if (cleanVal.at(-2) === 'M') {
      cleanVal = String(parseFloat(cleanVal));
    }
    // 3. Обрабатываем отрицательность: если число отрицательное, берём в скобки
    if (parseFloat(cleanVal) < 0) {
      val = `(${cleanVal})`;
    } else {
      val = cleanVal;
    }

    // --- НОВЫЙ БЛОК: РЕЖИМ ВВОДА ЗНАМЕНАТЕЛЯ ДРОБИ (только в дробном режиме) ---
    // Если дисплей заканчивается на '÷', значит мы вводим знаменатель.
    if (appState.now_mode === 'FRACTION' && appState.display.endsWith('÷')) {
      // Приклеиваем значение из памяти к дисплею (получится "12÷4")
      appState.display = appState.display + val;
      appState.isNewInput = false;
      // Очищаем память, если это не двойной клик
      if (!isDoubleClick) {
        appState.memoryUpdate(slot, null);
      }
      return;
    }

    // Условие: выражение заканчивается на '÷', дисплей пуст или '0',
    // и мы находимся в дробном режиме.
    if (appState.now_mode === 'FRACTION' &&
      appState.expression.endsWith('÷') &&
      (appState.display === '0' || appState.display === '')) {
      // Устанавливаем display как знаменатель
      appState.display = val;
      appState.isNewInput = false; // чтобы дальнейший ввод цифр добавлялся к знаменателю
      // Очищаем память, если это не двойной клик
      if (!isDoubleClick) {
        appState.memoryUpdate(slot, null);
      }
      // Логи для отладки (можно удалить после проверки)
      console.log('[btnMemo] Знаменатель установлен:', val);
      return; // выходим, не выполняя стандартную логику вставки
    }

    // --- СТАНДАРТНАЯ ЛОГИКА ВСТАВКИ (без изменений) ---
    // Определяем, есть ли оператор на конце дисплея или корень
    const lastChar = String(appState.display).slice(-1);
    const isOperator = ['+', '-', '*', '/'].includes(lastChar);

    // ЗОЛОТОЕ ПРАВИЛО:
    // 1. Если на экране оператор (30+) — ПРИКЛЕИВАЕМ (30+1)
    // 2. Если на экране 0 или флаг нового ввода (после "=" или записи) — ЗАМЕНЯЕМ
    // 3. Если на экране просто другое число (121) БЕЗ оператора — ЗАМЕНЯЕМ (предотвращаем конкатенацию)
    // 4. Если строка на экране заканчивается как √ или "√(" — добавляем цифры из памяти

    if (isOperator || endsWithSqrt) {
      appState.display = appState.display + val;
    } else {
      appState.display = val;
    }

    // После того как число извлечено, ставим false,
    // чтобы кнопка [+] могла забрать это число в expression.
    appState.isNewInput = false;

    // Очищаем память, если это не двойной клик
    if (!isDoubleClick) {
      appState.memoryUpdate(slot, null);
    }
  }
}

