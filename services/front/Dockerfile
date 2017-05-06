FROM node:6.9-slim

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    bzip2 \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn

ENV SRC_DIR /usr/src/app
WORKDIR ${SRC_DIR}

COPY ./package.json ./yarn.lock ${SRC_DIR}/
RUN yarn install

COPY . ${SRC_DIR}/

CMD ["npm", "run", "app"]
