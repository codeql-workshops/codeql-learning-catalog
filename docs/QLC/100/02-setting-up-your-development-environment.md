---
layout: page
title: Setting up your development environment
octicon: package
toc: false
---

Before we start we are going to spend some time to setup the development environment because that is essential for you to participate in the workshop.

The development environment will consist of:

- [Visual Studio Code](https://code.visualstudio.com/)
- The [CodeQL](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-codeql) extension
- The [CodeQL CLI](https://github.com/github/codeql-cli-binaries/releases/latest)

Follow the next steps to set up your environment. Feel free to reach out for support if things aren't going as planned.

1. Ensure you have the latest Visual Studio Code installed by downloading it from the [download page](https://code.visualstudio.com/Download) for your operating system and install it by following the [setup](https://code.visualstudio.com/docs/setup/setup-overview) instructions.
2. Install the CodeQL extension from the [Extension Marketplace](https://code.visualstudio.com/docs/editor/extension-marketplace).

The CodeQL extension automatically installs and updates the CodeQL CLI. However, the extension managed CLI is inconvienient to use directly in a Visual Studio Code terminal or other terminal available on your system due to the isolation mechanisms applied to Visual Studio Code extensions. We want to directly use the CodeQL CLI for the tasks that haven't been made available through the CodeQL extension, such as create QL packs and building databases. No worries if that doesn't ring a bell yet. These topics will be discussed in this workshop.

To install the CodeQL CLI and configure the Visual Studio Code extension use the following steps. We have split up the instructions for those that have the [GitHub CLI](https://cli.github.com/) installed and [authenticated](https://cli.github.com/manual/gh_auth_login) and for those who don't.

1. Install the CodeQL CLI with the GitHub CLI (GH)

    For those that have GH you can install the CodeQL extension to manage CodeQL CLI installations:

    ```bash
    # Install the CodeQL extension
    gh install codeql

    # Install a CodeQL stub for use with the Visual Studio Code extension. Default directory is /usr/local/bin.
    # For convenience, make sure the chosen path is added to your path environment variable.
    # For Linux and MacOS, add it to the $PATH environment variable.
    # For Windows, add it to the %PATH% environment variable.
    gh codeql install-stub

    # Install the latest version
    gh codeql set-version latest
    ```

2. Install the CodeQL CLI manually

    To manually install the latest CodeQL CLI download the archive corresponding to your operating system from the [release](https://github.com/github/codeql-cli-binaries/releases/latest) page. Unzip the archive to a location of choice, then make sure that location is added to your path environment variable. For Linux and MacOS, add it to the `$PATH` environment variable. For Windows, add it to the `%PATH%` environment variable.

3. Verifying your CodeQL CLI setup

    The CodeQL CLI has subcommands that can help with verify that the CLI is correctly set up.

    Run the following command to show which languages are available for database creation.

    ```bash
    codeql resolve languages
    ```

    For the purpose of this workshop make sure that the `cpp` language is available.

4. Configuring the CodeQL extension

    With the CodeQL CLI installed we are going to configure the CodeQL extension to use the installed extension.

    Locate the setting `codeQL.cli.executablePath` in the [user and workspace settings](https://code.visualstudio.com/docs/getstarted/settings) and update it to the absolute path of the CodeQL CLI executable if is not part of your system's path environment or just `codeql` (`codeql.exe` for Windows). The extension will notify you of any problems in case of a misconfiguration.
