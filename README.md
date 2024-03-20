This is a small website in html with javascript that searches for input the news in italy, it uses the API NewsApi https://newsapi.org/ called by another API to make sure it can run on websites.
For it to work you need to install Node.JS on you device https://nodejs.org/en and enter in the folder of the server /API then install the essential components with this commands in case it doesnt work
npm express
npm install sorc
npm install node-fetch
and set your news API key in a file  .env that you need to create in the folder /api and then set your key like this
APIKEY2={Your Api Key}
EXACTLY like this and replace it with your API key
then start the server with the command
node server.js
in the folder /api using the terminal
