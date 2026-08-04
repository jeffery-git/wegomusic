import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DeferredCircularGallery from './components/DeferredCircularGallery'
import './style.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

const R2_MEDIA_BASE_URL = 'https://pub-24cc0383e0514b31b33e7bfc05fd270c.r2.dev'
const toR2MediaUrl = (path) => path?.startsWith('/library/') ? `${R2_MEDIA_BASE_URL}${path}` : path
const rawTracks = [
  { id: 101, type: 'electronic', title: 'Frozen Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/frozen-echoes.png', audio: '/library/audio/frozen-echoes.wav' },
  { id: 102, type: 'electronic', title: 'Mountain Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/mountain-echoes.png', audio: '/library/audio/mountain-echoes.wav' },
  { id: 103, type: 'electronic', title: 'Nativara', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/nativara.png', audio: '/library/audio/nativara.wav' },
  { id: 104, type: 'electronic', title: 'Star Trails', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/star-trails.png', audio: '/library/audio/star-trails.wav' },
  { id: 105, type: 'electronic', title: 'Universe Loop', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/universe-loop.png', audio: '/library/audio/universe-loop.wav' },
  { id: 106, type: 'vocal-pop', title: 'Cosmic Breeze', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/cosmic-breeze.png', audio: '/library/audio/cosmic-breeze.wav' },
  { id: 107, type: 'vocal-pop', title: 'Midnight Groove', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/midnight-groove.png', audio: '/library/audio/midnight-groove.wav' },
  { id: 108, type: 'vocal-pop', title: 'Neon Coast', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/neon-coast.png', audio: '/library/audio/neon-coast.wav' },
  { id: 109, type: 'vocal-pop', title: 'Ripple', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/ripple.png', audio: '/library/audio/ripple.wav' },
  { id: 110, type: 'romantic', title: 'Cloud Reverie', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/cloud-reverie.png', audio: '/library/audio/cloud-reverie.wav' },
  { id: 111, type: 'romantic', title: 'Midnight Circuit', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/midnight-circuit.png', audio: '/library/audio/midnight-circuit.wav' },
  { id: 112, type: 'romantic', title: 'Neon Breeze', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/neon-breeze.png', audio: '/library/audio/neon-breeze.wav' },
  { id: 113, type: 'romantic', title: 'Orbital Self', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/orbital-self.png', audio: '/library/audio/orbital-self.wav' },
  { id: 114, type: 'romantic', title: 'Starlight Harbor', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/starlight-harbor.png', audio: '/library/audio/starlight-harbor.wav' },
  { id: 115, type: 'electronic', title: 'afterlight', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/afterlight.png', audio: '/library/audio/afterlight.wav' },
  { id: 116, type: 'electronic', title: 'Wilderness Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/wilderness-echoes.png', audio: '/library/audio/wilderness-echoes.wav' },
  { id: 117, type: 'romantic', title: 'Empty Station', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/empty-station.png', audio: '/library/audio/empty-station.wav' },
  { id: 118, type: 'romantic', title: 'Invisible City', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/invisible-city.png', audio: '/library/audio/invisible-city.wav' },
  { id: 119, type: 'romantic', title: 'Last Summer', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/last-summer.png', audio: '/library/audio/last-summer.wav' },
  { id: 120, type: 'romantic', title: 'Neon Dreams', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/neon-dreams.png', audio: '/library/audio/neon-dreams.wav' },
  { id: 121, type: 'romantic', title: 'Neon Rain', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/neon-rain.png', audio: '/library/audio/neon-rain.wav' },
  { id: 122, type: 'romantic', title: 'Polaroid Drift', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/polaroid-drift.png', audio: '/library/audio/polaroid-drift.wav' },
  { id: 123, type: 'romantic', title: 'Slow Morning', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/slow-morning.png', audio: '/library/audio/slow-morning.wav' },
  { id: 124, type: 'romantic', title: 'Weekend Drive', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/weekend-drive.png', audio: '/library/audio/weekend-drive.wav' },
  { id: 125, type: 'electronic', mood: 'soft', title: 'Gravity Check', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/gravity-check.png', audio: '/library/audio/gravity-check.wav' },
  { id: 126, type: 'electronic', mood: 'soft', title: 'Orange Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/orange-echoes.png', audio: '/library/audio/orange-echoes.wav' },
  { id: 127, type: 'electronic', mood: 'soft', title: 'Silver Horizon', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/silver-horizon.png', audio: '/library/audio/silver-horizon.wav' },
  { id: 128, type: 'electronic', mood: 'soft', title: 'Sunset Drive', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/sunset-drive.png', audio: '/library/audio/sunset-drive.wav' },
  { id: 129, type: 'electronic', mood: 'soft', title: 'Wild Ascent', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/wild-ascent.png', audio: '/library/audio/wild-ascent.wav' },
  { id: 130, type: 'electronic', mood: 'soft', title: 'Blue Ceiling', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/blue-ceiling.png', audio: '/library/audio/blue-ceiling.wav' },
  { id: 131, type: 'electronic', mood: 'soft', title: 'Cheerful Weekend', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/cheerful-weekend.png', audio: '/library/audio/cheerful-weekend.wav' },
  { id: 132, type: 'electronic', mood: 'soft', title: 'Dreamscape', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/dreamscape.png', audio: '/library/audio/dreamscape.wav' },
  { id: 133, type: 'electronic', mood: 'soft', title: 'Mirror Sky', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/mirror-sky.png', audio: '/library/audio/mirror-sky.wav' },
  { id: 134, type: 'electronic', mood: 'soft', title: 'Neon Drift', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/neon-drift.png', audio: '/library/audio/neon-drift.wav' },
  { id: 135, type: 'electronic', mood: 'soft', title: 'Paper Moon Frame', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/paper-moon-frame.png', audio: '/library/audio/paper-moon-frame.wav' },
  { id: 136, type: 'electronic', mood: 'soft', title: 'Rain Cathedral', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/rain-cathedral.png', audio: '/library/audio/rain-cathedral.wav' },
  { id: 137, type: 'electronic', mood: 'soft', title: 'Sky Haven', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/sky-haven.png', audio: '/library/audio/sky-haven.wav' },
  { id: 138, type: 'electronic', mood: 'soft', title: 'Sunset Glow', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/sunset-glow.png', audio: '/library/audio/sunset-glow.wav' },
  { id: 139, type: 'electronic', mood: 'soft', title: 'White Bell', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/white-bell.png', audio: '/library/audio/white-bell.wav' },
  { id: 140, type: 'electronic', mood: 'soft', title: 'Wonderful Everyday Life', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/wonderful-everyday-life.png', audio: '/library/audio/wonderful-everyday-life.wav' },
  { id: 141, type: 'electronic', mood: 'soft', title: '未来の角で', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/future-corner.png', audio: '/library/audio/future-corner.wav' },
  { id: 142, type: 'vocal-pop', title: 'ASCENT', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/ascent.png', audio: '/library/audio/ascent.wav' },
  { id: 143, type: 'electronic', mood: 'soft', title: 'Mountain Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/mountain-echoes-soft.png', audio: '/library/audio/mountain-echoes-soft.wav' },
  { id: 144, type: 'electronic', mood: 'soft', title: 'Snow Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/snow-echoes.png', audio: '/library/audio/snow-echoes.wav' },
  { id: 145, type: 'romantic', title: 'After Rain', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/after-rain.png', audio: '/library/audio/after-rain.wav' },
  { id: 146, type: 'romantic', title: 'Harbor Glow', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/harbor-glow.png', audio: '/library/audio/harbor-glow.wav' },
  { id: 147, type: 'electronic', mood: 'soft', title: 'Half A Beat', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/half-a-beat.png', audio: '/library/audio/half-a-beat.wav' },
  { id: 148, type: 'electronic', mood: 'soft', title: 'Nightfloor', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/nightfloor.png', audio: '/library/audio/nightfloor.wav' },
  { id: 149, type: 'electronic', mood: 'soft', title: 'One Beat Away', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/one-beat-away.png', audio: '/library/audio/one-beat-away.wav' },
  { id: 150, type: 'electronic', mood: 'soft', title: 'Starwalk', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/starwalk.png', audio: '/library/audio/starwalk.wav' },
  { id: 151, type: 'electronic', title: 'Pulse', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/pulse.png', audio: '/library/audio/pulse.wav' },
  { id: 152, type: 'electronic', title: 'Pulse Eight', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/pulse-eight.png', audio: '/library/audio/pulse-eight.wav' },
  { id: 153, type: 'electronic', title: 'Reggae Night', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/reggae-night.png', audio: '/library/audio/reggae-night.wav' },
  { id: 154, type: 'electronic', title: 'Rise', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/rise.png', audio: '/library/audio/rise.wav' },
  { id: 155, type: 'electronic', title: 'Sacred Mountain', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/sacred-mountain.png', audio: '/library/audio/sacred-mountain.wav' },
  { id: 156, type: 'electronic', title: 'Swing Till Dawn', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/swing-till-dawn.png', audio: '/library/audio/swing-till-dawn.wav' },
  { id: 157, type: 'electronic', title: 'Track', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/track.png', audio: '/library/audio/track.wav' },
  { id: 158, type: 'electronic', title: 'Velvet Night', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/velvet-night.png', audio: '/library/audio/velvet-night.wav' },
  { id: 159, type: 'electronic', title: 'VIBE', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/vibe.png', audio: '/library/audio/vibe.wav' },
  { id: 160, type: 'electronic', title: 'button', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/button.png', audio: '/library/audio/button.wav' },
  { id: 161, type: 'electronic', title: 'Cosmic Dawn', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/cosmic-dawn.png', audio: '/library/audio/cosmic-dawn.wav' },
  { id: 162, type: 'electronic', title: 'Echo Valley', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/echo-valley.png', audio: '/library/audio/echo-valley.wav' },
  { id: 163, type: 'electronic', title: 'Electric Pulse', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/electric-pulse.png', audio: '/library/audio/electric-pulse.wav' },
  { id: 164, type: 'electronic', title: 'Gongga', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/gongga.png', audio: '/library/audio/gongga.wav' },
  { id: 165, type: 'electronic', title: 'Hyper Run', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/hyper-run.png', audio: '/library/audio/hyper-run.wav' },
  { id: 166, type: 'electronic', title: 'Lion Dance', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/lion-dance.png', audio: '/library/audio/lion-dance.wav' },
  { id: 167, type: 'electronic', title: 'Lurking', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/lurking.png', audio: '/library/audio/lurking.wav' },
  { id: 168, type: 'electronic', title: 'MARS', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/mars.png', audio: '/library/audio/mars.wav' },
  { id: 169, type: 'electronic', title: 'Namcha Barwa', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/namcha-barwa.png', audio: '/library/audio/namcha-barwa.wav' },
  { id: 170, type: 'vocal-pop', title: 'Close Enough', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/close-enough.png', audio: '/library/audio/close-enough.wav', lyrics: '/library/lyrics/close-enough.lrc' },
  { id: 171, type: 'vocal-pop', title: 'Fading Echoes', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/fading-echoes.png', audio: '/library/audio/fading-echoes.wav', lyrics: '/library/lyrics/fading-echoes.lrc' },
  { id: 172, type: 'vocal-pop', title: 'Neon Summer', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/neon-summer.png', audio: '/library/audio/neon-summer.wav', lyrics: '/library/lyrics/neon-summer.lrc' },
  { id: 173, type: 'vocal-pop', title: 'Right Here', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/right-here.png', audio: '/library/audio/right-here.wav', lyrics: '/library/lyrics/right-here.lrc' },
  { id: 174, type: 'vocal-pop', title: 'Run to You', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/run-to-you.png', audio: '/library/audio/run-to-you.wav', lyrics: '/library/lyrics/run-to-you.lrc' },
  { id: 175, type: 'vocal-pop', title: 'Stay Tonight', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/stay-tonight.png', audio: '/library/audio/stay-tonight.wav', lyrics: '/library/lyrics/stay-tonight.lrc' },
  { id: 176, type: 'vocal-pop', title: 'WEGO', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/wego-song.png', audio: '/library/audio/wego-song.wav', lyrics: '/library/lyrics/wego-song.lrc' },
  { id: 177, type: 'vocal-pop', title: '刚好的距离', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/just-right-distance.png', audio: '/library/audio/just-right-distance.wav', lyrics: '/library/lyrics/just-right-distance.lrc' },
  { id: 178, type: 'vocal-pop', title: '靠近一点', artist: 'WEGO MUSIC', time: '—', genre: 'VOCAL POP', image: '/library/covers/come-closer.png', audio: '/library/audio/come-closer.wav', lyrics: '/library/lyrics/come-closer.lrc' },
  { id: 179, type: 'electronic', mood: 'soft', title: 'Backseat Moon', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/backseat-moon.png', audio: '/library/audio/backseat-moon.wav' },
  { id: 180, type: 'electronic', mood: 'soft', title: 'Butterflies Over Sunset', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/butterflies-over-sunset.png', audio: '/library/audio/butterflies-over-sunset.wav' },
  { id: 181, type: 'electronic', mood: 'soft', title: 'Golden Hour Circuit', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/golden-hour-circuit.png', audio: '/library/audio/golden-hour-circuit.wav' },
  { id: 182, type: 'electronic', mood: 'soft', title: 'Moonlit Passenger', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/moonlit-passenger.png', audio: '/library/audio/moonlit-passenger.wav' },
  { id: 183, type: 'electronic', mood: 'soft', title: 'Velvet Glass Tide', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/velvet-glass-tide.png', audio: '/library/audio/velvet-glass-tide.mp3' },
  { id: 184, type: 'electronic', mood: 'soft', title: 'Summerglass Promise', artist: 'WEGO MUSIC', time: '—', genre: 'ELECTRONIC MOTION', image: '/library/covers/summerglass-promise.png', audio: '/library/audio/summerglass-promise.wav' },
  { id: 185, type: 'romantic', title: 'Street Fantasy', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/street-fantasy.png', audio: '/library/audio/street-fantasy.wav' },
  { id: 186, type: 'romantic', title: 'synths Dreams', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/synths-dreams.png', audio: '/library/audio/synths-dreams.wav' },
  { id: 187, type: 'romantic', title: '慢慢看你', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/slowly-watch-you.png', audio: '/library/audio/slowly-watch-you.wav' },
  { id: 188, type: 'romantic', title: '微醺', artist: 'WEGO MUSIC', time: '—', genre: 'ROMANTIC LYRIC', image: '/library/covers/tipsy.png', audio: '/library/audio/tipsy.wav' },
]

const localTracks = rawTracks.map((track) => ({
  ...track,
  image: toR2MediaUrl(track.image),
  audio: toR2MediaUrl(track.audio),
  lyrics: toR2MediaUrl(track.lyrics),
}))

const tracks = [localTracks[3], localTracks[5], localTracks[9], localTracks[10]]

let types = [
  { no: '01', slug: 'electronic', cn: '电子音乐', en: 'ELECTRONIC MOTION', image: '/library/covers/universe-loop.png' },
  { no: '02', slug: 'vocal-pop', cn: '人声流行', en: 'VOCAL POP', image: '/library/covers/midnight-groove.png' },
  { no: '03', slug: 'romantic', cn: '浪漫抒情', en: 'ROMANTIC LYRIC', image: '/library/covers/starlight-harbor.png' },
  { no: '04', slug: 'updates', cn: '最近更新', en: 'LATEST UPDATE', image: '/library/covers/neon-breeze.png' },
]

types = types.map((type) => ({ ...type, image: toR2MediaUrl(type.image) }))

const latestUpdateTrackIds = [185, 186, 187, 188]

const genrePlaylists = [
  { name: '电子音乐', code: 'ELECTRONIC MOTION', description: '高能节拍、低频推进与夜间驱动。', items: localTracks.filter(track => track.type === 'electronic') },
  { name: '人声流行', code: 'VOCAL POP', description: '贴近耳边的旋律，也有可以合唱的段落。', items: localTracks.filter(track => track.type === 'vocal-pop') },
  { name: '浪漫抒情', code: 'ROMANTIC LYRIC', description: '为慢下来的一刻保留足够的留白。', items: localTracks.filter(track => track.type === 'romantic') },
  { name: '最近更新', code: 'LATEST UPDATE', description: '刚刚加入 WEGO MUSIC 的最新声音。', items: latestUpdateTrackIds.map(id => localTracks.find(track => track.id === id)) },
]

const playlistTracks = localTracks
const allTracks = localTracks
const pickDailyTracks = (count = 8) => [...allTracks].sort(() => Math.random() - .5).slice(0, count)

const updates = latestUpdateTrackIds.map((id, index) => {
  const track = localTracks.find(item => item.id === id)
  return {
    date: `RECENT ADDITION ${String(index + 1).padStart(2, '0')}`,
    type: `LATEST UPDATE ${String(index + 1).padStart(2, '0')}`,
    track,
    note: `${track.title} · ${track.genre}`,
  }
})
const FAVORITES_STORAGE_KEY = 'wego-music-favorites'

const parseLrc = (source) => source.split(/\r?\n/).flatMap((line) => {
  const text = line.replace(/\[[^\]]+\]/g, '').trim()
  return [...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)].map((match) => ({ time: Number(match[1]) * 60 + Number(match[2]), text }))
}).filter((line) => line.text).sort((a, b) => a.time - b.time)

const trackLyrics = () => [
  { time: 0, text: '纯音乐，暂无歌词' },
  { time: 4, text: '歌词将在提供文本或完成语音转写后显示。' },
]

function App() {
  const [active, setActive] = useState(tracks[0])
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')
      return Array.isArray(saved) ? saved.filter(id => allTracks.some(track => track.id === id)) : []
    } catch {
      return []
    }
  })
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hash, setHash] = useState(() => window.location.hash)
  const [navPinned, setNavPinned] = useState(false)
  const [favoritesPage, setFavoritesPage] = useState(0)
  const [detailTab, setDetailTab] = useState('lyrics')
  const [loadedLyrics, setLoadedLyrics] = useState([])
  const [muted, setMuted] = useState(false)
  const [genrePage, setGenrePage] = useState(0)
  const [electronicMood, setElectronicMood] = useState('energetic')
  const [dailyRecommendations] = useState(() => pickDailyTracks())
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false)
  const dailyCardControlsRef = useRef([])
  const audio = useRef(null)
  const homeRef = useRef(null)
  const genrePageRef = useRef(null)
  const libraryCountRef = useRef(null)
  const hasPlayedGenreIntro = useRef(false)
  const hasVisitedHome = useRef(false)

  const activeGenreIndex = types.findIndex(type => hash === `#genre/${type.slug}`)
  const detailMatch = hash.match(/^#track\/(\d+)$/)
  const detailTrack = detailMatch ? allTracks.find(track => track.id === Number(detailMatch[1])) : null
  useEffect(() => {
    let cancelled = false
    if (!detailTrack?.lyrics) {
      setLoadedLyrics([])
      return undefined
    }
    setLoadedLyrics([])
    fetch(detailTrack.lyrics)
      .then((response) => response.ok ? response.text() : '')
      .then((source) => { if (!cancelled) setLoadedLyrics(parseLrc(source)) })
      .catch(() => { if (!cancelled) setLoadedLyrics([]) })
    return () => { cancelled = true }
  }, [detailTrack?.id])
  const dailyItems = useMemo(() => dailyRecommendations.map(track => ({ image: track.image, text: track.title })), [dailyRecommendations])
  const detailLyrics = detailTrack?.lyrics && loadedLyrics.length ? loadedLyrics : trackLyrics(detailTrack)
  const activeLyricIndex = detailLyrics.findIndex((line, index) => currentTime >= line.time && (!detailLyrics[index + 1] || currentTime < detailLyrics[index + 1].time))

  const activePlaylist = activeGenreIndex >= 0 ? genrePlaylists[activeGenreIndex] : null
  const visibleGenreItems = activeGenreIndex === 0 ? (activePlaylist?.items ?? []).filter(track => electronicMood === 'soft' ? track.mood === 'soft' : track.mood !== 'soft') : activePlaylist?.items ?? []
  const genreItemsPerPage = 7
  const genrePageCount = Math.max(1, Math.ceil(visibleGenreItems.length / genreItemsPerPage))
  const paginatedGenreItems = visibleGenreItems.slice(genrePage * genreItemsPerPage, (genrePage + 1) * genreItemsPerPage)
  const favoriteTracks = allTracks.filter(track => liked.includes(track.id))
  const favoritesPerPage = 9
  const favoritePageCount = Math.max(1, Math.ceil(favoriteTracks.length / favoritesPerPage))
  const visibleFavoriteTracks = favoriteTracks.slice(favoritesPage * favoritesPerPage, (favoritesPage + 1) * favoritesPerPage)

  useEffect(() => {
    const player = audio.current
    if (!player) return
    player.load()
    if (playing) player.play().catch(() => setPlaying(false))
  }, [active.audio])

  useEffect(() => {
    const player = audio.current
    if (!player) return
    if (playing) player.play().catch(() => setPlaying(false))
    else player.pause()
  }, [playing])

  useEffect(() => {
    const loadVideo = () => setHeroVideoLoaded(true)
    const supportsIdle = typeof window.requestIdleCallback === 'function'
    const taskId = supportsIdle ? window.requestIdleCallback(loadVideo, { timeout: 1200 }) : window.setTimeout(loadVideo, 700)
    return () => { if (supportsIdle) window.cancelIdleCallback(taskId); else window.clearTimeout(taskId) }
  }, [])
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(liked))
  }, [liked])

  useEffect(() => {
    setFavoritesPage(page => Math.min(page, favoritePageCount - 1))
  }, [favoritePageCount])

  useEffect(() => {
    setGenrePage(0)
  }, [activeGenreIndex, electronicMood])

  useEffect(() => {
    setGenrePage(page => Math.min(page, genrePageCount - 1))
  }, [genrePageCount])

  useEffect(() => {
    if (activeGenreIndex < 0) gsap.set('.collection .track', { clearProps: 'transform,opacity,visibility' })
  }, [liked, activeGenreIndex])

  useLayoutEffect(() => {
    if (activeGenreIndex >= 0 || detailTrack) return
    const countNode = libraryCountRef.current
    if (!countNode) return
    const counter = { value: 0 }
    countNode.textContent = '00'
    const tween = gsap.to(counter, {
      value: allTracks.length,
      duration: 1.15,
      delay: .5,
      ease: 'power3.out',
      onUpdate: () => { countNode.textContent = String(Math.round(counter.value)).padStart(2, '0') },
    })
    return () => tween.kill()
  }, [activeGenreIndex, detailTrack])
  useEffect(() => {
    let frame = null
    const updateNav = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const pinned = window.scrollY > window.innerHeight - 120
        setNavPinned(current => current === pinned ? current : pinned)
      })
    }
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    return () => { window.removeEventListener('scroll', updateNav); if (frame) cancelAnimationFrame(frame) }
  }, [])

  useLayoutEffect(() => {
    if (activeGenreIndex < 0) {
      hasPlayedGenreIntro.current = false
      return
    }
    if (hasPlayedGenreIntro.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    hasPlayedGenreIntro.current = true
    const root = genrePageRef.current
    if (!root) return

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
      timeline
        .from(q('.genre-page-title > p'), { x: -34, autoAlpha: 0, duration: .48 })
        .from(q('.genre-page-title h1'), { y: 42, scale: .94, autoAlpha: 0, duration: .72 }, '-=.2')
        .from(q('.genre-page-title > span, .genre-mood-switch'), { y: 20, autoAlpha: 0, duration: .5, stagger: .08 }, '-=.3')
        .from(q('.genre-page-row'), { y: 46, autoAlpha: 0, duration: .62, stagger: .075 }, '-=.28')
        .from(q('.genre-page-cover'), { scale: .84, duration: .48, stagger: .075 }, '-=.74')
        .from(q('.genre-page-pagination, .genre-page-switch'), { y: 18, autoAlpha: 0, duration: .45, stagger: .08 }, '-=.22')
    }, root)

    return () => context.revert()
  }, [activeGenreIndex])

  useLayoutEffect(() => {
    if (activeGenreIndex >= 0) return
    const root = homeRef.current
    if (!root) return

    if (hasVisitedHome.current) {
      gsap.set(root.querySelectorAll('.hero-opening-mask'), { display: 'none' })
      return
    }
    hasVisitedHome.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const ease = 'power4.out'
      const reveal = (sectionSelector, cardsSelector) => {
        const section = q(sectionSelector)[0]
        if (!section) return
        const cards = q(cardsSelector)
        const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 76%', once: true } }).timeScale(1.32)
        timeline
          .from(q(`${sectionSelector} .section-kicker`), { x: -160, scale: 1.65, autoAlpha: 0, duration: 1.25, ease, transformOrigin: 'left center' })
          .from(q(`${sectionSelector} h2`), { y: 105, scale: 0.84, autoAlpha: 0, duration: 1.5, ease }, '-=.72')
          .from(cards, { y: 86, scale: 0.94, autoAlpha: 0, duration: 1.25, stagger: 0.15, ease }, '-=.82')
          .set(cards, { clearProps: 'transform,opacity' })
      }

      const opening = gsap.timeline({ defaults: { ease } }).timeScale(1.32)
      opening
        .to(q('.hero-opening-mask span'), { y: -28, autoAlpha: 0, duration: 0.5 }, 0.18)
        .to(q('.hero-opening-mask'), { scaleX: 0, duration: 1.45, transformOrigin: 'right center', ease: 'expo.inOut' }, 0.22)
        .from(q('.wego-v3 .nav'), { y: -34, autoAlpha: 0, duration: 1.05 }, 0.5)
        .from(q('.v3-topline'), { y: -18, autoAlpha: 0, duration: 0.9 }, 0.62)
        .from(q('.v3-main > p'), { x: -58, autoAlpha: 0, duration: 1.1 }, 0.78)
        .from(q('.v3-main h1'), { clipPath: 'inset(0 100% 0 0)', x: -135, scaleX: 0.76, transformOrigin: 'left center', duration: 1.85, ease: 'expo.out' }, 0.86)
        .from(q('.v3-main > div'), { y: 40, autoAlpha: 0, duration: 1.05 }, 1.35)
        .from(q('.v3-now'), { x: 75, autoAlpha: 0, duration: 1.2 }, 1.12)
        .from(q('.v3-footer p'), { y: 35, autoAlpha: 0, duration: 1, stagger: 0.13 }, 1.55)
        .from(q('.v3-orbit'), { scale: 0.58, autoAlpha: 0, duration: 1.85, ease: 'expo.out' }, 0.42)
        .from(q('.hero-meta'), { y: 20, autoAlpha: 0, duration: 0.8 }, 1.7)
        .set(q('.v3-main h1'), { clearProps: 'transform,clipPath,opacity' })

      reveal('.intro', '.genre-card')
      reveal('.recent-updates', '.daily-circular-stage')
      reveal('.square', '.feature-track')
      reveal('.collection', '.track')
      gsap.from(q('.marquee div'), { xPercent: -18, autoAlpha: 0, duration: 1.2, ease, scrollTrigger: { trigger: q('.marquee')[0], start: 'top 82%', once: true } })

      if (window.matchMedia('(min-width: 801px)').matches) {
        gsap.to(q('.v3-orbit'), { yPercent: -12, ease: 'none', scrollTrigger: { trigger: q('.wego-v3')[0], start: 'top top', end: 'bottom top', scrub: 1.2 } })
        gsap.to(q('.feature-cover'), { yPercent: -10, ease: 'none', scrollTrigger: { trigger: q('.square')[0], start: 'top bottom', end: 'bottom top', scrub: 1 } })
        gsap.to(q('.update-image'), { yPercent: -6, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: q('.recent-updates')[0], start: 'top bottom', end: 'bottom top', scrub: 1 } })
      }
    }, root)

    return () => context.revert()
  }, [activeGenreIndex])

  const choose = (track) => {
    setActive(track)
    setProgress(0)
    setCurrentTime(0)
    setPlaying(true)
  }
  const togglePlay = () => setPlaying(value => !value)
  const toggleLike = (id) => {
    setFavoritesPage(0)
    setLiked(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }
  const openGenre = (index) => { setGenrePage(0); window.location.hash = `genre/${types[index].slug}` }
  const openTrack = (track = active) => { window.location.hash = `track/${track.id}` }
  const downloadFavoriteList = () => {
    const groups = [
      { title: '电子音乐', type: 'electronic' },
      { title: '人声流行', type: 'vocal-pop' },
      { title: '浪漫抒情', type: 'romantic' },
    ]
    const content = ['WEGO MUSIC / 我的收藏', '', ...groups.flatMap(group => [
      `[${group.title}]`,
      ...favoriteTracks.filter(track => track.type === group.type).map(track => track.title),
      '',
    ])].join('\n')
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = 'wego-music-收藏表.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(link.href)
  }
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
  }
  const seek = (event) => {
    const nextProgress = event.nativeEvent.offsetX / event.currentTarget.clientWidth
    if (audio.current?.duration) audio.current.currentTime = audio.current.duration * nextProgress
    setProgress(nextProgress * 100)
  }

  return <main>
    <audio preload="metadata" ref={audio} muted={muted} src={active.audio} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => { const player = event.currentTarget; setCurrentTime(player.currentTime); setProgress(player.duration ? player.currentTime / player.duration * 100 : 0) }} onEnded={() => setPlaying(false)} />
    {activeGenreIndex >= 0 ? <section className="genre-page" ref={genrePageRef} style={{ '--genre-image': `url(${types[activeGenreIndex].image})` }}><div className="genre-page-shade" /><header className="shell genre-page-nav"><a href="#home" className="brand">wego</a><a href="#home" className="genre-back">← 返回首页</a></header><div className="shell genre-page-content"><div className="genre-page-title"><p>{types[activeGenreIndex].no} / {activePlaylist.code}</p><h1>{activePlaylist.name}</h1><span>{activePlaylist.description}</span>{activeGenreIndex === 0 && <div className="genre-mood-switch" role="tablist" aria-label="电子音乐列表"><button className={electronicMood === 'soft' ? 'mood-active' : ''} onClick={() => setElectronicMood('soft')} role="tab" aria-selected={electronicMood === 'soft'}>柔和</button><button className={electronicMood === 'energetic' ? 'mood-active' : ''} onClick={() => setElectronicMood('energetic')} role="tab" aria-selected={electronicMood === 'energetic'}>动感</button></div>}</div><div className="genre-page-list">{paginatedGenreItems.map((item, index) => { const track = playlistTracks.find(song => song.id === item.id); return <div className={active.id === item.id ? 'genre-page-row active-page-row' : 'genre-page-row'} key={item.id} role="link" tabIndex={0} onClick={() => openTrack(track)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openTrack(track) } }}><span>{String(genrePage * genreItemsPerPage + index + 1).padStart(2, '0')}</span><div className="genre-page-cover" style={{backgroundImage:`url(${track.image})`}}></div><button onClick={(event) => { event.stopPropagation(); choose(track) }}>{active.id === item.id && playing ? 'Ⅱ' : '▶'}</button><strong>{item.title}</strong><em>{item.artist}</em><small>{item.time}</small><button className={liked.includes(item.id) ? 'library-like selected' : 'library-like'} onClick={(event) => { event.stopPropagation(); toggleLike(item.id) }}>♡</button></div> })}{activeGenreIndex === 0 && !visibleGenreItems.length && <div className="genre-list-empty">柔和列表正在筹备中</div>}</div>{visibleGenreItems.length > genreItemsPerPage && <nav className="genre-page-pagination" aria-label="音乐类型列表分页"><button onClick={() => setGenrePage(page => Math.max(0, page - 1))} disabled={genrePage === 0}>← 上一页</button><span>{String(genrePage + 1).padStart(2, '0')} / {String(genrePageCount).padStart(2, '0')}</span><button onClick={() => setGenrePage(page => Math.min(genrePageCount - 1, page + 1))} disabled={genrePage === genrePageCount - 1}>下一页 →</button></nav>}<div className="genre-page-switch">{types.map((type, index) => <button key={type.slug} className={index === activeGenreIndex ? 'page-switch-active' : ''} onClick={() => openGenre(index)}>{type.cn}</button>)}</div></div></section> : detailTrack ? <section className="track-detail-page"><header className="shell track-detail-nav"><a href="#music" className="brand">wego</a><span>WEGO MUSIC / SINGLE</span><a href="#music">← 返回音乐</a></header><div className="shell track-detail-layout"><div className="detail-turntable"><div className={active.id === detailTrack.id && playing ? 'detail-vinyl spinning' : 'detail-vinyl'}><img src={detailTrack.image} alt={`${detailTrack.title} 专辑封面`} /></div><i className="detail-tonearm" /><button className="detail-play" onClick={() => choose(detailTrack)}>{active.id === detailTrack.id && playing ? 'Ⅱ 暂停' : '▶ 播放单曲'}</button></div><article className="track-detail-copy"><p className="section-kicker">NOW PLAYING / {detailTrack.genre}</p><h1>{detailTrack.title}</h1><p className="detail-meta">专辑：WEGO MUSIC <span>·</span> 音乐人：{detailTrack.artist} <span>·</span> {detailTrack.time}</p><div className="detail-tabs"><button className={detailTab === 'lyrics' ? 'active' : ''} onClick={() => setDetailTab('lyrics')}>歌词</button><button className={detailTab === 'about' ? 'active' : ''} onClick={() => setDetailTab('about')}>单曲信息</button><button className={detailTab === 'similar' ? 'active' : ''} onClick={() => setDetailTab('similar')}>相似推荐</button></div>{detailTab === 'lyrics' && <div className="detail-lyrics">{detailLyrics.map((line, index) => <p data-lyric-index={index} className={index === activeLyricIndex ? 'lyric-active' : ''} key={`${line.time}-${index}`}>{line.text || ' '}</p>)}</div>}{detailTab === 'about' && <div className="detail-about"><strong>WEGO MUSIC ORIGINAL</strong><p>{detailTrack.title} 是一段为夜晚而作的声音记录。低频、留白与缓慢推进的旋律共同构成它的听觉空间。</p><dl><div><dt>类型</dt><dd>{detailTrack.genre}</dd></div><div><dt>艺术家</dt><dd>{detailTrack.artist}</dd></div><div><dt>格式</dt><dd>LOCAL WAV / STEREO</dd></div></dl></div>}{detailTab === 'similar' && <div className="detail-similar">{allTracks.filter(track => track.type === detailTrack.type && track.id !== detailTrack.id).slice(0, 4).map((track, index) => <button key={track.id} onClick={() => { choose(track); openTrack(track) }}><span>{String(index + 1).padStart(2, '0')}</span><img src={track.image} alt="" /><strong>{track.title}<small>{track.artist}</small></strong><i>↗</i></button>)}</div>}</article></div></section> : <div className="site-motion-root" ref={homeRef}><section className="hero wego-home wego-v3" id="home">
      <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=70">
        {heroVideoLoaded && <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-clouds-at-sunset-14259-large.mp4" type="video/mp4" />}
      </video>
      <div className="hero-opening-mask"><span>WEGO / SOUND SYSTEM</span></div>
      <div className="hero-shade" />
      <div className="v3-grid" /><div className="v3-orbit"><i></i><b></b></div>
      <nav className="shell nav">
        <a className="brand" href="#home">wego</a>
        <div className="nav-links"><a className="active" href="#music">音乐</a><a href="#square">广场</a><a href="#favorites">收藏</a><a href="#about">关于</a></div>
        <button className="menu" aria-label="打开菜单"><i></i><i></i></button>
      </nav>
      <div className="shell hero-copy v3-copy">
        <div className="v3-topline"><span>WEGO SOUND SYSTEM</span><span>01 — 26</span></div>
        <div className="v3-main"><p>THE NEW FREQUENCY<br/>OF RIGHT NOW</p><h1>wegomusic</h1><div><a href="#music">开启播放 <b>→</b></a><span>独立音乐 / 声音设计 / 现场感知</span><p className="v3-library-count">音乐库：<b ref={libraryCountRef}>00</b></p></div></div>
        <div className="v3-now"><p>NOW TRANSMITTING</p><strong>{active.title}</strong><div><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>{formatTime(duration || currentTime)} / STEREO</small></div>
        <div className="v3-footer"><p>让声音离开耳机，<br/>成为正在发生的现场。</p><p>SHANGHAI — WORLDWIDE<br/>EST. 2024</p></div>
      </div>
      <div className="hero-meta">SCROLL <span>↓</span></div>
    </section>

    <nav className={`shell floating-nav ${navPinned ? 'is-visible' : ''}`} aria-label="固定导航">
      <a className="brand" href="#home">wego</a>
      <div className="nav-links"><a href="#music">音乐</a><a href="#square">广场</a><a href="#favorites">收藏</a><a href="#about">关于</a></div>
      <button className="menu" aria-label="打开菜单"><i></i><i></i></button>
    </nav>

    <section className="shell intro" id="music"><p className="section-kicker">01 / SELECTED FREQUENCIES</p><div><h2>每一种声音，<br/>都有它的<span>引力场。</span></h2><p>在节奏、旋律与静默之间，寻找情绪的精确轮廓。</p></div></section>
    <section className="shell genre-grid">
      {types.map((type, index) => <article className="genre-card" key={type.no} style={{'--bg': `url(${type.image})`}} onClick={() => openGenre(index)}>
        <div className="genre-fade" /><span>{type.no}</span><div><p>{type.en}</p><h3>{type.cn}</h3></div><button onClick={() => openGenre(index)} aria-label={`进入${type.cn}`}>↗</button>
      </article>)}
    </section>

    <section className="shell recent-updates" aria-labelledby="recent-title">
      <div className="recent-heading"><div><p className="section-kicker">02 / DAILY RECOMMENDATIONS</p><h2 id="recent-title">每日推荐</h2></div><p>每天一组，为此刻的心情挑选一首声音。</p></div>
      <div className="daily-circular-stage">
        <DeferredCircularGallery items={dailyItems} cardControlsRef={dailyCardControlsRef} />
        {dailyRecommendations.map((track, index) => <article className="daily-orbit-card-ui" key={track.id} ref={node => { dailyCardControlsRef.current[index] = node }}><p>{String(index + 1).padStart(2, '0')} / DAILY PICK</p><h3>{track.title}</h3><small>{track.genre}</small><div><button onClick={() => choose(track)} aria-label={`播放 ${track.title}`}>{active.id === track.id && playing ? 'Ⅱ' : '▶'}<b>播放</b></button><button className={liked.includes(track.id) ? 'daily-save selected' : 'daily-save'} onClick={() => toggleLike(track.id)} aria-label={`收藏 ${track.title}`}>♡</button></div></article>)}
      </div>
    </section>

    <section className="square" id="square"><div className="shell"><div className="title-row"><div><p className="section-kicker">02 / DAILY SELECTION</p><h2>音乐广场</h2></div><p>每日一组，献给认真聆听的人。<br/>全部由 WEGO MUSIC 筛选与编排。</p></div><div className="feature-track"><div className="feature-cover" style={{backgroundImage:`url(${tracks[0].image})`}}><div className="vinyl"></div></div><div className="feature-info"><p className="muted">TODAY'S SELECT / LOCAL LIBRARY</p><h3>{tracks[0].title}</h3><p className="artist">{tracks[0].artist} <span>—</span> {tracks[0].genre}</p><p className="description">从本地音乐库选出的声音，现在可以在网站中完整试听。</p><div className="actions"><button className="play-button" onClick={() => choose(tracks[0])}>{playing && active.id === tracks[0].id ? 'Ⅱ' : '▶'}<span>播放单曲</span></button><button className={liked.includes(tracks[0].id) ? 'heart selected' : 'heart'} onClick={() => toggleLike(tracks[0].id)} aria-label={`收藏 ${tracks[0].title}`}>♡</button></div></div><div className="feature-index">01 <span>/ 04</span></div></div></div></section>

    <section className="shell collection" id="favorites"><div className="title-row"><div><p className="section-kicker">03 / PERSONAL COLLECTION</p><h2>我的收藏 <sup>{favoriteTracks.length.toString().padStart(2,'0')}</sup></h2></div><div className="collection-heading-actions"><p>留住那些曾让你停下来的瞬间。</p><button className="favorite-list-download" onClick={downloadFavoriteList} disabled={!favoriteTracks.length}>⇩ 下载收藏表</button></div></div><div className="track-list">
      {favoriteTracks.length ? visibleFavoriteTracks.map((track, i) => <div className={active.id === track.id ? 'track active-track' : 'track'} key={track.id}><span className="track-number">{String(favoritesPage * favoritesPerPage + i + 1).padStart(2,'0')}</span><button className="tiny-play" onClick={() => choose(track)} aria-label={`播放${track.title}`}>{active.id === track.id && playing ? 'Ⅱ' : '▶'}</button><div className="track-cover" style={{backgroundImage:`url(${track.image})`}}></div><div className="track-name"><strong>{track.title}</strong><span>{track.artist}</span></div><span className="track-genre">{track.genre}</span><span className="track-time">{track.time}</span><button className="track-heart selected" onClick={() => toggleLike(track.id)} aria-label={`取消收藏 ${track.title}`}>♡</button></div>) : <div className="collection-empty"><span>♡</span><strong>还没有收藏的音乐</strong><p>在任意歌曲旁点击收藏，它就会出现在这里。</p></div>}
    </div>{favoriteTracks.length > favoritesPerPage && <nav className="collection-pagination" aria-label="收藏列表分页"><button onClick={() => setFavoritesPage(page => Math.max(0, page - 1))} disabled={favoritesPage === 0}>← 上一页</button><div>{Array.from({ length: favoritePageCount }, (_, page) => <button key={page} onClick={() => setFavoritesPage(page)} className={page === favoritesPage ? 'page-current' : ''}>{String(page + 1).padStart(2, '0')}</button>)}</div><button onClick={() => setFavoritesPage(page => Math.min(favoritePageCount - 1, page + 1))} disabled={favoritesPage === favoritePageCount - 1}>下一页 →</button></nav>}</section>

    <section className="marquee" id="about"><div>LISTEN <i>✳</i> FEEL <i>✳</i> REMEMBER <i>✳</i> LISTEN <i>✳</i> FEEL <i>✳</i> REMEMBER <i>✳</i></div></section>
    <footer className="shell"><a className="brand wego-brand" href="#home">wego</a><p>© 2024 WEGO MUSIC. ALL RIGHTS RESERVED.</p><a href="#home">BACK TO TOP ↑</a></footer>
    </div>}

    <div className="player"><div className="player-track"><button className="player-cover player-detail-link" onClick={() => openTrack(active)} aria-label={`查看 ${active.title} 详情`} style={{backgroundImage:`url(${active.image})`}}></button><button className="player-detail-info" onClick={() => openTrack(active)}><strong>{active.title}</strong><span>{active.artist}</span></button><div className="player-track-actions"><a className="player-download" href={active.audio} download={`${active.title}.wav`} aria-label={`下载 ${active.title}`} title={`下载 ${active.title}`}>⇩</a><button className={liked.includes(active.id) ? 'player-heart selected' : 'player-heart'} onClick={() => toggleLike(active.id)} aria-label={`收藏 ${active.title}`}>♡</button><button className={muted ? 'player-volume muted' : 'player-volume'} onClick={() => setMuted(value => !value)} aria-label={muted ? '开启声音' : '静音'} aria-pressed={muted} title={muted ? '开启声音' : '静音'}><i /></button></div></div><div className="controls"><button onClick={() => choose(allTracks[(allTracks.findIndex(track => track.id === active.id) + allTracks.length - 1) % allTracks.length])}>↶</button><button className="main-play" onClick={togglePlay}>{playing ? 'Ⅱ' : '▶'}</button><button onClick={() => choose(allTracks[(allTracks.findIndex(track => track.id === active.id) + 1) % allTracks.length])}>↷</button></div><div className="player-progress"><span>{formatTime(currentTime)}</span><div onClick={seek}><i style={{width:`${progress}%`}}></i></div><span>{formatTime(duration)}</span></div></div>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
