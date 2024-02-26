FROM node:20.11.0
WORKDIR /trpc
COPY trpc/package*.json .
RUN npm install
RUN npm install -g ts-node
COPY ./trpc .
COPY ./shared ../shared
CMD ts-node index.ts
