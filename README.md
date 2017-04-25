# Domoticz BSNL Broadband Usage
**Domoticz BSNL Broadband Usage** is a NodeJS script that uses HTML scrapping to extract the monthly bandwidth usage of the BSNL Broadband customer.
The values are then forwarded to **Domoticz** setup via **MQTT** and displayed on Domoticz dashboard.

I've kept the scrpt to run via cron at every 30th minutes (2 times per hour).

Since the page we are scraping uses the IP address of the connected BSNL connection, no special configuration is needed for that. However, the script needs
the IDX values of the three **Custom Sensors** (Upload, Download & Total) to notify the value of bandwidth usage.

Additionally, you will also need to provide the configuration details of your MQTT broker used by Domoticz installation.
