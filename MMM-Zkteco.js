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
            data = this.content.replace(/(\n)/gm, "<br>");
            attendance = data.replace("{",'').replace("}",'').replaceAll("\"", '');
            workers = attendance.split("],");
            // loop the list of attendances
            for (i=0; i<workers.length; i++) {
                // create employee element
                employee = document.createElement("span");
                employee.setAttribute('class', 'worker');
                if (i < workers.length - 1 ) {
                    workers[i] = workers[i] + "]";
                }
                employee.innerHTML = workers[i];                
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
        return ["MMM-Zkteco.css"];
    }

});
