import likeIcon from "../assets/icons/star-outline.svg"
import commentIcon from "../assets/icons/dialog-linear.svg"

function Post({data}) {
	const { title, content, owner, status, likes, comments, media } = data

	return (
		<article>
			{/* <img src={media[0].src} /> */}
			<section className="p-2 flex flex-col items-start gap-2">
				<p className="text-sm">Reclamo de {owner}</p>
				<div className={`${status === "en progreso" ? "bg-yellow-300": "bg-green-300"} text-sm px-1 rounded font-bold`} >{status}</div>
				<h3 className="text-xl">{title}</h3>
				<p className="">{content}</p>
				<div className="flex gap-4 [&>button]:flex [&>button]:gap-1 [&>button]:items-center text-sm">
					<button>
						<img src={likeIcon} width={24} />
						<span>{likes === 0 ? "Apoyar" : likes}</span>
						</button>
					<button>
						<img src={commentIcon} width={24} />
						<span>{comments === 0 ? "Comentar" : comments}</span>
						</button>
				</div>
			</section>
		</article>
	)
}
export default Post
