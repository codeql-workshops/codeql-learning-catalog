#!/usr/bin/env bash

# Install CodeQL into /opt/codeql 
echo "Installing CodeQL..."
(
    CODEQL_BUNDLE=`cat /workspaces/codeql-learning-catalog/supported_codeql_configs.json | jq -r '.supported_environment[0].codeql_cli'`
    cd /opt/
    wget https://github.com/github/codeql-cli-binaries/releases/download/v$CODEQL_BUNDLE/codeql-linux64.zip
        
    unzip codeql-linux64.zip
)

# Update env
echo "Exporting Environment."
echo 'export PATH=$PATH:/opt/codeql/' >> /root/.bashrc 

echo "Done."

exit 


