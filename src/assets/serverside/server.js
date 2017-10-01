const express = require('express');
const app = express();
const hb = require('handlebars');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./../../config.json');
const dogapi = require('dogapi');
const options = {
    api_key: '8827dd750efb8cec8a656985e4974413',
    app_key: 'f8d6a3ac647bc9a6caece15a9aadef20aa08f1f4',
};
dogapi.initialize(options);

client.login(config.token);

const source = hb.compile(fs.readFileSync('./website/index.html').toString());
app.use(express.static('website'));

const endpoints = {};
const stats = {
    requests: 0,
    cmds: {}
};
setInterval(function () { dogapi.metric.send('api.requests', stats.requests) }, 2000);


fs.readdir('./assets/', (err, files) => {
    files.forEach(file => {
        file = file.replace('.js', '');
        try {
            endpoints[file] = require(`./assets/${file}`).run;
            stats.cmds[file] = 0;
        } catch (e) {
            console.warn(`[ERR] Failed to load resource '${file}'`);
        }
    });
});

app.get('/api/*', async (req, res) => {
    stats.requests++;

    let keys = require('./keys.json');
    delete require.cache[require.resolve('./keys.json')];

    if (!req.headers['api-key'] || !keys.includes(req.headers['api-key']))
        return res.status(401).send('<h1>401 - Unauthorized</h1><br>You are not authorized to access this endpoint.');

    const endpoint = req.originalUrl.slice(req.originalUrl.lastIndexOf('/') + 1);
    if (!endpoints[endpoint])
        return res.status(404).send('<h1>404 - Not Found</h1><br>Endpoint not found.');

    stats.cmds[endpoint]++;
    const data = await endpoints[endpoint](req.headers['data-src'])
        .catch(err => {
            return res.status(400).send(err.message);
        });

    res.status(200).send(data);

})

app.get('/', (req, res) => {
    let data = {
        'uptime': formatTime(process.uptime()),
        'ram': (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
        'requests': stats.requests,
        'usage': Object.keys(stats.cmds).sort((a, b) => stats.cmds[b] - stats.cmds[a]).map(c => `${c} - ${stats.cmds[c]} hits`).join('<br>'),
        'guilds': client.guilds.size,
        'users': client.users.size
    };
    res.status(200).send(source(data));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`);
});

app.listen('80', console.log('Server ready.'));


function formatTime(time) {
    let days = Math.floor(time % 31536000 / 86400),
        hours = Math.floor(time % 31536000 % 86400 / 3600),
        minutes = Math.floor(time % 31536000 % 86400 % 3600 / 60),
        seconds = Math.round(time % 31536000 % 86400 % 3600 % 60);
    days = days > 9 ? days : '0' + days;
    hours = hours > 9 ? hours : '0' + hours;
    minutes = minutes > 9 ? minutes : '0' + minutes;
    seconds = seconds > 9 ? seconds : '0' + seconds;
    return `${days > 0 ? `${days}:` : ``}${(hours || days) > 0 ? `${hours}:` : ``}${minutes}:${seconds}`;
}

/*
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    // Fork workers.
    for (let i = 0 i < numCPUs i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end(`hello world from ${process.pid}\n`)
    }).listen('./my.sock')
    console.log(`Worker ${process.pid} started`)
}
*/