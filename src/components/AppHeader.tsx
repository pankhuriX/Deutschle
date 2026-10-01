type AppHeaderProps = { onHelp: () => void }

export function AppHeader({ onHelp }: AppHeaderProps) {
  return (
    <header className="app-header">
      <h1>Deutschle</h1>
      <button id="instructions-button" className="help-button" type="button" aria-label="Spielanleitung öffnen" onClick={onHelp}>
        <span aria-hidden="true">?</span>
      </button>
    </header>
  )
}
