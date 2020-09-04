# Change Log

All notable changes to the "launchqtcreator" extension will be documented in this file.

## [0.1.1]

- createing a new vsix package that contains the updated code reflecting the latest merged pull request from dependabot: Bump lodash from 4.17.15 to 4.17.19

## [0.1.0]

- updated minimalist dependency version based on the following alert from GitHub:
- CVE-2020-7598
  high severity
  Vulnerable versions: < 0.2.1
  Patched version: 0.2.1
  minimist before 1.2.2 could be tricked into adding or modifying properties of Object.prototype using a "constructor" or "proto" payload.
- engines.vscode ^1.39.0 ==>> engines.vscode ^1.43.0 (requires vscode 1.43.0 or later)

## [0.0.9]

- a dependency was updated for a scurity patch (acorn 7.1.0 -> 7.1.1), so Launch QtCreator has been bumped to 0.0.9

## [0.0.8]

- fixed an issue where QtCreator failed to launch after setting the path for QtCreator
- fixed an issue where QtCreator was launched twice when opening an item in QtCreator
- fixed an issue where Qt Designer failed to launch after setting the path for Qt Designer

## [0.0.7]

- Opens QtCreator or Qt Designer with no files via user selection from a Quick Pick.
- Added context menus for opening files in QtCreator or Qt Desinger (as applicable),
  from the explorer, editor title, or editor.

## [0.0.6]

- now uses progress boxes to display information about launcing

## [0.0.4]

- removed -notour from LaunchQtCreator due to lack of support for this flag on linux

## [0.0.3]

- added command to 'open in' for QtCreator: *.pro, *.ui, *.qrc, CMakeLists.txt files only
- added command to 'open in' for Qt Designer: *.ui files only
- commands are available on the selected file in the explorer window context menu
- commands are available on the open text editor window context menu
- commands are available on the open text editor title context menu

## [0.0.2]

- added a separate ts script file for some creator commands
  - get the path to QtCreator, and then launch QtCreator
  - launch QtCreator

- updated the extension to use async functions and added some 
  'exception' handling to help discover where failuers mught be
  happending when the extension is being used

## [.0.0.1]

- added a demo image to the README.md file

## [Unreleased]

- Initial release
