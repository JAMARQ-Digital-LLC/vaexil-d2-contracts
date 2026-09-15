# @vaexil/d2-contracts

Shared wire types for the Destiny 2 tools on **vaexil.tv**: the Armor Optimizer and the Armory, both served from `destiny2.vaexil.tv`.

The package started as the contract between two separately deployed apps, the Vaexil D2 Armor Optimizer and the Vaexil D2 Armory. Both were folded into vaexil.tv on 2026-08-16 and their standalone repos are archived. The package was kept on purpose: it holds the loadout and handoff shapes as a versioned, typed seam, so a tool surface can be pulled back out later without renegotiating its contract.

## Who uses it

vaexil.tv, pinned to a tag. `dist/` is committed, so no install-time build is needed:

```jsonc
"@vaexil/d2-contracts": "github:JAMARQ-Digital-LLC/vaexil-d2-contracts#v1.0.0"
```

The imports all live in the Armory, under `src/app/(hub)/armory/`:

- `_lib/armor-loadout-shape.ts`, `_lib/inventory-action-contract.ts` and `_lib/vaexil-loadout-contract.ts` take their types from the package and re-export them for local use.
- `_components/use-armory-recipe-actions.ts` imports `VaexilLoadoutIntentV1` and `VAEXIL_LOADOUT_INTENT_VERSION` directly.

The Armor Optimizer page runs on vaexil.tv's own embedded implementation and does not import the package.

## What's in it

Pure types + version constants only (no runtime logic — validation/serialization/handoff helpers stay in the app because they depend on app-local modules): the armor stat system, investment/subclass/explorer/resource config, `ArmorOptimizerUrlConfiguration`, `VaexilLoadoutIntentV1`, `VaexilOwnedArmorLoadoutV1`, and `InventoryExecutionHandoffV2` (+ its manual-step and source unions).

## The drift it fixed

Before this package the shapes were hand-mirrored in each app, and they had begun to drift. `InventoryExecutionHandoffV2.source` was declared as `"recommendation" | "alternative" | "saved-loadout"` on the Optimizer (writer) but the superset including `"individual-item"` on the Armory (reader). The package unified it to the full set, so the compiler catches any mismatch.

## Changing it

- Edit `src/index.ts`, run `npm run verify` (typecheck, then build), and commit `src/` and `dist/` together.
- A change reaches vaexil.tv only when you tag a new version and bump the pin there. Merging to `main` alone changes nothing in production.
- Shapes carry their version in the name (`…V1`, `…V2`) and a matching version constant. Change a shape by adding a new version rather than editing a published one in place.
- The repo is public. Its CI must stay on GitHub-hosted runners; never give it a self-hosted runner.
