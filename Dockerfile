FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./

RUN npm install
# if youa re building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Expose 3000 port on container
EXPOSE 3000

# Start up your application
CMD ["npm", "start"]