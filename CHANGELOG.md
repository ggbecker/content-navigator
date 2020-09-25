# Change Log

## [Unreleased]
### Added
- Support to new type of content called Kubernetes.
- Snippet for `bls_bootloader_option` template.
- Snippet for `yamlfile_value` template.


## [0.0.11] - 2020-05-15
### Added
- New Icon based on ComplianceAsCode/content icon with a fancy arrow.
- Display Name is now Content Navigator.

## [0.0.10] - 2020-05-15
### Added
- Launch configuration template for ComplianceAsCode Test Suite.
- VSCode properties to control the launch configuration for ComplianceAsCode Test Suite.
- Detect rule id when editing a test scenario using the pattern `*.pass.sh` and `*.fail.sh`.
- Copy rule ID functions to `editor/title/context` contribution point.
### Fixed
- Do not print selected/clipboard text when failing to open content.

## [0.0.9] - 2020-02-12
### Added
- Support to new type of content called Ignition.
- Option to copy full prefixed rule ID.
- Instructions on how to install the extension through VSCode Marketplace webpage.
- Snippet for `shell_lineinfile` template.
### Fixed
- Content now opens from every context VSCode is. For example, there is no need to have an active opened editor to activate the shortcuts.
### Removed
- Instructions on how to install using VSIX files.

## [0.0.8] - 2020-01-09
### Fixed
- Omission on detecting rule id when current opened file is an OVAL content (oval/shared.xml).

## [0.0.7] - 2019-10-11
### Changed
- Word separator excludes dash character.

## [0.0.6] - 2019-10-10
### Added
- Snippets to rule, identifiers and templates.
- Function to open the template section within "rule.yml" file.
- Precedence when opening content from clipboard.

### Changed
- Refactor code to use async/await instead of ".then()".

## [0.0.5] - 2019-11-13
### Added
- Support to rule prefixes (e.g.: "xccdf_org.ssgproject.content_rule_") when opening content from clipboard.
- Function to open Anaconda and Puppet content.
- Support to navigate between content types from current content.

## [0.0.4] - 2019-11-11
### Fixed
- Documentation of shortcuts now point to correct combination of keys.

## [0.0.3] - 2019-10-30
### Fixed
- Extension is always loaded when starting VSCode.

## [0.0.2] - 2019-10-29
### Added
- Auto complete of available rules from ComplianceAsCode/content project.

## [0.0.1] - 2019-09-26
### Added
- Functions to open content (Rule, Bash, Ansible) from selected text.
