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
COPY apps/sunrise-pwa/ ./apps/sunrise-pwa/
# Install dependencies
RUN yarn install

# Build the TypeScript code
RUN yarn build

# Remove the src directory after the build
RUN rm -rf apps/sunrise-pwa/src

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "--cwd", "apps/sunrise-pwa", "start"]