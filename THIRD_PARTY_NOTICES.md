# Third-party notices

KarSaathi is an independent prototype. It is not affiliated with or endorsed by the Income Tax Department, the Government of India, OpenAI, or the Build What Moves India organisers.

## Direct open-source dependencies

The application uses the following directly declared packages. Exact installed versions and transitive packages are recorded in `package-lock.json`.

| Software | Purpose | Licence | Project |
| --- | --- | --- | --- |
| React | User-interface rendering | MIT | https://react.dev/ |
| React DOM | Browser renderer for React | MIT | https://react.dev/ |
| React Router | Client-side routing | MIT | https://reactrouter.com/ |
| OpenAI JavaScript library | Optional server-side model request client | Apache-2.0 | https://github.com/openai/openai-node |
| Vite | Development server and production build | MIT | https://vite.dev/ |
| `@vitejs/plugin-react` | React integration for Vite | MIT | https://github.com/vitejs/vite-plugin-react |
| ESLint and its declared plugins | Static analysis | MIT | https://eslint.org/ |
| Vitest | Test runner | MIT | https://vitest.dev/ |
| Testing Library for React and jest-dom | Component tests and DOM assertions | MIT | https://testing-library.com/ |
| jsdom | Browser-like test environment | MIT | https://github.com/jsdom/jsdom |

The full licence text and copyright notices for these packages are available in their distributions and linked repositories. Transitive dependencies retain their respective licences.

## Assets, fonts, and content

- The submitted KarSaathi interface uses original text-based branding and system fonts.
- It does not use the State Emblem of India or another government logo in the product UI.
- Synthetic taxpayer names, identifiers, records, amounts, and scenarios are fictional fixtures created for this prototype. They must not be interpreted as real people or records.
- Product copy is original except for short tax terms and facts paraphrased from the official sources listed in `docs/research.md`.
- No source code, personal data, or private government-system material is copied from the Income Tax e-Filing portal.

## Starting repository

The project was developed from the existing `sufyaanahmed/ITR-Seva` repository. Its earlier commits contained a broad ITR portal simulation derived from an earlier visa-portal concept. The hackathon work substantially replaces that product direction with the independent KarSaathi journey. Repository history is retained as provenance.

## Maintainer check before submission

Before publishing, compare this file with `package.json` and the rendered application. Add any new library, image, icon, font, template, generated asset, or copied fixture and its licence/source. Remove any unused legacy government-mark asset from the deployment output.
