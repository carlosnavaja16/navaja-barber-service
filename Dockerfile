FROM node
WORKDIR /app
EXPOSE 8080
COPY ./trpc ./
COPY ./shared ../shared
RUN npm install
CMD ["npm", "run", "start"]
