// codexData_full_generated.ts
// Massive programmatic codex + recipes + loot tables + spawn maps for post-apoc anime game.

import { CodexEntity, CodexEntityType } from './types';

// ---------------------------------
// Basic constants & types
// ---------------------------------
export const GRID_WIDTH = 25;
export const GRID_HEIGHT = 25;
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const TICK_RATE = 500; // ms per game tick
export const INITIAL_SURVIVORS = 5;
export const INITIAL_ZOMBIES = 3;

// ---------------------------------
// Helpers: id, small svg/textures
// ---------------------------------
function pad(n: number, len = 3) { return String(n).padStart(len, "0"); }
function uid(prefix: string, idx: number) { return `${prefix}_${pad(idx)}`; }
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function animePalette(seed = 0) {
  const palettes = [
    ["#f1c27d", "#7b5a3a", "#2b2b2b"],
    ["#d98880", "#4a235a", "#1c1c2b"],
    ["#a3d9ff", "#2b6a8a", "#0f2b3b"],
    ["#f6e58d", "#b57a57", "#2a2a2a"],
    ["#b0e57c", "#556b2f", "#15220f"],
    ["#ffd1dc", "#69263f", "#24121b"],
  ];
  return palettes[seed % palettes.length];
}

function svgBackdrop(seed: number, name: string) {
  // Returns only the opening SVG tag for a transparent background.
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">`;
}
function svgFinish() { return `</svg>`; }

// ---------------------------------
// Template pool (same approach as earlier, tuned counts)
// ---------------------------------
type Template = {
  prefix: string;
  baseName: string;
  type: CodexEntityType;
  category: string;
  count: number;
  makeAttributes: (i: number, globalIdx: number) => Record<string, any>;
  makeInteractions?: (i: number, globalIdx: number) => any[];
  designHintBase?: string;
  svgMaker?: (i: number, globalIdx: number) => string;
};

const templates: Template[] = [
  // Characters - survivors (varied professions)
  {
    prefix: "char_survivor",
    baseName: "Survivor",
    type: CodexEntityType.CHARACTER,
    category: "player",
    count: 40,
    makeAttributes: (i, g) => {
        const baseTypes = ['male', 'female'];
        const hairTypes = ['hair1', 'hair2', 'hair3', 'hair4', 'hair5'];
        const outfitTypes = ['jacket', 'hoodie', 'armor', 'scavenger', 'worker'];
        const weaponTypes = ['knife', 'bat', 'pistol', 'rifle', 'none'];
        return {
          hp: 80 + (i % 5) * 6,
          stamina: 70 + (i % 6) * 5,
          hunger: 100,
          thirst: 100,
          speed: 1.6 + ((i % 4) * 0.12),
          profession: ["scavenger", "mechanic", "medic", "hunter", "engineer", "cook"][i % 6],
          inventoryCap: 20 + (i % 5) * 5,
          visuals: {
                base: baseTypes[g % baseTypes.length],
                hair: hairTypes[g % hairTypes.length],
                outfit: outfitTypes[g % outfitTypes.length],
                weapon: weaponTypes[g % weaponTypes.length],
            }
        };
    },
    makeInteractions: (i) => [{ action: "talk" }, { action: "trade" }, { action: "quest" }],
    designHintBase: "anime-survivor: cel-shading, bandaged sleeve, ribbon accessory, dusty palette",
  },

  // Raiders
  {
    prefix: "char_raider",
    baseName: "Raider",
    type: CodexEntityType.CHARACTER,
    category: "enemy_raider",
    count: 45,
    makeAttributes: (i, g) => {
        const baseTypes = ['male', 'female'];
        const hairTypes = ['hair1', 'hair3', 'hair5'];
        const outfitTypes = ['armor', 'scavenger', 'jacket'];
        const weaponTypes = ['knife', 'bat', 'pistol', 'rifle'];
        return {
            hp: 70 + (i % 7) * 6,
            damage: 10 + (i % 6) * 3,
            speed: 1.7 + (i % 3) * 0.18,
            aggression: 50 + (i % 50),
            lootTier: 1 + (i % 4),
            visuals: {
                base: baseTypes[g % baseTypes.length],
                hair: hairTypes[g % hairTypes.length],
                outfit: outfitTypes[g % outfitTypes.length],
                weapon: weaponTypes[g % weaponTypes.length],
            }
        };
    },
    makeInteractions: (i) => [{ action: "attack" }, { action: "raze" }],
    designHintBase: "dusty leather, patched armor, scratched visor, graffiti sigils",
  },

  // Mutants (various types)
  {
    prefix: "char_mutant",
    baseName: "Mutant",
    type: CodexEntityType.CHARACTER,
    category: "creature",
    count: 70,
    makeAttributes: (i, g) => ({
      hp: 40 + (i % 9) * 9,
      damage: 8 + (i % 6) * 4,
      speed: 1.1 + (i % 5) * 0.22,
      mutationLevel: 1 + (i % 6),
      behavior: ["feral", "pack", "ambush", "volatile", "lurker"][i % 5],
      visuals: {
            base: 'mutant',
            outfit: 'mutant_skin',
      }
    }),
    makeInteractions: (i) => [{ action: "hunt" }, { action: "pack_hunt" }],
    designHintBase: "mutant: crackled skin, luminescent marks, elongated limbs",
  },

  // Environment: trees, rocks, scrap piles, bushes, car wrecks
  {
    prefix: "env_tree",
    baseName: "DeadTree",
    type: CodexEntityType.ENVIRONMENT,
    category: "resource_tree",
    count: 36,
    makeAttributes: (i) => ({ hp: 40 + (i % 4) * 12, resource: "wood", yieldMin: 2 + (i % 3), yieldMax: 6 + (i % 5) }),
    makeInteractions: (i) => [{ action: "chop", tool: "axe", time: 3 + (i%4) }],
    designHintBase: "gnarled branches, flaky bark details, moss streaks",
    svgMaker: (i, g) => `${svgBackdrop(g, 'tree') }
      <rect x="46" y="45" width="8" height="40" fill="#6b4f3a"/>
      <path d="M20 55 C40 30 60 30 80 55" fill="#8c6d4e" opacity="0.95"/>
    ${svgFinish()}`
  },
  {
    prefix: "env_rock",
    baseName: "Stone",
    type: CodexEntityType.ENVIRONMENT,
    category: "resource_rock",
    count: 28,
    makeAttributes: (i) => ({ hp: 60 + (i%4)*14, resource: "stone", yieldMin: 3 + (i%3), yieldMax: 9 + (i%6) }),
    makeInteractions: (i) => [{ action: "mine", tool: "pickaxe", time: 4 + (i%3) }],
    designHintBase: "layered rock strata, mineral veins, small lichen patches",
    svgMaker: (i, g) => `${svgBackdrop(g, 'rock') }<polygon points="30,80 50,30 70,80" fill="#7f8c8d" stroke="#333" stroke-width="2"/>${svgFinish()}`
  },
  {
    prefix: "env_scrap",
    baseName: "ScrapPile",
    type: CodexEntityType.ENVIRONMENT,
    category: "resource_scrap",
    count: 36,
    makeAttributes: (i) => ({ hp: 30 + (i%5)*6, resource: ["metal_scraps","electronics"][i%2], yieldMin: 1, yieldMax: 6 }),
    makeInteractions: (i) => [{ action: "salvage", tool: "crowbar", time: 2 + (i%4) }],
    designHintBase: "rusted plates, coils, tangled wires, anime-labeled crate fragments",
    svgMaker: (i, g) => `${svgBackdrop(g, 'scrap') }<path d="M20,85 L40,60 L70,65 L85,85 Z" fill="#7f7f7f"/>${svgFinish()}`
  },
  {
    prefix: "env_bush",
    baseName: "HerbBush",
    type: CodexEntityType.ENVIRONMENT,
    category: "resource_herb",
    count: 20,
    makeAttributes: (i) => ({ hp: 18 + (i%3)*6, resource: "medicinal_herbs", yieldMin: 1, yieldMax: 3 }),
    makeInteractions: (i) => [{ action: "forage", time: 1 + (i%2) }],
    designHintBase: "soft leaf clusters, tiny sparkles (anime healing herbs)",
    svgMaker: (i, g) => `${svgBackdrop(g, 'bush') }<circle cx="50" cy="60" r="25" fill="#4a6b4f"/><circle cx="40" cy="70" r="18" fill="#5a7b5f"/><circle cx="60" cy="70" r="18" fill="#5a7b5f"/>${svgFinish()}`
  },
  {
    prefix: "env_car",
    baseName: "CarWreck",
    type: CodexEntityType.ENVIRONMENT,
    category: "vehicle_wreck",
    count: 16,
    makeAttributes: (i) => ({ hp: 150 + (i % 4) * 70, resource: ["metal_scraps","electronics"], yieldMin: 6, yieldMax: 18 }),
    makeInteractions: (i) => [{ action: "salvage", tool: "crowbar", time: 5 + (i%4) }],
    designHintBase: "shattered windshield, graffiti, neon residue, anime-sticker decals",
    svgMaker: (i,g) => `${svgBackdrop(g,'car') }<rect x="15" y="50" width="70" height="25" fill="#7d3c3c"/><circle cx="30" cy="80" r="6" fill="#333"/><circle cx="70" cy="80" r="6" fill="#333"/>${svgFinish()}`
  },

  // Structures
  {
    prefix: "struct_workbench",
    baseName: "Workbench",
    type: CodexEntityType.STRUCTURE,
    category: "crafting",
    count: 10,
    makeAttributes: (i) => ({ hp: 120, craftTier: 2 + (i % 2) }),
    makeInteractions: (i) => [{ action: "craft", slotCount: 2 }],
    designHintBase: "stained wood, tool hooks, cute anime sticker",
    svgMaker: (i,g) => `${svgBackdrop(g,'workbench') }<rect x="15" y="60" width="70" height="20" fill="#6b4f3a" stroke="#3b2b20" stroke-width="2"/>${svgFinish()}`
  },
  {
    prefix: "struct_generator",
    baseName: "Generator",
    type: CodexEntityType.STRUCTURE,
    category: "utility_power",
    count: 8,
    makeAttributes: (i) => ({ hp: 140, fuelCapacity: 60, powerOutput: 20 + (i%4)*6, noiseRadius: 8 }),
    makeInteractions: (i) => [{ action: "refuel", fuelType: "gasoline" }, { action: "toggle" }],
    designHintBase: "oil stains, vents, glowing coil, anime steam puffs",
    svgMaker: (i,g) => `${svgBackdrop(g,'generator') }<rect x="24" y="45" width="52" height="35" rx="4" fill="#c0392b"/><circle cx="70" cy="65" r="6" fill="#f1c40f"/>${svgFinish()}`
  },
  {
    prefix: "struct_purifier",
    baseName: "WaterPurifier",
    type: CodexEntityType.STRUCTURE,
    category: "utility_water",
    count: 8,
    makeAttributes: (i) => ({ hp: 100, processTime: 120, powerConsumption: 5, input: "contaminated_water", output: "purified_water" }),
    makeInteractions: (i) => [{ action: "fill", item: "contaminated_water" }, { action: "collect", item: "purified_water" }],
    designHintBase: "glass canisters, glowing filters, anime UI indicators",
    svgMaker: (i,g) => `${svgBackdrop(g,'purifier') }<rect x="30" y="30" width="40" height="55" rx="4" fill="#3498db" opacity="0.6"/>${svgFinish()}`
  },

  // Materials - base
  {
    prefix: "mat_wood",
    baseName: "WoodPlank",
    type: CodexEntityType.ITEM,
    category: "material",
    count: 48,
    makeAttributes: (i) => ({ stackable:true, stackSize: 50, quality: 1 + (i%3) }),
    designHintBase: "wood grain patterns, worn nails, anime soot smudges",
    svgMaker: (i,g) => `${svgBackdrop(g,'wood') }<rect x="20" y="35" width="60" height="30" fill="#a47b5b"/>${svgFinish()}`
  },
  {
    prefix: "mat_metal",
    baseName: "MetalScrap",
    type: CodexEntityType.ITEM,
    category: "material",
    count: 48,
    makeAttributes: (i) => ({ stackable:true, stackSize: 40, corrosion: (i%4) }),
    designHintBase: "rust streaks, riveted plates, solder splashes",
    svgMaker: (i,g) => `${svgBackdrop(g,'metal') }<rect x="20" y="50" width="60" height="20" fill="#7f8c8d" stroke="#4a4a4a"/>${svgFinish()}`
  },

  // Consumables
  {
    prefix: "cons_food",
    baseName: "Ration",
    type: CodexEntityType.ITEM,
    category: "consumable_food",
    count: 36,
    makeAttributes: (i) => ({ stackable:true, stackSize: 10, nutrition: 10 + (i%6)*3, spoilTime: 1440 + (i%4)*300 }),
    designHintBase: "anime food tin labels, dusty edges, cute mascot logos",
    svgMaker: (i,g) => `${svgBackdrop(g,'food') }<rect x="30" y="35" width="40" height="30" rx="4" fill="#ffd1a1"/>${svgFinish()}`
  },
  {
    prefix: "cons_med",
    baseName: "MedKit",
    type: CodexEntityType.ITEM,
    category: "consumable_medical",
    count: 32,
    makeAttributes: (i) => ({ stackable:true, stackSize: 5, heal: 20 + (i%4)*10 }),
    designHintBase: "clean white box, stylized red cross anime crest",
    svgMaker: (i,g) => `${svgBackdrop(g,'med') }<rect x="30" y="30" width="40" height="40" rx="6" fill="#fff" stroke="#e74c3c" stroke-width="3"/><path d="M45 45 h10 v20 h-10 z" fill="#e74c3c"/>${svgFinish()}`
  },

  // Tools & crafting
  {
    prefix: "tool_hand",
    baseName: "HandTool",
    type: CodexEntityType.ITEM,
    category: "tool",
    count: 56,
    makeAttributes: (i) => ({ durability:50 + (i%7)*8, utility: ["mine","chop","repair","salvage","dig"][(i%5)] }),
    designHintBase: "wrapped grips, tape, tiny anime insignia",
    svgMaker: (i,g) => `${svgBackdrop(g,'tool') }<rect x="45" y="20" width="8" height="60" fill="#8c6d4e"/><rect x="30" y="60" width="40" height="8" fill="#bdc3c7"/>${svgFinish()}`
  },

  // Weapons melee & ranged
  {
    prefix: "wpn_melee",
    baseName: "MeleeWeapon",
    type: CodexEntityType.ITEM,
    category: "weapon_melee",
    count: 60,
    makeAttributes: (i) => ({ durability:60 + (i%8)*10, damage: 10 + (i%8)*5, speed: clamp(1.4 - (i%6)*0.08, 0.5, 1.4) }),
    designHintBase: "battle-worn edge, taped handle, ribbon charm",
    svgMaker: (i,g) => `${svgBackdrop(g,'melee') }<rect x="48" y="20" width="4" height="60" fill="#8c6d4e"/><polygon points="48,20 56,20 70,40 30,40" fill="#ecf0f1"/>${svgFinish()}`
  },
  {
    prefix: "wpn_ranged",
    baseName: "RangedWeapon",
    type: CodexEntityType.ITEM,
    category: "weapon_ranged",
    count: 44,
    makeAttributes: (i) => ({ durability:40 + (i%6)*12, damage: 20 + (i%9)*6, ammoType: ["bullet","shell","bolt"][i%3], accuracy: 60 + (i%6)*5 }),
    designHintBase: "rusty barrel, taped stock, anime charm dangling",
    svgMaker: (i,g) => `${svgBackdrop(g,'ranged') }<rect x="30" y="40" width="40" height="10" fill="#7f8c8d"/><rect x="15" y="52" width="18" height="10" fill="#6b4f3a"/>${svgFinish()}`
  },

  // Blueprints / engineering
  {
    prefix: "bp_basic",
    baseName: "Blueprint",
    type: CodexEntityType.BLUEPRINT,
    category: "blueprint",
    count: 40,
    makeAttributes: (i) => ({ requiredMaterials: null, craftTime: 30 + (i%6)*8, unlockTier: 1 + (i%4) }),
    designHintBase: "schematic lines, stamped workshop seal, aged paper anime stickers",
    svgMaker: (i,g) => `${svgBackdrop(g,'bp') }<rect x="10" y="10" width="80" height="80" fill="#fff" opacity="0.95"/><line x1="20" x2="80" y1="30" y2="30" stroke="#333" stroke-width="1"/>${svgFinish()}`
  },

  // Furniture & decorative (useful for shelter/comfort)
  {
    prefix: "furn",
    baseName: "Furniture",
    type: CodexEntityType.ITEM,
    category: "furniture",
    count: 28,
    makeAttributes: (i) => ({ hp:40 + (i%6)*12, comfort:1 + (i%4) }),
    designHintBase: "patched upholstery, anime posters, LED strips",
    svgMaker: (i,g) => `${svgBackdrop(g,'furn') }<rect x="20" y="40" width="60" height="30" fill="#6b4f3a"/>${svgFinish()}`
  },

  // Electronics / modules
  {
    prefix: "mod",
    baseName: "Module",
    type: CodexEntityType.ITEM,
    category: "electronic",
    count: 28,
    makeAttributes: (i) => ({ rarity: 1 + (i%5), powerUse: 1 + (i%4), function: ["sensor","cpu","motor","battery","chip"][i%5] }),
    designHintBase: "microtraces, glowing LEDs, tiny kanji decals",
    svgMaker: (i,g) => `${svgBackdrop(g,'mod') }<rect x="30" y="30" width="40" height="40" fill="#2ecc71" rx="3"/><circle cx="50" cy="50" r="6" fill="#34495e"/>${svgFinish()}`
  },

  // Vehicles / big wrecks
  {
    prefix: "veh_wreck",
    baseName: "VehicleWreck",
    type: CodexEntityType.ENVIRONMENT,
    category: "vehicle",
    count: 14,
    makeAttributes: (i) => ({ hp:150 + (i%4)*50, lootTier: 2 + (i%3) }),
    makeInteractions: (i) => [{ action: "salvage", tool: "crowbar", time: 6 + (i%6) }],
    designHintBase: "shattered glass, neon residue, engine cores, anime decals",
    svgMaker: (i,g) => `${svgBackdrop(g,'veh') }<rect x="15" y="50" width="70" height="25" fill="#7d3c3c"/><circle cx="30" cy="80" r="6" fill="#333"/><circle cx="70" cy="80" r="6" fill="#333"/>${svgFinish()}`
  },

  // Traps
  {
    prefix: "trap",
    baseName: "Trap",
    type: CodexEntityType.ITEM,
    category: "defense",
    count: 22,
    makeAttributes: (i) => ({ triggerDamage:20 + (i%6)*8, durability:20 + (i%5)*12, trapType: ["wire","pit","spike","noise"][i%4] }),
    designHintBase: "barbs, spike sheen, warning paint, anime hazard decals",
    svgMaker: (i,g) => `${svgBackdrop(g,'trap') }<rect x="30" y="60" width="40" height="8" fill="#2c3e50"/><path d="M30 60 L35 48 L40 60 L45 48 L50 60 L55 48 L60 60" fill="#c0392b" opacity="0.9"/>${svgFinish()}`
  },

  // NPCs (vendors, quest givers)
  {
    prefix: "npc_vendor",
    baseName: "Vendor",
    type: CodexEntityType.NPC,
    category: "npc_vendor",
    count: 22,
    makeAttributes: (i, g) => {
        const baseTypes = ['male', 'female'];
        const hairTypes = ['hair2', 'hair4'];
        const outfitTypes = ['hoodie', 'worker'];
        return {
            hp: 80,
            barterSkill: 10 + (i % 8),
            inventorySize: 10 + (i % 6),
            visuals: {
                base: baseTypes[g % baseTypes.length],
                hair: hairTypes[g % hairTypes.length],
                outfit: outfitTypes[g % outfitTypes.length],
                weapon: 'none',
            }
        };
    },
    makeInteractions: (i) => [{ action: "trade" }, { action: "gossip" }],
    designHintBase: "anime tiny stall banners, patched aprons, emotive expressions",
  },

  // Turrets
  {
    prefix: "turret",
    baseName: "AutoTurret",
    type: CodexEntityType.STRUCTURE,
    category: "defense_turret",
    count: 10,
    makeAttributes: (i) => ({ hp:120 + (i%4)*40, damage:25 + (i%4)*6, range:6 + (i%3) }),
    makeInteractions: (i) => [{ action: "power" }, { action: "upgrade" }],
    designHintBase: "rivets, rotating head, muzzle glow, anime sparks",
    svgMaker: (i,g) => `${svgBackdrop(g,'turret') }<rect x="35" y="35" width="30" height="30" fill="#34495e"/><rect x="48" y="20" width="4" height="20" fill="#333"/>${svgFinish()}`
  },
];

// ---------------------------------
// Generate codexData (array)
// ---------------------------------
export const codexData: CodexEntity[] = (function generate() {
  const out: CodexEntity[] = [];
  let globalIdx = 1;
  for (const t of templates) {
    for (let i = 0; i < t.count; i++) {
      const gid = globalIdx++;
      const id = uid(t.prefix, gid);
      const name = `${t.baseName} ${gid}`;
      const isCharacter = t.type === CodexEntityType.CHARACTER || t.type === CodexEntityType.NPC;
      
      const svg = isCharacter ? '' : (t.svgMaker) ? t.svgMaker(i, gid) : (svgBackdrop(gid, t.baseName) + `<rect x="20" y="30" width="60" height="40" fill="#aaa"/>` + svgFinish());
      
      const attrs = t.makeAttributes ? t.makeAttributes(i, gid) : {};
      const interactions = t.makeInteractions ? t.makeInteractions(i, gid) : undefined;
      const desc = `${t.baseName} — variant #${gid}. ${t.designHintBase ?? ""}`.trim();

      out.push({
        id,
        name,
        description: desc,
        type: t.type,
        category: t.category,
        svg_code: svg,
        attributes: attrs,
        interactions,
        designHints: [t.designHintBase ?? "anime post-apoc style", `variant:${gid}`, `paletteSeed:${gid % 6}`],
      });
    }
  }

  // Ensure ≥ 500 entities (safety filler)
  const MIN = 500;
  while (out.length < MIN) {
    const gid = globalIdx++;
    out.push({
      id: uid("mat_fill", gid),
      name: `Common Scrap ${gid}`,
      description: "Placeholder scrap material.",
      type: CodexEntityType.ITEM,
      category: "material_fill",
      svg_code: svgBackdrop(gid, "scrap") + `<rect x="20" y="40" width="60" height="20" fill="#9b7a5a" opacity="0.95"/>` + svgFinish(),
      attributes: { stackable: true, stackSize: 100 },
      designHints: ["filler scrap", `paletteSeed:${gid % 6}`]
    });
  }

  return out;
})();

// ---------------------------------
// Crafting recipes generator
// ---------------------------------
type Recipe = {
  id: string; // e.g., recipe_wpns_001
  name: string;
  output: { id: string; qty: number };
  required: Array<{ id: string; qty: number }>;
  craftTime: number; // seconds
  station?: string; // e.g., "workbench"
  unlockTier?: number;
};

function sampleMaterialIdsByCategory(catPrefix: string, amount = 6) {
  const candidates = codexData.filter(e => e.category.includes(catPrefix) || e.id.includes(catPrefix));
  if (candidates.length === 0) return codexData.slice(0, amount).map(c => c.id);
  return candidates.slice(0, Math.min(amount, candidates.length)).map(c => c.id);
}

export const recipes: Recipe[] = (function genRecipes() {
  const out: Recipe[] = [];
  let rIdx = 1;

  const blueprintItems = codexData.filter(e => e.type === CodexEntityType.BLUEPRINT);
  const materialPool = sampleMaterialIdsByCategory("material", 60);

  for (let i = 0; i < blueprintItems.length; i++) {
    const bp = blueprintItems[i];
    const reqCount = 2 + (i % 4);
    const reqs = [];
    for (let j = 0; j < reqCount; j++) {
      const matId = materialPool[(i + j) % materialPool.length];
      const qty = 1 + ((i + j) % 6);
      reqs.push({ id: matId, qty });
    }
    out.push({
      id: `recipe_bp_${pad(rIdx++)}`,
      name: `Recipe for ${bp.name || bp.id}`,
      output: { id: bp.id, qty: 1 },
      required: reqs,
      craftTime: 30 + (i % 6) * 8,
      station: "workbench",
      unlockTier: 1 + (i % 4),
    });
  }
  return out;
})();

// ---------------------------------
// Loot tables (by source type)
// ---------------------------------
export type LootEntry = { id: string; weight: number; qtyMin?: number; qtyMax?: number; probability?: number };

function pickMaterialsForLoot(prefixGuess: string, limit = 8): LootEntry[] {
  const pool = codexData.filter(e => e.category.includes(prefixGuess) || e.type === CodexEntityType.ITEM);
  const slice = pool.slice(0, Math.min(limit, pool.length));
  return slice.map((s, i) => ({ id: s.id, weight: Math.max(1, 10 - (i % 8)), qtyMin: 1, qtyMax: 1 + (i%4) }));
}

const foodEntry = codexData.find(e => e.category === "consumable_food");
export const lootTables: Record<string, LootEntry[]> = {
  "scrap_pile": pickMaterialsForLoot("material", 8),
  "car_wreck": pickMaterialsForLoot("vehicle", 10),
  "raider_drop": pickMaterialsForLoot("weapon", 8).concat(foodEntry ? [{ id: foodEntry.id, weight: 4, qtyMin:1, qtyMax:2 }] : []),
  "mutant_trophies": pickMaterialsForLoot("creature", 6),
  "workbench_loot": pickMaterialsForLoot("tool", 10),
  "vendor_stock": pickMaterialsForLoot("consumable", 12),
};

// ---------------------------------
// Spawn map / biome mapping & spawn chances
// ---------------------------------
export type SpawnRule = { category: string; weight: number; minCount: number; maxCount: number; minRarity?: number };

export const spawnMap: Record<string, SpawnRule[]> = {
  "urban_ruins": [
    { category: "enemy_raider", weight: 12, minCount: 1, maxCount: 4 },
    { category: "vehicle_wreck", weight: 6, minCount: 0, maxCount: 2 },
    { category: "resource_scrap", weight: 18, minCount: 1, maxCount: 6 },
    { category: "npc_vendor", weight: 2, minCount: 0, maxCount: 1 },
  ],
  "wasteland": [
    { category: "creature", weight: 18, minCount: 1, maxCount: 6 },
    { category: "resource_rock", weight: 10, minCount: 1, maxCount: 4 },
    { category: "resource_tree", weight: 6, minCount: 0, maxCount: 3 },
  ],
  "forested_ruins": [
    { category: "resource_tree", weight: 18, minCount: 2, maxCount: 6 },
    { category: "creature", weight: 10, minCount: 1, maxCount: 3 },
    { category: "resource_herb", weight: 8, minCount: 1, maxCount: 4 },
  ],
};

// ---------------------------------
// Runtime utility functions
// ---------------------------------
/** getEntitiesByCategory: returns matching codex entries. */
export function getEntitiesByCategory(category: string): CodexEntity[] {
  return codexData.filter(e => e.category === category || e.category.includes(category) || e.id.includes(category));
}

/** spawnEntitiesForBiome: produce list of entity categories to spawn */
export function spawnEntitiesForBiome(biome: string, rngSeed = 1001): Array<{ category: string; count: number }> {
  const rules = spawnMap[biome] ?? [];
  if (!rules.length) return [];
  const out: Array<{ category: string; count: number }> = [];
  let seed = rngSeed;
  function randInt(a: number, b: number) { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (seed % (b - a + 1)); }
  for (const r of rules) {
    const roll = randInt(1, 100);
    const threshold = Math.min(90, r.weight * 3 + 10);
    if (roll <= threshold) {
      const count = randInt(r.minCount, r.maxCount);
      if (count > 0) out.push({ category: r.category, count });
    }
  }
  return out;
}