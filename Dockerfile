FROM node:20.11.0
WORKDIR /trpc
EXPOSE 4001
COPY trpc/package*.json .
RUN npm install
RUN npm install -g ts-node
COPY ./trpc .
COPY ./shared ../shared
CMD ts-node index.ts
