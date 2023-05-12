# Install dependencies only when needed
FROM node:16-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM ruby:2.7 AS runner

# Install vim
RUN apt-get update
RUN apt-get install -y vim
RUN apt-get install -y jq 
RUN apt-get install -y git-lfs 

COPY ./.devcontainer/startup.sh /root/snippet
RUN cat /root/snippet >> /etc/bash.bashrc

