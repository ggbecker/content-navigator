Content-Navigator is a Visual Studio Code extension which helps to navigate and create content for [ComplianceAsCode/content](https://github.com/ComplianceAsCode/content/) by enabling faster navigation between content files and by providing awareness of existent content.

## How to install

Install through Visual Studio Code Extensions page search for `content-navigator` or,

Download the .vsix file from releases page and load it manually into Visual Studio Code by pressing `Ctrl+Shift+P` and typing `Install from VSIX...`.

## Features

### Load Content

Load content by activating a hotkey or selecting the option through right clicking.

Press a key combination when the cursor is selecting a rule ID or when the clipboard contains a rule ID. It is also possible to navigate between content types when a content is opened. For example: is Ansible content is opened in the current editor and `Ctrl+Alt+R` is pressed, then the rule.yml file associated to the Ansible content will open.

Note: When using clipboard, the extension is able to handle rule prefix such as: `xccdf_org.ssgproject.content_rule_` or `content_rule_`. It might be useful when copying rule ID directly from scanning results.

#### Rule

`Ctrl+Alt+R`

#### OVAL

`Ctrl+Alt+O`

#### Bash

`Ctrl+Alt+B`

#### Ansible

`Ctrl+Alt+A`

#### Anaconda

`Ctrl+Alt+N`

#### Puppet

`Ctrl+Alt+P`

### Copy Rule ID

When editing a rule.yml file you can right click and activate `Copy Rule ID` option to copy the rule ID.

### Auto completion of available rules

When editing `*.profile` files it is possible to find all availables rules by using the standard auto complete system by pressing `Ctrl+Space`
