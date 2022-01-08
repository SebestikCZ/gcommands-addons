import { CommandContext, ComponentContext, Inhibitor } from 'gcommands';
import { Cooldowns } from '../utils/CooldownManager';
import ms from 'ms';

export interface ChannelOnlyOptions extends Inhibitor.InhibitorOptions {
	cooldown: string;
}

export class CooldownInhibitor extends Inhibitor.Inhibitor {
	cooldown: number;
	constructor(options) {
		super(options);
    
		this.cooldown = ms(options.cooldown);
	}

	async run(ctx: CommandContext | ComponentContext): Promise<any> {
		const hasCooldown = Cooldowns.hasCooldown(ctx.client, ctx.userId);
		if (hasCooldown) {
			return ctx.reply({
				content: this.resolveMessage(ctx) || `[Before you use this command, you have to vote for me on top.gg](https://top.gg/bot/${ctx.client.user.id})`,
				ephemeral: true
		    });
		} else {
			Cooldowns.setCooldown(ctx.client, ctx.userId, this.cooldown);
			return true;
		}
	}
}