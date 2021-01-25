import chalk from 'chalk';
import { Md5 } from 'Md5-typescript';
import { Packr } from 'msgpackr';
import WebSocket from 'ws';

module.exports = class Penguin {
	userName: string;
	nickname: string;
	password: string;
	rndK: string;
	msgpackr: Packr;
	socket: WebSocket;
	id: number;
	token: string;
	penguinData: { coins: number };
	loggedIn: boolean = false;
	crumbs: object = {};
	added: boolean = false;
	isNum: any;
	connected: boolean = false;
	debug: boolean;
	latestVersion: string;
	version: string;

	constructor(userName: string, password: string) {
		this.userName = userName;
		this.password = password;
		this.rndK = 'a94c5ed2140fc249ee3ce0729e19af5a';
		this.msgpackr = new Packr({ useRecords: false });
	}

	public async connect(ip: string, port: number) {
		this.socket = new WebSocket(`wss://${ip}:${port}/`, {
			origin: 'https://play.cprewritten.net',
			rejectUnauthorized: false
		});

		this.socket.on('open', async () => {
			this.connected = true;
			if (!this.loggedIn) return await this.sendLogin();

			return await this.sendJoinWorld();
		});

		this.socket.on('message', async (e) => {
			let data = this.msgpackr.unpack(e as Buffer);
			if (this.debug && (String(data).search('engine') == -1)) console.log(chalk.yellowBright(`[+] PACKET RECV ${JSON.stringify(data)}`));

			await this.handlePacket(data);
		});

		this.socket.on('error', (err) => {
			return console.log(chalk.redBright(`Sorry, there was an error creating a connection to CPRewritten! Error: ${err.toString().replace('Error: ', "")}`));
		});
	}

	public async startHeartBeat() {
		await this.emitPacket('engine:heart_beat', []);
		setInterval(async () => {
			await this.emitPacket('engine:heart_beat', []);
		}, 10000);
	}

	public async sendLogin() {
		await this.emitPacket('login:u', [this.userName, this.hashPasswordCP(this.password)]);
	}

	public async random_add() {
		return new Promise < void > (async (res) => {
			let coins = this.ranCoin(2500);

			console.log(chalk.magentaBright(`[+] Randomly added ${coins} coins...`));

			await this.sendJoinRoom(903);
			await this.emitPacket("game:over", [coins, 407, 692]);

			await this.waitFor(_ => this.added === true).then(_ => res());

			this.added = false;
		});
	}

	public async fast_max() {
		return new Promise < void > (async (res) => {

			let coins = 99990; // updated to push limit (literally use this if u just want to be banned)

			console.log(chalk.magentaBright(`[+] Added ${coins} coins...`));

			await this.sendJoinRoom(903);
			await this.emitPacket("game:over", [coins, 407, 692]);

			await this.waitFor(_ => this.added === true).then(_ => res());

			this.added = false; // set to false so that new coins from packet can be received.
		});
	};

	public async addCoins(amount) {
		return new Promise < void > (async (res, rej) => {

			this.isNum = /^\d+$/.test(amount);
			if (amount < 5 || amount >= 100000 || this.isNum === false) return rej();

			console.log(chalk.magentaBright(`[+] Adding ${amount} coins...`));

			await this.sendJoinRoom(903);
			await this.emitPacket("game:over", [parseInt(amount), 407, 692]);

			await this.waitFor(_ => this.added === true).then(_ => res());
		}).catch(() => {
			if (amount < 5) console.log(chalk.redBright('[-] Add more coins!\n'));
			if (amount >= 100000) console.log(chalk.redBright('[-] Are you trying to get banned?\n'));
			if (this.isNum === false) console.log(chalk.redBright('[-] Numbers only!\n'));
		});
	};

	public ranCoin(max) {
		return Math.floor(Math.random() * Math.floor(max));
	};

	public async sendJoinWorld() {
		await this.emitPacket('world:auth', [this.id, this.token]);
	}

	public async sendJoinRoom(room: number = -1, x: number = 4, y: number = 38) {
		await this.emitPacket('navigation:join_room', [room, x, y])
	}

	public swapMd5(password) {
		return password.substr(16, 16) + password.substr(0, 16);
	}

	public hashPasswordCP(password) {
		password = Md5.init(password).toUpperCase();
		password = this.swapMd5(password);
		password += this.rndK;
		password += 'Y(02.>\'H}t":E1';
		password = Md5.init(password);
		return this.swapMd5(password);
	}

	public async emitPacket(action: string, params: Array < any > ) {
		let packet: any = { action, params };
		if (this.debug) console.log(chalk.yellowBright(`[+] PACKET SENT ${JSON.stringify(packet)}`));

		packet = this.msgpackr.pack(packet);
		this.socket.send(packet);
	}

	public async handlePacket(packet) {
		switch (packet.action) {
			case 'login:u':
				await this.handleLogin(packet.params);
				break;
			case 'world:auth':
				await this.handleJoinWorld();
				break;
			case 'engine:get_crumbs':
				await this.handleProccessCrumbs(packet.params);
				break;
			case 'game:over':
				this.added = true;
				this.penguinData.coins = packet.params[0];
				console.log(chalk.magentaBright('[+] Done!'))
				console.log(chalk.yellowBright(`\nYour Current Coins: ${this.penguinData.coins}`));
				break;
			case 'engine:prompt':
				this.handlePrompt(packet.params);
		}
	}

	public async handleProccessCrumbs(params) {
		this.crumbs[params[0]] = params[1];
		if (params[0] == "tour_messages") await this.sendJoinRoom();
	}

	public async handlePrompt(params) {
		if (params[0] === 'login') {
			this.socket.close(); // close connection to tcp socket
			console.log(chalk.redBright(`[-] Error: ${params[1]}`));
			return process.exit();
		}
	}

	public async handleJoinWorld() {
		await this.startHeartBeat();
		let crumbs = ["client", "item", "room", "game", "furniture", "igloo", "location", "puffle", "igloo_music", "postcard", "stamps", "stamp_polaroids", "stamp_cover", "pins", "frame_hacks", "characters", "safe_chat", "jokes", "tour_messages"];
		for (let crumb of crumbs) await this.emitPacket('engine:get_crumbs', [crumb]);
	}

	public async handleLogin(params) {
		this.id = params[0];
		this.nickname = params[1];
		this.token = params[2];
		this.penguinData = params[3];
		this.loggedIn = true;

		console.log(chalk.magentaBright(`Username: ${this.nickname}`));
		console.log(chalk.yellowBright(`Current Coins: ${this.penguinData.coins}\n`));
		console.log(chalk.yellowBright(`CPR Server Version: ${params[params.length -1]}\n`));
	}

	public sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	public waitFor(conditionFunction) {
		const poll = resolve => {
			if (conditionFunction()) resolve();
			else setTimeout(_ => poll(resolve), 400);
		}
		return new Promise(poll);
	}

	public banner() {
		console.log(chalk.blueBright(`       
   ___ ___ ___    ___     _          _      _    _         
  / __| _ \\ _ \\  / __|___(_)_ _     /_\\  __| |__| |___ _ _ 
 | (__|  _/   / | (__/ _ \\ | ' \\   / _ \\/ _\` / _\` / -_) '_|
  \\___|_| |_|_\\  \\___\\___/_|_||_| /_/ \\_\\__,_\\__,_\\___|_|  
                  created by benjii#0420                     
																		 `));

	}
};
