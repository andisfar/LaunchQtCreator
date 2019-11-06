# launchqtcreator README

QtCreator is very useful for certain tasks! When working on Qt projects, there are things I find Qt Creator invaluable for -just too convenient to use anything else (almost). I often use Vislual Studio Code and QtCreator together when working on c++/gui projects

![Qt Creator Launcher](src/images/selection_tool.gif)

## Features

- launches QtCreator or Qt Designer from within code with the click of a button

- launch selected file (*.ui, *.qrc, *.pro, CMakeLists.txt) from context menus on
  explorer view or in editor title, or from editor.

- if the path to QtCreator is empty then the user is prompted to
  supply the path via a file open dialog

- if the path to Qt Designer is empty then the user is prompted to
  supply the path via a file open dialog

- ui files can be opended directly in QtCreator or Qt Designer (dealers choice)

- *.pro, CMakeLists.txt project files can be opened in QtCreator

- *.qrc files can be opend in QtCreator

## Requirements

- Visual Studio Code
- QtCreator
- recommended that Qt frame work is also installed
- CMake is requred for configuring software projects using CMake

## Extension Settings

-'launchqtcreator.qtCreatorPath': configure path to use for launching QtCreator
-'launchqtcreator.qtDesignerPath': configure path to use for launching Qt Designer

## Known Issues

no known issues

## Release Notes

### 0.0.8

- fixed an issue where QtCreateor failed to launch after setting the path for QtCreator
- fixed an issue where Qt Designer failed to launch after setting the path for Qt Designer

### 0.0.7

- Opens QtCreator or Qt Designer with no files via user selection from a Quick Pick.
- Added context menus for opening files in QtCreator or Qt Desinger (as applicable),
  from the explorer, editor title, or editor.

### 0.0.6

- Changed information messages out with progress messages that disapear after a few seconds.

### 0.0.4

- removed -notour from LaunchQtCreator due to lack of support for this flag on linux

### 0.0.3

- added command to 'open in' for QtCreator: *.pro, *.ui, *.qrc, CMakeLists.txt files only
- added command to 'open in' for Qt Designer: *.ui files only
- commands are available on the selected file in the explorer window context menu
- commands are available on the open text editor window context menu
- commands are available on the open text editor title context menu

### 0.0.2

- added a separate ts script file for some creator commands
  - get the path to QtCreator, and then launch QtCreator
  - launch QtCreator

### 0.0.1

Initial release - added demo.gif

- updated the extension to use async functions and added some 
  'exception' handling to help discover where failuers mught be
  happending when the extension is being used

The extension now will prompt for a path to the QtCreator executable with a FileOpen dialog

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
