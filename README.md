# @vaexil/d2-contracts

Single source of truth for the wire types shared between the **Vaexil D2 Armor Optimizer** and the **Vaexil D2 Armory**. The two apps deploy independently but must agree on the loadout shape, the optimizer URL configuration, the recommended action plan, and the cross-app execution handoff.

Before this package the shapes were hand-mirrored in each repo (Armory's `armor-loadout-shape.ts` even names the Optimizer as "source of truth… kept in sync by hand"). They had begun to drift; this package collapses that into one typed contract.

## What's in it

Pure types + version constants only (no runtime logic — validation/serialization/handoff helpers stay in each app because they depend on app-local modules): the armor stat system, investment/subclass/explorer/resource config, `ArmorOptimizerUrlConfiguration`, `VaexilLoadoutIntentV1`, `VaexilOwnedArmorLoadoutV1`, and `InventoryExecutionHandoffV2` (+ its manual-step and source unions).

## The drift this fixes

`InventoryExecutionHandoffV2.source` was declared as `"recommendation" | "alternative" | "saved-loadout"` on the Optimizer (writer) but the superset including `"individual-item"` on the Armory (reader). Benign today (the Optimizer never writes `"individual-item"`), but a latent interop bug: a future change to one side's `source` values would silently diverge. This package unifies it to the full set, so the compiler catches any mismatch.

## Distribution (two separate Vercel apps)

Recommended: **git dependency to this repo**, pinned to a tag, matching the `cpanel-backend-kit` VCS precedent. `dist/` is committed so no install-time build is needed on Vercel:

```jsonc
// in each app's package.json
"@vaexil/d2-contracts": "github:jmars319/vaexil-d2-contracts#v1.0.0"
```

Alternative if you prefer no external fetch on the build: `npm pack` this package and commit the tarball into each app under `vendor/`, referenced via `"file:vendor/vaexil-d2-contracts-1.0.0.tgz"`.

## Migration plan

### Armory — low risk (do first)
Armory's contract files are already pure, logic-free mirrors, so this is a clean re-export swap:
- `src/lib/armor-loadout-shape.ts` → replace its type declarations with `export * from "@vaexil/d2-contracts";` (every `./armor-loadout-shape` import keeps resolving).
- `src/lib/vaexil-loadout-contract.ts` → import `VaexilOwnedArmorLoadoutV1` + `VAEXIL_OWNED_ARMOR_LOADOUT_VERSION` from the package; keep the local `isVaexilOwnedArmorLoadout` guard.
- `src/lib/inventory-action-contract.ts` → import `InventoryExecutionHandoffV2` / `InventoryManualStepV2` from the package for the handoff half (keep the Armory-only executor internals local).
- Give the currently-untyped intent literal in `src/components/armory-client.tsx` (~line 377) the `VaexilLoadoutIntentV1` type from the package.
- Verify: `npm run build`, the 59-test suite, `tsc --noEmit`, and a green Vercel preview.

### Optimizer — supervised (do with eyes on it)
This is the harder half and why it should not be blind-migrated: the contract types are interleaved with runtime logic and defined off transitive types.
- `src/lib/armor-loadout-contract.ts` declares `VaexilLoadoutIntentV1` / `VaexilOwnedArmorLoadoutV1` alongside 66 lines of `safeConfiguration` validation; its `actionPlan` is typed as `ArmorRecommendedBuildSummary["actionPlan"]` (a derived type), which is structurally equal to `ArmorRecommendedAction[]` but not declared identically.
- The config shapes come from `armor-optimizer-url.ts`, `armor-stat-definitions.ts`, `armor-explorer.ts`, `armor-investment-settings.ts`, `armor-subclass.ts`, `armor-resources.ts`, `armor-piece-rules.ts` — each with its own runtime logic.
- Safe approach: keep the runtime functions in place; replace only the **type declaration** lines in each of those files with `import`/`re-export` from `@vaexil/d2-contracts`, verifying `tsc --noEmit` after each file so a structural mismatch is caught immediately. Reconcile the `actionPlan` element type (`ArmorRecommendedAction`) explicitly.
- Verify: `npm run verify` (lint → typecheck → invariants → 45-test vitest → build → e2e) and a green Vercel preview before merge.

Both app PRs should be gated on green CI **and** a green Vercel preview before merging, since they ride a new cross-repo dependency into production.
