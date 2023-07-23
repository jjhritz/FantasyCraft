export function _getInitiativeFormula(formula = "1d20")
{
    const actor = this.actor;
    if (!actor) return formula;

    const init = (actor.type == "npc") ? actor.system.traits.initiative : actor.system.initiative;

    let dice = 1;
    let mods = "";

    if (actor.getFlag("fantasycraft", "Lightning Reflexes")) 
    {
        dice = 2;
        mods = "kh";
    }

    const roll = (actor.type == "npc") ? [`${dice}d20${mods}`, init.value, actor.system.abilityScores.dexterity.mod, 0] : [`${dice}d20${mods}`, init.class, init.ability.value, init.featBonus];

    return roll.filter(p => p !== null).join(" + ");
}