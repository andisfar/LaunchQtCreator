import * as vscode from 'vscode';
var path = require("path");

export async function getQtCreatorPath() {
	let pathUri = await vscode.window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false,
		openLabel: 'Select the QtCreator executable to launch'
	});
	if (!pathUri) {
		return null;
	}
	let creatorPath = pathUri[0].fsPath;
	const settings = vscode.workspace.getConfiguration('launchqtcreator');
	settings.update('qtCreatorPath', creatorPath, vscode.ConfigurationTarget.Global).then(() => {
		doLaunchQtCreator(creatorPath);
	}).then(undefined, err => {
		vscode.window.showErrorMessage('unable to set \"launchqtcreator.qtCreatorPath\"\n(' + err + ")");
	});
	return creatorPath;
}

export async function getQtDesignerPath() {
	let pathUri = await vscode.window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false,
		openLabel: 'Select the Qt Designer executable to launch'
	});
	if (!pathUri) {
		return null;
	}
	let designerPath = pathUri[0].fsPath;
	const settings = vscode.workspace.getConfiguration('launchqtcreator');
	settings.update('qtDesignerPath', designerPath, vscode.ConfigurationTarget.Global).then(
        undefined, err => {
		vscode.window.showErrorMessage('unable to set \"launchqtcreator.qtDesignerPath\"\n(' + err + ")");
	});
	return designerPath;
}

export async function doLaunchQtCreator(qtcreator: string) {
	const cp = require('child_process');
	await cp.exec(qtcreator + " -color teal", (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export async function doLaunchInQtCreator(qtcreator: string, qtfile: vscode.Uri) {
	const cp = require('child_process');
	await cp.exec(qtcreator + " -color teal " + qtfile.fsPath, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export async function doLaunchInQtDesigner(qtdesigner: string, qtfile: vscode.Uri) {
	const cp = require('child_process');
	await cp.exec(qtdesigner + "  " + qtfile.fsPath, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export function ValidCreatorFiles(file:string) : boolean {
	let return_value:boolean = file.endsWith('.pro') || file.endsWith(".qrc")
				   || path.basename(file) === "CMakeLists.txt" || file.endsWith('ui');
    return return_value;
}

export function ValidDesignerFiles(file:string) : boolean {
	let return_value:boolean = file.endsWith('ui');
    return return_value;
}

export function file_extension(file:string) : string {
	let basepath: string = path.basename(file);
	let basepathArray: string[] = basepath.split('.');
	basepath = "'*." + basepathArray[basepathArray.length - 1] + "'";
	return basepath;
}
