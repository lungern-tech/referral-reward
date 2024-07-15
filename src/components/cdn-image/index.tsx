import Image from "next/image";

const imageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export default function ({ src, width, height, alt, className }: { src: string, width: number, height: number, alt: string, className?: string }) {
  return <Image loader={imageLoader} src={src} width={width} height={height} alt={alt} className={className}></Image>
}