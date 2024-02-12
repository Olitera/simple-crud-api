import * as http from 'http'
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer((req, res) => {
  let users: IUserData[] = []

    if (req.url === '/users') {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end('My server');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




