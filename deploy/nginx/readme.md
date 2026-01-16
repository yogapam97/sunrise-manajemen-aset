## Setup nginx (nginks in indonesian)

Copy the configuration file to site-available directory.  
In common linux installation it is on /etc/nginx/sites-available directory  
or you can put it somewhere else depending on your installation configuration.

ps: _**en jin eks**_ does not sound right, so its nginks

## Setup https Certificate

The app should run in https to make several different feature work perfectly.  
You can run certbot and allow them to do the rest ☕️

```sh
$ sudo apt install certbot python3-certbot-nginx
$ sudo certbot --nginx -d <your_domain_name> -d www.<your_domain_name>
```
