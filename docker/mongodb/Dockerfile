FROM tutum/mongodb:3.2

HEALTHCHECK CMD ss -ln | awk '{print $5}' | grep ':27017'
