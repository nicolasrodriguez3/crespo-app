import google from "../assets/google.svg"
import facebook from "../assets/facebook.svg"
import email from "../assets/email.svg"

function Login() {
	return (
		<main className="login_form w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
			<div className="flex justify-center items-end grow">
				<img src="/chicken.svg" alt="Logo de la app" width={100}/>
			</div>
			<section className="flex flex-col gap-4  p-4 pb-28 text-xl">
				<p className="flex gap-3 items-center">
					<img src={google} alt="" width={32}/>
					<span>Iniciar sesión con Google</span>
				</p>
				<p className="flex gap-3 items-center">
					<img src={facebook} alt="" width={32}/>
					<span>Iniciar sesión con Facebook</span>
				</p>
				<p className="flex gap-3 items-center">
					<img src={email} alt="" width={32}/>
					<span>Iniciar sesión con tu email</span>
				</p>
			</section>
		</main>
	)
}
export default Login