#!/usr/bin/env bash

# install dotnet
cd /root/
wget https://dot.net/v1/dotnet-install.sh
bash dotnet-install.sh 

echo "Setting up .NET Path"

# make it possible to use vscode + .net
ln -s /root/.dotnet/dotnet /usr/local/bin/dotnet

echo "Exporting Environment."
echo 'export PATH=$PATH:/root/.dotnet/:/workspaces/codeql-learning-catalog/script/registrar/' >> /root/.bashrc 

echo "Done. To use this codespace for the first time, reload VS Code by launching it again."

exit 