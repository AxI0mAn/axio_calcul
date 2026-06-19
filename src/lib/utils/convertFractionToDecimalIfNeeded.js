/**
 * src/lib/utils/convertFractionToDecimalIfNeeded.js
 * Преобразует строковое значение из ячейки памяти в десятичное число,
 * если текущий режим не дробный (FRACTION) и значение содержит дробь.
 * @param {string|number} value - значение из ячейки
 * @returns {string} - преобразованная строка или исходное значение
 */
import { appState } from "$lib/store/appState.svelte";
import Fraction from "fraction.js";

export function convertFractionToDecimalIfNeeded(value) {
  // Если режим дробный – оставляем как есть
  if (appState.now_mode === 'FRACTION') return String(value);

  const str = String(value);
  // Если нет символов дроби – оставляем
  if (!str.includes('÷') && !str.includes('⥑')) return str;

  try {
    // Заменяем маркеры на формат, понятный Fraction.js
    const normalized = str.replace(/⥑/g, ' ').replace(/÷/g, '/').replace(/⥏/g, '');
    const frac = new Fraction(normalized);
    return String(frac.valueOf());
  } catch {
    // В случае ошибки парсинга оставляем исходное значение
    return str;
  }
}