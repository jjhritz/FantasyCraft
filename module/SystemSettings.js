export const registerSystemSettings = async function() {

	game.settings.register("fantasycraft", "Miracles", {
		config: true,
		scope: "world",
		name: "SETTINGS.campaignQualities.miracles.name",
		hint: "SETTINGS.campaignQualities.miracles.label",
		type: Boolean,
		default: true
    });
    
    game.settings.register("fantasycraft", "Sorcery", {
		config: true,
		scope: "world",
		name: "SETTINGS.campaignQualities.sorcery.name",
		hint: "SETTINGS.campaignQualities.sorcery.label",
		type: Boolean,
		default: true
	});

    game.settings.register("fantasycraft", "autoRollForNPCs", {
		config: true,
		scope: "world",
		name: "SETTINGS.campaignQualities.autoRoll.name",
		hint: "SETTINGS.campaignQualities.autoRoll.label",
		type: Boolean,
		default: true
	});

    game.settings.register("fantasycraft", "fragileMonsters", {
		config: true,
		scope: "world",
		name: "SETTINGS.campaignQualities.fragileMonsters.name",
		hint: "SETTINGS.campaignQualities.fragileMonsters.label",
		type: Boolean,
		default: true
	});

};
  