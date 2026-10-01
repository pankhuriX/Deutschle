# Deutschle

A mobile-first German vocabulary word guessing game inspired by Wordle.
The visual foundation includes a dark, mobile-first shell, a 5 × 6 board, and a German keyboard. Physical and virtual keyboards enter up to five letters per row; Backspace deletes from the current row. Enter locks a complete five-letter guess and advances to the next row. Input stops after six submitted guesses. Submitted guesses are evaluated with duplicate-aware letter matching and lime, purple, or dark gray tiles. Input and game state live in `src/hooks/useGame.ts`.

## Stack

Vite, React, TypeScript, and plain CSS. No UI framework or backend.

## Development

Use Node.js 22.18+ and npm (required by the development-only dictionary generator).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

- `npm run dev` — start the development server with hot reload.
- `npm run build` — type-check and build for production into `dist/`.
- `npm run preview` — serve the production build locally after building.
- `npm run lint` — run Oxlint.
- `npm run typecheck` — run strict TypeScript checks.
- `npm test` — run game logic, state transition, and contrast tests.

## Structure

```text
src/
  components/
    AppHeader.tsx  # Shared page header
    GameBoard.tsx  # Six-row board layout
    Tile.tsx       # Reusable letter tile
    Keyboard.tsx   # German keyboard layout
    Key.tsx        # Reusable keyboard button
  App.tsx          # Application shell
  App.css          # Shell and header styles
  index.css        # Global styles and base defaults
  main.tsx         # React entry point
public/            # Future static assets
index.html         # HTML entry point
vite.config.ts     # Vite configuration
```

Keep components in `src/components/` and introduce feature folders when the game grows.

## Visual foundation

Design tokens for colors, fonts, spacing, and radii live in `src/index.css`. Layout and component styles live in `src/App.css`. The shell targets 390px wide and centers on larger screens. Google Fonts loads Bricolage Grotesque, Fredoka, and DM Sans, with local fallback fonts when offline.

## Vocabulary

- `src/data/solutions.json` contains 120 learner words, with 30 solutions each for A1, A2, B1, and B2. Each entry includes length, type, article, meaning, plural, level, category, descriptive hint, and example. Levels are editorial learning bands, not certified exam classifications.
- `src/data/acceptedWords.ts` exports the generated dictionary Set: 6,520 accepted guesses, including all 120 solutions. Regenerate it with `npm run generate:words`; do not edit it manually.
- `npm run validate:data` checks five-letter Unicode length, supported uppercase characters, duplicates, metadata, and solution membership in accepted guesses. This also runs before every production build.
- Ä, Ö, and Ü count as one letter. ß is excluded from playable words; ordinary German spelling is retained in teaching sentences.

The initial target is randomly selected from the cumulative saved-level pool (A1 by default). `useGame(targetWord)` keeps that target fixed for a game and locks input on a win. “Nächstes Wort” randomly chooses from the other five-letter solutions in the cumulative selected-level pool and starts a fresh game without reloading the page. The previous word is excluded, so immediate repeats cannot occur. Guesses are validated against the separate accepted-word list before evaluation. Daily selection is not implemented yet.

Run `npm test` for the two-pass evaluator tests, including duplicate letters, umlauts, and invalid input.

## Motion

Tiles reveal in 260ms with 100ms stagger and a color change at the flip midpoint. Typing uses a 120ms, 1.035× scale; incomplete submissions trigger a 220ms, 3px row shake with a text error. Repeated invalid submissions replay the shake. `prefers-reduced-motion: reduce` disables these animations and reveals results immediately. Unknown dictionary entries trigger the same shake without consuming an attempt.

## Onboarding

The German instructions open automatically until dismissed with the close button, “Los geht's”, or Escape. Dismissal is stored under `deutschle:onboarding-dismissed` in localStorage; if storage is unavailable, dismissal still works for the current visit. The header’s ? button always reopens the instructions. The native dialog contains focus, blocks background interaction, and pauses game input while open.

## Success result

The success card opens after the last winning tile finishes its reveal (immediately with reduced motion). It uses the target’s vocabulary metadata; articles and plurals appear only for nouns. Closing preserves the completed board, and “Ergebnis ansehen” reopens the card. “Nächstes Wort” clears all game and result state for the next entry. Celebration is limited to a small emoji and lime typography, with no confetti animation.

## Shared results

Both outcomes use `ResultModal` and `WordDetails`, backed by the same target vocabulary entry. After the sixth incorrect guess finishes revealing, the purple “Fast geschafft.” card teaches the answer. A correct sixth guess still shows the lime success card. Both results support closing, reopening, and starting the next word; reduced-motion preferences reveal results immediately.

## Messages and guess validation

A subtle toast above the board shows “Nicht genug Buchstaben” for incomplete submissions and “Wort nicht gefunden” for words absent from `acceptedWords.ts`. Messages disappear after 2.4 seconds; repeated invalid submissions restart the timer. Editing or a successful submission clears the message. Invalid guesses remain editable and do not consume a row or update keyboard colors. The accepted dictionary can be expanded independently of the solution list.

## Next word

Both result modals share the same next-word action. A uniformly random index within the cumulative selected-level pool excludes the current solution. Remounting the game screen clears guesses, board tiles, keyboard knowledge, hints, messages, reveal state, and result visibility. Onboarding dismissal remains stored.

## Responsive layout

Audited game, onboarding, success, and unsuccessful results at 375×667, 390×844, 430×932, 768×1024, and 1440×900. The game and completed-game controls fit without page scrolling at these sizes. Short viewports use tighter vertical spacing and slightly smaller board tiles; taller screens retain 56px tiles and generous spacing. Keyboard keys stay 46px high with narrow gaps; help/close controls are 44×44px and primary actions are at least 48px high. Dialogs retain outer margins, account for safe-area insets, and scroll internally if content exceeds the available height.

## Accessibility

- Each tile exposes a letter/state label (for example, “T, correct position”). Check, arrow, and cross symbols accompany evaluated colors on tiles and keyboard keys.
- The board is focusable. Type letters, Enter to submit, and Backspace to delete; Tab navigates controls, and Space activates virtual keys. Game input is paused in dialogs. Typing after closing help returns focus to the board.
- Native modal dialogs have named titles, explicit modal semantics, forward/backward Tab wrapping, Escape dismissal, initial heading focus, and restoration of the previous focus.
- Focus outlines remain visible, including in forced-color mode. Toasts and guess results use live regions.
- Text contrast tests cover default, secondary, hover, and result/accent combinations at a minimum 4.5:1. Secondary text is #8B8B8B to clear this threshold on #242424.
- Reduced motion disables tile/shake animations and opens result dialogs without waiting for animation events.

Reference: [WCAG contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) and [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Browser keyboard and accessibility-tree checks are included in manual verification; a dedicated screen-reader user test has not been performed.

## Code organization

`src/game/rules.ts` owns shared constants and input normalization. `gameState.ts` implements pure state transitions, while `useGame` owns React state, physical keyboard handling, and message timers. `data/vocabulary.ts` exposes the validated dataset and its shared type. The board derives accessible announcements without duplicating state. Onboarding lives outside the per-word reset boundary so it stays dismissed for the visit even when browser storage is unavailable. Tests share one lightweight TypeScript loader and require no extra runtime or testing framework.

## Levels, hints, and adding vocabulary

- Edit `src/data/solutions.json` to add a playable solution. Use the existing 11-field schema. Keep `word` uppercase and NFC-normalized, `displayWord` naturally capitalized, and `length` exactly 5. Allowed levels are A1/A2/B1/B2; allowed types are noun/verb/adjective/other. Nouns need an article; use `plural: null` when the taught sense has no usual plural. Non-nouns use null for article and plural.
- Run `npm run validate:data` to ensure new solutions are present in the generated dictionary. Accepted guesses come only from the upstream dictionary, including inflected forms, across all levels. Changing a level filters solutions, not guesses.
- Categories are short German labels. Hints are original English descriptions; do not include the answer or its direct translation. The first hint shows the category, the second the article or word type, and the third the descriptive clue. Meaning and example remain exclusive to end-of-game results.
- `useVocabularyGame` owns the selected level and target. The selected level is stored under `deutschle:level`, with a safe A1 fallback for invalid/unavailable storage. A level change immediately starts a fresh game. Next-word selection excludes the previous word when alternatives exist.
- `useHints` owns the three-step hint count within each game. Both level changes and next-word actions reset it with board and keyboard state. `GameTools` presents the compact native level selector and inline hints.
- Run `npm run validate:data` after editing. It checks exact lengths, spelling characters, metadata, answer leakage in clues, uniqueness, accepted-word membership, and at least 30 words per level. Run `npm test` for selection and hint-field tests.

The word choices and examples are curated for this game. [Goethe's A1 vocabulary reference](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf) provides general learner-vocabulary context; these level assignments are not an official Goethe list.


## German guess dictionary

`npm run generate:words` regenerates `src/data/acceptedWords.ts` offline using the vendored LibreOffice `de/de_DE_frami.dic` and `.aff` files. See [source provenance and licenses](scripts/dictionaries/README.md). `hunspell-reader` is a pinned development dependency; the browser imports only the generated Set and makes no dictionary API requests. Generation applies Hunspell affixes before selecting five-letter A–Z/Ä/Ö/Ü words, excludes sharp S before uppercase conversion, removes duplicates, and sorts deterministically. This is a broad spelling dictionary, not a curated learner list.

`solutionWords` in `src/data/vocabulary.ts` wraps the curated learning entries in `src/data/solutions.json`. Only these entries become answers. Target pools are cumulative: A1 has 30 words; A2 has 60; B1 has 90; B2 has 120. Valid guesses never depend on CEFR level. Add learning metadata only to `solutions.json`.
