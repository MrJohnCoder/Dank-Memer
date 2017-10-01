exports.run = async function (Memer, msg, args) {
	if (!msg.member.permission.has('manageGuild')) {
		return msg.reply('You are not authorized to use this command.');
	}
	const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || await Memer.db.createGuild(msg.channel.guild.id);
	args = Memer.removeDuplicates(args);
	args = args.map(arg => {
		if (Memer.aliases.has(arg)) {
			return Memer.aliases.get(arg);
		} else {
			return arg;
		}
	});
	if (!args[0]) {
		return msg.reply(`Specify a command to enable, or multiple.\n\nExample: \`${gConfig.prefix} enable meme trigger shitsound\` or \`${gConfig.prefix} enable meme\``);
	}
	if (args.some(cmd => !Memer.cmds.has(cmd) && !Memer.aliases.has(cmd))) {
		return msg.reply(`The following commands are invalid: \n\n${args.filter(cmd => !Memer.cmds.has(cmd)).map(cmd => `\`${cmd}\``).join(', ')}\n\nPlease make sure all of your commands are valid and try again.`);
	}
	if (args.some(cmd => !gConfig.disabledCommands.includes(cmd))) {
		return msg.channel.createMessage(`The following commands currently aren't disabled: \n\n${args.filter(cmd => !gConfig.disabledCommands.includes(cmd)).map(cmd => `\`${cmd}\``).join(', ')}  \n\nPlease make sure all of your arguments are valid and try again.`);
	}
	args.map(cmd => {
		gConfig.disabledCommands.splice(gConfig.disabledCommands.indexOf(cmd), 1)
	});
	await Memer.db.updateGuild(gConfig);
	msg.reply(`The following commands have been enabled successfully:\n\n${args.map(cmd => `\`${cmd}\``).join(', ')}`);
};

exports.props = {
	name: 'enable',
	usage: '{command}',
	aliases: [],
	cooldown: 60000,
	description: ''
};
