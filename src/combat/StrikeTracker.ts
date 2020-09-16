import StrikeCombat from "./StrikeCombat";

export default class StrikeTracker extends CombatTracker<StrikeCombat> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/fmmua/combat/StrikeTracker.html"
        });
    }

    async getData(options: any) {
        let result = await super.getData(options);
        console.log(result);
        return result;
    }

    // modified version of the base class implementation which ignores token permissions
    updateTrackedResources() {
        const combat = this.combat;
        if ( !combat ) return this.trackedResources = {};
        const resources = [combat.settings.resource];    // For future tracking of multiple resources
        this.trackedResources = combat.turns.reduce((obj: Record<string, any>, t) => {
            if ( !t.token ) return obj;
            const token = new Token(t.token);
            let obs = t.actor && true; // t.actor.hasPerm(game.user, "NONE");
            obj[token.id] = resources.reduce((res, r) => {
                res[r] = obs && t.actor ? getProperty(token.actor.data.data, r) : null;
                return res;
            }, {});
            return obj;
        }, {});
    
        // Synchronize updates with the pop-out tracker
        if ( this._popout ) this._popout.trackedResources = this.trackedResources;
        return this.trackedResources;
      }
}