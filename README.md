## Mini Sudoku Archive

Open-source recreation of LinkedIn’s 6×6 Mini Sudoku. The goal is to keep every community puzzle accessible, let authors submit new levels through PRs, and deploy the experience to Vercel.

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

MIT License — contributions welcome. Open an issue or PR if you’d like to help expand the archive or improve the builder UX.
