# Agent notes: @vaexil/d2-contracts

## What this is

A types-only TypeScript package holding the Destiny 2 wire shapes (armor stats,
optimizer URL config, `VaexilLoadoutIntentV1`, `VaexilOwnedArmorLoadoutV1`,
`InventoryExecutionHandoffV2`) used by the Armory on vaexil.tv. It is not deployed
on its own and has no runtime, database, or secrets. Its only consumer is the
vaexil.tv repo, which installs it from GitHub at a pinned tag. The README covers
history and the consumer's import sites; read it before changing anything.

## Layout

- `src/index.ts` is the whole package. The only runtime values are
  `ARMOR_STAT_KEYS` and the two `*_VERSION` constants; everything else is types.
- `dist/` is committed and is what consumers import (`package.json` `main`,
  `types`, `exports` all point at it). There is no `prepare` script, so a git
  install never builds. `.claudeignore` hides `dist/`, so Claude-based agents
  will not see it unless they look on purpose.

## Consumer hazards

- vaexil.tv pins `github:JAMARQ-Digital-LLC/vaexil-d2-contracts#v1.0.0` and its
  lockfile resolves that to commit `fb088e0`. Merging to `main` changes nothing
  in production. A release means: new tag, then bump the pin and lockfile in
  vaexil.tv and run its own `npm run verify` there.
- Never move, delete, or re-point an existing tag. The lockfile holds the SHA,
  so a moved tag silently diverges from what vaexil.tv builds, and a deleted
  tag breaks fresh installs of the pin.
- Never edit a published shape in place. Add a new versioned type (`...V2`,
  `...V3`) with its own version constant. The Armory compares the `*_VERSION`
  constants at runtime to accept or reject saved loadouts, so changing a value
  changes live behavior.
- vaexil.tv's Optimizer does not import this package. It keeps its own copy of
  the loadout shapes and version constants in `src/lib/armor-loadout-contract.ts`
  (vaexil.tv repo). A shape or version change here must be matched there by
  hand, or the Optimizer and Armory stop accepting each other's loadouts.
- `main` is ahead of `v1.0.0` only by comment changes in `src/` and `dist/`.
  Do not tag `main` just to "catch up"; there is nothing to ship.
- The local checkouts of `vaexil-d2-armory` and `vaexil-d2-armor-optimizer`
  are archived repos with stale `jmars319/...` pins. They are not consumers;
  do not update them. Statward does not use this package.

## Verify

CI requires three checks on `main`: `verify`, `Gitleaks`, `just security`.

- `npm run verify` - typecheck then build (writes `dist/`).
- After it, `git status --short` must be empty. CI does not check that `dist/`
  matches `src/`; a stale `dist/` passes CI and ships the old types. Commit
  `src/` and `dist/` together.
- `just security` - `actionlint` plus `osv-scanner` (needs `just`,
  `actionlint`, `osv-scanner` installed).

All of the above pass on a clean `main`. Node is pinned by `.nvmrc`
(22.12.0; `engines` allows `>=22.12.0 <23`) and npm by `packageManager`.

## Repo-local conventions

- The repo is public. CI must stay on GitHub-hosted runners; never add a
  self-hosted runner label to any workflow.
- `dependabot-auto-merge.yml` enables auto-merge for Dependabot minor and
  patch PRs (Tier A). Dependabot bumps never need a tag.
