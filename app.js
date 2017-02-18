const scrapeIt = require("scrape-it");
const mqtt = require('mqtt');

var oneGb = Math.pow(1024, 3);
const mqtt_server = "mqtt://localhost:1883";	//Your local mqtt instance. Change to an IP address if you MQTT broker is somewhere else.

const domoticz_total_idx = 14;		//Your virtual device for total
const domoticz_down_idx = 15;		//Your virtual device for download
const domoticz_up_idx = 16;			//Your virtual device for upload





process.stdout.write((new Date).toString());
process.stdout.write("Requesting...");

var convertToGb = function (val) {
    return val / oneGb;
}

var convertUnits = function (page){
    page.total_usage = convertToGb(page.total_usage);
    page.in_usage = convertToGb(page.in_usage);
    page.out_usage = convertToGb(page.out_usage);

    return page;
}

// Promise interface
scrapeIt("http://172.30.3.130:9090/SSSS_Servlet?key1=usage&exceed=usage", {
    total_usage: "#usageTable tr.odd td:nth-child(2)",
    in_usage: "#usageTable tr.odd td:nth-child(3)",
    out_usage: "#usageTable tr.odd td:nth-child(4)",
}).then(function (page) {
    process.stdout.write("\tDone.\r\nProcessing...");
    page = convertUnits(page);
	console.log(page);
    process.stdout.write("\tDone.\r\nPublishing...");
   
    var client = mqtt.connect(mqtt_server);

    client.on("connect", function () {
        client.publish("domoticz/in", JSON.stringify({
            idx: domoticz_total_idx,
            svalue: page.total_usage.toFixed(2)
        }));
        
        client.publish("domoticz/in", JSON.stringify({
            idx: domoticz_down_idx,
            svalue: page.in_usage.toFixed(2)
        }));
        
        client.publish("domoticz/in", JSON.stringify({
            idx: domoticz_up_idx,
            svalue: page.out_usage.toFixed(2)
        }));

        client.end();
        process.stdout.write("\tDone\r\n");
    });
});