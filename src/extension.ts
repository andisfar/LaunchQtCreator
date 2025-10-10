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

// validation helper lives in creator/designer modules; keep this file focused on activation/commands

export function activate(context: ExtensionContext) {
    try {
        const pj = context.extension.packageJSON;
        const version: string = pj.version;
        console.log(`[${version}] Launch Qt Creator extension activated`);
    // command to launch Qt Tool Selection
	let command:string = 'launchqtcreator.launchqtselection';
    let commandHandler = () =>
    {
        let selections: string[] = ["QtCreator","Qt Designer"];
        window.showQuickPick(selections).then((selection)=>
        {
                if (selection === 'QtCreator') {
                    window.withProgress(
                        {
                            location: ProgressLocation.Notification,
                            title: "Launching QtCreator...",
                            cancellable: false
                        }, async () => {
                            try {
                                const success = await LaunchQtCreator();
                                if (!success) {
                                    console.log("error calling LaunchQtCreator");
                                    window.showErrorMessage("error calling LaunchQtCreator");
                                }
                            } catch (err:any) {
                                console.error('error launching QtCreator', err);
                                window.showErrorMessage('error launching QtCreator: ' + String(err));
                            }
                        }
                    );
                }
            if (selection === 'Qt Designer') {
                window.withProgress(
                    {
                        location: ProgressLocation.Notification,
                        title: "Launching Qt Designer...",
                        cancellable: false
                    }, async () => {
                        try {
                            const success = await LaunchQtDesigner();
                            if (!success) {
                                console.log("error calling LaunchQtDesigner");
                                window.showErrorMessage("error calling LaunchQtDesigner");
                            }
                        } catch (err:any) {
                            console.error('error launching Qt Designer', err);
                            window.showErrorMessage('error launching Qt Designer: ' + String(err));
                        }
                    }
                );
            }
        });
    };
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Creator
    command = 'launchqtcreator.launchqtcreator';
    commandHandler = () => {
        return window.withProgress(
            {
                location: ProgressLocation.Window,
                title: "Launching QtCreator...",
                cancellable: false
            }, async () => {
                return await LaunchQtCreator();
            }
        );
    };
    context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Designer
    command = 'launchqtcreator.launchqtdesigner';
    commandHandler = () => {
        return window.withProgress(
            {
                location: ProgressLocation.Window,
                title: "Launching Qt Designer...",
                cancellable: false
            }, async () => {
                return await LaunchQtDesigner();
            }
        );
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
        if (!qtFile) 
        {
            if (window.activeTextEditor) 
            {
                qtFile = window.activeTextEditor.document.uri;
            } else 
            {
                window.showErrorMessage("No active file to open in QtCreator.");
                return Promise.resolve(false);
            }
        }
        return window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: "Opening " + path.basename(qtFile.fsPath) + " in QtCreator ...",
                cancellable: false
            }, async () => {
                return await OpenInQtCreator(qtFile);
            }
        );
    };
    context.subscriptions.push(commands.registerCommand(command, commandInHandler));

 // command to open a file in Qt Designer:
// QtCreator Form files (*.ui)
    command = 'launchqtcreator.openinqtdesigner';
    commandInHandler = (qtFile: Uri) => 
    {
    if (!qtFile) 
    {
        if (window.activeTextEditor) 
        {
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
        }, async () => {
            return await OpenInQtDesigner(qtFile);
        }
    );
};
context.subscriptions.push(commands.registerCommand(command, commandInHandler));
    // Create a statusbar item
    MakeLaunchQtSelectionStatusbarItem(context);
    } catch (err:any) {
        console.error('Extension activation failed', err);
        // rethrow so the extension host records the activation failure
        throw err;
    }
}

function MakeLaunchQtSelectionStatusbarItem(context: ExtensionContext) : any {
    try {
        const item = window.createStatusBarItem(StatusBarAlignment.Right, undefined);
        item.text = "Launch Qt...";
        item.command = "launchqtcreator.launchqtselection";
        item.show();
        context.subscriptions.push(item);
        console.log('created statusbar item "Qt Tool Selection"');
    }
    catch (error: any) {
        console.log('failed to create statusbar item "Qt Tool Selection"');
        window.showErrorMessage(String(error));
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
