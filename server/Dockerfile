# Use an official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/server

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project (including Prisma schema)
COPY . .

# Ensure the Prisma schema is in the correct location
RUN ls -la src/prisma

# Build the project
RUN npm run build

# Generate Prisma client and apply schema
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npx prisma db push --schema=src/prisma/schema.prisma

# Use a lightweight Node.js image for production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/server

# Copy built files
COPY --from=builder /usr/src/server ./

# Expose port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]