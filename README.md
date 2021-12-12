# WINF Matura 2021/2022
A small webapp providing an overview of the matura topics for informatics in the schoolyear of 2021/2022. When finished, this webapp should allow for blog-like activities. 

This Project was realized on the MESN-Stack (MongoDB, Express.js, Svelte.js and Node.js) and is mainly an experiment for me to explore these technologies

DISCLAMER: This project is more of a personal project / experiment with technologies new for me. A lot of the code here is terrible, since this is a learning process. But still, this code (mostly) works. If you find an issue, feel free to let me know! :)

## Features
This webapp functions as kind of a mashup of a web server and blog platform, allowing users to create Sites to which they can upload arbitrary files! (Sounds dangerous, probably is). These are some of the functionalities as of now:
* Create User Accounts
* Automatically mail verification emails
* Verify user accounts over link
* Change password
* Create new sites
  * Upload files, set a start page, a name and choose wether or not the page should be public
  * Upcomming features: Add a thumbnail as well as premade components (like a comment section, etc.)
* See all your sites as well as any public pages by others
* Edit your page, removing and adding files, changing the name or just the visibility
* Delete your page
* Change the normally randomly generated path to any path you like
* Run the server in HTTPS


## Comming Soon
Features I'd like to implement before this is finished are: 
* Tags for Sites
* Viewers displaying all sites of a tag / multiple tags
* actual content on the main page



## Command Line Args and so on
There are some arguments in order to configure the app:

* Dev Mode (-d --dev --debug):
  This changes the behaviour of the site. Running the app without dev mode is currently not recommended.
* Gmail Password (-pw --gmail-password --mail-password):
  Sets the password to authenticate to gmail with.
* Gmail User (-gi --gmail-user --mail-user):
  Sets the user to authenticate to gmail with. Also the address from which all mail is sent. Looks something like this: johndoe@gmail.com
* Mongo IP (-m --mongo -mip --mongo-ip):
  Tells the app where the database is. Format: <ip>:<port>. Default: localhost:27017
* Hostname (-h --host):
  The address to used for example in the emails. Default: localhost
* HTTP Port (-p --port):
  The port on which this app should listen. Default: 3000 if in dev mode, 80 if in production mode
* HTTPS Port (--https-port):
  The port on which the https server should listen. Default: 8080 if in dev mode, 443 if in production mode
* SSL Key Path (--ssl-key-path):
  The to the ssl private key
* SSL Certificate Path (--ssl-cert-path):
  The path to the ssl certificate
 
You can also create a .env file in the directory of the init node file.
* To set dev mode, use DEV_MODE=true
* To set the gmail password, use GMAIL_PASSWORD='\<password\>'
* To set the gmail user, use GMAIL_USER='\<email address\>'
* To set the mongo ip, use MONGO_IP='\<ip\>:\<port\>'
* To set the hostname, use HOSTNAME='\<hostname\>'
* To set the port, use PORT=\<port\>
* To set the https port, use HTTPS_PORT=\<port\>
* To set the ssl key path, use SSLKEY_PATH=\<path/to/key.pem\>
* To set the ssl certificate path, use SSLCERT_PATH=\<path/to/cert.pem\>
