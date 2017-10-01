const metrics = require('datadog-metrics');
const config = require('../config.json');
metrics.init({
	apiKey: config.datadog.APIkey,
	appKey: config.datadog.APPkey,
	flushIntervalSeconds: 10,
	prefix: 'dank.'
});
module.exports = Bot => ({
	createGuild: async function createGuild(guildID) {
		await Bot.r.table('guilds')
			.insert({
				id: guildID,
				prefix: Bot.config.defaultPrefix,
				disabledCommands: []
			})
			.run();
		metrics.increment('db.createGuild');
		return this.getGuild(guildID);
	},

	getGuild: async function getGuild(guildID) {
		metrics.increment('db.getGuild');
		return await Bot.r.table('guilds')
			.get(guildID)
			.run();
	},

	updateGuild: async function updateGuild(guildEntry) {
		metrics.increment('db.updateGuild');
		return await Bot.r.table('guilds')
			.insert(guildEntry, { conflict: 'update' })
			.run();
	},

	deleteGuild: async function deleteGuild(guildID) {
		metrics.increment('db.deleteGuild');
		return await Bot.r.table('guilds')
			.get(guildID)
			.delete()
			.run();
	},


	addCooldown: async function addCooldown(command, ownerID) {
		metrics.increment('db.addCooldown');
		if (!Bot.cmds.has(command)) {
			return;
		}
		const cooldown = Bot.cmds.get(command).props.cooldown;
		const profile = await this.getCooldowns(ownerID);
		if (!profile) {
			return await this.createCooldowns(command, ownerID);
		}
		if (profile.cooldowns.some(cmd => cmd[command])) {
			profile.cooldowns.forEach(cmd => {
				if (cmd[command]) {
					cmd[command] = Date.now() + cooldown;
				}
			});
		} else {
			profile.cooldowns.push({ [command]: Date.now() + cooldown });
		}
		return await Bot.r.table('cooldowns')
			.insert({ id: ownerID, cooldowns: profile.cooldowns }, { conflict: 'update' });
	},

	createCooldowns: async function createCooldowns(command, ownerID) {
		metrics.increment('db.createCooldown');
		if (!Bot.cmds.has(command)) {
			return;
		}
		const cooldown = Bot.cmds.get(command).props.cooldown;
		return await Bot.r.table('cooldowns')
			.insert({ id: ownerID, cooldowns: [{ [command]: Date.now() + cooldown }] });
	},

	getCooldowns: async function getCooldown(ownerID) {
		metrics.increment('db.getCooldown');
		return await Bot.r.table('cooldowns');
			.get(ownerID)
			.run();
	},


	getCooldown: async function getCooldown(command, ownerID) {
		metrics.increment('db.getCooldown');
		const profile = await Bot.r.table('cooldowns').get(ownerID).run();
		if (!profile) {
			return 1;
		}
		const cooldowns = profile.cooldowns.find(item => item[command]);
		if (!cooldowns) {
			return 1;
		}
		return profile.cooldowns.find(item => item[command])[command];
	},

	addBlock: async function addBlock(id) {
		metrics.increment('db.addBlock');
		return await Bot.r.table('blocked')
			.insert({ id })
			.run();
	},

	removeBlock: async function removeBlock(id) {
		metrics.increment('db.removeBlock');
		return await Bot.r.table('blocked')
			.get(id)
			.delete()
			.run();
	},

	isBlocked: async function isBlocked(guildID, authorID = 1) {
		metrics.increment('db.checkBlock');
		const res = await Bot.r.table('blocked').get(guildID).run() ||
			await Bot.r.table('blocked').get(authorID).run();

		return Boolean(res);
	},


	addDonator: async function addDonator(id, donatorLevel) {
		metrics.increment('db.addDonor');
		return await Bot.r.table('donators')
			.insert({ id, donatorLevel })
			.run();
	},

	removeDonator: async function removeDonator(id) {
		metrics.increment('db.removeDonor');
		return await Bot.r.table('donators')
			.get(id)
			.delete()
			.run();
	},

	isDonator: async function isDonator(id, donatorLevel = 1) {
		metrics.increment('db.checkDonor');
		const res = await Bot.r.table('donators')
			.get(id)
			.run();
		return res ? res.donatorLevel >= donatorLevel : false;
	},


	getStats: async function getStats() {
		metrics.increment('db.getStats');
		const res = await Bot.r.table('stats')
			.get(1)
			.run();
		return res.stats;
	}
})