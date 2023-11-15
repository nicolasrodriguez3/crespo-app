export function removeAccents(text) {
  const withAccents = 'áéíóúüñÁÉÍÓÚÜÑ';
  const withoutAccents = 'aeiouunAEIOUUN';

  return text
    .split('')
    .map((char) => {
      const index = withAccents.indexOf(char);
      return index !== -1 ? withoutAccents[index] : char;
    })
    .join('');
}