FROM node:10

# Create app directory
WORKDIR /usr/src/Investment-app

# Install app dependencies
COPY Investment-app/package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:server" ]
