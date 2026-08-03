// @vaexil/d2-contracts
//
// Single source of truth for the wire types shared between the Vaexil D2 Armor
// Optimizer and the Vaexil D2 Armory. These two apps deploy independently but
// must agree on the loadout shape, the optimizer URL configuration, the
// recommended action plan, and the cross-app execution handoff. Before this
// package the shapes were hand-mirrored in each app and had begun to drift
// (see InventoryExecutionHandoffV2.source, unified here).
//
// This module is intentionally pure types + version constants. Runtime helpers
// (validation, serialization, handoff queueing) stay in each app because they
// depend on app-local modules.
// ---------------------------------------------------------------------------
// Armor stat system
// ---------------------------------------------------------------------------
export const ARMOR_STAT_KEYS = [
    "weapons",
    "health",
    "class",
    "grenade",
    "super",
    "melee",
];
// ---------------------------------------------------------------------------
// Loadout intent (Armory -> Optimizer export/import) and owned loadout
// (Optimizer -> Armory save). Versioned so either side can gate on version.
// ---------------------------------------------------------------------------
export const VAEXIL_LOADOUT_INTENT_VERSION = 1;
export const VAEXIL_OWNED_ARMOR_LOADOUT_VERSION = 1;
