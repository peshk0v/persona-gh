# persona-gh

Multi-theme GitHub profile README generator with seven visual styles, from **Material 3 Expressive** to **Retropixel**. Every theme renders the same blocks with its own surfaces, borders, radii, shadows, typography, accents and light/dark tokens.

> **Fork notice**
>
> `persona-gh` is a fork of [expressive-profile](https://github.com/metawka/expressive-profile), originally created by [metawka](https://github.com/metawka). The original code, design, and documentation are © metawka and stay under the MIT License. This fork keeps the original copyright notice and adds `Copyright (c) 2026 peshk0v`. See [LICENSE](LICENSE).

- Fork source: <https://github.com/peshk0v/persona-gh>
- Issues: <https://github.com/peshk0v/persona-gh/issues>
- Upstream project: <https://github.com/metawka/expressive-profile>
- Original author: <https://github.com/metawka>

## Status

**Phase 2: multi-theme engine.** The rebrand to `persona-gh` is complete and the renderer now runs through a theme registry. Material 3 works exactly as before; six new themes ship beside it and existing `profile.json` files stay compatible.

## Themes

| Theme | Character |
| --- | --- |
| **Material 3** | Expressive color, soft organic shapes and tonal surfaces. |
| **Minimalism** | Hairline borders, monochrome surfaces and generous whitespace. |
| **Warm minimalism** | Paper and sand tones with calm editorial typography. |
| **Glassmorphism** | Frosted layers, soft ambient glow and translucent cards. |
| **Neumorphism** | Soft extruded surfaces with tactile raised and inset shadows. |
| **Bento grid** | Modular cells, crisp borders and data-widget hierarchy. |
| **Retropixel** | Sharp pixel frames, hard shadows and console typography. |

The theme selector lives in the editor's **Style** panel. Each theme keeps its identity across light and dark mode, while the accent palette is still derived from the chosen seed color.

## Features

- Blocks: header, socials, about, tech stack, project cards, activity, streak, divider, link buttons.
- Seven rendering themes with live previews and a theme selector.
- Live preview with editing by click, drag to reorder, hiding blocks.
- Material 3 color palette built from one color, a custom color or an image. Five palette styles, light and dark themes.
- Eight Material 3 shapes for the avatar, project cards and social icons; other themes use their own geometry.
- Typing animation for the subtitle and animations in every card. Animations can be turned off.
- Icon search across Material Symbols and Simple Icons.
- Templates, a shareable link to a setup and a "make one like this" page for any profile built with the generator.
- Opening a username that already has a `profile.json` setup, from this fork or the upstream project.
- English and Russian interface.

## Roadmap

- Phase 1: rename the project, update repository and author metadata, preserve the original MIT notice.
- Phase 2: introduce a theme registry and theme tokens, then add new profile design styles beside Material 3 Expressive.
- Later: theme-aware templates, per-theme typography packaging, and a public gallery of community setups.

## Usage

1. Run the generator locally with `npm run dev`.
2. Enter a GitHub username and set up the blocks.
3. Press **Download** and choose **Install to GitHub** or **Download archive**.

The site is configured for GitHub Pages at `/persona-gh/`. Once deployed, the generator URL will be <https://peshk0v.github.io/persona-gh/>.

Manual setup: **Download archive** gives a ZIP for a public repository named exactly like the username. All files from it are uploaded to that repository, including the `.github` and `.profile` folders.

Signing in uses the GitHub device flow with the `public_repo` and `workflow` scopes. The token stays in the browser tab and is used only for this upload. If the repository already has a README, the generator asks before replacing it.

The first workflow run replaces the preview data with exact stats and pinned repositories. Then the profile updates every hour and commits only when the data changes, plus once a day for the calendar.

To change the profile later, edit `profile.json` in the repository or set it up again on the site and upload the new `profile.json`.

The editor reads `profile.json` from the root of the profile repository, so setups made with this fork or with the upstream [expressive-profile](https://github.com/metawka/expressive-profile) open as-is: entering a username that already has that file loads their theme, colors, blocks and texts instead of starting from defaults. Re-entering the same username only refreshes the numbers, and a username without a saved setup keeps the setup currently on screen.

## Deploying the site

1. Create or rename the GitHub repository to **`persona-gh`**. The production Vite base path is `/persona-gh/`, so a different repository name breaks asset URLs unless `vite.config.ts` is changed to match.
2. Push the project to the `main` branch.
3. Open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
4. The bundled `Pages` workflow runs `npm ci` and `npm run build`, then publishes `dist` to <https://peshk0v.github.io/persona-gh/>.
5. Run `npm run renderer` after changing renderer code and commit `action/render.mjs`. The generated profile workflow uses `peshk0v/persona-gh@main`, which runs that bundle.

### Sign-in proxy

**Install to GitHub** uses the device-flow proxy in [`proxy/`](proxy). Deploy that folder as a Vercel project, then point `AUTH` in `src/app/install.ts` at the deployment URL. Without a proxy deployment, use **Download archive** and upload the ZIP contents manually. Downloading, editing and copying the generated Markdown do not require sign-in.

## Action

The archive contains this workflow:

```yaml
name: persona-gh

on:
  schedule:
    - cron: "17 * * * *"
  workflow_dispatch:
  push:
    paths:
      - profile.json
      - .profile/icons.json
      - .github/workflows/persona-gh.yml

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peshk0v/persona-gh@main
        with:
          token: ${{ secrets.PROFILE_TOKEN || github.token }}
```

| Input | Default | Description |
| --- | --- | --- |
| `token` | `github.token` | Token for the GitHub API |
| `commit-message` | `Updated profile` | Message of update commits |

With the default token the language chart counts public repositories only. Private repositories are counted with a personal access token saved as the `PROFILE_TOKEN` secret.

> **Action dependency note:** the generated workflow uses this fork's Action (`peshk0v/persona-gh@main`), so all seven themes render on GitHub. Pin it to a release tag such as `@v1` after publishing one. The upstream project is still credited in the license and project links.

## Theme engine

The renderer is theme-driven, with Material 3 as the default:

- `src/render/types.ts` defines `Config`, including `theme: ThemeId`, `seed`, `scheme`, `motion`, `iconFill`, and block settings. Configs without `theme` migrate to `material-3`, so existing `profile.json` files keep working.
- `src/render/themes/` is the registry. `index.ts` exposes `THEMES`, `THEME_IDS` and `getTheme()`. Each theme file defines its palette, card/project/inner/tile/row/chip surfaces, corner radii, line weights, badge and icon shapes, heading typography, and optional SVG `<defs>`, hero art and backdrop.
- `src/render/palette.ts` turns the seed color into Material role tokens for the Material theme. Other themes derive their own accents from the same seed while keeping their surface character.
- `src/render/kit.ts` provides SVG primitives: text measuring/wrapping, parametric shapes, square/rounded frames, themed surfaces, icons, chips, animation CSS, and the SVG document wrapper.
- `src/render/blocks.ts` renders each block as a standalone SVG using the active theme, palette, shapes, and icons.
- `src/render/index.ts` resolves the theme, loops over light/dark modes, renders every block, and builds the Markdown `README.md` from the generated assets.
- `src/app/editors.tsx` contains the theme selector plus seed color and palette scheme controls; `src/app/presets.ts` controls block composition.
- `src/app/App.tsx` applies the active theme palette to CSS variables for the editor UI and previews the generated SVGs.

All generated SVG stays inside GitHub's README sanitizer: inline `<defs>`, `<filter>`, `<linearGradient>`, `<radialGradient>` and `<pattern>` only, no scripts and no external references.

## Development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

`npm run build` builds the site into `dist` and the Action renderer into `action/render.mjs`.

The `proxy` folder contains the sign-in proxy deployed on Vercel. It forwards two device flow requests to GitHub and stores nothing.

## Privacy

This fork does not include the upstream GoatCounter analytics snippet. The original project counted visits on `metawka.github.io` only; the fork ships without analytics.

The sign-in flow still uses the upstream device-flow proxy endpoint (`expressive-profile-auth.vercel.app`) during Phase 1. A fork-owned proxy will be needed for a production deployment; the proxy source is included in [`proxy/`](proxy).

## License

The code is under the [MIT License](LICENSE).

Original work © 2026 metawka. Fork changes © 2026 peshk0v.

Third-party assets:

- Google Sans Flex and Roboto Flex: SIL Open Font License, see `fonts/`.
- Material Symbols: Apache License 2.0.
- Simple Icons: CC0 1.0. Brand icons belong to their owners.

## Credits

- Original project: [expressive-profile](https://github.com/metawka/expressive-profile) by [metawka](https://github.com/metawka).
- Fork maintained by [peshk0v](https://github.com/peshk0v).
