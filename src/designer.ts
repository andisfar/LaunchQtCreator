import
{ Uri,
  window,
  workspace,
  ConfigurationTarget,
  WorkspaceConfiguration
} from 'vscode';

var   cp = require('child_process');

function ValidDesignerFiles(file: string): boolean {
    let return_value: boolean = file.endsWith('ui');
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

export async function LaunchInQtDesigner(qtFile: Uri): Promise<boolean> {
    let return_value: boolean = ValidDesignerFiles(qtFile.fsPath);
    if (return_value) {
        let config = workspace.getConfiguration('launchqtcreator');
        let qtdesigner: string = config.qtDesignerPath;
        if (qtdesigner === "<qt-designer-path>" || qtdesigner === "")
        {
            await getQtDesignerPath().then(async (path) => {
                qtdesigner = path;
                console.log('successfully called getQtDesignerPath: result [' + qtdesigner + ']');
                await doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(() => {
                    console.log('called doLaunchInQtDesigner with path ' +
                        qtdesigner +
                        " " + qtFile.fsPath);
                    return_value = true;
                }).then(undefined, () => {
                    return_value = false;
                });
            }).then(undefined, () => {
                return_value = false;
            });
        }
        else
        {
            await doLaunchInQtDesigner({ qtdesigner, qtfile: qtFile }).then(() => {
                console.log('called doLaunchInQtDesigner with path ' +
                    qtdesigner +
                    " " + qtFile.fsPath);
                return_value = true;
            }).then(undefined, () => {
                return_value = false;
            });
        }
    }
    return return_value;
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
