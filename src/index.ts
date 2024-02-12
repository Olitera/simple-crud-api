import * as http from 'http';
import { v4 as uuid, validate } from 'uuid';
import { IUserData } from './interfaces/user-data'
import dotenv from 'dotenv';
dotenv.config();

let users: IUserData[] = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;
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
      console.log(users, 'GET');
      res.end(JSON.stringify(users))
    }
    else if (method === 'GET' && url?.startsWith('/users/')) {
      const userID: string = url?.split('/')[2];
      const user: IUserData | undefined = users.find(user => user.id === userID)
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(user))
      if(!(user?.id && validate(user.id))) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'User id is invalid' }))
      } else if (!users.find((u): boolean => u.id === user?.id)) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }))
      }
    }
    else if (method === 'POST' && url === '/users') {
      if(userData.username && userData.age && userData.hobbies) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(201);
        userData.id = uuid();
        users.push(userData)
        console.log(users);
        res.end(JSON.stringify(userData))
      } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Username, age and hobbies are required' }))
      }
    }
    else if (method === 'PUT' && url?.startsWith('/users/')) {
      const userID: string = url?.split('/')[2];
      const user: IUserData | undefined = users.find(user => user.id === userID)
      res.setHeader("Content-Type", "application/json");
      if(!(user?.id && validate(user.id))) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'User id is invalid' }))
      } else if (!users.find((u): boolean => u.id === user?.id)) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }))
      } else {
        res.writeHead(200);
        users = users.map((user) => {
          if (user?.id === userID && userData.username) {
            return {...userData, id: userID}
          }
          return user
        })
        res.end(JSON.stringify({...userData, id: userID}));
      }
    }
    else if (method === 'DELETE' && url?.startsWith('/users/')) {
      const userID: string = url?.split('/')[2];
      const user: IUserData | undefined = users.find(user => user.id === userID)
      res.setHeader("Content-Type", "application/json");
      if(!(user?.id && validate(user.id))) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'User id is invalid' }))
      } else if (!users.find((u): boolean => u.id === user?.id)) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }))
      } else {
        res.writeHead(204);
        const userIndex: number = users.findIndex(user => user.id === userID);
        console.log(users, 'kkkkkk')
        users.splice(userIndex,1)
        console.log(users)
        res.end();
      }
    }
    else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end('Not Found');
    }
  })
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
