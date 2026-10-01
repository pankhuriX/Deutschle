import { LEVELS, isLanguageLevel, type LanguageLevel } from '../data/vocabularyTypes'
import type { WordHint } from '../game/hints'

type GameToolsProps = {
  level: LanguageLevel
  onLevelChange: (level: LanguageLevel) => void
  hints: WordHint[]
  hintCount: number
  hintTotal: number
  onHint: () => void
}

export function GameTools({ level, onLevelChange, hints, hintCount, hintTotal, onHint }: GameToolsProps) {
  return (
    <section className="game-tools" aria-label="Spieleinstellungen und Hinweise" lang="de">
      <div className="game-toolbar">
        <label className="level-control">
          <span>Niveau</span>
          <span className="level-select">
          <select aria-label="Niveau" value={level} onChange={(event) => {
            if (isLanguageLevel(event.target.value)) onLevelChange(event.target.value)
          }}>
            {LEVELS.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <svg className="select-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </span>
        </label>
        <button className="hint-button" type="button" onClick={onHint} aria-controls="word-hints" aria-disabled={hintCount === hintTotal}>
          Hinweis <span>{hintCount}/{hintTotal}</span>
        </button>
      </div>
      <div id="word-hints" className="hint-panel" role="status" aria-live="polite" aria-atomic="true">
        {hints.map(({ label, value, lang }) => (
          <p key={label} className={label === 'Tipp' ? 'hint-description' : 'hint-fact'}>
            <span className="hint-label">{label}</span><span lang={lang}>{value}</span>
          </p>
        ))}
      </div>
    </section>
  )
}
