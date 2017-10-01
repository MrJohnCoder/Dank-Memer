
const twitter = require('../config.json').twitter;
const twit = require('twit');
const tClient = new twit({
	consumer_key: twitter.consumer_key,
	consumer_secret: twitter.consumer_secret,
	access_token: twitter.access_token,
	access_token_secret: twitter.access_token_secret,
	timeout_ms: 60 * 1000,
});

exports.run = async function (Memer, msg, args) {
	/*
	if (!await Memer.db.isDonator(msg.author.id)) {
		return msg.reply('You need to both be on Melmsie\'s server and be a donor to use this command (you can thank all the assholes who decided to ruin it)! To join the server, use `pls invite`. To donate, use `pls donate`.')
	}*/

	if (!args[0] || msg.mentions[0]) {
		return msg.reply('What do you want me to tweet?');
	}

	if (args.join(' ').length > 140) {
		return msg.channel.createMessage(`Tweet too long. You're ${args.join(' ').length - 140} characters over the limit!`);
	}

	tClient.post('statuses/update', {
		status: `${args.join(' ')} -${msg.author.username}#${msg.author.discriminator}`
	}, (err, data, response) => {
		if (err) {
			return msg.channel.createMessage(`Something went wrong. \n${err.message}`);
		}
		if (response.statusCode !== 200) {
			return msg.channel.createMessage('Something went wrong. Please try again later.');
		}
		msg.channel.createMessage({
			embed: {
				color: Memer.colors.lightblue,
				title: 'Tweet Sent!',
				description: `[View here](https://twitter.com/${data.user.screen_name}/status/${data.id_str})`,
				footer: { text: 'See this tweet, and more @plsmeme' }
			}
		});
		try {
			Memer.bot.createMessage('326384964964974602', {
				content: Memer.bannedWords.some(word => args.join(' ').toLowerCase().includes(word)) ? '<@172571295077105664> BAD TWEET LAD WEE WOO WEE WOO' : '',
				embed: {
					title: 'New tweet:',
					url: `https://twitter.com/PlsMeme/status/${data.id_str}`,
					author: { name: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}` },
					description: args.join(' '),
					fields: [{ name: 'Sent from:', value: `#${msg.channel.name} in ${msg.channel.guild.name}` }],
					color: 0x4099FF,
					footer: { text: `Tweet ID: ${data.id_str} | Guild ID: ${msg.channel.guild.id} ` },
					timestamp: new Date(),
				}
			});
		} catch (e) {
			Memer.log(e.stack, 'error');
		}
	});
};

exports.props = {
	name: 'tweet',
	usage: '{command} what you wanna tweet',
	aliases: ['twitter'],
	cooldown: 20000,
	description: ''
};
