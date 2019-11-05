var path = require("path");
export function ValidCreatorFiles(file: string): boolean {
    let return_value: boolean = file.endsWith('.pro') || file.endsWith(".qrc")
        || path.basename(file) === "CMakeLists.txt" || file.endsWith('ui');
    return return_value;
}
