exports.run = async function (Memer, msg) {
	const res = await Memer._snek.get('https://www.reddit.com/r/Jokes/top/.json?sort=top&t=day&limit=400');
	const posts = res.body.data.children.filter(post => !post.data.preview && post.data.selftext.length <= 550 && post.data.title.length <= 256);

	if (!Memer.indexes.joke[msg.channel.guild.id] || Memer.indexes.joke[msg.channel.guild.id] >= posts.length) {
		Memer.indexes.joke[msg.channel.guild.id] = 1;
	}

	const post = posts[Memer.indexes.joke[msg.channel.guild.id]];
	Memer.indexes.joke[msg.channel.guild.id]++;

	msg.channel.createMessage({
		embed: {
			title: post.data.title,
			color: Memer.randomColor(),
			url: post.data.url,
			description: post.data.selftext,
			footer: { text: `posted by ${post.data.author}` }
		}
	});
};

exports.props = {
	name: 'joke',
	usage: '{command}',
	aliases: ['funny'],
	cooldown: 1000,
	description: 'See a funny joke. Dad\'s love them!'
};