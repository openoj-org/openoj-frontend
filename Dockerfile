FROM node:latest as builder

COPY . .

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=builder dist /usr/share/nginx/html
COPY --from=builder nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80