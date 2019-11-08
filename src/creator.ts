import
{   Uri,
    window,
    workspace,
    ConfigurationTarget,
    WorkspaceConfiguration
} from 'vscode';

import {file_extension} from './common';

var   cp = require('child_process');
var path = require("path");

async function ValidCreatorFiles(file: string): Promise<boolean> {
    let return_value: boolean = file.endsWith('.pro') || file.endsWith(".qrc")
        || path.basename(file) === "CMakeLists.txt" || file.endsWith('ui');
    if(!return_value)
    {
        window.showErrorMessage("opening " + file_extension(file) + " not allowed!");
    }
    return return_value;
}

export async function LaunchQtCreator() : Promise<boolean> {
    let return_value:boolean = true;
    let config:WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
    let qtcreator:string = config.qtCreatorPath;
    if(qtcreator === "<qt-creator-path>" || qtcreator === "")
    {
        await getQtCreatorPath().then(async path =>
        {
            qtcreator = path;
            console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
            await doLaunchQtCreator(qtcreator).then(()=>{
                console.log('called doLaunchQtDesigner with path ' + qtcreator);
                return_value = true;
            }).then(undefined, ()=>{
                return_value = false;
            });
        }).then(undefined, () =>{
            return_value = false;
        });
    }
    else
    {
        doLaunchQtCreator(qtcreator).then(()=>{
            console.log('called doLaunchQtCreator with path ' + qtcreator);
            return_value = true;
        }).then(undefined, ()=>{
            return_value = false;
        });
    }
	return return_value;
}

export async function OpenInQtCreator(qtFile: Uri): Promise<boolean> 
{
    let return_value: boolean = false;
    ValidCreatorFiles(qtFile.fsPath).then(valid_file =>
    {
        if (valid_file)
        {
            let config = workspace.getConfiguration('launchqtcreator');
            let qtcreator: string = config.qtCreatorPath;
            if (qtcreator === "<qt-creator-path>" || qtcreator === "")
            {
                getQtCreatorPath().then(async (path) =>
                {
                    qtcreator = path;
                    console.log('successfully called getQtCreatorPath: result [' + qtcreator + ']');
                    await doOpenInQtCreator({ qtcreator, qtfile: qtFile }).then(() =>
                    {
                        console.log('called doLaunchInQtCreator with path ' +
                            qtcreator +
                            " " + qtFile.fsPath);
                        return_value = true;
                    }).then(undefined, () =>
                    {
                        return_value = false;
                    });
                }).then(undefined, () =>
                {
                    return_value = false;
                });
            }
            else
            {
                doOpenInQtCreator({ qtcreator, qtfile: qtFile }).then(() =>
                {
                    console.log('called doLaunchInQtCreator with path ' +
                        qtcreator +
                        " " + qtFile.fsPath);
                    return_value = true;
                }).then(undefined, () =>
                {
                    return_value = false;
                });
            }
        }
    });
    return return_value;
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
    const settings:WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
    settings.update('qtCreatorPath', creatorPath, ConfigurationTarget.Global).then(
    undefined, err =>
    {
        window.showErrorMessage('unable to set \"launchqtcreator.qtCreatorPath\"\n(' + err + ")");
    });
    return creatorPath;
}

export async function doLaunchQtCreator(qtcreator: string)
{
    await cp.exec(qtcreator + " -color teal", (err: string, stdout: string) =>
    {
        if (err)
        {
	    console.log('error: ' + err);
	}
        if (stdout)
        {
	    console.log('stdout: ' + stdout);
        }
	});
}

export async function doOpenInQtCreator({ qtcreator, qtfile }: { qtcreator: string; qtfile: Uri; })
{
    await cp.exec(qtcreator + " -color teal " + qtfile.fsPath, (err: string, stdout: string) =>
    {
        if (err)
        {
            console.log('error: ' + err);
        }
        if (stdout)
        {
            console.log('stdout: ' + stdout);
        }
	});
}
