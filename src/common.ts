import * as path from 'path';

export function file_extension(file: string): string {
    // return the file extension in lower-case including the dot (e.g. ".ui")
    return path.extname(file).toLowerCase();
}
