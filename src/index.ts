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
] as const;

export type ArmorStatKey = (typeof ARMOR_STAT_KEYS)[number];
export type ArmorStats = Record<ArmorStatKey, number>;

// ---------------------------------------------------------------------------
// Build constraints and investment
// ---------------------------------------------------------------------------
export type ArmorSetToggleRequirement = {
  setHash: number;
  count: 2 | 4;
};

export type ArmorOptimizationStrategy = "strict-priority" | "balanced-pair";

export type ArmorMasterworkMode = "current" | "full";
export type ArmorTuningMode = "current" | "optimize";

export type ArmorInvestmentSettings = {
  masterwork: ArmorMasterworkMode;
  tuning: ArmorTuningMode;
  statModSlots: number;
  maxMajorStatMods: number;
  respectCurrentEnergy: boolean;
};

// ---------------------------------------------------------------------------
// Subclass configuration
// ---------------------------------------------------------------------------
export type ArmorSubclassSource = "equipped" | "custom" | "none";

export type ArmorSubclassConfiguration = {
  source: ArmorSubclassSource;
  subclassHash?: number;
  aspectHashes: number[];
  fragmentHashes: number[];
  optimizeFragments: boolean;
  pinnedFragmentHashes: number[];
};

// ---------------------------------------------------------------------------
// Explorer filters and resources
// ---------------------------------------------------------------------------
export type ArmorExplorerLocation =
  | "target-character"
  | "vault"
  | "other-characters";

export type ArmorExplorerFilters = {
  locations: ArmorExplorerLocation[];
  equipState: "any" | "equipped" | "unequipped";
  destinyLockState: "any" | "locked" | "unlocked";
  gearTiers: number[];
  minBaseTotal: number;
  minBaseStats: ArmorStats;
  allowedSetIds: string[];
  excludedSetIds: string[];
  minMasterworkLevel: number;
  requireCurrentEnergyFit: boolean;
  maxMoves?: number;
  maxUpgradeActions?: number;
  maxRetuneActions?: number;
  maxStatModChanges?: number;
};

export type ArmorResourceMode = "informational" | "affordable-only";

export type ArmorResourcePolicy = {
  mode: ArmorResourceMode;
  reserves: Record<string, number>;
};

export type ArmorPieceRules = {
  lockedItemIds: string[];
  excludedItemIds: string[];
};

export type ArmorTargetCharacter = {
  policy: "recent-matching" | "explicit";
  characterId?: string;
};

// ---------------------------------------------------------------------------
// Recommended action plan (recommendation-only; never executed by the Armory)
// ---------------------------------------------------------------------------
export type ArmorRecommendedActionKind =
  | "move"
  | "equip"
  | "upgrade"
  | "retune"
  | "stat-mod"
  | "subclass";

export type ArmorRecommendedAction = {
  order: number;
  kind: ArmorRecommendedActionKind;
  itemId?: string;
  label: string;
  recommendationOnly: true;
};

// ---------------------------------------------------------------------------
// Durable, ownership-independent armor build intent (the shared URL config)
// ---------------------------------------------------------------------------
export type ArmorOptimizerUrlConfiguration = {
  className: string;
  exotic: string;
  sets: ArmorSetToggleRequirement[];
  targets: ArmorStats;
  primary: ArmorStatKey | null;
  secondary: ArmorStatKey | null;
  ignoredStats: ArmorStatKey[];
  strategy: ArmorOptimizationStrategy;
  primaryLossLimit: number;
  investment: ArmorInvestmentSettings;
  subclass?: ArmorSubclassConfiguration;
  explorerFilters?: ArmorExplorerFilters;
  resourceMode?: ArmorResourceMode;
};

// ---------------------------------------------------------------------------
// Loadout intent (Armory -> Optimizer export/import) and owned loadout
// (Optimizer -> Armory save). Versioned so either side can gate on version.
// ---------------------------------------------------------------------------
export const VAEXIL_LOADOUT_INTENT_VERSION = 1 as const;

export type VaexilLoadoutIntentV1 = {
  kind: "VaexilLoadoutIntent";
  version: typeof VAEXIL_LOADOUT_INTENT_VERSION;
  createdAt: string;
  name?: string;
  configuration: ArmorOptimizerUrlConfiguration;
};

export const VAEXIL_OWNED_ARMOR_LOADOUT_VERSION = 1 as const;

export type VaexilOwnedArmorLoadoutRecommendedPlug = {
  itemId: string;
  masterworkHash: number | null;
  tuningHash: number | null;
  statModHash: number | null;
};

export type VaexilOwnedArmorLoadoutV1 = {
  kind: "VaexilOwnedArmorLoadout";
  version: typeof VAEXIL_OWNED_ARMOR_LOADOUT_VERSION;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  configuration: ArmorOptimizerUrlConfiguration;
  pieceRules: ArmorPieceRules;
  resourcePolicy: ArmorResourcePolicy;
  targetCharacter: ArmorTargetCharacter;
  itemIds: string[];
  recommendedPlugs: VaexilOwnedArmorLoadoutRecommendedPlug[];
  actionPlan: ArmorRecommendedAction[];
};

// ---------------------------------------------------------------------------
// Cross-app execution handoff (sessionStorage: vaexil:destiny2:handoff:*:v1)
//
// DRIFT FIX: the Optimizer (writer) previously declared source as
//   "recommendation" | "alternative" | "saved-loadout"
// while the Armory (reader) declared the superset including "individual-item".
// Unified here to the full set. "individual-item" is Armory-internal today;
// keeping it in the shared type prevents the two hand-declared copies from
// silently disagreeing and lets the compiler catch any future addition.
// ---------------------------------------------------------------------------
export type InventoryExecutionHandoffSource =
  | "individual-item"
  | "recommendation"
  | "alternative"
  | "saved-loadout";

export type InventoryManualStepKindV2 =
  | "stat-mod"
  | "masterwork"
  | "tuning"
  | "resource"
  | "energy"
  | "subclass";

export type InventoryManualStepV2 = {
  kind: InventoryManualStepKindV2;
  label: string;
  itemInstanceId?: string;
};

export type InventoryExecutionHandoffV2 = {
  version: 2;
  source: InventoryExecutionHandoffSource;
  itemIds: string[];
  targetCharacterId?: string;
  className?: string;
  manualSteps: InventoryManualStepV2[];
};
