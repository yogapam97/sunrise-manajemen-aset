# Use the official Node.js image as a base image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

# Copy package.json and package-lock.json
COPY package.json ./

COPY yarn.lock ./
COPY turbo.json ./

# Copy the rest of the application files
COPY packages/ ./packages/
COPY apps/sunrise-api/ ./apps/sunrise-api/

# Install dependencies
RUN yarn install

# Build the TypeScript code
RUN yarn build

# Create necessary directories
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/tmp 
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage 
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/avatar 
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/workspace/
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/workspace/logos
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/fixed-asset 
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/fixed-asset/thumbnails
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/fixed-asset/images
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/dist/storage/workspace 
RUN mkdir -p /usr/src/app/apps/sunrise-pwa/logs

# Remove the src directory after the build
RUN rm -rf apps/sunrise-api/src
# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["yarn", "--cwd", "apps/sunrise-api", "start"]