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

export function LaunchQtCreator() {
	let config = vscode.workspace.getConfiguration('launchqtcreator');
	let qtcreator = config.qtCreatorPath;
	if(qtcreator === "")
	{		
		vscode.window.showErrorMessage("Define 'launchqtcreator.qtCreatorPath'");
	}
	else
	{		
		const cp = require('child_process');
		cp.exec(qtcreator, (err: string, stdout: string, stderr: string) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err) {
				console.log('error: ' + err);
			}
		});	
		vscode.window.showInformationMessage("launching QtCreator from [" + qtcreator + "]");	
	}	
}