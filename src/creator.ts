import
{
    Uri,
    window,
    workspace,
    ConfigurationTarget,
    WorkspaceConfiguration
} from 'vscode';

var path = require("path");
var   cp = require('child_process');

export async function getQtCreatorPath() : Promise<string> {
	let pathUri = await window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false,
		openLabel: 'Select the QtCreator executable to launch'
	});
	if (!pathUri) {
		return "";
	}
	let creatorPath:string = pathUri[0].fsPath;
	const settings:WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
	settings.update('qtCreatorPath', creatorPath, ConfigurationTarget.Global).then(() => {
		doLaunchQtCreator(creatorPath);
	}).then(undefined, err => {
		window.showErrorMessage('unable to set \"launchqtcreator.qtCreatorPath\"\n(' + err + ")");
	});
	return creatorPath;
}

export async function getQtDesignerPath() : Promise<string> {
	let pathUri = await window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false,
		openLabel: 'Select the Qt Designer executable to launch'
	});
	if (!pathUri) {
		return "";
	}
	let designerPath = pathUri[0].fsPath;
	const settings:WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
	settings.update('qtDesignerPath', designerPath, ConfigurationTarget.Global).then(
        undefined, err => {
		window.showErrorMessage('unable to set \"launchqtcreator.qtDesignerPath\"\n(' + err + ")");
	});
	return designerPath;
}

export async function doLaunchQtCreator(qtcreator: string) {
	await cp.exec(qtcreator + " -color teal", (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export async function doLaunchQtDesigner(qtdesigner: string) {
	await cp.exec(qtdesigner, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export async function doLaunchInQtCreator({ qtcreator, qtfile }: { qtcreator: string; qtfile: Uri; }) {
	await cp.exec(qtcreator + " -color teal " + qtfile.fsPath, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}

export async function doLaunchInQtDesigner({ qtdesigner, qtfile }: { qtdesigner: string; qtfile: Uri; }) {
	await cp.exec(qtdesigner + "  " + qtfile.fsPath, (err: string, stdout: string) => {
		if (err) {
			console.log('error: ' + err);
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
        }
	});
}
