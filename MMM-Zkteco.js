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
        var self = this;
        if (notification == 'node_data') {
            Log.log("received content back from helper")
            // save it
            self.content = payload;
            Log.log("there are " + self.content.length + " elements to display");
            if (self.content.length == 0) {
                self.message = "MMM-Zkteco No content found" + self.config.location;
            }
            // tell MM we have new stuff to display
            // will cause getDom() to be called
            self.updateDom()
        }
    },

    getDom: function() {
        // base wrapper for our content
        wrapper = document.createElement("div");
        if(this.content.length > 0 ) {
            data = this.content.replace(/(\n)/gm, "<br>");
            attendance = data.replace("{",'').replace("}",'').replaceAll("\"", '');
            workers = attendance.split("],");
            // loop the list of attendances
            for (i=0; i<workers.length; i++) {
                // create employee element
                container = document.createElement("span");
                container.setAttribute('class', 'worker-container')
                if (i < workers.length - 1 ) {
                    workers[i] = workers[i] + "]";
                }
                // divide name and punches
                workerID = workers[i].split(": ");

                surname = document.createElement("span");
                surname.setAttribute('class', 'surname');
                surname.innerHTML = workerID[0].trim();
                container.appendChild(surname);

                punches = document.createElement("span");
                punches.setAttribute('class', 'punches');
                punches.innerHTML = workerID[1].trim();
                container.appendChild(punches);
;                
                // append employee to main wrapper
                wrapper.appendChild(container);
            }
        }
        else {
            wrapper.innerHTML = this.message;
        }
        // tell MM this our content to add to the MM dom
        return wrapper;
    },

    getStyles: function () {
        return ["MMM-Zkteco.css"];
    }

});
