// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { debuglog } from 'util';

export function openContent(location: string) {
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(document.getWordRangeAtPosition(selection.start));
			vscode.workspace.findFiles('**/'+word+"/"+location).then(uries => {
				if(uries.length > 0) {
					uries.forEach(element => {
						let doc = vscode.workspace.openTextDocument(element);
						vscode.window.showTextDocument(element, { preview: false });
						return;
					});
				} else {
					vscode.window.showInformationMessage("Unable to open content: "+word, "Is it a templated content?");
					debuglog("Couldn't find any content with location: "+word+"/"+location);
				}
			});
		}

}

export function activate(context: vscode.ExtensionContext) {
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let open_rule_command = vscode.commands.registerCommand('extension.openRule', () => {
		openContent("rule.yml");
	});
	let open_oval_command = vscode.commands.registerCommand('extension.openOVAL', () => {
		openContent("oval/shared.xml");
	});
	let open_bash_command = vscode.commands.registerCommand('extension.openBash', () => {
		openContent("bash/shared.sh");
	});
	let open_ansible_command = vscode.commands.registerCommand('extension.openAnsible', () => {
		openContent("ansible/shared.yml");
	});

	context.subscriptions.push(open_rule_command);
	context.subscriptions.push(open_oval_command);
	context.subscriptions.push(open_bash_command);
	context.subscriptions.push(open_ansible_command);
}

// this method is called when your extension is deactivated
export function deactivate() {}
