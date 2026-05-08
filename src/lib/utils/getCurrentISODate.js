/**
 * Возвращает текущую дату и время в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns {string}
 */

export function getCurrentISODate() {
  return new Date().toISOString();
}

// console.log(getCurrentISODate()); 
// Пример вывода: "2026-05-08T14:54:13.000Z"