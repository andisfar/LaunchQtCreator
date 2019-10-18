// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "launchqtcreator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.launchqtcreator', () => {
		// The code you place here will be executed every time your command is executed

		// Create a statusbar item
		let item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, undefined);
		item.text = "QtCreator";
		item.show();
		vscode.commands.registerCommand("QtCreatorCommand",
			LaunchQtCreator, this);
		item.command = "QtCreatorCommand";
		LaunchQtCreator();
	});

	context.subscriptions.push(disposable);
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