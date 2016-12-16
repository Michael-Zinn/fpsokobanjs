FROM node:6.9.1
COPY . /usr/local/fpsokoban
WORKDIR /usr/local/fpsokoban
RUN npm install
CMD ["npm", "start"]