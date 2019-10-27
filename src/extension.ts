// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getQtCreatorPath, 
		 doLaunchQtCreator, 
		 doLaunchInQtCreator,
		 getQtDesignerPath,
		 doLaunchInQtDesigner} from './creator';

var path = require("path");				 
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let command:string = 'launchqtcreator.launchqtcreator';
	let commandHandler = (name:string='LaunchQtCreator') => {
		if(!LaunchQtCreator())
		{
			vscode.window.showErrorMessage("Command " + name + " failed!");
		}
	};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));  

	command = 'launchqtcreator.openinqtdesigner';
	context.subscriptions.push(vscode.commands.registerCommand(command,LaunchInQtDesigner,(_qtfile:vscode.Uri)=>{
		console.log("designer opening file:" + _qtfile.path);
	}));  

	command = 'launchqtcreator.openinqtcreator';
	context.subscriptions.push(vscode.commands.registerCommand(command,LaunchInQtCreator,(_qtfile:vscode.Uri)=>{
		console.log("qtcreator opening file:" + _qtfile.path);
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
			vscode.window.showInformationMessage("Launching QtCreator");
			return_value = true;
		}).then(undefined, err=>{
			vscode.window.showErrorMessage("Error launching QtCreator\n" + err);
		});
	}	
	return return_value;
}

function ValidCreatorFiles(file:string) : boolean {
	let return_value:boolean = file.endsWith('.pro') || file.endsWith(".qrc")
				   || path.basename(file) === "CMakeLists.txt" || file.endsWith('ui');
    return return_value;
}

function ValidDesignerFiles(file:string) : boolean {
	let return_value:boolean = file.endsWith('ui');
    return return_value;
}

function file_extension(file:string) : string {
	let basepath: string = path.basename(file);
	let basepathArray: string[] = basepath.split('.');
	basepath = "'*." + basepathArray[basepathArray.length - 1] + "'";
	return basepath;
}

export async function LaunchInQtCreator(qtfile:vscode.Uri) : Promise<boolean> {
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
		var path = require("path");		
		await doLaunchInQtCreator(qtcreator,qtfile).then(()=>{
			vscode.window.showInformationMessage("Opening " 
												  + path.basename(qtfile.fsPath) + 
												  " in QtCreator");
			return_value = true;
		}).then(undefined, err=>{
			vscode.window.showErrorMessage("Error opening " 
											+ path.basename(qtfile.fsPath) 
											+ " in QtCreator\n" + err);
		});
	}	
	return return_value;
}

export async function LaunchInQtDesigner(qtfile:vscode.Uri) : Promise<boolean> {
	let config = vscode.workspace.getConfiguration('launchqtcreator');
	let qtdesigner = config.qtDesignerPath;
	let return_value:boolean = false; 
	if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
	{		
		qtdesigner = getQtDesignerPath().then(()=>{ 			
			return_value = true;
		}).then(undefined, () =>{
			return_value = false;
		});			
	}
	else
	{
		var path = require("path");		
		await doLaunchInQtDesigner(qtdesigner,qtfile).then(()=>{
			vscode.window.showInformationMessage("Opening " 
												  + path.basename(qtfile.fsPath) + 
												  " in Qt Designer");
			return_value = true;
		}).then(undefined, err=>{
			vscode.window.showErrorMessage("Error opening " 
											+ path.basename(qtfile.fsPath) 
											+ " in Qt Designer\n" + err);
		});
	}	
	return return_value;
}