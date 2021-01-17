# Cordova-test
Cordova test app


cordova test app

$ npm install -g cordova

you also need : 
node and npm,
gradle 6.5 ++ ,
google sdk api 9, 10, 11,
java jdk 1.8

clone that repo , cd to Juapp/ directory then :

$ cp key_tempalte.html key.html

Import your personal API Map Key into key.html
key.html is .gitignored it shounld not be pushed to your repo.

run :
$ cordova build android // just for building apk
or 
$ cordova run android // to build, push and run on a connected android phone
