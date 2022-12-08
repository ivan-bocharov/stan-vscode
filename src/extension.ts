/**
 * Based on code from https://github.com/iansan5653/vscode-format-python-docstrings
 * (MIT Licensed)
 */

import * as vscode from "vscode";
import * as util from "util";
import * as cp from "child_process";
import * as diff from "diff";
import * as path from 'path';
import { createTempFile, deleteTempFile } from "./fileHelpers";

import { c } from "compress-tag";

export const promiseExec = util.promisify(cp.exec);
export let registration: vscode.Disposable | undefined;

let logger = vscode.window.createOutputChannel("Stan Formatting")


const disableFormatterButton = "Disable Formatting";
const openSettingsButton = "Open Settings"

/**
 * A callback to disable the formatter if the user requests it on error
 * @param response The response recieved from the error callback
 */
function disableCallback(response: string) {
    if (response === disableFormatterButton) {
        const settings = vscode.workspace.getConfiguration("stan-vscode.format");
        settings.update("enable", false);
    } else if (response === openSettingsButton) {
        vscode.commands.executeCommand("workbench.action.openSettings", "@ext:ivan-bocharov.stan-vscode")
    }
}

/**
 * Get the path to stanc3
 * @returns A command which can be called to invoke stanc in the terminal.
 */
export async function getStan(): Promise<string> {
    const setPath = vscode.workspace.getConfiguration("stan-vscode.format").get<string>("stancPath");
    if (setPath !== undefined && setPath != "stanc") {
        try {
            await promiseExec(`"${setPath}" --version`);
            return setPath;
        } catch (err) {


            vscode.window.showErrorMessage(c`
        The stanc3 path set in the "stan-vscode.stancPath" setting is invalid.
      `, openSettingsButton, disableFormatterButton).then(disableCallback);
            throw err;
        }
    }
    try {
        await promiseExec("stanc --version");
        return "stanc";
    } catch (err) {
        vscode.window.showErrorMessage(c`
        stanc cannot be found in the global environment, please set a path in
        settings under "stan-vscode.stancPath"
      `, openSettingsButton, disableFormatterButton).then(disableCallback);
        throw err;
    }
}


/**
 * Build a text string that can be run as the stanc format command with flags.
 *
 * Reads the current settings and implements them or falls back to defaults.
 * @param file Path to the (possibly temporary) file to be formatted.
 * @param name Name of the (original) file to show in any error messages.
 * @returns Runnable terminal command that will format the specified file.
 */
export async function buildFormatCommand(file: string, name: string): Promise<string> {
    const stanc = await getStan();
    const settings = vscode.workspace.getConfiguration("stan-vscode.format");
    const linelen = settings.get<number>("lineLength") || 78;


    const cmd = c`
    ${stanc}
    --auto-format "${file}"
    --max-line-length=${linelen}
    --filename-in-msg "${name}"
    `
        .trim()
        .replace(/\s+/, " "); // Remove extra whitespace (helps with tests)
    logger.appendLine(`Running Stan with args "${cmd}"`)
    return cmd
}


/**
 * Handle an error raised by `promiseExec`, which passes an exception object.
 *
 * @param err The error raised by `promiseExec`, which would have been run to
 * execute the format command.
 */
export async function alertFormattingError(
    err: FormatException
): Promise<void> {
    if (err.message.includes("Syntax") || err.message.includes("Semantic")) {
        logger.show(true)
        logger.clear()
        logger.appendLine(err.message)
    } else {
        const bugReportButton = "Submit Bug Report";
        const response = await vscode.window.showErrorMessage(
            c`Unknown Error: Could not format Stan file. Full error:\n\n
        ${err.message}`,
            bugReportButton
        );
        if (response === bugReportButton) {
            vscode.commands.executeCommand(
                "vscode.open",
                vscode.Uri.parse(
                    "https://github.com/ivan-bocharov/stan-vscode/issues/new"
                )
            );
        }
    }
}

/**
 * Format a file using Docformatter and return the edit hunks without
 * modifying the file.
 * @param path Full path to a file to format.
 * @returns A promise that resolves to the edit hunks, which can then be
 * converted to edits and applied to the file. If the promise rejects, will
 * automatically show an error message to the user.
 */
export async function formatFile(document: vscode.TextDocument): Promise<diff.Hunk[]> {

    const tmp = await createTempFile(document);
    const command: string = await buildFormatCommand(tmp, document.fileName);

    try {
        const result = await promiseExec(command);
        const patch = diff.createPatch(path, document.getText(), result.stdout.trim())
        const parsed: diff.ParsedDiff[] = diff.parsePatch(patch)
        return parsed[0].hunks;
    } catch (err) {
        alertFormattingError(err);
        throw err;
    } finally {
        await deleteTempFile(document.fileName, tmp, logger);
    }

}


/**
 * Convert any number of hunks to a matching array of native VSCode edits.
 * @param hunks Array of hunks to convert to edits.
 * @returns Array of VSCode text edits, which map directly to the input hunks.
 */
export function hunksToEdits(hunks: diff.Hunk[]): vscode.TextEdit[] {
    return hunks.map(
        (hunk): vscode.TextEdit => {
            const startPos = new vscode.Position(hunk.newStart - 1, 0);
            const endPos = new vscode.Position(
                hunk.newStart - 1 + hunk.oldLines - 1,
                hunk.lines[hunk.lines.length - 1].length - 1
            );
            const editRange = new vscode.Range(startPos, endPos);

            const newTextLines = hunk.lines
                .filter(
                    (line): boolean => line.charAt(0) === " " || line.charAt(0) === "+"
                )
                .map((line): string => line.substr(1));
            const lineEndChar: string = hunk.linedelimiters[0];
            const newText = newTextLines.join(lineEndChar);

            return new vscode.TextEdit(editRange, newText);
        }
    );
}


/**
 * Activate the extension. Run automatically by VSCode based on
 * the `activationEvents` property in package.json.
 */
export function activate(): void {
    // Register formatter
    const selector: vscode.DocumentSelector = {
        scheme: "file",
        language: "stan"
    };

    const provider: vscode.DocumentFormattingEditProvider = {
        provideDocumentFormattingEdits: (
            document: vscode.TextDocument
        ): Promise<vscode.TextEdit[]> => {
            if (!vscode.workspace.getConfiguration("stan-vscode.format").get<boolean>("enable")) {
                return Promise.resolve([]);
            }
            return formatFile(document).then(hunksToEdits);
        }
    };

    registration = vscode.languages.registerDocumentFormattingEditProvider(
        selector,
        provider
    );

    logger.appendLine("Initialized Stan formatting")
}

/**
 * Deactivate the extension. Runs automatically upon deactivation or uninstall.
 */
export function deactivate(): void {
    if (registration) {
        registration.dispose();
    }
}

/**
 * Exception thrown when formatting fails.
 */
export interface FormatException {
    message: string;
}