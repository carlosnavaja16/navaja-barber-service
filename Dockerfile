FROM node
WORKDIR /trpc
EXPOSE 8080
COPY trpc/package*.json .
RUN npm install
RUN npm install -g ts-node
COPY ./trpc .
COPY ./shared ../shared
CMD ["ts-node", "index.ts"]
