export function validateErrorOnAuth(error) {
	switch (error) {
		case "auth/user-not-found":
			return "El usuario no existe."

		case "auth/wrong-password":
			return "La contraseña no es válida."

		case "auth/missing-password":
			return "Ingrese su contraseña."

		case "auth/invalid-email":
			return "El email no es válido."

		case "auth/popup-closed-by-user":
			return "Ventana de login cerrada"

		case "auth/weak-password":
			return "La contraseña debe tener al menos 6 caracteres."

		case "auth/email-already-in-use":
			return "El email ya se encuentra registrado."

		default:
			console.error(error)
			return "Ocurrió un error. Por favor, intente nuevamente más tarde."
	}
}
