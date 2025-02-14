FROM node

WORKDIR /frontend

COPY package.json ./

COPY . .

RUN if [ -d "node_modules" ]; then rm -rf node_modules; fi

RUN npm install

CMD ["npm", "run", "dev"]