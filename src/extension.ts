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
	let commandHandler = () => {
        let selections: string[] = ["QtCreator","Qt Designer"];
        window.showQuickPick(selections).then((selection)=>{
            if(selection === 'QtCreator')
            {
                let success:Promise<boolean> = LaunchQtCreator().then((success:boolean)=>{
                    return success;
                }).then(undefined, (error:string) =>
                {
                    console.log("error calling LaunchQtCreator-[" + error + "]");
                    window.showInformationMessage("error calling LaunchQtCreator-[" + error + "]");
                    return false;
                });
                if(success)
                {
                    window.withProgress({
                        location : ProgressLocation.Window,
                        title : "Launching QtCreator...",
                        cancellable: false}, () => {
                        var p = new Promise<boolean>(resolve=> {
                            setTimeout(() => {
                            resolve();
                        }, 8000);});return p;});
                    console.log("called LaunchQtCreator");
                }
            }
            if(selection === 'Qt Designer')
            {
                let success:Promise<boolean> = LaunchQtDesigner().then((success:boolean)=>{
                    return success;
                }).then(undefined, (error:string) => {
                    console.log("error calling LaunchQtDesigner-[" + error + "]");
                    window.showInformationMessage("error calling LaunchQtDesigner-[" + error + "]");
                    return false;
                });
                if(success)
                {
                    window.withProgress({
                        location : ProgressLocation.Window,
                        title : "Launching Qt Designer...",
                        cancellable: false}, () => {
                        var p = new Promise<boolean>(resolve=> {
                            setTimeout(() => {
                            resolve();
                        }, 3000);});return p;});
                    console.log("called Qt Designer");
                }
            }
        });};
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Tool Selection
	command = 'launchqtcreator.launchqtcreator';
	commandHandler = () => {
        LaunchQtCreator().then((success)=>{
            if(!success)
            {
                window.showErrorMessage("unknown error launching QtCreator...");
            }
            else
            {
                window.withProgress({
                    location : ProgressLocation.Window,
                    title : "Launching QtCreator...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });};
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to launch Qt Tool Selection
	command = 'launchqtcreator.launchqtdesigner';
	commandHandler = () => {
        LaunchQtDesigner().then((success)=>{
            if(!success)
            {
                window.showErrorMessage("unknown error launching Qt Designer...");
            }
            else
            {
                window.withProgress({
                    location : ProgressLocation.Window,
                    title : "Launching Qt Designer...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });};
	context.subscriptions.push(commands.registerCommand(command, commandHandler));

    // command to open a file in QtCreator:
    // can be QtCreator project files (*.pro),
    // CMake project files (CMakeLists.txt)
    // QtCreator Form files (*.ui)
    // QtCreatpr Resource Files (*.qrc)
    command = 'launchqtcreator.openinqtcreator';
    let commandInHandler = (qtFile:Uri) => {
        LaunchInQtCreator(qtFile).then((success)=>{
            if(!success)
            {
                window.showErrorMessage("allowed files from extension: *.pro, CMakeLists.txt, *.ui, *.qrc...\n"+
                "attempted loading '" + file_extension(qtFile.fsPath) + "'");
            }
            else
            {
                window.withProgress({
                    location : ProgressLocation.Notification,
                    title : "Launching " + path.basename(qtFile.fsPath) + " in QtCreator ...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
        });
    };
    context.subscriptions.push(commands.registerCommand(command, commandInHandler));

    // command to open a file in Qt Designer:
    // QtCreator Form files (*.ui)
    command = 'launchqtcreator.openinqtdesigner';
    commandInHandler = (qtFile:Uri) => {
        LaunchInQtDesigner(qtFile).then((success)=>{
            if(!success)
            {
                window.showErrorMessage("allowed files from extension: *.ui...\n"+
                "attempted loading '" + file_extension(qtFile.fsPath) + "'");
            }
            else
            {
                window.withProgress({
                    location : ProgressLocation.Notification,
                    title : "Launching " + path.basename(qtFile.fsPath) + " in Qt Designer ...",
                    cancellable: false}, () => {
                    var p = new Promise<boolean>(resolve=> {
                        setTimeout(() => {
                        resolve();
                    }, 8000);});return p;});
            }
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
    if(return_value)
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
    if(return_value)
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

export async function LaunchInQtCreator(qtFile:Uri) : Promise<boolean> {
    let return_value:boolean = ValidCreatorFiles(qtFile.fsPath);
    if(return_value)
    {
        let config = workspace.getConfiguration('launchqtcreator');
        let qtcreator = config.qtCreatorPath;
        if(qtcreator === "<qt-creator-path>" || qtcreator === "")
        {
            qtcreator = getQtCreatorPath().then(()=>{
                console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
                doLaunchInQtCreator({ qtcreator, qtfile: qtFile }).then(()=>{
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
            doLaunchInQtCreator({ qtcreator, qtfile: qtFile }).then(()=>{
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
        let qtdesigner = config.qtDesignerPath;
        if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
        {
            qtdesigner = getQtDesignerPath().then(()=>{
                console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
                doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(()=>{
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
            doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(()=>{
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
