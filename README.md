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


## Comming Soon
Features I'd like to implement before this is finished are: 
* Tags for Sites
* Viewers displaying all sites of a tag / multiple tags
* acutual content on the main page
* HTTPS (this should be quite easy but I am also quite lazy sooo)
