import * as Utils from './Utils.js';

//Function to handle trick effects pre-roll adding bonuses or penalties to the roll formula or replacing it with a skill roll
export function determinePreRollTrickEffect(trick, actor, rollInfo, rollFormula, target)
{
    if (!trick) return rollFormula;

    //if attack trick
    if (checkTargets(trick, target)) return "Error"; 

    //Tricks that affect the attack roll by either a flat roll modifier or replacing the roll with a different kind.
    if (trick.system.effect.rollModifier) rollFormula += Utils.returnPlusOrMinusString(rollInfo.trick1.system.effect.rollModifier);

    //This is essentially only for called shot
    if (trick.system.effect.additionalEffect == "ignoreAP")
    {
        rollFormula += ignoreArmour(target);
        return rollFormula
    }

    //replace the roll with a skill check if required
    if (trick.system.effect.additionalEffect == "replaceAttackRoll")
    {
      let skill = actor.skills[rollInfo.trick1.system.effect.secondaryCheck]
      rollFormula = "1d20" + " + " + skill.ranks + " + " + skill.misc + " + " + actor.abilityScores[skill.ability].mod;
      return rollFormula
    }

    return rollFormula;
    
    //if combat action trick
}

//Function to handle trick effects that happen after the roll has been made (mainly comparing rolls to target defense)
export function determinePostRollTrickEffect(trick, actor, item, target, attackRoll)
{
    if (!trick) return null;

    //If the attack is using a trick that instantly causes a failed damage save, see if the target auto-fails a save.
    if (target != null)
    {
        if (!checkConditions(trick, target[0]?.document._actor, attackRoll))
            return null;

        if (trick.system.effect.additionalEffect == "failDamageSave") autoFailSaveCheck(attackRoll, target, trick.system, item);
    }
}

export function checkConditions(trick, target, attackRoll = 0)
{
    const condition = trick.system.effect.condition;

    if ((condition == "hitBy4" || condition == "hitBy10") && attackRoll.total >= target.system.defense.value + 4)
        return true;
    if (condition == "targetHasCondition" && target.getEmbeddedCollection('ActiveEffect').filter(effect => effect.label.toLowerCase() == trick.system.effect.conditionTarget).length > 0 ) 
        return true;
    if (condition == "targetIsSpecial" && target.isSpecial) return true; 
    if (condition == "targetIsStandard" && !target.isSpecial) return true;
        
    return false;
}

//If a target is required for a trick, check to see if the player has anything targeted, and if not stop the attack and give an error message. 
function checkTargets(trick, target)
{
    if (!trick) return false;

    if (trick.system.requiresTarget && target.length == 0)
    {
        ui.notifications.error(game.i18n.localize('fantasycraft.Dialog.requiresTargetWarningMessage'))
        return true;
    }

    return false
}

function ignoreArmour(target)
{
    let armour = target[0].actor.items.find(item => (item.type == "armour" && item.system.equipped == true));
    if (armour == null)
        armour = target[0].actor.items.find(item => item.name == game.i18n.localize("fantasycraft.thickHide"));
        
    if (armour  == null)
        return 0
        
    if (armour.type == "feature" || armour.system?.armourCoverage == "partial")
        return -3
    if (armour.system.armourCoverage == "moderate")
        return -6
    if (armour.system.armourCoverage == "full")
        return -9
}

export function autoFailSaveCheck(attackRoll, targets, trick, item)
{
  for (let [k, v] of Object.entries(targets))
  {
    let t = v.document._actor;
    if (t.type != "npc") continue;

    let autoFailCheck = trick.effect.secondaryCheck;
    let lethal = (item.system.damageType == "subdual" || item.system.damageType == "cold" || item.system.damageType == "heat" || item.system.damageType == "stress") ? false : true;
    if (autoFailCheck != "beatsDefense")
    {
        if (attackRoll.total >= t.system.traits.defense.total && this.system.abilityScores[autoFailCheck].value > t.system.abilityScores[autoFailCheck].value)
            t.npcDamageSave(0, lethal, true);
    } else if (autoFailCheck != "dr4")
    {
        if (t.system.dr <= 4)
            t.npcDamageSave(0, lethal, true);
    } else 
    {
        if (attackRoll.total >= (t.system.traits.defense.total + 4))
            t.npcDamageSave(0, lethal, true);
    }
  }
}

export function multipleDamageRolls(attackRoll, target, trick)
{
    const condition = trick.system.effect.condition;

    if (condition == "hitBy4" && attackRoll.total >= target.system.defense.value + 4)
        return 1;
    if (condition == "hitBy10" && attackRoll.total >= target.system.defense.value + 4 && attackRoll.total < target.system.defense.value + 10)
        return 1;
    if (condition == "hitBy10" && attackRoll.total >= target.system.defense.value + 10)
        return 2;

    return 0;
}