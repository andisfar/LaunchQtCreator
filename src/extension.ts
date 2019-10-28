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
	let commandHandler = (name:string='LaunchQtCreator') => {
        if(LaunchQtCreator())
        {
            vscode.window.withProgress({
                location : vscode.ProgressLocation.Notification,
                title : "Launching QtCreator ...",
                cancellable: false}, () => {
                var p = new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });
                return p;
            });
        }
		{
			vscode.window.showErrorMessage("Command " + name + " failed!");
		}
	};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

	command = 'launchqtcreator.openinqtdesigner';
	context.subscriptions.push(vscode.commands.registerCommand(command,LaunchInQtDesigner,(_qtfile:vscode.Uri)=>{
        vscode.window.withProgress({
            location : vscode.ProgressLocation.Notification,
            title : "Launching " + path.basename(_qtfile.fsPath) + " in Qt Designer...",
            cancellable: false}, () => {
            var p = new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
            return p;
        });
	}));

	command = 'launchqtcreator.openinqtcreator';
	context.subscriptions.push(vscode.commands.registerCommand(command,LaunchInQtCreator,(_qtfile:vscode.Uri)=>{
	}));

	// Create a statusbar item
	try
	{
		let item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, undefined);
		item.text = "Launch Qt Creator";
		item.command = "launchqtcreator.launchqtcreator";
		item.show();
	} catch (error) {
		console.log('failed to create statusbar item \"Qt Creator\"');
		vscode.window.showErrorMessage(error);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}

export async function LaunchQtCreator() : Promise<boolean> {
	let config = vscode.workspace.getConfiguration('launchqtcreator');
	let qtcreator = config.qtCreatorPath;
	let return_value:boolean = false;
	if(qtcreator === "<qt-creator-path>" || qtcreator === "")
	{
		qtcreator = getQtCreatorPath().then(()=>{
			return_value = true;
		}).then(undefined, () =>{
			return_value = false;
		});
	}
	else
	{
		await doLaunchQtCreator(qtcreator).then(()=>{
			//vscode.window.showInformationMessage("Launching QtCreator");
			return_value = true;
		}).then(undefined, err=>{
			vscode.window.showErrorMessage("Error launching QtCreator\n" + err);
		});
	}
	return return_value;
}

export async function LaunchInQtCreator(qtfile:vscode.Uri) : Promise<boolean> {
	if(!ValidCreatorFiles(qtfile.fsPath))
	{
		let basepath: string = file_extension(qtfile.fsPath);
		vscode.window.showErrorMessage("Extension doesn't allow: opening " + basepath + " type files in QtCreator");
		return false;
	}
	let config = vscode.workspace.getConfiguration('launchqtcreator');
	let qtcreator = config.qtCreatorPath;
	let return_value:boolean = false;
	if(qtcreator === "<qt-creator-path>" || qtcreator === "")
	{
		qtcreator = await getQtCreatorPath().then(()=>{
			return_value = true;
		}).then(undefined, () =>{
			return_value = false;
		});
	}
	await doLaunchInQtCreator(qtcreator,qtfile).then(()=>{
        vscode.window.withProgress({
            location : vscode.ProgressLocation.Notification,
            title : "Launching " + path.basename(qtfile.fsPath) + " in QtCreator ...",
            cancellable: false}, () => {
            var p = new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
            return p;
        });
		return_value = true;
	}).then(undefined, err=>{
		vscode.window.showErrorMessage("Error opening "
										+ path.basename(qtfile.fsPath)
										+ " in QtCreator\n" + err);
	});
	return return_value;

}

export async function LaunchInQtDesigner(qtfile:vscode.Uri) : Promise<boolean> {
	if(!ValidDesignerFiles(qtfile.fsPath))
	{
		let basepath: string = file_extension(qtfile.fsPath);
		vscode.window.showErrorMessage("Extension doesn't allow: opening " + basepath + " type files in Qt Designer");
		return false;
	}
	let config = vscode.workspace.getConfiguration('launchqtcreator');
	let qtdesigner = config.qtDesignerPath;
	let return_value:boolean = false;
	if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
	{
		qtdesigner = await getQtDesignerPath().then(()=>{
			return_value = true;
		}).then(undefined, () =>{
			return_value = false;
		});
	}
	await doLaunchInQtDesigner(qtdesigner,qtfile).then(()=>{
        vscode.window.withProgress({
            location : vscode.ProgressLocation.Notification,
            title : "Launching " + path.basename(qtfile.fsPath) + " in Qt Designer ...",
            cancellable: false}, () => {
            var p = new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000);
            });
            return p;
        });
		return_value = true;
	}).then(undefined, err=>{
		vscode.window.showErrorMessage("Error opening "
										+ path.basename(qtfile.fsPath)
										+ " in Qt Designer\n" + err);
	});
	return return_value;
}
