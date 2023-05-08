FROM debian@sha256:f81bf5a8b57d6aa1824e4edb9aea6bd5ef6240bcc7d86f303f197a2eb77c430f

RUN apt-get update && apt-get upgrade -y
RUN apt-get install build-essential linux-headers-amd64 curl unzip -y

RUN useradd -ms /bin/bash codeql

USER codeql
WORKDIR /home/codeql
RUN curl -L https://github.com/github/codeql-cli-binaries/releases/download/v2.12.1/codeql-linux64.zip -o codeql-linux64.zip && unzip codeql-linux64.zip

ENTRYPOINT ["/home/codeql/codeql/codeql"]
