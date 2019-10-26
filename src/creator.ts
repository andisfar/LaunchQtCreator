import { ConfigurationTarget, workspace, window } from 'vscode';
export async function getQtCreatorPath() {
	let pathUri = await window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false, 
		openLabel: 'Select the QtCreator executable to launch'
	});
	if (!pathUri) {
		return null;
	}
	let creatorPath = pathUri[0].fsPath;
	const settings = await workspace.getConfiguration('launchqtcreator');
	settings.update('qtCreatorPath', creatorPath, ConfigurationTarget.Global).then(() => {
		console.log('path from OpenDialog ' + creatorPath);
		if (doLaunchQtCreator(creatorPath)) {
			window.showInformationMessage("Launching QtCreator from [" + creatorPath + "]");
		}
		else {
			window.showErrorMessage("Error launching QtCreator from [" + creatorPath + "]");
		}
	}).then(undefined, err => {
		window.showErrorMessage('unable to set \"launchqtcreator.qtCreatorPath\"');
	});
	return creatorPath;
}

export async function doLaunchQtCreator(qtcreator: string) {
	const cp = require('child_process');
	await cp.exec(qtcreator, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
		}
	});
}
