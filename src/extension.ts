// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { debuglog } from 'util';

function getRuleId(uri: vscode.Uri): string
{
	let uri_str = uri.toString()

	if (uri_str.indexOf('rule.yml') >= 0) {
		let paths: string[] = uri_str.split("/")
		// vscode.window.showInformationMessage(paths[paths.length - 2])
		return paths[paths.length - 2]
	}
	else if(uri_str.indexOf('bash/shared.sh') >= 0 ||
			uri_str.indexOf('ansible/shared.yml') >= 0 ||
			uri_str.indexOf('anaconda/shared.anaconda') >= 0 ||
			uri_str.indexOf('puppet/shared.pp') >= 0){
		let paths: string[] = uri_str.split("/");
		// vscode.window.showInformationMessage(paths[paths.length - 3]);
		return paths[paths.length - 3];
	}
	// no rule was found with current opened file
	return "";
}

function anacondaAvailable(): boolean {
	return false;

	// menu part
	// TODO: enable presence of menu only when content is available
	// {
	// 	"command": "extension.openAnaconda",
	// 	"when": "anacondaAvailable"
	// },

	// let editor = vscode.window.activeTextEditor;

	// if (editor) {
	// 	let document = editor.document;
	// 	let uri = document.uri.toString()
	// 	if (uri.indexOf('anaconda/shared.anaconda') >= 0)
	// 	{
	// 		let paths: string[] = uri.split("/")
	// 		vscode.window.showInformationMessage(paths[paths.length - 3])
	// 		return paths[paths.length - 3];
	// 	}
	// }
}

export function openContent(location: string) {
	// Get the active text editor
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let document = editor.document;
		let selection = editor.selection;

		let word : string;

		// Try to fetch rule id
		word = getRuleId(document.uri)
		// Get the word within the selection
		if(word == "")
		{
			word = document.getText(document.getWordRangeAtPosition(selection.active));
		}
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
					let index_full_prefix = word.indexOf('xccdf_org.ssgproject.content_rule_');
					let index_short_prefix = word.indexOf('content_rule_');
					let word_1 = word;
					if(index_full_prefix == 0)
					{
						word_1 = word_1.slice('xccdf_org.ssgproject.content_rule_'.length)
					}
					else if(index_short_prefix == 0)
					{
						word_1 = word_1.slice('content_rule_'.length)
					}

					vscode.workspace.findFiles('**/' + word_1 + "/" + location).then(uries => {
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
		let word = getRuleId(fileUri);
		if (word != "") {
			vscode.window.showInformationMessage("Rule ID copied to Clipboard: " + word)
			vscode.env.clipboard.writeText(word)
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
