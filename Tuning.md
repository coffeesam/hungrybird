Linux Server Tuning for Hummingbird (Nodejs and MongoDB)
========================================================

Pure Linux server performance
-----------------------------
1. Turn off atime [ http://www.findmysoft.com/news/Disable-Atime-for-a-Faster-Running-Linux-OS/ ]
2. Turn off Huge VM paging [ http://linuxgazette.net/155/krishnakumar.html ]
3. Set HIGH ulimits (75,000 for nodejs) and sysctl.conf (750,000 for system) [ http://www.cyberciti.biz/faq/linux-increase-the-maximum-number-of-open-files/ ] 
   modify /etc/security/limits.conf :
        nodejs 		 soft	 nofile		 75000
        nodejs		 hard	 nofile	   75000
        mongodb    hard  nofile    10240
        mongodb    soft  nofile    10240
   
4. Use ext4 for / partition and any partition that mongodb writes to


NodeJs
------
1. Start node in nodejs user with valid permissions (listen at port 80 and 8080)
2. server.js : server.maxConnections = 60000;

MongoDB
-------
1. (nothing yet, suggestions?)