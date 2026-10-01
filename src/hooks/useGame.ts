import { useCallback, useEffect, useState } from 'react'
import { acceptedWords } from '../data/acceptedWords'
import { getKeyboardStates } from '../game/getKeyboardStates'
import { applyGameInput, createGameState, hasWonGame } from '../game/gameState'
import { isSupportedLetter, MAX_GUESSES, MESSAGE_DURATION_MS, normalizeWord } from '../game/rules'


export function useGame(targetWord: string, inputEnabled = true) {
  // Keep one target for the lifetime of this game. Remount to start a new game.
  const [target] = useState(() => normalizeWord(targetWord))
  const [state, setState] = useState(createGameState)

  const handleKey = useCallback((key: string) => {
    if (!inputEnabled) return
    setState((previous) => applyGameInput(previous, key, target, acceptedWords))
  }, [target, inputEnabled])

  useEffect(() => {
    if (!state.message) return
    const timer = window.setTimeout(() => {
      setState((previous) => previous.invalidAttempts === state.invalidAttempts ? { ...previous, message: null } : previous)
    }, MESSAGE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [state.message, state.invalidAttempts])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return
      if (!inputEnabled) return
      const target = event.target
      if (target instanceof HTMLElement && (
        target.isContentEditable || target.closest('input, textarea, select, dialog, [role="dialog"]') ||
        (event.key === 'Enter' && target.closest('button') && !target.closest('.keyboard'))
      )) return
      if (event.key !== 'Enter' && event.key !== 'Backspace' && !isSupportedLetter(event.key)) return
      // Enter always submits, including when a virtual letter key has focus.
      // Prevent its native click so the focused letter is not entered again.
      event.preventDefault()
      if (target instanceof HTMLElement && target.closest('button') && !target.closest('.keyboard')) {
        document.querySelector<HTMLElement>('.game-board')?.focus()
      }
      handleKey(event.key)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKey, inputEnabled])

  const hasWon = hasWonGame(state, target)

  return {
    ...state,
    hasWon,
    keyboardStates: getKeyboardStates(state.guesses),
    isComplete: hasWon || state.guesses.length === MAX_GUESSES,
    handleKey,
  }
}
