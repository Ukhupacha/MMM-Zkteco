Module.register("MMM-Zkteco", {
    defaults: {
        ip: "zkteco.intranet"
    },

    message: "MMM-Zkteco starting up",
    notificationReceived(notification, payload){
        Log.log("notification received=" + notification);
        // if all modules are running
        if(notification == 'ALL_MODULES_STARTED') {
            //send our confic down to helper use
            this.sendSocketNotification("CONFIG", this.config)
            // get the playing content
            this.message = "MMM-Zkteco waiting for content from api request"
            this.sendSocketNotification("getcontent", null)
        }
    },

    // helper sends back specific web page nodes scraped
    socketNotificationReceived: function(notification, payload){
        if (notification == 'node_data') {
            Log.log("received content back from helper")
            // save it
            this.content = payload;
            Log.log("there are " + this.content.length + " elements to display");
            if (this.content.length == 0) {
                this.message = "MMM-Zkteco No content found" + this.config.location;
            }
            // tell MM we have new stuff to display
            // will cause getDom() to be called
            this.updateDom()
        }
    },

    getDom: function() {
        // base wrapper for our content
        wrapper = document.createElement("div");
        if(this.content.length > 0 ) {
            // loop the list of nodes (if any)
            for (const [key, value] of Object.entries(this.content)) {
                // create employee element
                employee = document.createElement("span");
                employee.setAttribute('class', 'worker');
                employee.innerHTML = value;
                
                // append employee to main wrapper
                wrapper.appendChild(employee);
            }
        }
        else {
            wrapper.innerHTML = this.message;
        }
        // tell MM this our content to add to the MM dom
        return wrapper;
    },

    getStyles: function () {
        return ["MMM-Senamhi.css"];
    }

});