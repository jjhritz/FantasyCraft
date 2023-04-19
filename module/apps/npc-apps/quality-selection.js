import * as Utils from '../../Utils.js';

export default class Qualities extends Application   {
    constructor(actor, options, ...args)
    {
        super(...args);
        this.actor = actor; 
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "npc-qualites",
            classes: ["fantasycraft"],
            choices: {},
            template: "systems/fantasycraft/templates/apps/npcApps/npc-qualities.handlebars",
            height: "auto",
            width: 250,
            title: "Qualities",
        });
    }

    /** @override */
    getData() 
    {
		let qualities = this.actor.items.filter(function(item) {return (item.type == "feature" && item.system.featureType == "npcQuality")});
		let classFeatures = this.actor.items.filter(function(item) {return (item.type == "feature" && item.system.featureType == "class")});
		let feats = this.actor.items.filter(function(item) {return (item.type == "feat")});
        let tricks = this.actor.items.filter(function(item) {return (item.type == "trick")});

        qualities.sort( Utils.alphabatize )
        classFeatures.sort( Utils.alphabatize )
        feats.sort( Utils.alphabatize )
        tricks.sort( Utils.alphabatize )

        // Populate choices
        const choices = 
        {
            label: "Qualities",
        }
        // Return data
        return {
            choices: choices,
            qualities: qualities,
            classFeatures: classFeatures,
            feats: feats,
            tricks: tricks
        }
    }
  
    activateListeners(html) {
        super.activateListeners(html);

        html.find('.editItem').click( async ev => {
            let itemId = ev.currentTarget.closest(".item").dataset.itemId;
            let item = this.actor.items.get(itemId);
            return item.sheet.render(true); 
        });

        html.find('.deleteItem').click( async ev => {
            let itemId = ev.currentTarget.closest(".item").dataset.itemId;
            await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
            this.render(false);
        });

        //close the window
        html.find('.submit').click( ev => {
            this.close();
        });
    }

  }
  