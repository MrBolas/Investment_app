FROM node:10

# Create app directory
WORKDIR /usr/src/Investment-app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build_prod

EXPOSE 3000

CMD [ "npm", "run", "start:server" ]
