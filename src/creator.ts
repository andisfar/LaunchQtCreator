import { Uri, window, workspace, ConfigurationTarget, WorkspaceConfiguration } from 'vscode';
import { file_extension } from './common';
import * as path from 'path';
import { execFile } from 'child_process';

async function ValidCreatorFiles(file: string): Promise<boolean> {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file);
    const return_value: boolean = ext === '.pro' || ext === '.qrc' || base === 'CMakeLists.txt' || ext === '.ui';
    if (!return_value) {
        window.showErrorMessage(`opening ${file_extension(file)} not allowed!`);
    }
    return return_value;
}

export async function LaunchQtCreator() : Promise<boolean> {
    let return_value:boolean = true;
    const config: WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
    let qtcreator: string = config.qtCreatorPath;
    try {
        if (qtcreator === "<qt-creator-path>" || qtcreator === "") {
            qtcreator = await getQtCreatorPath();
            console.log(`successfully called getQtCreatorPath: result [${qtcreator}]`);
        }
        await doLaunchQtCreator(qtcreator);
        console.log(`called doLaunchQtCreator with path ${qtcreator}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function OpenInQtCreator(qtFile: Uri): Promise<boolean> {
    try {
        const valid = await ValidCreatorFiles(qtFile.fsPath);
        if (!valid) return false;
        const config = workspace.getConfiguration('launchqtcreator');
        let qtcreator: string = config.qtCreatorPath;
        if (qtcreator === "<qt-creator-path>" || qtcreator === "") {
            qtcreator = await getQtCreatorPath();
            console.log(`successfully called getQtCreatorPath: result [${qtcreator}]`);
        }
        await doOpenInQtCreator({ qtcreator, qtfile: qtFile });
        console.log(`called doLaunchInQtCreator with path '${qtcreator}' '${qtFile.fsPath}'`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getQtCreatorPath() : Promise<string>
{
	let pathUri = await window.showOpenDialog(
        {
            canSelectFolders: false,
            canSelectFiles: true,
            canSelectMany: false,
            openLabel: 'Select the QtCreator executable to launch'
	    });
    if (!pathUri)
    {
        return "";
    }
    let creatorPath:string = pathUri[0].fsPath;
    const settings: WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
    try {
        await settings.update('qtCreatorPath', creatorPath, ConfigurationTarget.Global);
    } catch (err: any) {
        window.showErrorMessage(`unable to set \"launchqtcreator.qtCreatorPath\"\n(${err})`);
    }
    return creatorPath;
}

export async function doLaunchQtCreator(qtcreator: string)
{
    return new Promise<void>((resolve, reject) => {
        execFile(qtcreator, ['-color', 'teal'], (err, stdout, stderr) => {
            if (err) {
                console.error(`error: ${err}`);
                reject(err);
                return;
            }
            if (stdout) console.log(`stdout: ${stdout}`);
            if (stderr) console.error(`stderr: ${stderr}`);
            resolve();
        });
    });
}

export async function doOpenInQtCreator({ qtcreator, qtfile }: { qtcreator: string; qtfile: Uri; })
{
    return new Promise<void>((resolve, reject) => {
        execFile(qtcreator, ['-color', 'teal', qtfile.fsPath], (err, stdout, stderr) => {
            if (err) {
                console.error(`error: ${err}`);
                reject(err);
                return;
            }
            if (stdout) console.log(`stdout: ${stdout}`);
            if (stderr) console.error(`stderr: ${stderr}`);
            resolve();
        });
    });
}
