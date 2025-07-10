FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application code to the working directory
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]

