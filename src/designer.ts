import
{ Uri,
  window,
  workspace,
  ConfigurationTarget,
  WorkspaceConfiguration
} from 'vscode';
import { file_extension } from './common';

var   cp = require('child_process');

async function ValidDesignerFiles(file: string): Promise<boolean> {
    let return_value: boolean = file.endsWith('ui');
    if(!return_value)
    {
        window.showErrorMessage("opening " + file_extension(file) + " not allowed!");
    }
    return return_value;
}

export async function LaunchQtDesigner() : Promise<boolean> {
    let return_value:boolean = true;
    let config = workspace.getConfiguration('launchqtcreator');
    let qtdesigner:string = config.qtDesignerPath;
    if(qtdesigner === "<qt-designer-path>" || qtdesigner === "")
    {
        await getQtDesignerPath().then(async path =>
        {
            qtdesigner = path;
            console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
            await doLaunchQtDesigner(qtdesigner).then(()=>{
                console.log('called doLaunchQtDesigner with path ' + qtdesigner);
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
        await doLaunchQtDesigner(qtdesigner).then(()=>{
            console.log('called doLaunchQtDesigner with path ' + qtdesigner);
            return_value = true;
        }).then(undefined, ()=>{
            return_value = false;
        });
    }
	return return_value;
}

export async function OpenInQtDesigner(qtFile: Uri): Promise<boolean>
{
    let return_value: boolean = false;
    ValidDesignerFiles(qtFile.fsPath).then(valid_file =>
    {
        if (valid_file)
        {
            let config = workspace.getConfiguration('launchqtcreator');
            let qtdesigner: string = config.qtDesignerPath;
            if (qtdesigner === "<qt-designer-path>" || qtdesigner === "")
            {
                getQtDesignerPath().then(async (path) =>
		{
                    qtdesigner = path;
                    console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
                    await doOpenInQtDesigner({ qtdesigner, qtfile: qtFile }).then(() =>
		    {
                        console.log('called doLaunchInQtDesigner with path ' +
                            qtdesigner +
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
                doOpenInQtDesigner({ qtdesigner, qtfile: qtFile }).then(() =>
		{
                    console.log('called doLaunchInQtDesigner with path ' +
                        qtdesigner +
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
	const settings:WorkspaceConfiguration = workspace.getConfiguration('launchqtcreator');
	settings.update('qtDesignerPath', designerPath, ConfigurationTarget.Global).then(
        undefined, err =>
	{
		window.showErrorMessage('unable to set \"launchqtcreator.qtDesignerPath\"\n(' + err + ")");
	});
	return designerPath;
}

export async function doLaunchQtDesigner(qtdesigner: string)
{
	await cp.exec(qtdesigner, (err: string, stdout: string) =>
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

export async function doOpenInQtDesigner({ qtdesigner, qtfile }: { qtdesigner: string; qtfile: Uri; })
{
    await cp.exec(`${qtdesigner}  "${qtfile.fsPath}"`, (err: string, stdout: string) =>
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
