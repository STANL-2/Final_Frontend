# Stage 1: Build the Vue Vite application
# FROM node:18 AS builder
# WORKDIR /app

# # Copy files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .

# # Build the application
# RUN npm run build

# # Stage 2: Serve with NGINX
# FROM nginx:1.23.4
# WORKDIR /usr/share/nginx/html

# # Copy build output from Stage 1
# COPY --from=builder /app/dist .

# # Copy custom NGINX configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]