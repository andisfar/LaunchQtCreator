// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import
{
    commands,
    ExtensionContext,
    ProgressLocation,
    StatusBarAlignment,
    Uri,
    window,
    workspace
} from 'vscode';
//
import {LaunchQtCreator, OpenInQtCreator} from './creator';
//
import {LaunchQtDesigner, OpenInQtDesigner} from './designer';

var path = require("path");

export function ValidCreatorFiles(file: string): boolean {
    let return_value: boolean = file.endsWith('.pro') || file.endsWith(".qrc")
        || path.basename(file) === "CMakeLists.txt" || file.endsWith('ui');
    return return_value;
}

export function activate(context: ExtensionContext) {
    // command to launch Qt Tool Selection
	let command:string = 'launchqtcreator.launchqtselection';
    let commandHandler = () =>
    {
        let selections: string[] = ["QtCreator","Qt Designer"];
        window.showQuickPick(selections).then((selection)=>
        {
            if(selection === 'QtCreator')
            {
                window.withProgress(
                {
                    location : ProgressLocation.Notification,
                    title : "Launching QtCreator...",
                    cancellable: false
                }, () =>
                {
                    var p = new Promise<boolean>(resolve=>
                    {
                        setTimeout(() =>
                        {
                            resolve(LaunchQtCreator());
                        }, 5000);
                    });return p;
                }).then(success =>
                {
                    if(!success)
                    {
                        console.log("error calling LaunchQtCreator");
                        window.showErrorMessage("error calling LaunchQtCreator");
                    }
                },rejected_because =>
                {
                    console.log("promise rejection from LaunchQtCreator: " + rejected_because);
                    window.showErrorMessage("promise rejection from LaunchQtCreator: " + rejected_because);
                });
            }
            if(selection === 'Qt Designer')
            {
                window.withProgress(
                {
                    location : ProgressLocation.Notification,
                    title : "Launching Qt Designer...",
                    cancellable: false
                }, () =>
                {
                    var p = new Promise<boolean>(resolve=>
                    {
                        setTimeout(() =>
                        {
                            resolve(LaunchQtDesigner());
                        }, 2000);
                    });return p;
                }).then(success =>
                {
                    if(!success)
                    {
                        console.log("error calling LaunchQtDesigner");
                        window.showErrorMessage("error calling LaunchQtDesigner");
                    }
                },rejected_because =>
                {
                    console.log("promise rejection from LaunchQtDesigner: " + rejected_because);
                    window.showErrorMessage("promise rejection from LaunchQtDesigner: " + rejected_because);
                });
            }
        });
    };
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Creator
	command = 'launchqtcreator.launchqtcreator';
    commandHandler = () =>
    {
        window.withProgress(
        {
            location : ProgressLocation.Window,
            title : "Launching QtCreator...",
            cancellable: false
        }, () =>
        {
            var p = new Promise<boolean>(resolve=>
            {
                setTimeout(() =>
                {
                    resolve(LaunchQtCreator());
                }, 2000);
            });return p;
        });
    };
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Designer
	command = 'launchqtcreator.launchqtdesigner';
    commandHandler = () =>
    {
        window.withProgress(
        {
            location : ProgressLocation.Window,
            title : "Launching Qt Designer...",
            cancellable: false
        }, () =>
        {
            var p = new Promise<boolean>(resolve=>
            {
                setTimeout(() =>
                {
                    resolve(LaunchQtDesigner());
                }, 2000);
            });return p;
        });
    };
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to open a file in QtCreator:
    // can be QtCreator project files (*.pro),
    // CMake project files (CMakeLists.txt)
    // QtCreator Form files (*.ui)
    // QtCreatpr Resource Files (*.qrc)
    command = 'launchqtcreator.openinqtcreator';
    let commandInHandler = (qtFile:Uri) =>
    {
        window.withProgress(
        {
            location : ProgressLocation.Notification,
            title : "Opening " + path.basename(qtFile.fsPath) + " in QtCreator ...",
            cancellable: false
        }, () =>
        {
            var p = new Promise<boolean>(resolve=>
            {
                setTimeout(() =>
                {
                    resolve(OpenInQtCreator(qtFile));
                }, 5000);
            });return p;
        });
    };
    context.subscriptions.push(commands.registerCommand(command, commandInHandler));

 // command to open a file in Qt Designer:
// QtCreator Form files (*.ui)
command = 'launchqtcreator.openinqtdesigner';
commandInHandler = (qtFile: Uri) => {
    if (!qtFile) {
        if (window.activeTextEditor) {
            qtFile = window.activeTextEditor.document.uri;
        } else {
            window.showErrorMessage("No active file to open in Qt Designer.");
            return Promise.resolve(false);
        }
    }
    return window.withProgress(
        {
            location: ProgressLocation.Notification,
            title: "Opening " + path.basename(qtFile.fsPath) + " in Qt Designer ...",
            cancellable: false
        },
        () => {
            return new Promise<boolean>(resolve => {
                setTimeout(() => {
                    resolve(OpenInQtDesigner(qtFile));
                }, 2000);
            });
        }
    );
};
context.subscriptions.push(commands.registerCommand(command, commandInHandler));
    // Create a statusbar item
    MakeLaunchQtSelectionStatusbarItem();
}

function MakeLaunchQtSelectionStatusbarItem() : any {
    try {
        let item = window.createStatusBarItem(StatusBarAlignment.Right, undefined);
        item.text = "Launch Qt...";
        item.command = "launchqtcreator.launchqtselection";
        item.show();
        console.log('created statusbar item \"Qt Tool Selection\"');
    }
    catch (error: any) {
        console.log('failed to create statusbar item \"Qt Tool Selection\"');
        window.showErrorMessage(error);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
