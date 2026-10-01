import { useCallback, useState } from 'react'
import { HowToPlayModal } from './components/HowToPlayModal'
import { ResultModal } from './components/ResultModal'
import { useOnboarding } from './hooks/useOnboarding'
import { AppHeader } from './components/AppHeader'
import { GameBoard } from './components/GameBoard'
import { Keyboard } from './components/Keyboard'
import { GameTools } from './components/GameTools'
import { useHints } from './hooks/useHints'
import { useVocabularyGame } from './hooks/useVocabularyGame'
import type { LanguageLevel } from './data/vocabularyTypes'
import { useGame } from './hooks/useGame'
import type { VocabularyWord } from './data/vocabulary'
import './App.css'

type GameScreenProps = {
  word: VocabularyWord
  level: LanguageLevel
  onLevelChange: (level: LanguageLevel) => void
  onNext: () => void
  onboarding: ReturnType<typeof useOnboarding>
}

function GameScreen({ word, level, onLevelChange, onNext, onboarding }: GameScreenProps) {
  const hints = useHints(word)
  const [revealFinished, setRevealFinished] = useState(false)
  const [resultDismissed, setResultDismissed] = useState(false)
  const resultOpen = revealFinished && !resultDismissed && !onboarding.isOpen
  const { guesses, currentGuess, isComplete, hasWon, keyboardStates, invalidAttempts, message, handleKey } = useGame(word.word, !onboarding.isOpen && !resultOpen)
  const finishReveal = useCallback(() => setRevealFinished(true), [])

  return (
    <div className={`app${hints.count > 0 ? ' app--hints' : ''}`}>
      <AppHeader onHelp={onboarding.reopen} />
      <main className="app-main">
        <h2 className="sr-only">German word guessing game</h2>
        <GameTools level={level} onLevelChange={onLevelChange} hints={hints.hints} hintCount={hints.count} hintTotal={hints.total} onHint={hints.revealNext} />
        <GameBoard guesses={guesses} currentGuess={currentGuess} invalidAttempts={invalidAttempts} message={message} onResultReveal={finishReveal} />
        <Keyboard states={keyboardStates} onKeyPress={handleKey} disabled={isComplete} />
        {revealFinished && <button className="result-reopen" type="button" onClick={() => setResultDismissed(false)}>Ergebnis ansehen</button>}
      </main>
      <HowToPlayModal open={onboarding.isOpen} onClose={onboarding.dismiss} />
      {revealFinished && <ResultModal outcome={hasWon ? 'won' : 'lost'} open={resultOpen} word={word} onClose={() => setResultDismissed(true)} onNext={onNext} />}
    </div>
  )
}

function App() {
  const onboarding = useOnboarding()
  const game = useVocabularyGame()
  return <GameScreen onboarding={onboarding} key={game.id} word={game.word} level={game.level} onLevelChange={game.changeLevel} onNext={game.nextWord} />
}

export default App
