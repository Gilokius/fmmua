import * as dice from './dice.js';
import { RollTag } from './StrikeRoll.js';

export interface RollDialogResult {
    type: RollTag;
    advantage: boolean;
    disadvantage: boolean;
    flavor: string | undefined;
}

export default class RollDialog extends Dialog {
    static defaults: RollDialogResult = {
        type: "skilled",
        advantage: false,
        disadvantage: false,
        flavor: undefined
    }

    constructor(dialogData = {}, options = {}) {
        super(dialogData, options);
        this.options.classes = ["fmmua", "dialog"];
    }

    static async run(flavor?: string): Promise<void> {
        let data = this.defaults;
        if (typeof flavor === "string" && flavor.length > 0) {
            data.flavor = flavor;
        }

        const content = await renderTemplate("systems/fmmua/dice/RollDialog.html", data);

        return new Promise((resolve) => {
            const dialog = new this({
                title: "Strike Roll",
                content,
                buttons: {
                    roll: {
                        icon: `<i class="fas fa-dice"></i>`,
                        label: "Roll",
                        callback: async (html: JQuery<HTMLElement>) => {
                            let result = {
                                type: html[0].querySelector<HTMLSelectElement>(".fmmua-roll-type")!.value as RollTag,
                                advantage: html[0].querySelector<HTMLInputElement>(".fmmua-advantage")!.checked,
                                disadvantage: html[0].querySelector<HTMLInputElement>(".fmmua-disadvantage")!.checked,
                                flavor: html[0].querySelector<HTMLInputElement>(".fmmua-flavor")!.value
                            };
                            this.defaults = result;
                            await dice.strikeRoll(result.advantage, result.disadvantage, result.flavor, result.type);
                            resolve();
                        }
                    },
                },
                default: "roll",
                close: () => resolve()
            });
            dialog.render(true);
        });
    }
}