#!/bin/bash

# Port setting
stty -F /dev/ttyUSB0 cs7 cstopb -ixon raw speed 1200

# Loop
while [ 1 ]; 
do
    echo 'LOADING...'
    READ=`dd if=/dev/ttyUSB0 count=22 | sed 's/ //g'`
    echo $READ
done
