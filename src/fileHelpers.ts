
/**
 * code from vscode-python (MIT licensed)
 */

import * as fs from 'fs';
import * as md5 from 'md5';
import * as vscode from "vscode";
import * as path from 'path';


function getTempFileWithDocumentContents(document: vscode.TextDocument): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const ext = path.extname(document.uri.fsPath);
        // Don't create file in temp folder since external utilities
        // look into configuration files in the workspace and are not able
        // to find custom rules if file is saved in a random disk location.
        // This means temp file has to be created in the same folder
        // as the original one and then removed.

        // tslint:disable-next-line:no-require-imports
        const fileName = `${document.uri.fsPath}.${md5(document.uri.fsPath)}${ext}`;
        fs.writeFile(fileName, document.getText(), ex => {
            if (ex) {
                reject(`Failed to create a temporary file, ${ex.message}`);
            }
            resolve(fileName);
        });
    });
}

export async function createTempFile(document: vscode.TextDocument): Promise<string> {
    return document.isDirty
        ? getTempFileWithDocumentContents(document)
        : document.fileName;
}


export async function deleteTempFile(originalFile: string, tempFile: string, logger: vscode.OutputChannel): Promise<void> {
    if (originalFile !== tempFile) {
        return fs.unlink(tempFile, (err) => {
            if (err) throw err;
            logger.appendLine(`Temporary file "${tempFile}" was deleted`);
        });
    }
    return Promise.resolve();
}
