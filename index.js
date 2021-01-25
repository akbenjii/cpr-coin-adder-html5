const c = require('chalk');
const p = require('phin'); // haha cp lol

const Penguin = require('./dist/client');
const prompt = require('prompt-sync')({sigint: true});

const {username, password} = require('./account.json');
const {version} = require('./package.json');

const client = new Penguin(username, password);

client.debug = false; 

(async () => {

    let completedPrompt = false;

    const result = await p({
        'url': 'https://raw.githubusercontent.com/akbenjii/cpr-coin-adder-html5/main/package.json',
        'parse': 'json'
    });

    client.banner();
    if(result.body.version !== version) {
        console.log(c`            {redBright Running Coin Adder} {redBright.bold v${version}}{redBright . [OUTDATED]}\n`);
        console.log(c`{redBright.bold Get the new version at https://github.com/akbenjii/cpr-coin-adder-html5}`);
        return console.log(c`{redBright.bold Join the supprot discord @ : https://discord.gg/CJ68DGV67J}`)
    }

    console.log(c`                {blueBright Running Coin Adder} {blueBright.bold v${version}}{blueBright .}\n`);

    await client.connect('server.cprewritten.net', 7072);
    await client.waitFor(_ => client.connected === true).then(_ => client.connected = false);
	
    await client.connect('server.cprewritten.net', 7074);
    await client.waitFor(_ => client.connected === true).then(_ => console.log(c`{greenBright [+] Connected to CPR!\n}`));

    await client.sleep(2000);
    console.log(c`{blue Select an option.}`);
    console.log(c`{blueBright [1] Random Amount. \n[2] Custom Amount.\n[3] Fast Max (Dangerous)}`);

    while (completedPrompt === false) {
        const option = prompt(c`{magentaBright Method: }`);

        switch (option) {
            case '1':
                console.log(c.magentaBright('\n[+] Loading random coin adder...'));
                completedPrompt = true;
                setInterval(async () => {
                    await client.random_add();
                }, 3500);
                break;
            case '2':
                completedPrompt = true;

                console.log('')
                let add_amount = prompt(c.yellowBright('How many coins would you like to add? '));
                await client.addCoins(add_amount);

                console.log(c`{greenBright Thank you for using the CPR Coin Adder!}`);
                process.exit();
            case '3':
                console.log(c.magentaBright('\n[+] Loading Fast Max coin adder...'));
                completedPrompt = true;
                setInterval(async () => {
                    await client.fast_max();
                }, 1500);
                break;
            default:
                console.log(c.redBright("[-] Sorry, that option doesn't exist."));
        }
    }

})();
