# Use the official nginx image as a parent image
FROM nginx:latest

# Copy the dist directory from your host to the container's nginx html directory
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80