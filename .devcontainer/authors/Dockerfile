# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM ruby:2.7 AS runner
# Install Node.js / npm
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

# Install vim
RUN apt-get update
RUN apt-get install -y vim
RUN apt-get install -y jq 
RUN apt-get install -y git-lfs


RUN wget https://github.com/errata-ai/vale/releases/download/v2.3.4/vale_2.3.4_Linux_64-bit.tar.gz
RUN tar -xvzf vale_2.3.4_Linux_64-bit.tar.gz
RUN mv vale /usr/local/bin

COPY --from=deps /app/node_modules ./node_modules
COPY ./.devcontainer/startup.sh /root/snippet
RUN cat /root/snippet >> /etc/bash.bashrc

COPY ./.devcontainer/authors/installDotNet.sh /root/
RUN chmod +x /root/installDotNet.sh
RUN /root/installDotNet.sh

