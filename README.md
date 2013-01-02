PiThermServer
=============

Simple NodeJS temperature server for the DS18B20 sensor on the Raspberry Pi.

Description
-----------
A few lines of code to show my implementation of a NodeJS server for the DS18B20 GPIO temperature sensor on the Raspberry Pi. The sensor is accessed using the w1-gpio and w1-therm kernel modules in the Raspbian distro. The server parses data from the sensor and returns the temperature and a Unix time-stamp in JSON format. A simple front-end is included and served usig node-static. This performs ajax calls to the server and plots temperature in real time using the highcharts JavaScript library.

Files
-----
load_gpio.sh - bash commands to load kernel modules
server.js - NodeJS server, returns temperature as JSON and serves other static files
temperature_plot.htm - example client front-end

Usage
-----
With sensor attached load kernel modules: sudo load_gpio.sh 
Start server: node server.js

References
----------
http://www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature/

