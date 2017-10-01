const Jimp = require('jimp');

exports.run = (URL) => {
	return new Promise(async (resolve, reject) => {
		try {
			URL = JSON.parse(URL);
		} catch (e) {
			return reject('Unable to parse data-src.');
		};
		if (URL.length < 2)
			return reject('data-src must be an array of 3 strings');

		const avatar = await Jimp.read(URL[0]);
		const avatar2 = avatar.clone();
		const text = URL[1];
		const mom = await Jimp.read('./resources/byemom/mom.png');
		const blank = await Jimp.read('./resources/byemom/blank.png');

		avatar.resize(70, 70);
		avatar2.resize(125, 125);
		mom.composite(avatar, 530, 15);
		mom.composite(avatar2, 70, 340);

		Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function (font) {
			blank.resize(275, 200);
			let search = blank.print(font, 0, 0, text, 275);
			search.rotate(337);

			mom.composite(search, 380, 435);
			mom.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
				if (err)
					return reject(err);
				resolve(buffer);
			});
		});
	});
};