export function validateFilename(fileName) {
  // Get the file extension
  const extension = fileName.split(".").pop().toLowerCase()

  // List of allowed extensions
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]

  // Check if the extension is in the list of allowed extensions
  if (allowedExtensions.includes(extension)) {
    return true // The file is a valid image
  }

  return false // The file is not a valid image
}
