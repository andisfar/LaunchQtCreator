var path = require("path");
export function file_extension(file: string): string {
    let basepath: string = path.basename(file);
    let basepathArray: string[] = basepath.split('.');
    basepath = "'*." + basepathArray[basepathArray.length - 1] + "'";
    return basepath;
}
