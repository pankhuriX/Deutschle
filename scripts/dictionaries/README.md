# German dictionary provenance

Vendored unchanged from [LibreOffice/dictionaries](https://github.com/LibreOffice/dictionaries/tree/32b006a2c22a4ac7e8ed3f03346f7b3d85a970a4/de), revision `32b006a2c22a4ac7e8ed3f03346f7b3d85a970a4`:

- `de/de_DE_frami.dic`
- `de/de_DE_frami.aff`
- `de/README_de_DE_frami.txt`
- `de/COPYING_GPLv2` and `de/COPYING_GPLv3`

The upstream dictionary and word lists are licensed under GNU GPL version 2 or 3, as stated in its README and affix header. Those licenses and notices also accompany our generated derivative word list. Authors: Björn Jacke (base igerman98 dictionary) and Franz Michael Baumann (extension). Source text uses ISO-8859-1; preserve its original bytes. The frami extension contains vocabulary beyond the German core vocabulary; it is intentionally broader than our educational solution list.

Run `npm ci` with Node 22.18+ and then `npm run generate:words`. No network is needed for generation after dependencies are installed. The pinned development-only `hunspell-reader` consumes the dictionary flags and expands prefix/suffix rules, decoding the encoding from the `.aff` file. Its standalone-word iterator excludes forbidden words, compound-only fragments, and stems requiring an affix. It does not enumerate arbitrary compound combinations. Generation then filters supported five-letter forms; no Hunspell engine ships to the browser.

To update upstream, choose a new repository commit, download the same five files from `https://raw.githubusercontent.com/LibreOffice/dictionaries/<commit>/de/<filename>`, update this revision, and run generation, tests, and build. Keep the sources and generated output together in version control. Do not manually edit `src/data/acceptedWords.ts`.
