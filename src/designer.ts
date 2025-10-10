import { Uri, window, workspace, ConfigurationTarget, WorkspaceConfiguration } from 'vscode';
import { file_extension } from './common';
import { execFile } from 'child_process';
import * as path from 'path';

async function ValidDesignerFiles(file: string): Promise<boolean> {
    const ext = path.extname(file).toLowerCase();
    const return_value: boolean = ext === '.ui';
    if (!return_value) {
        window.showErrorMessage(`opening ${file_extension(file)} not allowed!`);
    }
    return return_value;
}

export async function LaunchQtDesigner() : Promise<boolean> {
    let return_value:boolean = true;
    const config = workspace.getConfiguration('launchqtcreator');
    let qtdesigner: string = config.qtDesignerPath;
    try {
        if (qtdesigner === "<qt-designer-path>" || qtdesigner === "") {
            qtdesigner = await getQtDesignerPath();
            console.log(`successfully called getQtDesignerPath: result [${qtdesigner}]`);
        }
        await doLaunchQtDesigner(qtdesigner);
        console.log('called doLaunchQtDesigner with path ' + qtdesigner);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function OpenInQtDesigner(qtFile: Uri): Promise<boolean> {
    try {
        const valid = await ValidDesignerFiles(qtFile.fsPath);
        if (!valid) return false;
        const config = workspace.getConfiguration('launchqtcreator');
        let qtdesigner: string = config.qtDesignerPath;
        if (qtdesigner === "<qt-designer-path>" || qtdesigner === "") {
            qtdesigner = await getQtDesignerPath();
            console.log(`successfully called getQtDesignerPath: result [${qtdesigner}]`);
        }
        await doOpenInQtDesigner({ qtdesigner, qtfile: qtFile });
        console.log('called doLaunchInQtDesigner with path ' + qtdesigner + ' ' + qtFile.fsPath);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getQtDesignerPath() : Promise<string> {
	let pathUri = await window.showOpenDialog({
		canSelectFolders: false,
		canSelectFiles: true,
		canSelectMany: false,
		openLabel: 'Select the Qt Designer executable to launch'
	});
	if (!pathUri)
	{
		return "";
	}
	let designerPath = pathUri[0].fsPath;
    const settings: WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
    try {
        await settings.update('qtDesignerPath', designerPath, ConfigurationTarget.Global);
    } catch (err: any) {
        window.showErrorMessage('unable to set \"launchqtcreator.qtDesignerPath\"\n(' + err + ")");
    }
    return designerPath;
}

export async function doLaunchQtDesigner(qtdesigner: string)
{
    return new Promise<void>((resolve, reject) => {
        execFile(qtdesigner, [], (err, stdout, stderr) => {
            if (err) {
                console.error('error: ' + err);
                reject(err);
                return;
            }
            if (stdout) console.log('stdout: ' + stdout);
            if (stderr) console.error('stderr: ' + stderr);
            resolve();
        });
    });
}

export async function doOpenInQtDesigner({ qtdesigner, qtfile }: { qtdesigner: string; qtfile: Uri; })
{
    return new Promise<void>((resolve, reject) => {
        execFile(qtdesigner, [qtfile.fsPath], (err, stdout, stderr) => {
            if (err) {
                console.error('error: ' + err);
                reject(err);
                return;
            }
            if (stdout) console.log('stdout: ' + stdout);
            if (stderr) console.error('stderr: ' + stderr);
            resolve();
        });
    });
}
