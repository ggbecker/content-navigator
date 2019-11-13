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
		let word = document.getText(document.getWordRangeAtPosition(selection.active));
		vscode.workspace.findFiles('**/' + word + "/" + location).then(uries => {
			if (uries.length > 0) {
				uries.forEach(element => {
					vscode.window.showInformationMessage("Resource: " + location + " found", word);
					let doc = vscode.workspace.openTextDocument(element);
					vscode.window.showTextDocument(element, { preview: false });
					return;
				});
			} else {
				vscode.window.showInformationMessage("Unable to open content: " + word + ". Using clipboard content to find resource");
				debuglog("Couldn't find any content with location: " + word + "/" + location);

				vscode.env.clipboard.readText().then((word) => {
					vscode.workspace.findFiles('**/' + word + "/" + location).then(uries => {
						if (uries.length > 0) {
							uries.forEach(element => {
								vscode.window.showInformationMessage("Resource: " + location + " found using clipboard content", word);
								let doc = vscode.workspace.openTextDocument(element);
								vscode.window.showTextDocument(element, { preview: false });
								return;
							});
						} else {
							vscode.window.showInformationMessage("Unable to open requested content: " + word + ". Is it a templated content?");
							debuglog("Couldn't find any content with location: " + word + "/" + location);
						}
					})
				});
			}
		});
	}

}

export function activate(context: vscode.ExtensionContext) {
	let open_rule_command = vscode.commands.registerCommand('extension.openRule', () => {
		return openContent("rule.yml");
	});
	let open_oval_command = vscode.commands.registerCommand('extension.openOVAL', () => {
		return openContent("oval/shared.xml");
	});
	let open_bash_command = vscode.commands.registerCommand('extension.openBash', () => {
		return openContent("bash/shared.sh");
	});
	let open_ansible_command = vscode.commands.registerCommand('extension.openAnsible', () => {
		return openContent("ansible/shared.yml");
	});
	let open_anaconda_command = vscode.commands.registerCommand('extension.openAnaconda', () => {
		return openContent("anaconda/shared.anaconda");
	});
	let open_puppet_command = vscode.commands.registerCommand('extension.openPuppet', () => {
		return openContent("puppet/shared.pp");
	});

	let copy_rule_id_command = vscode.commands.registerCommand('extension.copyRuleId', async (fileUri) => {
		if (fileUri.toString().indexOf('rule.yml') >= 0) {
			let paths: string[] = fileUri.toString().split("/")
			vscode.window.showInformationMessage("Rule ID copied to Clipboard: " + paths[paths.length - 2])
			vscode.env.clipboard.writeText(paths[paths.length - 2])
		}

	});

	context.subscriptions.push(open_rule_command);
	context.subscriptions.push(open_oval_command);
	context.subscriptions.push(open_bash_command);
	context.subscriptions.push(open_ansible_command);
	context.subscriptions.push(open_anaconda_command);
	context.subscriptions.push(open_puppet_command);
	context.subscriptions.push(copy_rule_id_command);

	let completionList: vscode.CompletionItem[] = [];

	vscode.workspace.findFiles('**/rule.yml').then(uries => {
		uries.forEach(element => {
			let paths: string[] = element.toString().split("/")
			// let item: vscode.CompletionItem;
			// item = new vscode.CompletionItem(paths[paths.length - 2]);
			// vscode.workspace.openTextDocument(element).then(text => {
			// 	item.documentation = new vscode.MarkdownString(text.getText())
			// });
			// item.documentation = new vscode.MarkdownString("Hello world")
			// completionList.push(item);
			completionList.push(new vscode.CompletionItem(paths[paths.length - 2]));
		});
	});

	let provider1 = vscode.languages.registerCompletionItemProvider({pattern: '**/*.profile'}, {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return completionList;
		}
	});

	context.subscriptions.push(provider1);
}

// this method is called when your extension is deactivated
export function deactivate() { }
