import StrikeData from "./StrikeData.js";
import StrikeActor from "./StrikeActor.js";

export default class CharacterSheet extends ActorSheet<StrikeData, StrikeActor> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["fmmua", "sheet", "actor", "character"],
        width: 610,
        height: 810,
        template: "systems/fmmua/actors/CharacterSheet.html"
      });
    }
}