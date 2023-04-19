import TraitSelector from "../../apps/trait-selector.js";
import ArmourResistance from "../../apps/armour-resistances.js";

export default class FCItemSheet extends ItemSheet {

	get template(){
		return `systems/fantasycraft/templates/items/${this.item.type}-sheet.handlebars`;
  }
  
	static get defaultOptions() 
  {
    return mergeObject(super.defaultOptions, {
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      classes: ["fantasycraft", "sheet", "item"],
      width: 600,
      height: 700, 
    });
  }

  // @override base getData
  async	getData(options)
	{
    const data = super.getData(options);

    const itemData = data;
    data.config = CONFIG.fantasycraft;

    this.prepairDerivedData(data.item);
    this._prepareOptions(data.item.system.classSkills)

    data.item = itemData.item;
    data.data = itemData.item.system;

    if (data.item.type == "spell")
    {
      data.spellDisciplines = data.config.spellDiscipline[data.data.school];
      this._spellSaveCheck(data);
      this._spellDistanceCheck(data);
      this._spellDurationCheck(data);
      this._spellArea(data);
    }

    if(data.item.type == "attack")
    {
      data.apDropdown = {0: 0, 2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20};
      data.keenDropdown = {0: 0, 4: 4, 8: 8, 12: 12, 16: 16, 20: 20, 24: 24, 28: 28, 32: 32, 36: 36, 40: 40};
      data.reachDropdown = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20};
      data.saveUpgrade = {none: "none", linked: "Linked to Attack", area: "area"};

      data.data.naturalUpgrades.keen = parseInt(data.data.naturalUpgrades.keen);
      data.data.naturalUpgrades.armourPiercing = parseInt(data.data.naturalUpgrades.armourPiercing);
      data.data.naturalUpgrades.reach = parseInt(data.data.naturalUpgrades.reach);
    }

    if(data.item.type == "feature")
    {
      data.xpChoices = {none: game.i18n.localize("fantasycraft.none"), points: game.i18n.localize("fantasycraft.point"), grades: game.i18n.localize("fantasycraft.grade"), entries: game.i18n.localize("fantasycraft.entries"), damageType: game.i18n.localize("fantasycraft.damageType")}
      data.grades = {"": "", I: "I", II: "II", III: "III", IV: "IV", V: "V", VI: "VI", VII: "VII", VIII: "VIII", IX: "IX", X: "X"}
    }

    if(data.item.type == "general")
    {
      if (data.item.system.itemType != "service" && data.item.system.itemType != "consumable")
      {
        let itemString = data.item.system.itemType + "Upgrades";
        data.itemUpgrades = data.config[itemString];
      }  
    }

    if(data.item.type == "class")
    {
      this.item.system.abilities = TextEditor.enrichHTML(this.item.system.abilities);
      this.item.system.classTable = TextEditor.enrichHTML(this.item.system.classTable);
    }
    if(data.item.type == "stance")
    {
      let effect1 = this.item.system.effect1.effect;
      let effect2 = this.item.system.effect2.effect;

      if (effect1 == "accuracyBonus" || effect1  == "damageBonus" || effect1 == "dodgeBonusToDefense" || effect1 == "dr" || effect1 == "increasesAttributes" || effect1 == "skillBonus" || 
      effect1 == "reduceThreat" || effect1 == "saveBonus")
      {
        data.effect1IsNumeric = true;
      }

      if (effect2 == "accuracyBonus" || effect2  == "damageBonus" || effect2 == "dodgeBonusToDefense" || effect2 == "dr" || effect2 == "increasesAttributes" || effect2 == "skillBonus" || 
      effect2 == "reduceThreat" || effect2 == "saveBonus")
      {
        data.effect2IsNumeric = true;
      }
    }

    return data;
	}
	
  activateListeners(html) 
  {
    // Editable Only Listeners
    if ( this.isEditable ) 
    {
      // Trait Selector
      html.find('.trait-selector').click(this._onTraitSelector.bind(this));
      html.find('.armour-resistances').click(this._onArmourResistance.bind(this));
    }

    html.find('.charmSelecter').change(this._magicItemInformation.bind(this));
    
    html.find('.essenceSelecter').change(this._magicItemInformation.bind(this));



    // Handle default listeners last so system listeners are triggered first
    super.activateListeners(html);
  }

	prepairDerivedData(itemData)
	{

    //If the item is a class, get the number of starting proficiencies and skill points
		if (itemData.type == "class")
		{
			let attack = itemData.system.baseAttack;
			let vitCont = 0;
			let attCont = 0;
			let _skillPoints = 8;

			//determine starting proficiencies
			if (itemData.system.vitality > 6) 
			{
				vitCont = (itemData.system.vitality == 9) ? 1 : 2;
				_skillPoints = (itemData.system.vitality == 9) ? 6 : 4;
			}
			if (attack != "Low") attCont = (attack == "Medium") ? 1 : 2;
			itemData.system.proficiencies.value = 2 + vitCont + attCont;

			//determine starting skill points
			itemData.system.skillPoints = _skillPoints;
		}
	}

  _prepareOptions(options) 
  {
    if (options == undefined)
      return;

    //create a list of the different skills
    const map = 
    {
      "skills": CONFIG.fantasycraft.skills
    };

    //Go through the list of skills
    for ( let [o, choices] of Object.entries(map) ) 
    {
      const option = options[o];

      if ( !option ) continue;
      
      let values = [];
      
      if ( option.value ) 
      {
        values = option.value instanceof Array ? option.value : [option.value];
      }
      option.selected = values.reduce((obj, o) => 
      {
        obj[o] = choices[o];
        return obj;
      }, 
      {});

      // Add custom entry
      if ( option.custom ) 
      {
        option.custom.split(";").forEach((c, i) => option.selected[`custom${i+1}`] = c.trim());
      }
      
      option.cssClass = !isEmpty(option.selected) ? "" : "inactive";
    }
  }

  _magicItemInformation(event)
  {
    event.preventDefault();
    const element = event.currentTarget;
    const effect = element.value;

    // Determine if there should be a lesser/greater option
    let greaterOption = this._getMagicEffectInformation(effect);
    let reputation = 0;

    // Determine the reputation cost of a given trait
    if (!greaterOption)
    {
      //reputation = 
    }    
  }

  _getMagicEffectInformation(effect)
  {
    let greater = ["skillRanks", "storage", "defenseBonus", "accuracyBonus", "damageBonus", "bane", "spellPoints", "spellEffect", "attributeBonus", 
    "acp", "trainedSkill", "alignedDamage", "exoticDamage", "damageAura", "damageResistance", "edgeSurge", "travelSpeed", "saveBonus", "vitality", "wounds", "threatRange"]
    
    return (greater.includes(effect)) ? true: false;
  }

  _spellDistanceCheck(spell)
  {
    let distance = spell.item.system.distance;

    this.item.update({"system.distance.description": "fantasycraft." + distance.value});

    if (distance.value == "personalOrTouch")
      distance.description = "fantasycraft.personalOrTouch"
  }

  _spellDurationCheck(spell)
  {
    let duration = spell.item.system.duration;

    if (duration.value == "instant" || duration.value == "permanent")
      this.item.update({"system.duration.isNotInstantOrPermanent": false});

    if(duration.enduring || duration.dismissable)
      this.item.update({"system.duration.durationKeyword": true});

    if (duration.value == "instant")
      this.item.update({"system.duration.durationText": "fantasycraft.instant"});
    else if (duration.value == "permanent")
      this.item.update({"system.duration.durationText": "fantasycraft.permanent"});
    else if (duration.value == "concentrationAndDuration")
      this.item.update({"system.duration.durationText": "fantasycraft.concentrationAndDuration"});
    else if(duration.value == "concentrationToDuration")
      this.item.update({"system.duration.durationText": "fantasycraft.concentrationToDuration"});
  }

  _spellArea(spell)
  {
    let area = spell.item.system.area;


    if (area.shape == "custom")
      area.customShape = true;

  }

  _spellSaveCheck(spell)
  {
    let save1 = spell.item.system.save;
    let save2 = spell.item.system.save2;

    this.item.update({"system.save.hasSave": (save1.saveType == "none") ? false : true});
    this.item.update({"system.save2.hasSave": (save2.saveType == "none") ? false : true});
  }

	_onTraitSelector(event) 
    {
      event.preventDefault();
      const element = event.currentTarget;
      const label = element.parentElement.querySelector("label");
      const choices = CONFIG.fantasycraft[element.dataset.options];
      const options = { name: element.dataset.target, title: label.innerText, choices };
      new TraitSelector(this.item, options).render(true)
	} 

  _onArmourResistance(event)
  {
    event.preventDefault();
    const element = event.currentTarget;
    const label = element.parentElement.querySelector("label");
    const choices = CONFIG.fantasycraft[element.dataset.options];
    const options = { name: element.dataset.target, title: label.innerText, choices };
    new ArmourResistance(this.item, options).render(true)
  }
}