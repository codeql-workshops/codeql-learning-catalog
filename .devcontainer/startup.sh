if [ -t 1 ] && [ ! -f $HOME/.config/vscode-dev-containers/first-run-notice ]; then
  echo -e "\e[1;92m🚀🚀🚀 Welcome to the CodeQL Learning Catalog! \e[0mYour codespace is being set up and packages are being installed. Once configuration is \ncomplete, you can start your workshop!"
  mkdir -p $HOME/.config/vscode-dev-containers
  touch $HOME/.config/vscode-dev-containers/first-run-notice
fi
