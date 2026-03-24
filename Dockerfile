# Stage de build con Node.js
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install

RUN npm run build

# Stage para servir con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
