FROM node:alpine
WORKDIR /server
ENV PORT 8080
ENV HOST 0.0.0.0
COPY ./ ./
RUN npm install
CMD ["npm", "run", "start"]
