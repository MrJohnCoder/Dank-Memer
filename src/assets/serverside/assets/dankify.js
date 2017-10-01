const Jimp = require('jimp');

exports.run = (URL) => {
	return new Promise(async (resolve, reject) => {
		const avatar = await Jimp.read(URL).catch(err => { reject(err) });
		const horn = await Jimp.read('./resources/dankify/horn.png').catch(err => { reject(err) });
		const horn2 = horn.clone();
		const chips = await Jimp.read('./resources/dankify/chips.png').catch(err => { reject(err) });
		const dew = await Jimp.read('./resources/dankify/dew.png').catch(err => { reject(err) });
		const hit = await Jimp.read('./resources/dankify/hit.png').catch(err => { reject(err) });
		const hit2 = hit.clone();
		const hit3 = hit2.clone();
		const gun = await Jimp.read('./resources/dankify/gun.png').catch(err => { reject(err) });
		const red = await Jimp.read('./resources/dankify/red.png').catch(err => { reject(err) });

		avatar.resize(350, Jimp.AUTO);
		red.opacity(.2);
		horn.resize(150, 150);
		horn.rotate(315);
		horn2.resize(150, 150);
		horn2.rotate(315);
		horn2.flip(true, false);
		chips.resize(100, 100);
		chips.rotate(25);
		dew.resize(Jimp.AUTO, 140);
		dew.rotate(25);
		hit.resize(60, 60);
		hit2.resize(45, 45);
		hit3.resize(30, 30);
		gun.resize(250, Jimp.AUTO);

		avatar.composite(red, 0, 0);
		avatar.composite(horn, 225, 30);
		avatar.composite(horn, 220, 0);
		avatar.composite(horn, 215, -50);
		avatar.composite(horn, 210, -20);
		avatar.composite(horn2, -95, 30);
		avatar.composite(horn2, -82, 0);
		avatar.composite(horn2, -77, -30);
		avatar.composite(horn2, -70, -50);
		avatar.composite(chips, 0, 250);
		avatar.composite(dew, -20, 230);
		avatar.composite(hit, 130, 105);
		avatar.composite(hit2, 170, 90);
		avatar.composite(hit3, 200, 150);
		avatar.composite(gun, 150, 180);

		avatar.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
			if (err)
				return reject(err);
			resolve(buffer);
		});
	});
};