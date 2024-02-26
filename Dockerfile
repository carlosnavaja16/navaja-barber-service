FROM node
WORKDIR /trpc
EXPOSE 8080
ENV HOST 0.0.0.0
COPY ./trpc ./
COPY ./shared ../shared
RUN npm install
CMD ["npm", "run", "start"]
