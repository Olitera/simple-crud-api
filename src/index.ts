import * as http from 'http';
import { v4 as uuid } from 'uuid'
import { IUserData } from './interfaces/user-data'
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let users: IUserData[] = [{id: '9879', username: 'cat', age: 18, hobbies:[ 'play']}];
  let data: Uint8Array[] = [];
  let userData: IUserData;

  req.on('data', (chunk) => {
    data.push(chunk)
  })
  req.on('end', () => {
    userData = data.length ? JSON.parse(Buffer.concat(data).toString()) : {};

    if (method === 'GET' && url === '/users') {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(users))
    }
    if (method === 'POST' && url === '/users') {
      if(userData.username && userData.age && userData.hobbies) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(201);
        userData.id = uuid();
        users.push(userData)
        res.end(JSON.stringify(userData))
      } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Username, age and hobbies are required' }))
      }
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end('Not Found');
  })
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




