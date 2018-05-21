# GlobalWarming
*Web and iOS strategy game*
https://global-warming-rts.herokuapp.com/

*CI server*
https://travis-ci.org/PBeninga/GlobalWarming
##  Git
This is the process you should follow when you make a change

ffgit pull //pulls code from github

git checkout -b featureName // makes a new branch and will appened any changes you make onto it

make changes

git add file1 file2 file3 // add any files you have made

git commit -m "your commit message here"

git pull //so you don't cause merge conflicts trying to push

git push origin YOURFEATUREBRANCH

go to github and click new pull request


http://gojasonyang.com/post/phaserMultiplayerGamePart1.html

## How To Run

Read this:
https://devcenter.heroku.com/articles/heroku-cli

Once you have the heroku CLI you can run the app by doing

npm install

heroku local


## Client explanation

The /client folder contains all of the client side code,
as of right now it is using phaser.js and I think that is probably the best game engine we could use.

read http://gojasonyang.com/post/phaserMultiplayerGamePart1.html for an explanation of what it is doing.


## Server explanation

This uses Socket.io, express and Node and all of the server logic is done inside app.js.

In the future I think we should move internal game logic /server,  and handle only very high level actions in app.js.
However for right now this fine.
