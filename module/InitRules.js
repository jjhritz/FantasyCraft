export const _getInitiativeFormula = function(char)
{
    const actor = char.actor;
    if (!actor) return "1d20";
    const init = actor.systam.initiative;

    let dice = 1;
    let mods = "";

    if (actor.getFlag("fantasycraft", "Lightning Reflexes")) 
    {
        dice = 2;
        mods = "kh";
    }

    const roll = [`${dice}d20${mods}`, init.class, init.ability.value, init.featBonus];

    return roll.filter(p => p !== null).join(" + ");
}