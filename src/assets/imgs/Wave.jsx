const Wave = ({
  width = "100%",
  height = "100px",
  fill = "#ffcc00",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 1280 107"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill={fill}>
      <path
        d="M0 51.76c36.21-2.25 77.57-3.58 126.42-3.58 320 0 320 57 640 57 271.15 0 312.58-40.91 513.58-53.4V0H0z"
        fillOpacity=".3"
      />
      <path
        d="M0 24.31c43.46-5.69 94.56-9.25 158.42-9.25 320 0 320 89.24 640 89.24 256.13 0 307.28-57.16 481.58-80V0H0z"
        fillOpacity=".5"
      />
      <path d="M0 0v3.4C28.2 1.6 59.4.59 94.42.59c320 0 320 84.3 640 84.3 285 0 316.17-66.85 545.58-81.49V0z" />
    </g>
  </svg>
)

export default Wave