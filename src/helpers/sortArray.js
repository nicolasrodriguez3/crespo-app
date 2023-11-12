export function sortArray(arr, field, order = "desc") {
  const sortedArray = arr.sort((a, b) => {
    if (order === "asc") {
      return a[field] - b[field]
    } else {
      return b[field] - a[field]
    }
  })
  return sortedArray
}
