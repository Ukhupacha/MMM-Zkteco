# MMM-Zkteco
Module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) smart mirror.

Displays today's attendance according to [Zkteco devices](https://www.zkteco.com/)

### Example

![Example of MMM-Zkteco](images/example.png?raw=true "Example screenshot")

## Installation
To install the module, use your terminal to:
1. Navigate to your MagicMirror's modules folder. If you are using the default installation directory, use the command:<br />`cd ~/MagicMirror/modules`
2. Clone the module:<br />`https://github.com/Ukhupacha/MMM-Zkteco.git`
3. Install: <br/>`npm install`


## Using the module

### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        ...
        {
            module: 'MMM-Zkteco',
            header: "Attendance",
            position: "top_left",
            config: {
                ip: "zkteco.intranet" // ip address of the zkteco device
            }
        },
        ...
    ]
}