import { useEffect, useState } from 'react'
import Icon from '../common/Icon.jsx'
import { ORG } from '../../data/constants.js'

function formatIST(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  // Month uses en-US instead of en-GB: en-GB abbreviates September as the
  // irregular 4-letter "Sept" (every other month is 3 letters), which was
  // just wide enough to overflow the utility bar and force it onto a
  // second line. en-US keeps every month a consistent 3 letters.
  const month = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', month: 'short' }).format(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return `${get('day')}-${month}-${get('year')} ${get('hour')}:${get('minute')}:${get('second')}`
}

export default function UtilityBar({ fontScale, onFontScale }) {
  // Real, live wall-clock time — reads straight from the system clock every
  // second, so this always matches actual current IST, not a fixed demo date.
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-navy-800 text-navy-100 text-[11px] border-b border-navy-600 px-4 py-1.5 flex flex-nowrap items-center justify-between gap-3 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-white tracking-wide">भारत सरकार | Government of India</span>
        <span className="text-navy-300">|</span>
        <span className="text-navy-200 hidden sm:inline">{ORG.ministryHi} ({ORG.ministryEn})</span>
        <span className="text-navy-300 hidden sm:inline">|</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-teal-200">
          <Icon name="verified" size={13} />
          CVC Statutory Vigilance Gateway (ISO 27001)
        </span>
      </div>
      <div className="flex items-center gap-3 font-mono shrink-0">
        <a className="hover:underline text-navy-100 hidden md:inline" href="#main-content">
          Skip to Main Content
        </a>
        <span className="text-navy-300 hidden md:inline">|</span>
        <span className="flex items-center gap-1">
          <span className="text-[10px] text-navy-200">Font:</span>
          {['A-', 'A', 'A+'].map((label, i) => (
            <button
              key={label}
              onClick={() => onFontScale?.(i)}
              className={`px-1 py-0.5 rounded text-[10px] ${fontScale === i ? 'bg-saffron text-navy font-bold' : 'bg-navy-500 hover:bg-navy-400 text-white'} ${i === 1 ? 'px-1.5 font-bold' : ''}`}
            >
              {label}
            </button>
          ))}
        </span>
        <span className="text-navy-300">|</span>
        <button className="flex items-center gap-1 hover:text-white">
          <Icon name="screen_search_desktop" size={12} />
          <span className="hidden sm:inline">Screen Reader</span>
        </button>
        <span className="text-navy-300">|</span>
        <span className="bg-saffron text-black font-bold px-1.5 py-0.5 rounded text-[10px]">हिन्दी</span>
        <span className="text-navy-300">|</span>
        <span className="text-teal-200 flex items-center gap-1">
          <Icon name="schedule" size={12} />
          <span>IST: {formatIST(now)}</span>
        </span>
      </div>
    </div>
  )
}