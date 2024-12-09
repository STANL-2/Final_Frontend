FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]