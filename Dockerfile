FROM node:16
COPY package*.json ./
RUN npm install
COPY . .
ENV IN_DOCKER=1
EXPOSE 8080
CMD [ "node", "server.js" ]
