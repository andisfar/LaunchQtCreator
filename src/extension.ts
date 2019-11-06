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
import
{
    doLaunchInQtCreator,
    doLaunchInQtDesigner,
    doLaunchQtCreator,
    doLaunchQtDesigner,
    getQtCreatorPath,
    getQtDesignerPath,
} from './creator';
//
import { file_extension } from "./file_extension";
//
import { ValidDesignerFiles } from "./ValidDesignerFiles";
//
import { ValidCreatorFiles } from "./ValidCreatorFiles";

var path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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
                        }, 2000);
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
            title : "Launching " + path.basename(qtFile.fsPath) + " in QtCreator ...",
            cancellable: false
        }, () =>
        {
            var p = new Promise<boolean>(resolve=>
            {
                setTimeout(() =>
                {
                    resolve(LaunchInQtCreator(qtFile));
                }, 2000);
            });return p;
        });
    };
    context.subscriptions.push(commands.registerCommand(command, commandInHandler));

    // command to open a file in Qt Designer:
    // QtCreator Form files (*.ui)
    command = 'launchqtcreator.openinqtdesigner';
    commandInHandler = (qtFile:Uri) =>
    {
        window.withProgress(
        {
            location : ProgressLocation.Notification,
            title : "Launching " + path.basename(qtFile.fsPath) + " in Qt Designer ...",
            cancellable: false
        }, () =>
        {
            var p = new Promise<boolean>(resolve=>
            {
                setTimeout(() =>
                {
                    resolve(LaunchInQtDesigner(qtFile));
                }, 2000);
            });return p;
        });
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
    catch (error) {
        console.log('failed to create statusbar item \"Qt Tool Selection\"');
        window.showErrorMessage(error);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}

export async function LaunchQtCreator() : Promise<boolean> {
    let return_value:boolean = true;
    let config = workspace.getConfiguration('launchqtcreator');
    let qtcreator:string = config.qtCreatorPath;
    if(qtcreator === "<qt-creator-path>" || qtcreator === "")
    {
        await getQtCreatorPath().then(async path =>
        {
            qtcreator = path;
            console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
            await doLaunchQtDesigner(qtcreator).then(()=>{
                console.log('called doLaunchQtDesigner with path ' + qtcreator);
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
    let config = workspace.getConfiguration('launchqtcreator');
    let qtdesigner:string = config.qtDesignerPath;
    if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
    {
        await getQtDesignerPath().then(async path =>
        {
            qtdesigner = path;
            console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
            await doLaunchQtDesigner(qtdesigner).then(()=>{
                console.log('called doLaunchQtDesigner with path ' + qtdesigner);
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
        await doLaunchQtDesigner(qtdesigner).then(()=>{
            console.log('called doLaunchQtDesigner with path ' + qtdesigner);
            return_value = true;
        }).then(undefined, ()=>{
            return_value = false;
        });
    }
	return return_value;
}

export async function LaunchInQtCreator(qtFile:Uri) : Promise<boolean> {
    let return_value:boolean = ValidCreatorFiles(qtFile.fsPath);
    if(return_value)
    {
        let config = workspace.getConfiguration('launchqtcreator');
        let qtcreator:string = config.qtCreatorPath;
        if(qtcreator === "<qt-creator-path>" || qtcreator === "")
        {
            await getQtCreatorPath().then(async path =>
            {
                qtcreator = path;
                console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
                await doLaunchInQtCreator({ qtcreator, qtfile: qtFile }).then(()=>{
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
            await doLaunchInQtCreator({ qtcreator, qtfile: qtFile }).then(()=>{
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

export async function LaunchInQtDesigner(qtFile:Uri) : Promise<boolean> {
    let return_value:boolean = ValidDesignerFiles(qtFile.fsPath);
    if(return_value)
    {
        let config = workspace.getConfiguration('launchqtcreator');
        let qtdesigner:string  = config.qtDesignerPath;
        if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
        {
            await getQtDesignerPath().then( async path =>
            {
                qtdesigner = path;
                console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
                await doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(()=>{
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
            await doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(()=>{
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
