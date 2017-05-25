# APIWalker
A small cmd prompt application that makes async API requests and outputs the sum of estimated time
## How to Install
1. $ git clone https://github.com/Velikriss/APIWalker.git
2. $ cd apiWalker
3. $ npm install


## How to Run
There are three different environments to run this
From the root directory:
  *$ NODE_ENV=development node app.js
  This will run app with development mode which uses sample data
    *$ NODE_ENV=configuration node app.js
  This will run app with parameters in helpers/config.js
    *$ node app.js OR npm start
  This will run app where the user is prompted for input that must follow the format--
  -http://www.example.com/api/v1
  -[issue1|issue2|issue3]

##TODO
1. Add input validation to prompt arguments
2. Create mock server to validate API calls