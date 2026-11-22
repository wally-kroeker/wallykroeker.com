import clsx from 'clsx'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  className?: string
}

// Plain HTML5 video. No autoplay. preload="metadata" so phones fetch only
// the header until the viewer presses play.
export default function VideoPlayer({ src, poster, title, className }: VideoPlayerProps) {
  return (
    <figure className={clsx('mt-6 w-full max-w-3xl', className)}>
      <video
        className="w-full h-auto rounded-2xl bg-black"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
      >
        Your browser cannot play this video. <a href={src}>Download it</a>.
      </video>
    </figure>
  )
}
