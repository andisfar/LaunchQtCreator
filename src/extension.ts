// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { StatusBarAlignment,
		 ExtensionContext, 
		 ConfigurationTarget, 
		 workspace, 
		 window, 
		 commands } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	const command = 'extension.launchqtcreator';
	const commandHandler = (name:string='LaunchQtCreator') => {
		console.log(`Launch QtCreator via ${name}!!!`);
	};
	context.subscriptions.push(commands.registerCommand(command, commandHandler));  
	// Create a statusbar item
	try 
	{
		let item = window.createStatusBarItem(StatusBarAlignment.Right, undefined);
		item.text = "Qt Creator";
		item.show();
		commands.registerCommand("QtCreatorCommand",
			LaunchQtCreator, this);
		item.command = "QtCreatorCommand";
	} catch (error) {
		console.log('failed to create statusbar item \"Qt Creator\"');			
		window.showErrorMessage(error);
	}
	LaunchQtCreator();
}

// this method is called when your extension is deactivated
export function deactivate() { }

export async function LaunchQtCreator() : Promise<boolean> {
	let config = workspace.getConfiguration('launchqtcreator');
	let qtcreator = config.qtCreatorPath;
	let return_value:boolean = false; 
	if(qtcreator === "")
	{		
		qtcreator = getQtCreatorPath().then(()=>{ 			
			return_value = true;
		}).then(undefined, err =>{
			return_value = false;
		});			
	}
	else
	{		
		await doLaunchQtCreator(qtcreator).then(()=>{
			window.showInformationMessage("Launching QtCreator from [" + qtcreator + "]");
			return_value = true;
		}).then(undefined, err=>{
			window.showErrorMessage("Error launching QtCreator from [" + qtcreator + "]");
		});
	}	
	return return_value;
}

async function doLaunchQtCreator(qtcreator: any) {
	const cp = require('child_process');
	await cp.exec(qtcreator, (err: string, stdout: string, stderr: string) => {
		if (err) { console.log('error: ' + err); }
		if (stdout) {console.log('stdout: ' + stdout);}	
	});
}

 async function getQtCreatorPath() 
 {
	let pathUri = await window.showOpenDialog({
	canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false, openLabel: 'Select the QtCreator executable'
	});
	if(!pathUri)
	{
		return null;
	}

	let creatorPath = pathUri[0].fsPath;

	const settings = await workspace.getConfiguration('launchqtcreator');		
	settings.update('qtCreatorPath',creatorPath,ConfigurationTarget.Global).then(()=>{
		console.log('path from OpenDialog ' + creatorPath);
		if(doLaunchQtCreator(creatorPath))
		{
			window.showInformationMessage("Launching QtCreator from [" + creatorPath + "]");
		}
		else
		{
			window.showErrorMessage("Error launching QtCreator from [" + creatorPath + "]");
		}
		}).then(undefined, err=>{
			window.showErrorMessage('unable to set \"launchqtcreator.qtCreatorPath\"');
		});	
	return creatorPath;
}
