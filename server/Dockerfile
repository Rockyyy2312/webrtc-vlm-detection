FROM node:18

# Set working directory for server
WORKDIR /app/server

# Copy package.json and install dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy the rest of the server code
COPY server/ ./

# Copy frontend code into /app/web
WORKDIR /app
COPY web ./web

EXPOSE 3000
CMD ["node", "server/index.js"]
