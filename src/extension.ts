// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getQtCreatorPath,
		 doLaunchQtCreator,
        doLaunchQtDesigner,
         doLaunchInQtCreator,
		 getQtDesignerPath,
         doLaunchInQtDesigner,
         ValidCreatorFiles,
         ValidDesignerFiles,
        file_extension,
        } from './creator';

var path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // command to launch Qt Tool Selection
	let command:string = 'launchqtcreator.launchqtselection';
	let commandHandler = () => {
        let selections: string[] = ["QtCreator","Qt Designer"];
        vscode.window.showQuickPick(selections).then((selection)=>{
            if(selection === 'QtCreator')
            {
                LaunchQtCreator();
            }
            if(selection === 'Qt Designer')
            {
                LaunchQtDesigner();
            }
            vscode.window.withProgress({
                location : vscode.ProgressLocation.Window,
                title : "Launching " + selection + "...",
                cancellable: false}, () => {
                var p = new Promise<boolean>(resolve=> {
                    setTimeout(() => {
                    resolve();
                }, 8000);});return p;});
        });
    };
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

    // command to launch Qt Tool Selection
	command = 'launchqtcreator.launchqtcreator';
	commandHandler = () => {
        LaunchQtCreator().then((success)=>{
            if(!success)
            {
                vscode.window.showErrorMessage("unknown error launching QtCreator...");
            }
            else
            {
                vscode.window.withProgress({
                    location : vscode.ProgressLocation.Window,
                    title : "Launching QtCreator...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

    // command to launch Qt Tool Selection
	command = 'launchqtcreator.launchqtdesigner';
	commandHandler = () => {
        LaunchQtDesigner().then((success)=>{
            if(!success)
            {
                vscode.window.showErrorMessage("unknown error launching Qt Designer...");
            }
            else
            {
                vscode.window.withProgress({
                    location : vscode.ProgressLocation.Window,
                    title : "Launching Qt Designer...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

    // command to open a file in QtCreator:
    // can be QtCreator project files (*.pro),
    // CMake project files (CMakeLists.txt)
    // QtCreator Form files (*.ui)
    // QtCreatpr Resource Files (*.qrc)
    command = 'launchqtcreator.openinqtcreator';
    let commandInHandler = (qtFile:vscode.Uri) => {
        LaunchInQtCreator(qtFile).then((success)=>{
            if(!success)
            {
                vscode.window.showErrorMessage("allowed files from extension: *.pro, CMakeLists.txt, *.ui, *.qrc...\n"+
                "attempted loading '" + file_extension(qtFile.fsPath) + "'");
            }
            else
            {
                vscode.window.withProgress({
                    location : vscode.ProgressLocation.Notification,
                    title : "Launching " + path.basename(qtFile.fsPath) + " in QtCreator ...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });
    };
    context.subscriptions.push(vscode.commands.registerCommand(command, commandInHandler));

    // command to open a file in Qt Designer:
    // QtCreator Form files (*.ui)
    command = 'launchqtcreator.openinqtdesigner';
    commandInHandler = (qtFile:vscode.Uri) => {
        LaunchInQtDesigner(qtFile).then((success)=>{
            if(!success)
            {
                vscode.window.showErrorMessage("allowed files from extension: *.ui...\n"+
                "attempted loading '" + file_extension(qtFile.fsPath) + "'");
            }
            else
            {
                vscode.window.withProgress({
                    location : vscode.ProgressLocation.Notification,
                    title : "Launching " + path.basename(qtFile.fsPath) + " in Qt Designer ...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });

    };
    context.subscriptions.push(vscode.commands.registerCommand(command, commandInHandler));

    // Create a statusbar item
    MakeLaunchQtSelectionStatusbarItem();
}

function MakeLaunchQtSelectionStatusbarItem() : any {
    try {
        let item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, undefined);
        item.text = "Launch Qt...";
        item.command = "launchqtcreator.launchqtselection";
        item.show();
        console.log('created statusbar item \"Qt Tool Selection\"');
    }
    catch (error) {
        console.log('failed to create statusbar item \"Qt Tool Selection\"');
        vscode.window.showErrorMessage(error);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}

export async function LaunchQtCreator() : Promise<boolean> {
    let return_value:boolean = false;
    let config = vscode.workspace.getConfiguration('launchqtcreator');
    let qtcreator = config.qtCreatorPath;
    if(qtcreator === "<qt-creator-path>" || qtcreator === "")
    {
        qtcreator = getQtCreatorPath().then(()=>{
            console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
            return_value = true;
        }).then(undefined, () =>{
            return_value = false;
        });
    }
    if(!return_value)
    {
        doLaunchQtCreator(qtcreator).then(()=>{
            console.log('called doLaunchQtCreator with path ' + qtcreator);
            return_value = true;
        }).then(undefined, ()=>{
            return_value = false;
        });
    }
	return return_value;
}

export async function LaunchQtDesigner() : Promise<boolean> {
    let return_value:boolean = true;
    let config = vscode.workspace.getConfiguration('launchqtcreator');
    let qtdesigner = config.qtDesignerPath;
    if(qtdesigner === "<qt-creator-path>" || qtdesigner === "")
    {
        qtdesigner = getQtDesignerPath().then(()=>{
            console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
            return_value = true;
        }).then(undefined, () =>{
            return_value = false;
        });
    }
    if(!return_value)
    {
        doLaunchQtDesigner(qtdesigner).then(()=>{
            console.log('called doLaunchQtDesigner with path ' + qtdesigner);
            return_value = true;
        }).then(undefined, ()=>{
            return_value = false;
        });
    }
	return return_value;
}

export async function LaunchInQtCreator(qtFile:vscode.Uri) : Promise<boolean> {
    let return_value:boolean = ValidCreatorFiles(qtFile.fsPath);
    if(return_value)
    {
        let config = vscode.workspace.getConfiguration('launchqtcreator');
        let qtcreator = config.qtCreatorPath;
        if(qtcreator === "<qt-creator-path>" || qtcreator === "")
        {
            qtcreator = getQtCreatorPath().then(()=>{
                console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
                doLaunchInQtCreator(qtcreator, qtFile).then(()=>{
                    console.log('called doLaunchInQtCreator with path ' +
                    qtcreator +
                    " " + qtFile.fsPath);
                    return_value = true;
                }).then(undefined, ()=>{
                    return_value = false;
                });
            }).then(undefined, () =>{
                return_value = false;
            });
        }
        else
        {
            doLaunchInQtCreator(qtcreator, qtFile).then(()=>{
                console.log('called doLaunchInQtCreator with path ' +
                qtcreator +
                " " + qtFile.fsPath);
                return_value = true;
            }).then(undefined, ()=>{
                return_value = false;
            });
        }
    }
	return return_value;
}

export async function LaunchInQtDesigner(qtFile:vscode.Uri) : Promise<boolean> {
    let return_value:boolean = ValidDesignerFiles(qtFile.fsPath);
    if(return_value)
    {
        let config = vscode.workspace.getConfiguration('launchqtcreator');
        let qtdesigner = config.qtDesignerPath;
        if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
        {
            qtdesigner = getQtDesignerPath().then(()=>{
                console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
                doLaunchInQtDesigner(qtdesigner, qtFile).then(()=>{
                    console.log('called doLaunchInQtDesigner with path ' +
                    qtdesigner +
                    " " + qtFile.fsPath);
                    return_value = true;
                }).then(undefined, ()=>{
                    return_value = false;
                });
            }).then(undefined, () =>{
                return_value = false;
            });
        }
        else
        {
            doLaunchInQtDesigner(qtdesigner, qtFile).then(()=>{
                console.log('called doLaunchInQtDesigner with path ' +
                qtdesigner +
                " " + qtFile.fsPath);
                return_value = true;
            }).then(undefined, ()=>{
                return_value = false;
            });
        }
    }
	return return_value;
}
