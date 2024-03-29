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

# Install OpenJDK 11 and 17
RUN apt-get install -y openjdk-11-jdk
RUN apt-get install -y openjdk-17-jdk

# Install OpenJDK 8
RUN wget https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u372-b07/OpenJDK8U-jdk_x64_linux_hotspot_8u372b07.tar.gz
RUN tar -xvzf OpenJDK8U-jdk_x64_linux_hotspot_8u372b07.tar.gz
RUN mv jdk8u372-b07 /usr/lib/jvm

# Install Jenv
RUN git clone https://github.com/jenv/jenv.git ~/.jenv
RUN echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bash_profile
RUN echo 'eval "$(jenv init -)"' >> ~/.bash_profile
RUN echo 'source ~/.bash_profile' >> ~/.bashrc

# Register JDKs
RUN mkdir -p ~/.jenv/versions
RUN ~/.jenv/bin/jenv add /usr/lib/jvm/jdk8u372-b07
RUN ~/.jenv/bin/jenv add /usr/lib/jvm/java-11-openjdk-amd64
RUN ~/.jenv/bin/jenv add /usr/lib/jvm/java-17-openjdk-amd64

# Set OpenJDK 8 as default
RUN ~/.jenv/bin/jenv global 1.8

# Install Gradle
RUN wget https://services.gradle.org/distributions/gradle-8.1.1-bin.zip
RUN unzip gradle-8.1.1-bin.zip
RUN mv gradle-8.1.1/ /opt/
RUN echo 'export PATH="/opt/gradle-8.1.1/bin/:$PATH"' >> ~/.bash_profile
RUN rm gradle-8.1.1-bin.zip

# Install Maven
RUN wget https://archive.apache.org/dist/maven/maven-3/3.9.2/binaries/apache-maven-3.9.2-bin.tar.gz
RUN tar -xf apache-maven-3.9.2-bin.tar.gz
RUN mv apache-maven-3.9.2/ /opt/
RUN echo 'export PATH="/opt/apache-maven-3.9.2/bin/:$PATH"' >> ~/.bash_profile
RUN rm apache-maven-3.9.2-bin.tar.gz

RUN wget https://github.com/errata-ai/vale/releases/download/v2.3.4/vale_2.3.4_Linux_64-bit.tar.gz
RUN tar -xvzf vale_2.3.4_Linux_64-bit.tar.gz
RUN mv vale /usr/local/bin

COPY --from=deps /app/node_modules ./node_modules
COPY ./.devcontainer/startup.sh /root/snippet
RUN cat /root/snippet >> /etc/bash.bashrc

COPY ./.devcontainer/authors/installDotNet.sh /root/
RUN chmod +x /root/installDotNet.sh
RUN /root/installDotNet.sh

