var NodeHelper = require('node_helper');
const { PythonShell } = require('python-shell');
var pyshell;

module.exports = NodeHelper.create ({
    config: null,
    debug: true,
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
    }    
})