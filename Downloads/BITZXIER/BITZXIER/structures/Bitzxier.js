const { Client, Collection, Partials, WebhookClient, Options } = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const Utils = require('./util')
const { glob } = require('glob')
const { promisify } = require('util')
const { Database } = require('quickmongo')
const axios = require('axios')
const { QuickDB } = require("quick.db");
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const Sql = require('better-sqlite3')
const redis = require('redis')
const { Destroyer } = require('destroyer-fast-cache')
module.exports = class Bitzxier extends Client {
    constructor() {
        super({
            intents: 53608191,
            fetchAllMembers: true,
            shards: getInfo().SHARD_LIST, 
           shardCount: getInfo().TOTAL_SHARDS, 
            allowedMentions: {
        parse: ['users'], 
        repliedUser: true 
            },
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
            sweepers: {
        messages: {
            interval: 300,
            lifetime: 1800
        }} })
        this.setMaxListeners(Infinity)
       this.cluster = new ClusterClient(this);
        this.config = require(`${process.cwd()}/config.json`)
        this.logger = require('./logger')
		this.ready = false
        this.rateLimits = new Collection()
        this.commands = new Collection()
        this.categories = fs.readdirSync('./commands/')
        this.emoji = {
            tick: '<:tick:1180470648053702657>',
            cross: '<:crosss:1180470543896551438>',
            dot: '<:bitzxier_dot_1:1181287240870146139>',
            process : '<a:red_loading:1221326019986980894>',
            disable : '<:biztxier_disable_yes:1180432405501333617><:bitzxier_enable_no:1180432231282516050>',
            enable : '<:bitzxier_disable_no:1180518054518587454><:bitzxier_enable_yes:1180431183620882472>',
            protect : '<a:bitzxier_antinuke:1180431827438153821>',
            hii : '<:bitzxier:1180449001934442516>'
        }

        this.util = new Utils(this)
        this.color = 0xff0000
        this.support = `https://discord.gg/S7Ju9RUpbT`
        this.cooldowns = new Collection()
        this.snek = require('axios')
        this.ratelimit = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1269946396434497568/-r5ZOP0b0kGG4ZM6Rh1DUTkbrBopQYrJYg0ujy8IzXy2G0hZFzBqMwTJYOHio39OrJlt'
        })
        this.error = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1180429380321804289/hK4ERW6vGMAjvO1VuGXyuKre60Zw1X3xkHhVChshBn7mNhhbtPODOeB1S1LFF_hZpTNp'
        })

        this.on('error', (error) => {
   		 if (error.code == 10008) return;
   		 if (error.code == 4000) return;
    	if (error.code == 10001) return;
    	if (error.code == 10003) return;
    	if (error.code == 10004) return;
    	if (error.code == 10005) return;
    	if (error.code == 50001) return;
    	if (error.code == 10062) return;
    	if (error.code == 50013) return;
    	if (error.code == 50035) return;
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('unhandledRejection', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('uncaughtException', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('warning', (warn) => {
            this.error.send(`\`\`\`js\n${warn}\`\`\``)
        })
        process.on('uncaughtExceptionMonitor', (err, origin) => {
            this.error.send(`\`\`\`js\n${err},${origin}\`\`\``)
        })
		process.on('uncaughtException', (error) => {
   		 if (error.code == 10008) return;
   		 if (error.code == 4000) return;
    	if (error.code == 10001) return;
    	if (error.code == 10003) return;
    	if (error.code == 10004) return;
    	if (error.code == 10005) return;
    	if (error.code == 50001) return;
    	if (error.code == 10062) return;
    	if (error.code == 50013) return;
    	if (error.code == 50035) return;
    	console.error(error);
});
process.on("triggerUncaughtException", (error) => {
    console.error(error);
});

this.rest.on('rateLimited', (info) => {
 this.ratelimit.send(`\`\`\`js\nTimeout: ${info.retryAfter},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.hash},\nRoute: ${info.route},\nGlobal: ${info.global}\nURL : ${info.url}\nScope : ${info.scope}\nMajorParameter : ${info.majorParameter}\`\`\``)
   const { route, retryAfter, limit, remaining, resetAfter,timeout } = info;
  this.rateLimits.set(route, {

    timeout,

    limit,

    remaining,

    resetAfter,

    lastReset: Date.now()

  });

  // Implement adaptive backoff strategy

  const now = Date.now();

  const timeLeft = this.rateLimits.get(route).resetAfter - (now - this.rateLimits.get(route).lastReset);

  const backoffTime = Math.min(Math.max(timeLeft, 1000), 60000); // Adjust minimum and maximum backoff times as needed
(async () => {
  await new Promise(resolve => setTimeout(resolve, backoffTime));
})()
});

    }

    async initializedata() {
        this.cache = new Destroyer()
        this.redis = new redis.createClient({ url : 'redis://redis:BITZXIER@5.161.76.60:1503/0' })
//        this.redis.connect()
        this.logger.log(`Connecting to Redis...`)

        this.logger.log('Redis Cache Connected', 'ready')
        this.logger.log(`Connecting to Sql...`)
        this.logger.log('Sql Database Connected', 'ready')
    }
    async SQL() {
        this.warn = new Sql(`${process.cwd()}/Database/warns.db`);
        this.warn.pragma('journal_mode = WAL');
        this.warn.prepare(`CREATE TABLE IF NOT EXISTS warnings (id INTEGER PRIMARY KEY AUTOINCREMENT,guildId TEXT NOT NULL,userId TEXT NOT NULL,reason TEXT,moderatorId TEXT,timestamp TEXT,warnId TEXT NOT NULL)`).run();
        this.snipe = new Sql(`${process.cwd()}/Database/snipe.db`);
        this.snipe.pragma('journal_mode = WAL');
    this.snipe.pragma('synchronous = NORMAL');

    this.snipe.pragma('locking_mode = NORMAL');
   
    this.snipe.pragma('threads = 4');
        this.snipe.prepare(`CREATE TABLE IF NOT EXISTS snipes (id INTEGER PRIMARY KEY AUTOINCREMENT,guildId TEXT NOT NULL,channelId TEXT NOT NULL,content TEXT,author TEXT,timestamp INTEGER,imageUrl TEXT)`).run();
        this.cmd = new Sql(`${process.cwd()}/Database/cmd.db`);
        this.cmd.pragma('journal_mode = WAL');
        this.cmd.prepare(`
            CREATE TABLE IF NOT EXISTS total_command_count (
                id INTEGER PRIMARY KEY CHECK (id = 1), 
                count INTEGER DEFAULT 0
            )
        `).run();
        this.cmd.prepare(`
            INSERT OR IGNORE INTO total_command_count (id, count) VALUES (1, 0)
        `).run();
    }

    async initializeMongoose() {
        this.db = new Database(this.config.MONGO_DB+"")
        this.db.connect()
        this.logger.log(`Connecting to MongoDb...`)
        mongoose.connect(this.config.MONGO_DB,{   
        maxPoolSize: 500
});
        this.logger.log('Mongoose Database Connected', 'ready')
    }

    async loadEvents() {
        fs.readdirSync('./events/').forEach((file) => {
            let eventName = file.split('.')[0]
            require(`${process.cwd()}/events/${file}`)(this)
            this.logger.log(`Updated Event ${eventName}.`, 'event')
        })
    }

    async loadlogs() {
        fs.readdirSync('./logs/').forEach((file) => {
            let logevent = file.split('.')[0]
            require(`${process.cwd()}/logs/${file}`)(this)
            this.logger.log(`Updated Logs ${logevent}.`, 'event')
        })
    }
        
    async loadMain() {
        const commandFiles = []

        const commandDirectories = fs.readdirSync(`${process.cwd()}/commands`)

        for (const directory of commandDirectories) {
            const files = fs
                .readdirSync(`${process.cwd()}/commands/${directory}`)
                .filter((file) => file.endsWith('.js'))

            for (const file of files) {
                commandFiles.push(
                    `${process.cwd()}/commands/${directory}/${file}`
                )
            }
        }
        commandFiles.map((value) => {
            const file = require(value)
            const splitted = value.split('/')
            const directory = splitted[splitted.length - 2]
            if (file.name) {
                const properties = { directory, ...file }
                this.commands.set(file.name, properties)
            }
        })
        this.logger.log(`Updated ${this.commands.size} Commands.`, 'cmd')
    }
}

