var NodeHelper = require('node_helper');
const axios = require('axios');
const https = require('https');
const { JSDOM } = require('jsdom');
const { PythonShell } = require('python-shell');
var pyshell;

module.exports = NodeHelper.create ({
    config: null,
    debug: false,
    init() {
        console.log(`Init module helper: ${this.name}`);
    },
    start() {
        console.log(`Starting module helper: ${this.name}`);
    },
    stop() {
        console.log(`Stopping module helper: ${this.name}`);
    },

    // Handle messages from our module// each notificiation indicates a different messgage
    // payload is a data structure that is different per message.. up to you to design this
    socketNotificationReceived(notification, payload) {
        if (this.debug){
            console.log(this.name + " received a socket notification: " + notification + " - Payload " + payload);
        }        
        // if config message from module
        if (notification == "CONFIG") {
            // save payload config info
            this.config = payload
        }
        // module wants content from api
        else if (notification == "getcontent") {
            this.getcontent()

        }
    },
    // get the selected dom nodes from the specific web site page
    getcontent(){
        //setting JSDOM parameters
        pyshell = new PythonShell('modules/' + this.name + '/MMM-Zkteco.py');

        pyshell.on('message', function (message) {
            if (this.debug) {
                console.log(message);
            }
            this.sendSocketNotification("node_data", message)

        });

        pyshell.end(function (err) {
            if (err) throw err;
            if (this.debug){
                console.log("[" + this.name + "]" + 'finished running...');
            }
            this.sendSocketNotification("error", 'pyshell-throw');
        });
    },

    // getForecast function
    getForecast: async function(locationId) {
        const locationUrl = (location) => `https://www.senamhi.gob.pe/?p=pronostico-detalle&localidad=${location}`;
        const { data: html } = await axios.get(locationUrl(locationId), {
            headers: {
                accept: '*/*',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        const dom = new JSDOM(html);
        const $ = (selector) => dom.window.document.querySelector(selector);
    
        const title = $('.subtit-interior').textContent.trim();
    
        const forecastList = dom.window.document.querySelectorAll('.bg-gris');
        const forecast = []
    
        const getDay = (day) => {
            const date = day.querySelector('strong').textContent.trim().split(" ")[0];
            const icon = 'https://www.senamhi.gob.pe/' + day.querySelector('img').getAttribute('src');
            const maxTemp = day.querySelector('.text-max').textContent.split("C")[0];
            const minTemp = day.querySelector('.text-min').textContent.split("C")[0];
            const desc = day.querySelector('.desc').textContent;
            return {
                date,
                icon,
                maxTemp,
                minTemp,
                desc
            }    
        }
        forecastList.forEach((day) => {
            forecast.push(getDay(day));
        })

        return forecast;
    },
})