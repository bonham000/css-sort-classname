// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { alphabetizeCssByClassName } from "./util";

let myStatusBarItem: vscode.StatusBarItem;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The commandId parameter must match the command field in package.json
  const myCommandId = "css-sort-classname.sortCssClassnames";
  const disposable = vscode.commands.registerCommand(myCommandId, () => {
    // The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor;
    const fileName = editor?.document.fileName;
    const isCssFile =
      fileName?.slice(fileName?.length - 3, fileName?.length) === "css";

    if (isCssFile) {
      if (!editor) {
        vscode.window.showInformationMessage("editor does not exist.");
        return;
      }

      const { document } = editor;

      // Use entire document text
      const text = document.getText();
      const result = alphabetizeCssByClassName(text);

			if (result === null) {
				vscode.window.showInformationMessage("Failed to parse CSS.");
				return;
			}

      editor.edit((builder) => {
        // Replace the entire document text
        builder.replace(
          new vscode.Range(
            document.lineAt(0).range.start,
            document.lineAt(document.lineCount - 1).range.end
          ),
          result
        );
        vscode.window.showInformationMessage(
          `CSS sorted by alphabetical class name. Any media queries are appended at the end.`
        );
      });
    } else {
      vscode.window.showErrorMessage("Sorting only works on .css files.");
    }
  });

  context.subscriptions.push(disposable);
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = myCommandId;
  context.subscriptions.push(myStatusBarItem);

  // update status bar item once at start
  updateStatusBarItem("Idle");
}

function updateStatusBarItem(iconStatus: "Success" | "Failure" | "Idle"): void {
  if (iconStatus === "Idle") {
    myStatusBarItem.text = `$(list-flat)$(chevron-down)`;
  }
  if (iconStatus === "Success") {
    myStatusBarItem.text = `$(list-flat)$(chevron-down)$(check)`;
  }
  if (iconStatus === "Failure") {
    myStatusBarItem.text = `$(list-flat)$(chevron-down)$(close)`;
  }

  myStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}
