// Объявляем модули для всех статических ассетов, которые мы импортируем.
// Мы говорим TypeScript, что импорт этих файлов вернет строковое значение (URL).

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: any;
  export default value;
}
// Добавьте сюда любые другие форматы, которые вы планируете импортировать (например, .mp4, .json)