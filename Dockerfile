# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variable (API_KEY should be passed at runtime)
ENV API_KEY=fc7c95f3018ea8d5664b7312cfed6564

# Expose the port the app runs on
EXPOSE 3000

# Command to run the API server
CMD ["node", "server.js"]
