#!/bin/bash
#
# load_gpio.sh -  Load Raspberry Pi GPIO/therm modules to kernel
#
# Note - this script must be run as root:
# sudo load_gpio.sh
#
# Tom Holderness 03/01/2013
#
# Ref: http://www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature

set -e   # exit on errors (lazy error checking)

MODULES_FILE="/etc/modules"

function processYes {
  # new line just to be safe
  echo "" >> $MODULES_FILE

  if [ $(grep -c "w1-gpio" $MODULES_FILE) == "0" ]; then
      echo "w1-gpio" >> $MODULES_FILE
  fi

  if [ $(grep -c "w1-therm" $MODULES_FILE) == "0" ]; then
      echo "w1-therm" >> $MODULES_FILE
  fi

  echo "All done. "
}

# modprobe w1-gpio # load gpio module
# modprobe w1-therm # load temperature module

echo "Modules loaded for current session."
echo -n "Do you want to add the modules to /etc/modules? [yn]: "

while read answer; do
  case "$answer" in
    y) processYes; exit 0;;
    n) echo "Nothing more to do. "; exit 0;;
    *) echo -n "Option invalid. Try again [yn]: ";;
  esac
done

