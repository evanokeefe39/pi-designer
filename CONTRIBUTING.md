# Contributing

Thanks for your interest in pi-designer.

## Workflow

`master` is protected: linear history, squash merges, and a green CI run are required. All changes land via pull request.

1. Branch from `master`: `git checkout -b feat/my-change`
2. Make your change with tests.
3. Run the checks locally:
   ```bash
   npm run check && npm run lint && npm test
   ```
4. Open a PR. It is merged with **Squash and merge** (the only enabled merge method), keeping history linear.

## Conventions

- TypeScript, ESM, no build step — pi loads `.ts` directly via jiti. Distribute source.
- Color math stays in OKLCH (`src/color.ts`). Keep ramp generators deterministic and pure.
- Each export medium is a self-contained module under `src/targets/` returning `OutputFile[]`. Add new targets to the `TARGETS` registry.
- Runtime dependencies go in `dependencies` (pi installs with `--omit=dev`). Type-only/tooling deps go in `devDependencies`.
- Every behavioral change needs a test. Pure functions are tested directly; targets are tested via `runTargets`.

## Adding a target

1. Create `src/targets/<name>.ts` exporting `(<tokens>) => OutputFile[]`.
2. Register it in `src/targets/index.ts`.
3. Add a test in `test/targets.test.ts` asserting the medium-specific invariant.
