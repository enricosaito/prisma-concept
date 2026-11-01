"use client"

import * as React from "react"
import {
  RiFullscreenExitLine,
  RiFullscreenLine,
  RiPauseFill,
  RiPlayFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
} from "@remixicon/react"

import { cn } from "@/lib/utils"

/** How long the controls stay up after the pointer stops, while playing. */
const IDLE_MS = 2200

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/**
 * Um vídeo dentro da carta, com controles próprios no lugar dos do navegador:
 * os nativos mudam de cara a cada navegador e, no claro, brigavam com a
 * página.
 *
 * Antes do primeiro play, só o pôster e um botão redondo no centro. Depois,
 * uma barra no pé — play, linha do tempo, tempo, som e tela cheia — sobre um
 * degradê escuro, para que o branco dos controles leia sobre qualquer quadro.
 * Ela some sozinha enquanto o vídeo roda e o ponteiro está parado, e fica à
 * vista com o vídeo pausado.
 *
 * `preload="metadata"`: a carta não baixa o vídeo inteiro só por abrir, só a
 * duração e o primeiro quadro; o resto vem quando o leitor dá play.
 */
function VideoPlayer({
  src,
  poster,
  title,
  className,
}: {
  src: string
  poster?: string
  /** Nome acessível do player, para quem não vê o quadro. */
  title: string
  className?: string
}) {
  const frame = React.useRef<HTMLDivElement>(null)
  const video = React.useRef<HTMLVideoElement>(null)
  const idle = React.useRef<number>(0)

  const [started, setStarted] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [muted, setMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [active, setActive] = React.useState(true)

  React.useEffect(() => {
    // The metadata can arrive before hydration attaches `onLoadedMetadata`,
    // and then the event never reaches React: read the duration once here.
    const ready = requestAnimationFrame(() => {
      const v = video.current
      if (v && v.readyState >= 1) setDuration(v.duration)
    })
    const onChange = () =>
      setFullscreen(document.fullscreenElement === frame.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => {
      cancelAnimationFrame(ready)
      document.removeEventListener("fullscreenchange", onChange)
      window.clearTimeout(idle.current)
    }
  }, [])

  // Any movement brings the controls back; a pause in it hides them again,
  // but only while the video plays — paused, they stay.
  const wake = () => {
    setActive(true)
    window.clearTimeout(idle.current)
    idle.current = window.setTimeout(() => setActive(false), IDLE_MS)
  }

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused || v.ended) void v.play()
    else v.pause()
  }

  const seek = (value: number) => {
    const v = video.current
    if (!v) return
    v.currentTime = value
    setCurrent(value)
  }

  const toggleMute = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    // Unmuting at zero volume would still be silent.
    if (!v.muted && v.volume === 0) v.volume = 1
  }

  const changeVolume = (value: number) => {
    const v = video.current
    if (!v) return
    v.volume = value
    v.muted = value === 0
  }

  const toggleFullscreen = () => {
    const el = frame.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (el.requestFullscreen) void el.requestFullscreen()
    // iOS Safari has no element fullscreen, only the video's own.
    else
      (
        video.current as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void
        }
      )?.webkitEnterFullscreen?.()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Only when the player itself has focus: the buttons and sliders inside
    // handle their own keys.
    if (event.target !== event.currentTarget) return
    if (event.key === " " || event.key === "k") {
      event.preventDefault()
      toggle()
    }
  }

  const showBar = started && (!playing || active)
  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div
      ref={frame}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={wake}
      onPointerLeave={() => playing && setActive(false)}
      className={cn(
        "group/player relative aspect-video overflow-hidden rounded-[1rem] bg-black outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:rounded-[1.25rem]",
        fullscreen && "rounded-none",
        playing && !active && "cursor-none",
        className
      )}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => {
          setStarted(true)
          setPlaying(true)
          wake()
        }}
        onPause={() => setPlaying(false)}
        onEnded={(e) => {
          // Back to the opening screen: `load()` rewinds and brings the
          // poster back, which seeking to zero alone would not (it would
          // show frame one), and the big play button returns with it.
          e.currentTarget.load()
          setPlaying(false)
          setStarted(false)
          setCurrent(0)
          window.clearTimeout(idle.current)
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted)
          setVolume(e.currentTarget.volume)
        }}
        className="size-full object-contain"
      />

      {/* O botão grande, só antes do primeiro play. */}
      {!started ? (
        <button
          type="button"
          onClick={toggle}
          aria-label="Reproduzir vídeo"
          className="absolute inset-0 grid place-items-center outline-none"
        >
          <span className="grid size-16 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform duration-200 group-hover/player:scale-105 sm:size-20">
            {/* Sem deslocamento: o desenho do Remix já põe o triângulo à
                direita no próprio quadro (vai de x=8 a 19.4 num quadro de
                24), o que deixa o centro de massa dele no meio do círculo — o
                centro óptico. O `ml-1` que havia aqui empurrava de novo, e o
                play parecia caído para a direita. */}
            <RiPlayFill className="size-8 sm:size-9" />
          </span>
        </button>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-black/75 to-transparent px-3 pt-10 pb-2.5 text-white transition-opacity duration-200 sm:gap-4 sm:px-4 sm:pb-3",
          showBar ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproduzir"}
          className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {playing ? (
            <RiPauseFill className="size-6" />
          ) : (
            <RiPlayFill className="size-6" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={current}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Linha do tempo"
          aria-valuetext={`${formatTime(current)} de ${formatTime(duration)}`}
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
          className="video-range min-w-0 flex-1"
        />

        <span className="shrink-0 font-sans text-sm tabular-nums">
          {formatTime(current)}
          <span className="text-white/60"> / {formatTime(duration)}</span>
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {muted || volume === 0 ? (
            <RiVolumeMuteFill className="size-5" />
          ) : (
            <RiVolumeUpFill className="size-5" />
          )}
        </button>
        {/* O volume fino só onde há mouse: no celular o volume é o do
            aparelho, e a linha só tomaria espaço da linha do tempo. */}
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={muted ? 0 : volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          aria-label="Volume"
          style={
            {
              "--progress": `${(muted ? 0 : volume) * 100}%`,
            } as React.CSSProperties
          }
          className="video-range hidden w-16 shrink-0 sm:block lg:w-20"
        />

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {fullscreen ? (
            <RiFullscreenExitLine className="size-5" />
          ) : (
            <RiFullscreenLine className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export { VideoPlayer }
