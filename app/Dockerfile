# Use Node.js official image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Use lightweight Node.js image for production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy built files
COPY --from=builder /usr/src/app ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]