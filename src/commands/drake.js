exports.run = async function (Memer, msg) {
	const avatarurl = msg.mentions.length > 0 ? msg.mentions[0].staticAvatarURL : msg.author.staticAvatarURL;
	const authorurl = msg.mentions.length > 0 ? msg.author.staticAvatarURL : Memer.bot.user.staticAvatarURL;

	const data = await Memer._snek
		.get('http://getame.me/api/drake')
		.set('Api-Key', Memer.config.imgenKey)
		.set('data-src', JSON.stringify([`${avatarurl}`, `${authorurl}`]));

	if (data.status === 200) {
		await msg.channel.createMessage('', { file: data.body, name: 'hi.png' });
	} else {
		msg.channel.createMessage(`Error: ${data.text}`);
	}
};

exports.props = {
	name: 'drake',
	usage: '{command} @user',
	aliases: [],
	cooldown: 3000,
	description: 'Drake is picky'
};