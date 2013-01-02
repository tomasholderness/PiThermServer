#!/bin/bash
#
# load_gpio.sh -  Load Raspberry Pi GPIO/therm modules to kernel
#
# Note - this script must be run as root:
# sudo load_gpio_therm_modules.sh
#
# Tom Holderness 03/01/2013
#
# Ref: http://www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature

set -e   # exit on errors (lazy error checking)

modprobe w1-gpio # load gpio module
modprobe w1-therm # load temperature module

exit 0

