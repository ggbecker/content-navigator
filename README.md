Content-Navigator is a Visual Studio Code extension which helps to navigate and create content for [ComplianceAsCode/content](https://github.com/ComplianceAsCode/content/) by enabling faster navigation between content files and by providing awareness of existent content.

## How to install

Install through Visual Studio Code Extensions page search for `content-navigator` or,

Download the .vsix file from releases page and load it manually into Visual Studio Code by pressing `Ctrl+Shift+P` and typing `Install from VSIX...`.

## Features

### Load Content

Load content by activating a hotkey or selecting the option through right clicking.

Press a key combination when the cursor is selecting a rule ID or when the clipboard contains a rule ID. It is also possible to navigate between content types when a content is opened. For example: is Ansible content is opened in the current editor and `Ctrl+Alt+R` is pressed, then the rule.yml file associated to the Ansible content will open.

Note: When using clipboard, the extension is able to handle rule prefixes such as: `xccdf_org.ssgproject.content_rule_` or `content_rule_`. It might be useful when copying rule ID directly from scanning results.

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

When editing a file (Rule, Ansible, Bash, Anaconda, Puppet) you can right click and activate `Copy Rule ID` to copy the corresponding rule's ID.

### Auto completion of available rules

When editing `*.profile` files it is possible to find all availables rules by using the standard auto complete system by pressing `Ctrl+Space`

### Code Snippets

When editing a Rule file (`rule.yml`), code snippets are available. You can simply press `Ctrl+Space` and type the desired snippet name and it will show more description. The available snippets are:

- rule - Rule stub
- ident - Identifier item
- templates:
  - template_accounts_password
  - template_auditd_lineinfile
  - template_audit_rules_dac_modification
  - template_audit_rules_file_deletion_events
  - template_audit_rules_login_events
  - template_audit_rules_path_syscall
  - template_audit_rules_privileged_commands
  - template_audit_rules_unsuccessful_file_modification
  - template_audit_rules_unsuccessful_file_modification_o_creat
  - template_audit_rules_unsuccessful_file_modification_o_trunc_write
  - template_audit_rules_unsuccessful_file_modification_rule_order
  - template_audit_rules_usergroup_modification
  - template_file_groupowner
  - template_file_owner
  - template_file_permissions
  - template_grub2_bootloader_argument
  - template_kernel_module_disabled
  - template_mount
  - template_mount_option
  - template_mount_option_remote_filesystems
  - template_mount_option_removable_partitions
  - template_package_installed
  - template_package_removed
  - template_sebool
  - template_service_disabled
  - template_service_enabled
  - template_sshd_lineinfile
  - template_sysctl
  - template_timer_enabled

More details on templates you can find by activating the respective snippet on VSCode or on [ComplianceAsCode/content Templates Section of Developer Guide](https://github.com/ComplianceAsCode/content/blob/master/docs/manual/developer_guide.adoc#732-list-of-available-templates)
