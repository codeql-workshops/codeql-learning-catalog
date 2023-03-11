#!/usr/bin/env bash

# Install CodeQL into /opt/codeql 
echo "Installing CodeQL..."
(
    CODEQL_BUNDLE=`cat /workspaces/codeql-learning-catalog/supported_codeql_configs.json | jq -r '.supported_environment[0].codeql_cli_bundle'`
    cd /opt/
    wget https://github.com/github/codeql-action/releases/download/$CODEQL_BUNDLE/codeql-bundle-linux64.tar.gz
        
    tar -zxvf codeql-bundle-linux64.tar.gz 
)

# Update env
echo "Exporting Environment."
echo 'export PATH=$PATH:/opt/codeql/' >> /root/.bashrc 

echo "Done."

exit 