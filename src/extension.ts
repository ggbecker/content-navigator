// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function getRuleId(uri: vscode.Uri): string
{
	let uri_str = uri.toString()

	if (uri_str.indexOf('rule.yml') >= 0) {
		let paths: string[] = uri_str.split("/")
		return paths[paths.length - 2]
	}
	else if(uri_str.indexOf('bash/shared.sh') >= 0 ||
			uri_str.indexOf('ansible/shared.yml') >= 0 ||
			uri_str.indexOf('anaconda/shared.anaconda') >= 0 ||
			uri_str.indexOf('puppet/shared.pp') >= 0){
		let paths: string[] = uri_str.split("/");
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

async function openFile(rule_id : string, location : string) : Promise<boolean> {
	let uries = await vscode.workspace.findFiles('**/' + rule_id + "/" + location)
	if(uries.length > 0)
	{
		vscode.window.showInformationMessage("Resource: " + location + " found", rule_id);
		let doc = vscode.workspace.openTextDocument(uries[0]);
		vscode.window.showTextDocument(uries[0], { preview: false });
		return true;
	}
	return false
}

export async function openContent(location: string) {
	// Get the active text editor
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let document = editor.document;
		let selection = editor.selection;

		let rule_id: string;

		// content from clipboard
		rule_id = await vscode.env.clipboard.readText();
		if(rule_id.length > 0)
		{
			let index_full_prefix = rule_id.indexOf('xccdf_org.ssgproject.content_rule_');
			let index_short_prefix = rule_id.indexOf('content_rule_');
			if(index_full_prefix == 0)
			{
				rule_id = rule_id.slice('xccdf_org.ssgproject.content_rule_'.length)
			}
			else if(index_short_prefix == 0)
			{
				rule_id = rule_id.slice('content_rule_'.length)
			}
			if(await openFile(rule_id, location)){
				return;
			}
		}

		// rule id from current opened file
		rule_id = getRuleId(document.uri);
		if(rule_id != "")
		{
			if(await openFile(rule_id, location)){
				return;
			}
		}

		// selected word
		rule_id = document.getText(document.getWordRangeAtPosition(selection.active));
		if(rule_id != "")
		{
			if(await openFile(rule_id, location)){
				return;
			}
		}
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
		if(fileUri != null) {
			let word = getRuleId(fileUri);
			if (word != "") {
				vscode.window.showInformationMessage("Rule ID copied to Clipboard: " + word)
				vscode.env.clipboard.writeText(word)
			}
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
