const http = require('http');
const fs = require('fs');
const port = 8080;

let users = [];
if (fs.existsSync('users.json')) {
  users = JSON.parse(fs.readFileSync('users.json', "utf8"));
  console.log('users: ', users);
}

const requestHandler = (request, response) => {
    if (
      request.method === 'POST' &&
      request.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem'
    ) {
      response.writeHead(200, { "Content-Type": "text/plain" });
      let name;
      let ip = request.connection.remoteAddress;
      if (request.headers.name) {
        name = request.headers.name;
      } else {
        name = 'unknown'
      }
      users.push({name: name, ip});
      fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) {
            return console.log('Something bad happened', err)
        }
      });
      response.end(`Hello ${(users.map(item => item.name).join(', '))}`);
    } 
  }


const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})