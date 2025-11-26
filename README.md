<div align="center">
  <img src="https://github.com/horizonsimulations/Horizon-787/raw/main/branding/Horizon_Simulations.png" alt="Horizon Simulations" width="400"/>
</div>

## Mini Sudoku Archive

Open-source recreation of LinkedIn’s 6×6 Mini Sudoku. The goal is to keep every community puzzle accessible, let authors submit new levels through PRs, and deploy the experience to Vercel.

### The Story

41 years ago, a small Japanese magazine "Nikoli" introduced the world to Sudoku. Today, they're back with a fresh take.

Teaming up with Thomas Snyder, 3x World Sudoku Champion, they're handcrafting a new mini version. Just once a day.

This archive preserves every daily puzzle from LinkedIn's Mini Sudoku series, ensuring players can replay any level they missed or want to solve again.

**Original Creators:**
- **Nikoli** — The Japanese puzzle company that introduced Sudoku to the world in 1984
- **Thomas Snyder** — 3x World Sudoku Champion, co-creator of the Mini Sudoku series

Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

### Features

- Pixel-perfect board inspired by LinkedIn’s daily puzzle
- Unlimited hints (highlight + reasoning) without auto-filling answers
- Cookie-based progress tracking with an EU/GDPR-compliant consent banner
- Level metadata with automatic GitHub attribution for contributors
- Built-in Level Builder that exports ready-to-commit `.ts` files and links to the GitHub web editor
- Official levels grid (`/levels`) showing 10 puzzles per row with completion status
- File-based level registry in `src/levels`

### Local development

```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Using the archive

- Visit `/levels` to browse the official Mini Sudoku archive. Click any tile to load its dedicated play page.
- Each level gets its own URL at `/levels/<slug>`, making it easy to share or deep-link to a specific day.

### Adding a new level

1. Visit `/level-builder` locally (or https://mini-sodoku-linkedin.vercel.app/level-builder once deployed).
2. Fill the solved 6×6 grid, toggle the givens, and optionally write a description. The builder only exports the starting grid—our solver derives the finished board and hint data automatically.
3. Copy the generated code block (the slug/file name auto-converts to `level###` based on the title—e.g., "Level 107" → `level107`).
4. Click “Open GitHub web editor”, create `src/levels/<slug>.ts` (for example `src/levels/level107.ts`), and paste the code.
5. Export the level (default export) and add it to `src/levels/index.ts`.
6. Open a pull request. The automation will populate `githubHandle` with your GitHub username, so you don’t need to edit that field manually.

Each level file must export a `MiniSudokuLevel` object containing:

- `slug`, `title`, `publishedDate`
- `githubHandle` (filled automatically from the PR author)
- `startGrid` (with `null` entries for hidden cells)

### Deployment

Deploy directly to Vercel (recommended):

```bash
npm run build
vercel --prod
```

> The project is already configured for the App Router, React 19’s latest stable release, and Tailwind CSS 4 preview. No extra adapters are required for Vercel.

### License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

**Copyright © 2022-2025 Horizon Simulations Group Limited**

Horizon Simulations Group Limited is a company registered in England and Wales.  
Companies House Registration Number: 15714268.  
Registered address: 3rd Floor, 86-90 Paul Street, London, United Kingdom, EC2A 4NE.

#### GPL-3.0 License Terms

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html) for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

#### Contributing

Contributions are welcome! By contributing to this project, you agree that your contributions will be licensed under the same GPL-3.0 license. Open an issue or PR if you'd like to help expand the archive or improve the builder UX.
