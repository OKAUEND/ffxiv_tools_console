export default {
  groups: [
    { name: "Material", isMaterialTypeInfo: true },
    { name: "Weapon", isMaterialTypeInfo: false },
    { name: "Tools", isMaterialTypeInfo: false },
    { name: "Armor", isMaterialTypeInfo: false },
    { name: "House", isMaterialTypeInfo: false }
  ],
  types: [
    [{ name: "Raw" }, { name: "Middle" }],
    [
      { name: "Gladiator" },
      { name: "Marauder" },
      { name: "DarkKnight" },
      { name: "Gunbreaker" },
      { name: "Lancer" },
      { name: "Pugilist" },
      { name: "Samurai" },
      { name: "Rogue" },
      { name: "Archer" },
      { name: "Machinist" },
      { name: "Dancer" },
      { name: "Thaumaturge" },
      { name: "Arcanist" },
      { name: "RedMage" },
      { name: "BlueMage" },
      { name: "Conjurer" },
      { name: "Scholar" },
      { name: "Astrologian" }
    ],
    [
      { name: "Carpenter" },
      { name: "Blacksmith" },
      { name: "Armorer" },
      { name: "Goldsmith" },
      { name: "Leatherworker" },
      { name: "Weaver" },
      { name: "Alchemist" },
      { name: "Culinarian" },
      { name: "Miner" },
      { name: "Botanist" },
      { name: "Fisher" }
    ],
    [
      { name: "Shield" },
      { name: "Head" },
      { name: "Body" },
      { name: "Hands" },
      { name: "Waist" },
      { name: "Legs" },
      { name: "Feet" },
      { name: "Earrings" },
      { name: "Necklace" },
      { name: "Bracelets" },
      { name: "Ring" }
    ]
  ],
  materialtype: [
    { name: "Ingredient" },
    { name: "Seafood" },
    { name: "Stone" },
    { name: "Metal" },
    { name: "Lumber" },
    { name: "Cloth" },
    { name: "Leather" },
    { name: "Bone" },
    { name: "Reagent" },
    { name: "Part" },
    { name: "GuildCraft" }
  ]
};
