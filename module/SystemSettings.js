export const registerSystemSettings = async function() {

	game.settings.register("fantasycraft", "Miracles", {
		config: true,
		scope: "world",
		name: "fantasycraft.SETTINGS.campaignQualities.miracles.name",
		hint: "fantasycraft.SETTINGS.campaignQualities.miracles.label",
		type: Boolean,
		default: true
    });
    
    game.settings.register("fantasycraft", "Sorcery", {
		config: true,
		scope: "world",
		name: "fantasycraft.SETTINGS.campaignQualities.sorcery.name",
		hint: "fantasycraft.SETTINGS.campaignQualities.sorcery.label",
		type: Boolean,
		default: true
	});

	game.settings.register("fantasycraft", "wildMagic", {
		config: true,
		scope: "world",
		name: "fantasycraft.SETTINGS.campaignQualities.wildMagic.name",
		hint: "fantasycraft.SETTINGS.campaignQualities.wildMagic.label",
		type: Boolean,
		default: true
	});

    game.settings.register("fantasycraft", "autoRollForNPCs", {
		config: true,
		scope: "world",
		name: "fantasycraft.SETTINGS.campaignQualities.autoRoll.name",
		hint: "fantasycraft.SETTINGS.campaignQualities.autoRoll.label",
		type: Boolean,
		default: true
	});

    game.settings.register("fantasycraft", "fragileMonsters", {
		config: true,
		scope: "world",
		name: "fantasycraft.SETTINGS.campaignQualities.fragileMonsters.name",
		hint: "fantasycraft.SETTINGS.campaignQualities.fragileMonsters.label",
		type: Boolean,
		default: true
	});

};
  