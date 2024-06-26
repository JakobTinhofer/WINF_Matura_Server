FROM node:16
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN mkdir "/sites"
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
EXPOSE 80
EXPOSE 3000
EXPOSE 443
EXPOSE 465
EXPOSE 8080

CMD [ "node", "index.js", "-s", "/sites"]