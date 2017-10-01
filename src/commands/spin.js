const { spinners, diseases } = require('../assets/arrays.json');

exports.run = async function (Memer, msg) {
	msg.channel.createMessage(`Your ${Memer.randomInArray(spinners)} spun for ${Memer.parseTime(Math.floor(Math.random() * 60 + 1) * 4)}. Congratulations, you now have ${Memer.randomInArray(diseases)}.`);
};

exports.props = {
	name: 'spin',
	usage: '{command}',
	aliases: ['fidget'],
	cooldown: 1000,
	description: 'Spin the cancer spinner!'
};