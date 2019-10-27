import * as vscode from 'vscode';
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
		console.log('path from OpenDialog ' + creatorPath);
		if (doLaunchQtCreator(creatorPath)) {
			vscode.window.showInformationMessage("Launching QtCreator from [" + creatorPath + "]");
		}
		else {
			vscode.window.showErrorMessage("Error launching QtCreator from [" + creatorPath + "]");
		}
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
	settings.update('qtDesignerPath', designerPath, vscode.ConfigurationTarget.Global).then(() => {
		console.log('path from OpenDialog ' + designerPath);
	}).then(undefined, err => {
		vscode.window.showErrorMessage('unable to set \"launchqtcreator.qtDesignerPath\"\n(' + err + ")");
	});
	return designerPath;
}


export async function doLaunchQtCreator(qtcreator: string) {
	const cp = require('child_process');
	await cp.exec(qtcreator + " -color teal -notour -client", (err: string, stdout: string) => {
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
	await cp.exec(qtcreator + " -color teal -client " + qtfile.fsPath, (err: string, stdout: string) => {
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
