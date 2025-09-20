import { CodexEntity, CodexEntityType } from './types';

export const GRID_WIDTH = 25;
export const GRID_HEIGHT = 25;
export const TILE_WIDTH = 64; // Corresponds to w-16 in Tailwind
export const TILE_HEIGHT = 32; // Corresponds to h-8 in Tailwind
export const TICK_RATE = 500; // ms per game tick
export const INITIAL_SURVIVORS = 5;
export const INITIAL_ZOMBIES = 3;

export const codexData: CodexEntity[] = [
    // Characters
    {
      id: "player_01",
      name: "Survivor",
      description: "Someone who survived 'The Fall'. Now must fight to live in a world that is no longer friendly.",
      type: CodexEntityType.CHARACTER,
      category: "player",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="player"><rect x="40" y="55" width="20" height="30" fill="#4a4a4a"/><rect x="30" y="30" width="40" height="30" fill="#6b5b4a"/><circle cx="50" cy="20" r="12" fill="#e0a385"/></g></svg>`,
      attributes: {
        "hp": 100,
        "stamina": 100,
        "hunger": 100,
        "thirst": 100
      },
    },
    {
      id: "char_raider_01",
      name: "Raider",
      description: "A ruthless scavenger who preys on the weak. Hostile and territorial.",
      type: CodexEntityType.CHARACTER,
      category: "enemy",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="raider"><rect x="40" y="55" width="20" height="30" fill="#3d3d3d"/><path d="M30 30 L70 30 L65 60 L35 60 Z" fill="#7d3c3c"/><circle cx="50" cy="20" r="12" fill="#c48a7e"/></g></svg>`,
      attributes: { "hp": 80, "damage": 15, "speed": 1.2 },
    },
    {
      id: "char_mutant_dog_01",
      name: "Mutant Dog",
      description: "A grotesque canine mutated by the fallout. Fast, aggressive, and often hunts in packs.",
      type: CodexEntityType.CHARACTER,
      category: "creature",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="mutant_dog" transform="translate(0, 5)"><path d="M25,75 C30,50 70,50 75,75 Z" fill="#6b554a"/><circle cx="35" cy="55" r="5" fill="#c40d0d"/><rect x="30" y="75" width="8" height="15" fill="#6b554a"/><rect x="62" y="75" width="8" height="15" fill="#6b554a"/></g></svg>`,
      attributes: { "hp": 60, "damage": 12, "speed": 2.0 },
    },
    {
      id: "creature_bloater_01",
      name: "Bloater",
      description: "A disgusting mutation whose body is filled with methane gas. Very slow, but its death explosion can be fatal to anyone too close.",
      type: CodexEntityType.CHARACTER,
      category: "mutant_hostile",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="bloater"><ellipse cx="50" cy="65" rx="30" ry="35" fill="#7b8a6d"/><circle cx="50" cy="30" r="15" fill="#6a785d"/><circle cx="20" cy="60" r="10" fill="#7b8a6d"/><circle cx="80" cy="60" r="10" fill="#7b8a6d"/><circle cx="40" cy="90" r="8" fill="#7b8a6d"/><circle cx="60" cy="90" r="8" fill="#7b8a6d"/></g></svg>`,
      attributes: { "hp": 150, "damage": 10, "speed": 0.5, "on_death_effect": "toxic_explosion", "explosion_radius": 3 },
    },
    {
      id: "creature_stalker_01",
      name: "Stalker",
      description: "An apex predator that hunts in packs. Its fast, silent movements make it a very serious threat in the city ruins.",
      type: CodexEntityType.CHARACTER,
      category: "mutant_hostile",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="stalker"><path d="M20,70 C40,50 60,50 80,70 L50,85 Z" fill="#5a5a5a"/><circle cx="25" cy="60" r="5" fill="#e62e2e"/><path d="M15,75 L30,90" stroke="#5a5a5a" stroke-width="6" stroke-linecap="round"/><path d="M85,75 L70,90" stroke="#5a5a5a" stroke-width="6" stroke-linecap="round"/></g></svg>`,
      attributes: { "hp": 70, "damage": 25, "speed": 2.0, "behavior": "pack_hunter" },
    },
    // Environment
    {
      id: "env_dead_tree_01",
      name: "Dead Tree",
      description: "Remains of forest life. Its dry trunk can still be used as firewood or building material.",
      type: CodexEntityType.ENVIRONMENT,
      category: "resource_source",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="dead_tree"><path d="M50,90 L50,20 M50,60 L30,40 M50,50 L70,30" stroke="#6b4f3a" stroke-width="8" stroke-linecap="round" fill="none"/></g></svg>`,
      attributes: { "hp": 50, "resource": "wood", "yield": [3, 6] },
      interactions: [{ action: "chop", tool: "axe" }],
    },
    {
      id: "env_rock_01",
      name: "Rock Boulder",
      description: "A rocky outcrop protruding from the ground. A source of hard material for making tools or foundations.",
      type: CodexEntityType.ENVIRONMENT,
      category: "resource_source",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><polygon points="5,45 20,15 45,5 70,20 75,45" fill="#a1a1a1" stroke="#4a4a4a" stroke-width="3" stroke-linejoin="round"/></svg>`,
      attributes: { "hp": 80, "resource": "stone", "yield": [4, 8] },
      interactions: [{ action: "mine", tool: "pickaxe" }],
    },
    {
      id: "env_scrap_metal_01",
      name: "Scrap Metal Pile",
      description: "A heap of rusted metal, remnants of the old world. A valuable source of crafting materials.",
      type: CodexEntityType.ENVIRONMENT,
      category: "resource_source",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="scrap_metal"><path d="M20,85 L45,60 L70,65 L80,85 Z" fill="#7f7f7f" stroke="#4a4a4a" stroke-width="2"/><path d="M25,85 L30,70 L55,75 Z" fill="#a1a1a1" stroke="#4a4a4a" stroke-width="1.5"/></g></svg>`,
      attributes: { "hp": 60, "resource": "metal_scraps", "yield": [2, 5] },
      interactions: [{ "action": "salvage", "tool": "crowbar" }],
    },
    {
      id: "env_herb_bush_01",
      name: "Herb Bush",
      description: "A resilient bush bearing medicinal herbs. Can be harvested for basic remedies.",
      type: CodexEntityType.ENVIRONMENT,
      category: "resource_source",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="herb_bush"><circle cx="50" cy="60" r="25" fill="#4a6b4f"/><circle cx="40" cy="70" r="20" fill="#5a7b5f"/><circle cx="60" cy="70" r="20" fill="#5a7b5f"/></g></svg>`,
      attributes: { "hp": 20, "resource": "medicinal_herbs", "yield": [1, 3] },
      interactions: [{ "action": "forage" }],
    },
    {
      id: "env_car_wreck_01",
      name: "Rusted Car Wreck",
      description: "The husk of a pre-Fall vehicle. Can be salvaged for scrap metal and other components.",
      type: CodexEntityType.ENVIRONMENT,
      category: "resource_source",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="car_wreck"><path d="M15,80 L25,50 L75,50 L85,80 Z" fill="#7d3c3c"/><path d="M30,50 L35,40 L65,40 L70,50 Z" fill="#4a3b32" opacity="0.7"/><circle cx="30" cy="80" r="8" fill="#3d3d3d"/><circle cx="70" cy="80" r="8" fill="#3d3d3d"/></g></svg>`,
      attributes: { "hp": 200, "resource": ["metal_scraps", "electronics"], "yield": [10, 20] },
      interactions: [{ "action": "salvage", "tool": "crowbar" }],
    },
    // Items - Resources
    {
      id: "item_wood_01",
      name: "Wood",
      description: "A piece of dry wood from a dead tree. Useful for making fires, tools, and simple buildings.",
      type: CodexEntityType.ITEM,
      category: "resource",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g transform="rotate(-10 25 15) scale(1.5)" style="transform-origin: center;"><rect x="5" y="5" width="40" height="20" rx="3" fill="#a47b5b" stroke="#5d4037" stroke-width="2"/><path d="M 5 15 C 15 10, 35 10, 45 15" fill="none" stroke="#5d4037" stroke-width="1.5" opacity="0.6"/><path d="M 5 20 C 15 15, 35 15, 45 20" fill="none" stroke="#5d4037" stroke-width="1" opacity="0.5"/></g></svg>`,
      attributes: { "stackable": true, "stack_size": 20 },
    },
    { 
      id: "res_water_contaminated", 
      name: "Contaminated Water", 
      description: "Murky water from puddles or leaky pipes. Dangerous to drink directly.", 
      type: CodexEntityType.ITEM, 
      category: "raw_liquid", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="water_contaminated"><path d="M20,80 Q50,60 80,80 L80,90 Q50,70 20,90 Z" fill="#6b7a63" opacity="0.8"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 10, "effects": ["sickness", "radiation_low"]} 
    },
    { 
      id: "res_cloth_tattered", 
      name: "Tattered Cloth", 
      description: "Dirty, torn pieces of fabric. Can be processed into bandages or other basic materials.", 
      type: CodexEntityType.ITEM, 
      category: "raw_textile", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="cloth_tattered"><path d="M20,30 C30,20 70,40 80,30 L80,70 C70,80 30,60 20,70 Z" fill="#a39e8e"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 50} 
    },
    { 
      id: "res_plastic_scrap", 
      name: "Scrap Plastic", 
      description: "Shards of bottles and containers. Lightweight and versatile for crafting.", 
      type: CodexEntityType.ITEM, 
      category: "raw_material", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="plastic_scrap"><path d="M30 80 L20 60 L40 50 L50 70 Z" fill="#d1d1d1"/><path d="M50 85 L60 55 L80 60 Z" fill="#e0e0e0"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 50} 
    },
    { 
      id: "res_electronics_scrap", 
      name: "Electronics Scrap", 
      description: "Circuits and wires from broken devices. Crucial for advanced technology.", 
      type: CodexEntityType.ITEM, 
      category: "rare_material", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="electronics_scrap"><rect x="25" y="40" width="50" height="30" rx="3" fill="#3a5a4a"/><rect x="35" y="45" width="10" height="10" fill="#f1c40f"/><line x1="60" y1="50" x2="70" y2="50" stroke="#c0392b" stroke-width="3"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 20} 
    },
    { 
      id: "res_gunpowder", 
      name: "Gunpowder", 
      description: "A volatile chemical mixture for making ammunition and explosives.", 
      type: CodexEntityType.ITEM, 
      category: "processed_material", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="gunpowder"><path d="M30,80 L30,50 L70,50 L70,80 Z" fill="#6b5b4a"/><polygon points="30,50 70,50 50,30" fill="#6b5b4a"/><circle cx="50" cy="65" r="15" fill="#4a4a4a"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 20} 
    },
    // Items - Tools
    {
      id: "item_stone_axe_01",
      name: "Stone Axe",
      description: "A crude tool made from a sharp stone and a piece of wood. Effective for chopping down trees.",
      type: CodexEntityType.ITEM,
      category: "tool",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="stone_axe" transform="rotate(45, 50, 50)"><rect x="20" y="45" width="60" height="10" rx="3" fill="#8c6d4e"/><path d="M75,35 L90,50 L75,65 Z" fill="#b0b0b0" stroke="#555" stroke-width="1.5"/></g></svg>`,
      attributes: { "stackable": false, "durability": 50, "damage": 8, "efficiency": 1.5 },
      interactions: [{ action: "equip" }],
    },
    {
      id: "item_makeshift_spear_01",
      name: "Makeshift Spear",
      description: "A sharpened piece of wood or metal attached to a long stick. Better reach than a simple axe.",
      type: CodexEntityType.ITEM,
      category: "weapon",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="makeshift_spear" transform="rotate(45, 50, 50)"><rect x="10" y="47" width="80" height="6" fill="#8c6d4e"/><path d="M85,40 L95,50 L85,60 Z" fill="#a1a1a1" stroke="#4a4a4a" stroke-width="1"/></g></svg>`,
      attributes: { "stackable": false, "durability": 40, "damage": 12, "range": 1.5 },
      interactions: [{ "action": "equip" }],
    },
    { 
      id: "tool_crowbar", 
      name: "Crowbar", 
      description: "A sturdy steel bar. Useful for prying open doors and crates.", 
      type: CodexEntityType.ITEM, 
      category: "tool_utility", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="crowbar" transform="rotate(45, 50, 50)"><rect x="10" y="45" width="80" height="10" fill="#c0392b"/><path d="M85,45 L90,40 L90,60 L85,55" fill="#c0392b"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 12, "utility": "force_open"} 
    },
    { 
      id: "tool_hammer", 
      name: "Hammer", 
      description: "A basic tool for building and repairing structures.", 
      type: CodexEntityType.ITEM, 
      category: "tool_crafting", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="hammer" transform="rotate(-45, 50, 50)"><rect x="45" y="10" width="10" height="60" rx="2" fill="#8c6d4e"/><rect x="30" y="10" width="40" height="15" fill="#a1a1a1"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 10, "utility": "build_repair"} 
    },
    { 
      id: "tool_wrench", 
      name: "Wrench", 
      description: "For repairing machinery, generators, and dismantling mechanical devices.", 
      type: CodexEntityType.ITEM, 
      category: "tool_crafting", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="wrench" transform="rotate(-45, 50, 50)"><rect x="45" y="30" width="10" height="60" rx="2" fill="#a1a1a1"/><path d="M40 15 L60 15 L65 30 L35 30 Z" fill="#7f7f7f"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 9, "utility": "repair_mechanical"} 
    },
    { 
      id: "tool_fishing_rod", 
      name: "Fishing Rod", 
      description: "Made from a branch and string, for catching fish in water sources.", 
      type: CodexEntityType.ITEM, 
      category: "tool_gathering", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="fishing_rod" transform="rotate(45, 50, 50)"><path d="M10 90 L90 10" stroke="#8c6d4e" stroke-width="4"/><path d="M90 10 C 70 50, 60 70, 50 90" stroke="#d1d1d1" stroke-width="1.5" fill="none"/></g></svg>`, 
      attributes: {"stackable": false, "utility": "gather_fish"} 
    },
    { 
      id: "tool_geiger_counter", 
      name: "Geiger Counter", 
      description: "Detects radiation levels in the vicinity. Clicks faster in hazardous zones.", 
      type: CodexEntityType.ITEM, 
      category: "tool_utility", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="geiger_counter"><rect x="30" y="20" width="40" height="60" rx="4" fill="#2c3e50"/><rect x="35" y="25" width="30" height="20" fill="#2ecc71"/><circle cx="50" cy="65" r="10" fill="#34495e"/></g></svg>`, 
      attributes: {"stackable": false, "utility": "detect_radiation"} 
    },
    // Items - Weapons (Melee)
    { 
      id: "weapon_melee_bat", 
      name: "Baseball Bat", 
      description: "A relic of an old-world sport, now a skull-cracking tool.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_melee", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="baseball_bat" transform="rotate(45, 50, 50)"><path d="M10,45 L80,45 L90,50 L80,55 L10,55 Z" fill="#8c6d4e"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 18, "speed": 1.1, "knockback": 0.5} 
    },
    { 
      id: "weapon_melee_machete", 
      name: "Machete", 
      description: "A large, heavy knife, great for hacking through undergrowth and mutants.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_melee", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="machete" transform="rotate(45, 50, 50)"><rect x="10" y="45" width="30" height="10" fill="#4a4a4a"/><path d="M40,40 L90,40 C95,45 95,55 90,60 L40,60 Z" fill="#a1a1a1"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 22, "speed": 1.3, "effect": "bleeding"} 
    },
    { 
      id: "weapon_melee_fireaxe", 
      name: "Fire Axe", 
      description: "A heavy axe that can break down wooden doors and bones equally well.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_melee", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="fire_axe" transform="rotate(45, 50, 50)"><rect x="10" y="45" width="80" height="10" fill="#c0392b"/><path d="M70,25 L90,25 L90,45 L80,45 Z" fill="#a1a1a1"/><path d="M70,65 L90,65 L90,55 L80,55 Z" fill="#a1a1a1"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 30, "speed": 0.8, "utility": "chop_wood_door"} 
    },
    { 
      id: "weapon_melee_riotshield", 
      name: "Riot Shield", 
      description: "Provides significant protection from melee attacks and projectiles.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_offhand", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="riot_shield"><rect x="25" y="10" width="50" height="80" rx="10" fill="#2c3e50" stroke="#7f7f7f" stroke-width="3"/></g></svg>`, 
      attributes: {"stackable": false, "defense": 40, "utility": "block"} 
    },
    { 
      id: "weapon_melee_sledgehammer", 
      name: "Sledgehammer", 
      description: "Extremely heavy and slow, but its hits can demolish walls and enemies.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_melee", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="sledgehammer" transform="rotate(45, 50, 50)"><rect x="10" y="45" width="70" height="10" rx="2" fill="#6b4f3a"/><rect x="75" y="30" width="20" height="40" fill="#4a4a4a"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 45, "speed": 0.5, "utility": "demolish"} 
    },
     // Items - Weapons (Ranged)
    { 
      id: "weapon_ranged_pipegun", 
      name: "Pipe Gun", 
      description: "A crafted weapon that's inaccurate and prone to jamming, but better than nothing.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_firearm", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="pipe_gun"><rect x="40" y="45" width="50" height="8" fill="#7f7f7f"/><rect x="25" y="50" width="20" height="15" fill="#8c6d4e"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 25, "ammo_type": "crude_bullet", "fire_rate": 0.5, "accuracy": 40} 
    },
    { 
      id: "weapon_ranged_huntingrifle", 
      name: "Hunting Rifle", 
      description: "Accurate for medium to long range. Every shot must be calculated.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_firearm", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="hunting_rifle"><rect x="20" y="46" width="80" height="8" fill="#5d4037"/><rect x="30" y="54" width="25" height="12" fill="#6b4f3a"/></g></svg>`, 
      attributes: {"stackable": false, "damage": 60, "ammo_type": ".308_round", "fire_rate": 0.8, "accuracy": 85} 
    },
    { 
      id: "weapon_ranged_sawedoff", 
      name: "Sawed-off Shotgun", 
      description: "Brutal at close range, but its spread makes it useless at a distance.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_firearm", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="sawedoff_shotgun"><rect x="40" y="45" width="40" height="10" fill="#4a4a4a"/><rect x="25" y="50" width="20" height="15" fill="#8c6d4e"/></g></svg>`, 
      attributes: {"stackable": false, "damage": "15x8", "ammo_type": "shotgun_shell", "range": 5, "spread": 25} 
    },
    { 
      id: "weapon_explosive_molotov", 
      name: "Molotov Cocktail", 
      description: "A bottle filled with flammable liquid. Creates an area of fire on impact.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_explosive", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="molotov_cocktail"><path d="M40,90 C30,60 30,40 50,20 C70,40 70,60 60,90 Z" fill="#2ecc71" opacity="0.6"/><rect x="45" y="10" width="10" height="20" fill="#a39e8e"/><path d="M50,10 C60,5 55,20 50,10Z" fill="#f1c40f"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 5, "damage_type": "fire_area", "duration": 10} 
    },
    { 
      id: "weapon_explosive_grenade", 
      name: "Grenade", 
      description: "Standard military explosive. Pull the pin, throw, and take cover.", 
      type: CodexEntityType.ITEM, 
      category: "weapon_explosive", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="grenade"><ellipse cx="50" cy="60" rx="20" ry="25" fill="#2c3e50"/><rect x="45" y="25" width="10" height="15" fill="#7f7f7f"/><rect x="55" y="30" width="10" height="5" rx="2" fill="#e74c3c"/></g></svg>`, 
      attributes: {"stackable": true, "stack_size": 5, "damage": 150, "radius": 5, "fuse_time": 4} 
    },
    {
      id: "item_crossbow_01",
      name: "Crossbow",
      description: "A silent weapon perfect for ambushes. Makes no noise, but its reload time is quite long.",
      type: CodexEntityType.ITEM,
      category: "weapon_ranged",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="crossbow" transform="rotate(45, 50, 50)"><rect x="10" y="47" width="80" height="6" fill="#6b4f3a"/><rect x="5" y="35" width="6" height="30" fill="#5d4037"/><path d="M10 35 L10 65" stroke="#c4c4c4" stroke-width="1.5"/></g></svg>`,
      attributes: { "stackable": false, "damage": 50, "range": 15, "fire_rate": 0.2, "ammo_type": "bolt", "noise_level": 0 },
      interactions: [{ action: "equip" }],
    },
     // Items - Apparel
    {
      id: "equip_gasmask_01",
      name: "Gas Mask",
      description: "Protects the respiratory system from spores, toxic gases, and irradiated air. Its filter must be replaced periodically.",
      type: CodexEntityType.ITEM,
      category: "apparel_head",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="gas_mask"><path d="M25,30 C20,50 20,70 50,80 C80,70 80,50 75,30 Z" fill="#4a4a4a"/><circle cx="35" cy="50" r="10" fill="#2c3e50" stroke="#a1a1a1" stroke-width="2"/><circle cx="65" cy="50" r="10" fill="#2c3e50" stroke="#a1a1a1" stroke-width="2"/><rect x="40" y="75" width="20" height="15" rx="3" fill="#7f7f7f"/></g></svg>`,
      attributes: { "stackable": false, "durability": 100, "protection_type": ["toxic", "radiation_low"], "slot": "head" },
      interactions: [{ action: "equip" }],
    },
    { 
      id: "armor_torso_leatherjacket", 
      name: "Leather Jacket", 
      description: "Provides basic protection from light scratches and blows.", 
      type: CodexEntityType.ITEM, 
      category: "apparel_torso", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="leather_jacket"><path d="M20,30 L80,30 L70,80 L30,80 Z" fill="#4a3b32"/><path d="M50,30 L50,80" stroke="#2c221c" stroke-width="3"/></g></svg>`, 
      attributes: {"stackable": false, "defense": 10, "slot": "torso"} 
    },
    { 
      id: "armor_head_riothelmet", 
      name: "Riot Helmet", 
      description: "A sturdy helmet with a face shield, providing good head protection.", 
      type: CodexEntityType.ITEM, 
      category: "apparel_head", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="riot_helmet"><path d="M20,50 C20,20 80,20 80,50 Z" fill="#2c3e50"/><rect x="30" y="40" width="40" height="15" fill="#7f8c8d" opacity="0.7"/></g></svg>`, 
      attributes: {"stackable": false, "defense": 15, "slot": "head"} 
    },
    { 
      id: "armor_torso_tacticalvest", 
      name: "Tactical Vest", 
      description: "A military vest with extra pouches. Increases carrying capacity.", 
      type: CodexEntityType.ITEM, 
      category: "apparel_torso", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="tactical_vest"><path d="M25,30 L75,30 L65,80 L35,80 Z" fill="#3a5a4a"/><rect x="35" y="40" width="10" height="15" fill="#2f483d"/><rect x="55" y="40" width="10" height="15" fill="#2f483d"/></g></svg>`, 
      attributes: {"stackable": false, "defense": 8, "inventory_bonus": 10, "slot": "torso"} 
    },
    { 
      id: "armor_back_backpack", 
      name: "Backpack", 
      description: "A simple backpack to carry more loot.", 
      type: CodexEntityType.ITEM, 
      category: "apparel_back", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="backpack"><rect x="25" y="20" width="50" height="60" rx="8" fill="#6b5b4a"/><rect x="35" y="30" width="30" height="10" fill="#5d4037"/></g></svg>`, 
      attributes: {"stackable": false, "inventory_bonus": 25, "slot": "back"} 
    },
    { 
      id: "armor_full_hazmat", 
      name: "Hazmat Suit", 
      description: "Full-body protective clothing against high radiation and biological hazards.", 
      type: CodexEntityType.ITEM, 
      category: "apparel_fullbody", 
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="hazmat_suit"><path d="M25,90 L25,40 C25,20 75,20 75,40 L75,90 Z" fill="#f1c40f"/><circle cx="50" cy="40" r="20" fill="#f1c40f"/><rect x="40" y="30" width="20" height="20" fill="#7f8c8d" opacity="0.8"/></g></svg>`, 
      attributes: {"stackable": false, "defense": 5, "resist_radiation": 95, "resist_toxic": 95, "slot": "fullbody"} 
    },
    // Structures
    {
      id: "struct_campfire_01",
      name: "Campfire",
      description: "A controlled pile of burning wood. Provides warmth, light, and the ability to cook raw food.",
      type: CodexEntityType.STRUCTURE,
      category: "utility",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="campfire"><path d="M30,80 L70,80 L65,70 L35,70 Z" fill="#5d4037"/><path d="M50,70 C40,55 60,55 50,40 C50,55 40,55 50,70 Z" fill="#FFC107"/><path d="M45,70 C40,60 50,60 48,50 C48,60 40,60 45,70 Z" fill="#FF5722"/></g></svg>`,
      attributes: { "hp": 30, "fuel": 0, "max_fuel": 100, "cook_slots": 1, "light_radius": 5 },
      interactions: [{ action: "add_fuel", item: "wood" }, { action: "cook", item: "raw_meat" }],
    },
    {
      id: "struct_workbench_01",
      name: "Workbench",
      description: "A sturdy table with tools, necessary for crafting more complex items and equipment.",
      type: CodexEntityType.STRUCTURE,
      category: "crafting",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="workbench"><path d="M20,80 L30,70 L80,70 L70,80 Z" fill="#6b4f3a"/><rect x="15" y="55" width="70" height="15" rx="2" fill="#8c6d4e" stroke="#5d4037" stroke-width="2"/></g></svg>`,
      attributes: { "hp": 100, "craft_tier": 2 },
      interactions: [{ "action": "craft" }],
    },
    {
      id: "struct_wooden_wall_01",
      name: "Wooden Wall",
      description: "A simple defensive barrier made from scavenged wood. Provides basic protection from threats.",
      type: CodexEntityType.STRUCTURE,
      category: "defense",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="wooden_wall"><rect x="20" y="10" width="15" height="80" fill="#8c6d4e"/><rect x="42" y="10" width="15" height="80" fill="#8c6d4e"/><rect x="64" y="10" width="15" height="80" fill="#8c6d4e"/><rect x="10" y="20" width="80" height="8" fill="#6b4f3a"/><rect x="10" y="70" width="80" height="8" fill="#6b4f3a"/></g></svg>`,
      attributes: { "hp": 150, "defense_rating": 10 },
    },
    {
      id: "struct_purifier_01",
      name: "Water Purifier",
      description: "A device assembled to filter impurities and radiation from water, making it drinkable. Requires power to operate.",
      type: CodexEntityType.STRUCTURE,
      category: "utility_advanced",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="water_purifier"><rect x="25" y="40" width="50" height="50" rx="5" fill="#a1a1a1"/><rect x="30" y="45" width="40" height="20" fill="#3498db" opacity="0.5"/><rect x="30" y="70" width="40" height="15" fill="#3498db"/><rect x="55" y="30" width="10" height="10" fill="#f1c40f"/></g></svg>`,
      attributes: { "hp": 80, "input_slot": "contaminated_water", "output_slot": "purified_water", "process_time": 120, "power_consumption": 5 },
      interactions: [{ action: "fill" }, { action: "collect" }],
    },
    {
      id: "struct_generator_01",
      name: "Small Generator",
      description: "A noisy machine from the old world. Burns fuel to generate electricity, bringing back a glimmer of civilization.",
      type: CodexEntityType.STRUCTURE,
      category: "utility_advanced",
      svg_code: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g id="small_generator"><rect x="20" y="50" width="60" height="40" rx="4" fill="#c0392b"/><rect x="25" y="40" width="20" height="10" fill="#2c3e50"/><rect x="65" y="60" width="10" height="20" fill="#f1c40f"/><path d="M50 50 L50 30 L60 30" fill="none" stroke="#2c3e50" stroke-width="4"/></g></svg>`,
      attributes: { "hp": 100, "fuel_capacity": 50, "fuel_type": "gasoline", "power_output": 20, "noise_radius": 10 },
      interactions: [{ action: "refuel" }, { action: "toggle" }],
    }
  ];