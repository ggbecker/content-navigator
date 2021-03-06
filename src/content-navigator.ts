// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function getRuleId(): string
{
	let editor = vscode.window.activeTextEditor;
	if(editor) {
		return _getRuleId(editor.document.uri);
	}
	else {
		return "";
	}
}

function _getRuleId(uri: vscode.Uri): string
{
	let uri_str = uri.toString()

	if (uri_str.indexOf('rule.yml') >= 0) {
		let paths: string[] = uri_str.split("/")
		return paths[paths.length - 2]
	}
	else if(uri_str.indexOf('oval/shared.xml') >= 0 ||
			uri_str.indexOf('bash/shared.sh') >= 0 ||
			uri_str.indexOf('ansible/shared.yml') >= 0 ||
			uri_str.indexOf('ignition/shared.yml') >= 0 ||
			uri_str.indexOf('anaconda/shared.anaconda') >= 0 ||
			uri_str.indexOf('.pass.sh') >= 0 ||
			uri_str.indexOf('.fail.sh') >= 0 ||
			uri_str.indexOf('.notapplicable.sh') >= 0 ||
			uri_str.indexOf('.error.sh') >= 0 ||
			uri_str.indexOf('anaconda/shared.anaconda') >= 0 ||
			uri_str.indexOf('kubernetes/shared.yml') >= 0 ||
			uri_str.indexOf('puppet/shared.pp') >= 0){
		let paths: string[] = uri_str.split("/");
		return paths[paths.length - 3];
	}
	// no rule was found with current opened file
	return "";
}

function _getProfileId(uri: vscode.Uri): string
{
	let uri_str = uri.toString()

	if (uri_str.indexOf('.profile') >= 0) {
		let paths: string[] = uri_str.split("/")
		return paths[paths.length - 1].split(".")[0]
	}
	return "";
}

function anacondaAvailable(): boolean {
	return false;

	// menu part
	// TODO: enable presence of menu only when content is available
	// {
	// 	"command": "content-navigator.openAnaconda",
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

function getPreviewProperty() : boolean {
	const workbenchConfig = vscode.workspace.getConfiguration('workbench')
	if(workbenchConfig.has('editor.enablePreview'))
		return workbenchConfig.get('editor.enablePreview') as boolean;
	else
		return true
}

async function openFile(rule_id : string, location : string) : Promise<boolean> {
	let uries = await vscode.workspace.findFiles('**/' + rule_id + "/" + location);
	if(uries.length > 0)
	{
		// vscode.window.showInformationMessage("Resource: " + location + " found", rule_id);
		let doc = vscode.workspace.openTextDocument(uries[0]);
		let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
		vscode.window.showTextDocument(uries[0], { preview: getPreviewProperty(), selection: range });
		return true;
	}
	else
	{
		uries = await vscode.workspace.findFiles('**/' + rule_id + "/rule.yml");
		if(uries.length > 0)
		{
			let text = await vscode.workspace.openTextDocument(uries[0]);
			let i = 0;
			for (i = 0; i < text.lineCount; i++) {
				if(text.lineAt(i).text.startsWith("template:")){
					let range = new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, 0));
					vscode.window.showTextDocument(uries[0], { preview: getPreviewProperty(), selection: range })
					return true
				}
			}
		}
	}
	return false
}

export async function openContent(location: string) {
	// Get the active text editor

	let rule_id: string;

	const config = vscode.workspace.getConfiguration('content-navigator')

	// content from clipboard
	if(config.get('useClipboard'))
	{
		rule_id = await vscode.env.clipboard.readText();
		// sometimes huge amount of nonsense text can be in the clipboard so lets reduce the scope here with length < 120
		if(rule_id.length > 0 && rule_id.length < 120)
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
	}

	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let document = editor.document;
		let selection = editor.selection;

		// rule id from current opened file
		rule_id = _getRuleId(document.uri);
		if(rule_id != "")
		{
			if(await openFile(rule_id, location)){
				return;
			}
		}

		// selected word
		rule_id = document.getText(document.getWordRangeAtPosition(selection.active, RegExp("(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)")));
		if(rule_id.length > 0 && rule_id.length < 120)
		{
			if(await openFile(rule_id, location)){
				return;
			}
		}
	}

	vscode.window.showInformationMessage("Could not find any matching file with following pattern: " + location + "");
}

export function activate(context: vscode.ExtensionContext) {
	let open_rule_command = vscode.commands.registerCommand('content-navigator.openRule', () => {
		return openContent("rule.yml");
	});
	let open_oval_command = vscode.commands.registerCommand('content-navigator.openOVAL', () => {
		return openContent("oval/shared.xml");
	});
	let open_bash_command = vscode.commands.registerCommand('content-navigator.openBash', () => {
		return openContent("bash/shared.sh");
	});
	let open_ansible_command = vscode.commands.registerCommand('content-navigator.openAnsible', () => {
		return openContent("ansible/shared.yml");
	});
	let open_ignition_command = vscode.commands.registerCommand('content-navigator.openIgnition', () => {
		return openContent("ignition/shared.yml");
	});
	let open_anaconda_command = vscode.commands.registerCommand('content-navigator.openAnaconda', () => {
		return openContent("anaconda/shared.anaconda");
	});
	let open_puppet_command = vscode.commands.registerCommand('content-navigator.openPuppet', () => {
		return openContent("puppet/shared.pp");
	});
	let open_kubernetes_command = vscode.commands.registerCommand('content-navigator.openKubernetes', () => {
		return openContent("kubernetes/shared.yml");
	});

	let copy_rule_id_command = vscode.commands.registerCommand('content-navigator.copyRuleId', async (fileUri) => {
		if(fileUri != null) {
			let word = _getRuleId(fileUri);
			if (word != "") {
				vscode.window.showInformationMessage("Rule ID copied to Clipboard: " + word)
				vscode.env.clipboard.writeText(word)
			}
		}
	});

	let copy_profile_id_command = vscode.commands.registerCommand('content-navigator.copyProfileId', async (fileUri) => {
		if(fileUri != null) {
			let word = _getProfileId(fileUri);
			if (word != "") {
				vscode.window.showInformationMessage("Profile ID copied to Clipboard: " + word)
				vscode.env.clipboard.writeText(word)
			}
		}
	});

	let copy_full_prefixed_rule_id_command = vscode.commands.registerCommand('content-navigator.copyFullPrefixedRuleId', async (fileUri) => {
		if(fileUri != null) {
			let word = _getRuleId(fileUri);
			if (word != "") {
				vscode.window.showInformationMessage("Rule ID copied to Clipboard: xccdf_org.ssgproject.content_rule_" + word)
				vscode.env.clipboard.writeText("xccdf_org.ssgproject.content_rule_" + word)
			}
		}
	});

	let copy_full_prefixed_profile_id_command = vscode.commands.registerCommand('content-navigator.copyFullPrefixedProfileId', async (fileUri) => {
		if(fileUri != null) {
			let word = _getProfileId(fileUri);
			if (word != "") {
				vscode.window.showInformationMessage("Profile ID copied to Clipboard: xccdf_org.ssgproject.content_profile_" + word)
				vscode.env.clipboard.writeText("xccdf_org.ssgproject.content_profile_" + word)
			}
		}
	});

	let get_rule_id = vscode.commands.registerCommand('content-navigator.getRuleId', () => {
		return getRuleId();
	});

	context.subscriptions.push(open_rule_command);
	context.subscriptions.push(open_oval_command);
	context.subscriptions.push(open_bash_command);
	context.subscriptions.push(open_ansible_command);
	context.subscriptions.push(open_ignition_command);
	context.subscriptions.push(open_anaconda_command);
	context.subscriptions.push(open_puppet_command);
	context.subscriptions.push(open_kubernetes_command);
	context.subscriptions.push(copy_rule_id_command);
	context.subscriptions.push(copy_profile_id_command);
	context.subscriptions.push(copy_full_prefixed_rule_id_command);
	context.subscriptions.push(copy_full_prefixed_profile_id_command);
	context.subscriptions.push(get_rule_id);

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
