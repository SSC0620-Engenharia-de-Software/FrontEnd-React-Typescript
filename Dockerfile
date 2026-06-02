FROM node:20-alpine AS build

WORKDIR /app

COPY Frontend-Olimpia/package*.json ./
RUN npm install
RUN npm install recharts

COPY Frontend-Olimpia/ .

RUN npm run build -- --mode docker

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]