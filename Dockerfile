FROM node:alpine
WORKDIR /app
EXPOSE 8080
COPY ./trpc ./
RUN npm install
CMD ["npm", "run", "start"]
