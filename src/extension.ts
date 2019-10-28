// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getQtCreatorPath,
		 doLaunchQtCreator,
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

	let command:string = 'launchqtcreator.launchqtcreator';
	let commandHandler = () => {
        LaunchQtCreator();
        vscode.window.withProgress({
            location : vscode.ProgressLocation.Window,
            title : "Launching QtCreator ...",
            cancellable: false}, () => {
            var p = new Promise<boolean>(resolve=> {
                setTimeout(() => {
                resolve();
            }, 8000);});return p;});
    };
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

    // Create a statusbar item
    MakeLaunchQtCreatorStatusbarItem();
}

function MakeLaunchQtCreatorStatusbarItem() : any {
    try {
        let item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, undefined);
        item.text = "Launch Qt Creator";
        item.command = "launchqtcreator.launchqtcreator";
        item.show();
        console.log('created statusbar item \"Qt Creator\"');
    }
    catch (error) {
        console.log('failed to create statusbar item \"Qt Creator\"');
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
