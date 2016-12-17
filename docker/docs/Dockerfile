FROM node:6.9-slim

WORKDIR /usr/src/app/
COPY ./package.json /usr/src/app/
RUN npm install -g yarn
RUN yarn install

COPY . /usr/src/app/
RUN npm run-script generate-docs

VOLUME ["/usr/src/app/docs"]
CMD ["npm", "run", "generate-docs"]
