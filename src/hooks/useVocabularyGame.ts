import { useEffect, useState } from 'react'
import { solutionWords } from '../data/vocabulary'
import { isLanguageLevel, type LanguageLevel } from '../data/vocabularyTypes'
import { selectWord } from '../game/selectWord'

const STORAGE_KEY = 'deutschle:level'

function readLevel(): LanguageLevel {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLanguageLevel(stored) ? stored : 'A1'
  } catch {
    return 'A1'
  }
}

export function useVocabularyGame() {
  const [game, setGame] = useState(() => {
    const level = readLevel()
    return { level, word: selectWord(solutionWords, level), id: 0 }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, game.level) } catch {
      // The selected level still works for this visit when storage is unavailable.
    }
  }, [game.level])

  function startGame(level: LanguageLevel) {
    const word = selectWord(solutionWords, level, game.word.word)
    setGame({ level, word, id: game.id + 1 })
  }

  function changeLevel(level: LanguageLevel) {
    if (level !== game.level) startGame(level)
  }

  return { ...game, changeLevel, nextWord: () => startGame(game.level) }
}
