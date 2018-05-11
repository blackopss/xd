const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const moment = require('moment');
const client = new Discord.Client();
const { PREFIX, GOOGLE_API_KEY } = require('./config2');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
if (message.content.startsWith(PREFIX + 'help')) {
	if(!message.channel.guild) return message.reply('**هذا الأمر للسيرفرات فقط**').then(m => m.delete(300));
	let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL)
	.setColor('RANDOM')
	    .addField("***[!]=برفكس البوت***","****")
.addField("**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**","** **")
	.addField("!play","**لتشغيل لاغنيه**")
	.addField("!s","**يتخطي لاغنيه**")
  .addField("!stop","**لتوقيف لاغنيه**")
    .addField("!queue","**لتوقيف لاغنيه بشكل موقت**")
        .addField(".resume","**استئناف لاغنيه**")
  .addField("مبرمج البوت","**» <@43115088554911334**")
	          .addField("By server ","**» OyoZami**")
.addField("**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**","** **")
	.setFooter("ميوزك بوت", 'data:image/jpeg;base64,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')
	message.channel.sendEmbed(embed).then(m => m.delete(18000));

}
});


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

// client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

// client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(PREFIX.length)

	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('أنا آسف ولكن عليك أن تكون في قناة صوتية لتشغيل الموسيقى!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('لا أستطيع أن أتكلم في هذه القناة الصوتية، تأكد من أن لدي الصلاحيات الازمة !');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('لا أستطيع أن أتكلم في هذه القناة الصوتية، تأكد من أن لدي الصلاحيات الازمة !');
		}
		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**لا يوجد لدي صلاحيات `EMBED LINKS`**")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(` **${playlist.title}** تم اضافة القائمه!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
			        .setDescription(`**اختار رقم المقطع** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
					.setFooter("")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('لم يتم تحديد العدد لتشغيل الاغنيه.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: لم أستطع الحصول على أية نتائج بحث.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `s`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === `stop`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`:loud_sound: Current volume is **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');
		const embedNP = new Discord.RichEmbed()
	.setDescription(`:notes: الان يتم تشغيل: **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		let index = 0;
		const embedqu = new Discord.RichEmbed()
	.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('تم إيقاف الموسيقى مؤقتا!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('استأنفت الموسيقى بالنسبة لك !');
		}
		return msg.channel.send('لا يوجد شيء حالي في العمل.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`بدء تشغيل: **${song.title}**`);
}

client.login(process.env.BOT_TOKEN);
