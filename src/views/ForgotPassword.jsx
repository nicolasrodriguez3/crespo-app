import { Button } from "@nextui-org/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import wave from "../assets/imgs/wave-top.svg"


export default function ForgotPassword() {
	const navigate = useNavigate()

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)


	const handleSubmit = async (e) => {
		setLoading(true)
		e.preventDefault()
		try {
			console.log(e)
			navigate("/")
		} catch (err) {
			const errorMsg = err.code
			setError(errorMsg)
		}
	}

	return (
		<main className="flex min-h-screen w-full flex-col items-center bg-gray-50">
      <div className="flex min-h-[150px]  w-full items-center justify-center bg-gradient-to-t from-[#ffcc00] to-gold pt-8">
        <img
          src="/chicken.svg"
          alt="Logo de la app"
          width={80}
        />
      </div>
      <section className="relative flex min-h-[40vh] w-full flex-col items-center gap-8 pb-8 pt-20">
        <img
          src={wave}
          width={"100%"}
          className="absolute top-0 block h-24 w-full"
        />
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
					{/* TODO */}
					{error && <p className="text-red-400">{error}</p>}
					<Button
						type="submit"
						className="bg-gold"
						isLoading={loading}
						spinner={
							<svg
								className="animate-spin h-5 w-5 text-current"
								fill="none"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<path
									className="opacity-75"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									fill="currentColor"
								/>
							</svg>
						}>
						Restablecer contraseña
					</Button>
				</form>
				<section>
				</section>
			</section>
		</main>
	)
}
