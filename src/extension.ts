// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { StatusBarAlignment,
		 ExtensionContext, 
		 workspace, 
		 window, 
		 commands, 
		 Command} from 'vscode';
import { getQtCreatorPath, doLaunchQtCreator } from './creator';

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
			LaunchQtCreator, function(this:Command, err:any){});
		item.command = "QtCreatorCommand";
	} catch (error) {
		console.log('failed to create statusbar item \"Qt Creator\"');			
		window.showErrorMessage(error);
	}
	LaunchQtCreator();
}

// this method is called when your extension is deactivated
export function deactivate() {}

export async function LaunchQtCreator() : Promise<boolean> {
	let config = workspace.getConfiguration('launchqtcreator');
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
			window.showInformationMessage("Launching QtCreator from [" + qtcreator + "]");
			return_value = true;
		}).then(undefined, ()=>{
			window.showErrorMessage("Error launching QtCreator from [" + qtcreator + "]");
		});
	}	
	return return_value;
}