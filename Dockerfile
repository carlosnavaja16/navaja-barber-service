FROM node:alpine
WORKDIR /app
ENV PORT 8080
ENV HOST 0.0.0.0
COPY ./trpc ./
RUN npm install
CMD ["npm", "run", "start"]

