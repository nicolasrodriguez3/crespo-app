import { HomeHeader } from "./HomeHeader"

export function WrapperUI({ children, title, backTo }) {
  return (
    <>
      <HomeHeader
        title={title}
        backTo={backTo}
      />
      <div className="mx-auto flex  w-full max-w-sm flex-col gap-4 px-2 pb-16 pt-4">
        {children}
      </div>
    </>
  )
}
