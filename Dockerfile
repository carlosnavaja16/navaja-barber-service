FROM node
WORKDIR /trpc
EXPOSE 8080
ENV HOST 0.0.0.0
COPY trpc/package*.json .
RUN npm install
RUN npm install -g ts-node
COPY ./trpc .
COPY ./shared ../shared
CMD ["ts-node", "index.ts"]
