export declare const ARMOR_STAT_KEYS: readonly ["weapons", "health", "class", "grenade", "super", "melee"];
export type ArmorStatKey = (typeof ARMOR_STAT_KEYS)[number];
export type ArmorStats = Record<ArmorStatKey, number>;
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
export type ArmorSubclassSource = "equipped" | "custom" | "none";
export type ArmorSubclassConfiguration = {
    source: ArmorSubclassSource;
    subclassHash?: number;
    aspectHashes: number[];
    fragmentHashes: number[];
    optimizeFragments: boolean;
    pinnedFragmentHashes: number[];
};
export type ArmorExplorerLocation = "target-character" | "vault" | "other-characters";
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
export type ArmorRecommendedActionKind = "move" | "equip" | "upgrade" | "retune" | "stat-mod" | "subclass";
export type ArmorRecommendedAction = {
    order: number;
    kind: ArmorRecommendedActionKind;
    itemId?: string;
    label: string;
    recommendationOnly: true;
};
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
export declare const VAEXIL_LOADOUT_INTENT_VERSION: 1;
export type VaexilLoadoutIntentV1 = {
    kind: "VaexilLoadoutIntent";
    version: typeof VAEXIL_LOADOUT_INTENT_VERSION;
    createdAt: string;
    name?: string;
    configuration: ArmorOptimizerUrlConfiguration;
};
export declare const VAEXIL_OWNED_ARMOR_LOADOUT_VERSION: 1;
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
export type InventoryExecutionHandoffSource = "individual-item" | "recommendation" | "alternative" | "saved-loadout";
export type InventoryManualStepKindV2 = "stat-mod" | "masterwork" | "tuning" | "resource" | "energy" | "subclass";
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
