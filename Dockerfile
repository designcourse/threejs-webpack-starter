From node:14-alpine

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN npm install
CMD ["npm", "run", "dev"]
