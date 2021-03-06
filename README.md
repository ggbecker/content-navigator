Content Navigator is a VSCode/VSCodium extension which helps security content authors to create content for [ComplianceAsCode/content](https://github.com/ComplianceAsCode/content/) by enabling faster navigation between content files, by providing awareness of existent content and snippets to reduce boilerplate. Check this [post](https://complianceascode.github.io/template/2019/12/19/content-navigator-a-vscode-extension.html) out in the official ComplianceAsCode/content [blog](https://complianceascode.github.io/).

## How to install

Install through VSCode/VSCodium Extensions page search for `content-navigator` or, go to one the following pages and check the instructions:

VSCode:
  - [VSCode Content Navigator Page](https://marketplace.visualstudio.com/items?itemName=ggbecker.content-navigator).

VSCodium:
  - [VSCodium Content Navigator Page](https://open-vsx.org/extension/ggbecker/content-navigator).

## Features

### Open Content

Open content by activating a hotkey or selecting the option through right clicking.

Press a key combination when the cursor is selecting a rule ID or when the clipboard contains a rule ID. It is also possible to navigate between content types when a content is opened. For example: if Ansible content is opened in the current editor and `Ctrl+Alt+R` is pressed, then the rule.yml file associated to the Ansible content will open.

Note: When using clipboard, the extension is able to handle rule prefixes such as: `xccdf_org.ssgproject.content_rule_` or `content_rule_`. It might be useful when copying rule ID directly from scanning results. The clipboard always takes precedence over other sources. It can be disabled through VSCode/VSCodium preferences by untoggling the option `Use Clipboard` under Content Navigator extension properties.

#### Rule

`Ctrl+Alt+R`

#### OVAL

`Ctrl+Alt+O`

#### Bash

`Ctrl+Alt+B`

#### Ansible

`Ctrl+Alt+A`

#### Ignition

`Ctrl+Alt+I`

#### Kubernetes

`Ctrl+Alt+K`

#### Anaconda

`Ctrl+Alt+N`

#### Puppet

`Ctrl+Alt+P`

### Copy Rule ID

When editing a file (Rule, Ansible, Bash, Anaconda, Puppet, Kubernetes, Ignition) you can right click and activate `Content Navigator->Copy Rule ID` to copy the corresponding rule's ID. There is also an option to copy the full prefixed rule ID. You can right click and activate `Content Navigator->Copy Full Prefixed Rule ID` to copy the rule's ID prefixed with `xccdf_org.ssgproject.content_rule_`.

### Copy Profile ID

When editing `*.profile` files you can right click and activate `Content Navigator->Copy Profile ID` to copy the corresponding rule's ID. There is also an option to copy the full prefixed rule ID. You can right click and activate `Content Navigator->Copy Full Prefixed Profile ID` to copy the rule's ID prefixed with `xccdf_org.ssgproject.content_rule_`.

### Auto completion of available rules

When editing `*.profile` files it is possible to find all availables rules by using the standard auto complete system by pressing `Ctrl+Space`

### Code Snippets

When editing a Rule file (`rule.yml`), code snippets are available. You can simply press `Ctrl+Space` and type the desired snippet name and it will show more description. The available snippets are:

- rule - Rule stub
- ident - Identifier item
- templates:
  - t_accounts_password
  - t_auditd_lineinfile
  - t_audit_rules_dac_modification
  - t_audit_rules_file_deletion_events
  - t_audit_rules_login_events
  - t_audit_rules_path_syscall
  - t_audit_rules_privileged_commands
  - t_audit_rules_unsuccessful_file_modification
  - t_audit_rules_unsuccessful_file_modification_o_creat
  - t_audit_rules_unsuccessful_file_modification_o_trunc_write
  - t_audit_rules_unsuccessful_file_modification_rule_order
  - t_audit_rules_usergroup_modification
  - t_bls_bootloader_option
  - t_file_groupowner
  - t_file_owner
  - t_file_permissions
  - t_grub2_bootloader_argument
  - t_kernel_module_disabled
  - t_mount
  - t_mount_option
  - t_mount_option_remote_filesystems
  - t_mount_option_removable_partitions
  - t_package_installed
  - t_package_removed
  - t_sebool
  - t_service_disabled
  - t_service_enabled
  - t_shell_lineinfile
  - t_sshd_lineinfile
  - t_sysctl
  - t_timer_enabled
  - t_yamlfile_value

More details on templates you can find by activating the respective snippet on VSCode/VSCodium or on [ComplianceAsCode/content Templates Section of Developer Guide](https://complianceascode.readthedocs.io/en/latest/manual/developer/06_contributing_with_content.html#available-templates)

### Test Suite Launch Configuration

Content-Navigator provides a launch configuration template for the [ComplianceAsCode/content](https://github.com/ComplianceAsCode/content/) Test Suite.

When editing a `launch.json` configuration file, you can hit `Ctrl+Space` and select the item `Content Navigator Test Suite Setup`. It will create a launch configuration which can be used to run test scenarios using a Virtual Machine. After creating the launch configuration, you need to set Content Navigator properties, such as Domain Name of the Virtual Machine you are using for testing, remediation type and which product is desired to be tested (it will select the appropriated datastream automatically).

Those configuration items can be updated under VSCode/VSCodium preferences. Go to `File->Preferences->Settings` and search for Content Navigator. Configure the fields with desired information and now you can run desired test scenarios by simply launching the newly created configuration when editing a resource of a rule. If the resource you are editing belongs to a [ComplianceAsCode/content](https://github.com/ComplianceAsCode/content/) rule then it will automatically detect the rule id and run the existent test scenarios for it.

A Virtual Machine is required to use this feature. For more information on how to setup your own testing Virtual Machine, check the official documentation on: [How to prepare a backend for testing](https://complianceascode.readthedocs.io/en/latest/tests/README.html#how-to-prepare-a-backend-for-testing)
