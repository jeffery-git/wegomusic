import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const tracks = [
  { id: 1, title: 'Glass Memory', artist: 'NOCTURNE', time: '03:42', genre: 'Electronica', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e745f?auto=format&fit=crop&w=900&q=85' },
  { id: 2, title: '蓝色时差', artist: 'NOCTURNE / Lena', time: '04:16', genre: 'Vocal Pop', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85' },
  { id: 3, title: 'A Slow Light', artist: 'NOCTURNE', time: '03:58', genre: 'Lyrical', image: 'https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?auto=format&fit=crop&w=900&q=85' },
  { id: 4, title: 'Night Cruise', artist: 'NOCTURNE', time: '05:02', genre: 'Ambient', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85' },
]

const types = [
  { no: '01', cn: '动感电音', en: 'ELECTRONIC MOTION', image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b5f1?auto=format&fit=crop&w=1100&q=85' },
  { no: '02', cn: '人声流行', en: 'VOCAL POP', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1100&q=85' },
  { no: '03', cn: '浪漫抒情', en: 'ROMANTIC LYRIC', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1100&q=85' },
]

function App() {
  const [active, setActive] = useState(tracks[0])
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState([1, 3])
  const [progress, setProgress] = useState(24)
  const audio = useRef(null)

  useEffect(() => {
    const timer = playing ? setInterval(() => setProgress(v => (v >= 100 ? 0 : v + 0.12)), 1000) : null
    return () => clearInterval(timer)
  }, [playing])

  const choose = (track) => {
    setActive(track)
    setProgress(0)
    setPlaying(true)
    window.setTimeout(() => audio.current?.play().catch(() => {}), 0)
  }
  const togglePlay = () => {
    if (playing) audio.current?.pause()
    else audio.current?.play().catch(() => {})
    setPlaying(value => !value)
  }
  const toggleLike = (id) => setLiked(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id])

  return <main>
    <audio ref={audio} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    <section className="hero" id="home">
      <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=85">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-clouds-at-sunset-14259-large.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <nav className="shell nav">
        <a className="brand" href="#home">N<span>O</span>CTURNE<sup>®</sup></a>
        <div className="nav-links"><a className="active" href="#music">音乐</a><a href="#square">广场</a><a href="#favorites">收藏</a><a href="#about">关于</a></div>
        <button className="menu" aria-label="打开菜单"><i></i><i></i></button>
      </nav>
      <div className="shell hero-copy">
        <p className="eyebrow"><span></span> INDEPENDENT SOUND &amp; VISUAL ARCHIVE · 2024—∞</p>
        <h1>声音，<br/><em>在夜里显影。</em></h1>
        <div className="hero-bottom"><p>音乐人 / 视觉设计师 / 品牌设计师 / AI 设计师<br/>将未被命名的感受，译作可被看见的声响。</p><a href="#music" className="circle-link">探索声音 <b>↘</b></a></div>
      </div>
      <div className="hero-meta">SCROLL TO DISCOVER <span>↓</span></div>
    </section>

    <section className="shell intro" id="music"><p className="section-kicker">01 / SELECTED FREQUENCIES</p><div><h2>每一种声音，<br/>都有它的<span>引力场。</span></h2><p>在节奏、旋律与静默之间，寻找情绪的精确轮廓。</p></div></section>
    <section className="shell genre-grid">
      {types.map((type, index) => <article className="genre-card" key={type.no} style={{'--bg': `url(${type.image})`}}>
        <div className="genre-fade" /><span>{type.no}</span><div><p>{type.en}</p><h3>{type.cn}</h3></div><button onClick={() => choose(tracks[index])} aria-label={`播放${type.cn}`}>↗</button>
      </article>)}
    </section>

    <section className="square" id="square"><div className="shell"><div className="title-row"><div><p className="section-kicker">02 / DAILY SELECTION</p><h2>音乐广场</h2></div><p>每日一组，献给认真聆听的人。<br/>全部由 NOCTURNE 筛选与编排。</p></div><div className="feature-track"><div className="feature-cover" style={{backgroundImage:`url(${tracks[0].image})`}}><div className="vinyl"></div></div><div className="feature-info"><p className="muted">TODAY'S SELECT / JUL 28</p><h3>Glass Memory</h3><p className="artist">NOCTURNE <span>—</span> ELECTRONIC MOTION</p><p className="description">在城市褪去音量之后，一段关于记忆、玻璃与潮湿空气的低频漫游。</p><div className="actions"><button className="play-button" onClick={() => choose(tracks[0])}>{playing && active.id === 1 ? 'Ⅱ' : '▶'}<span>播放单曲</span></button><button className={liked.includes(1) ? 'heart selected' : 'heart'} onClick={() => toggleLike(1)} aria-label="收藏 Glass Memory">♡</button></div></div><div className="feature-index">01 <span>/ 04</span></div></div></div></section>

    <section className="shell collection" id="favorites"><div className="title-row"><div><p className="section-kicker">03 / PERSONAL COLLECTION</p><h2>我的收藏 <sup>{liked.length.toString().padStart(2,'0')}</sup></h2></div><p>留住那些曾让你停下来的瞬间。</p></div><div className="track-list">
      {tracks.map((track, i) => <div className={active.id === track.id ? 'track active-track' : 'track'} key={track.id}><span className="track-number">{String(i+1).padStart(2,'0')}</span><button className="tiny-play" onClick={() => choose(track)} aria-label={`播放${track.title}`}>{active.id === track.id && playing ? 'Ⅱ' : '▶'}</button><div className="track-cover" style={{backgroundImage:`url(${track.image})`}}></div><div className="track-name"><strong>{track.title}</strong><span>{track.artist}</span></div><span className="track-genre">{track.genre}</span><span className="track-time">{track.time}</span><button className={liked.includes(track.id) ? 'track-heart selected' : 'track-heart'} onClick={() => toggleLike(track.id)} aria-label={`收藏 ${track.title}`}>♡</button></div>)}
    </div></section>

    <section className="marquee" id="about"><div>LISTEN <i>✳</i> FEEL <i>✳</i> REMEMBER <i>✳</i> LISTEN <i>✳</i> FEEL <i>✳</i> REMEMBER <i>✳</i></div></section>
    <footer className="shell"><a className="brand" href="#home">N<span>O</span>CTURNE<sup>®</sup></a><p>© 2024 NOCTURNE STUDIO. ALL RIGHTS RESERVED.</p><a href="#home">BACK TO TOP ↑</a></footer>

    <div className="player"><div className="player-track"><div className="player-cover" style={{backgroundImage:`url(${active.image})`}}></div><div><strong>{active.title}</strong><span>{active.artist}</span></div></div><div className="controls"><button onClick={() => choose(tracks[(tracks.indexOf(active)+tracks.length-1)%tracks.length])}>↶</button><button className="main-play" onClick={togglePlay}>{playing ? 'Ⅱ' : '▶'}</button><button onClick={() => choose(tracks[(tracks.indexOf(active)+1)%tracks.length])}>↷</button></div><div className="player-progress"><span>01:{Math.floor(progress/3).toString().padStart(2,'0')}</span><div onClick={e => setProgress(e.nativeEvent.offsetX / e.currentTarget.clientWidth * 100)}><i style={{width:`${progress}%`}}></i></div><span>03:42</span></div><button className={liked.includes(active.id) ? 'player-heart selected' : 'player-heart'} onClick={() => toggleLike(active.id)}>♡</button></div>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
