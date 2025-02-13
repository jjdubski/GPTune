FROM node

WORKDIR /frontend

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]