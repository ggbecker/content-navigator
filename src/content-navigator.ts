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
			uri_str.indexOf('kubernetes/shared.yml') >= 0 ||
			uri_str.indexOf('puppet/shared.pp') >= 0){
		let paths: string[] = uri_str.split("/");
		// returns the rule id
		return paths[paths.length - 3];
	} else if (uri_str.indexOf('.var') >= 0){
		let paths: string[] = uri_str.split("/")
		// returns something like var_variable_1 without the .var extension
		return paths[paths.length - 1].split(".")[0]
	} else if (uri_str.indexOf('.profile') >= 0){
		let paths: string[] = uri_str.split("/")
		// returns something like rhel8/profiles/stig.profile
		return paths[paths.length - 3]+"/"+paths[paths.length - 2]+"/"+paths[paths.length - 1]
	}
	// no rule was found with current opened file
	return "";
}

function _getRuleIdFromString(path: string): string
{
	let uri = vscode.Uri.file(path);
	return _getRuleId(uri);
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

async function __openFile(file : string) : Promise<boolean> {

	let uries = await vscode.workspace.findFiles('**/' + file);
	if(uries.length > 0)
	{
		let doc = vscode.workspace.openTextDocument(uries[0]);
		let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
		vscode.window.showTextDocument(uries[0], { preview: false, selection: range });
		return true;
	}
	return false
}

export async function openVariableFile(built_content: boolean) {
	// Get the active text editor

	let selectedText: string;
	let product;

	const config = vscode.workspace.getConfiguration('content-navigator')

	if(built_content)
		product = getProduct();

	// content from clipboard
	if(config.get('useClipboard'))
	{
		// content from clipboard
		selectedText = await vscode.env.clipboard.readText();

		var re = /\:/gi;
		selectedText = selectedText.replace(re, "").toLowerCase() // remove any colon character from the clipboard content

		let variable_id_from_clipboard = _getRuleIdFromString(selectedText);
		if(variable_id_from_clipboard != "") {
			selectedText = variable_id_from_clipboard
		}

		var accepted_chars = /^[a-zA-Z0-9-_\.]+$/;
		if (accepted_chars.test(selectedText)) {
			// sometimes huge amount of nonsense text can be in the clipboard so lets reduce the scope here with length < 120
			if(selectedText.length > 0 && selectedText.length < 120)
			{
				if(built_content){
					if(await openBuiltFile(selectedText, "variable", product as any)){
						return;
					}
				} else {
					if(await __openFile(selectedText + ".var")){
						return;
					}
				}
			}
		} else {
		vscode.window.showInformationMessage("Ignoring clipboard input as it contains invalid data.");
		}
	}

	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let document = editor.document;
		let selection = editor.selection;

		// rule id from current opened file
		selectedText = _getRuleId(document.uri);
		if(selectedText != "")
		{
			if(built_content){
				if(await openBuiltFile(selectedText, "variable", product as any)){
					return;
				}
			} else {
				if(await __openFile(selectedText + ".var")){
					return;
				}
			}
		}

		// selected word
		selectedText = document.getText(document.getWordRangeAtPosition(selection.active, RegExp("(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)")));
		if(selectedText.length > 0 && selectedText.length < 120)
		{
			if(built_content){
				if(await openBuiltFile(selectedText, "variable", product as any)){
					return;
				}
			} else {
				if(await __openFile(selectedText + ".var")){
					return;
				}
			}
		}
	}

	vscode.window.showInformationMessage("Could not find any variable file with the input provided");
}


async function openBuiltFile(rule_id : string, location : string, product : string) : Promise<boolean> {
	let uries;

	if(location == "rule.yml") {
		uries = await vscode.workspace.findFiles('build/' + product + '/rules/' + rule_id + ".yml");
	}
	else if(location == 'oval/shared.xml') {
		uries = await vscode.workspace.findFiles('build/' + product + '/checks/oval/' + rule_id + ".xml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/checks_from_templates/oval/' + rule_id + ".xml");
		}
	}
	else if(location == 'bash/shared.sh') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/bash/' + rule_id + ".sh");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/bash/' + rule_id + ".sh");
		}
	}
	else if(location == 'ansible/shared.yml') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/ansible/' + rule_id + ".yml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/ansible/' + rule_id + ".yml");
		}
	}
	else if(location == 'ignition/shared.yml') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/ignition/' + rule_id + ".yml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/ignition/' + rule_id + ".yml");
		}
	}
	else if(location == 'anaconda/shared.anaconda') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/anaconda/' + rule_id + ".anaconda");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/anaconda/' + rule_id + ".anaconda");
		}
	}
	else if(location == 'kubernetes/shared.yml') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/kubernetes/' + rule_id + ".yml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/kubernetes/' + rule_id + ".yml");
		}
	}
	else if(location == 'puppet/shared.pp') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/puppet/' + rule_id + ".pp");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/puppet/' + rule_id + ".pp");
		}
	}
	else if(location == 'blueprint/shared.toml') {
		uries = await vscode.workspace.findFiles('build/' + product + '/fixes/blueprint/' + rule_id + ".toml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/fixes_from_templates/blueprint/' + rule_id + ".toml");
		}
	}
	else if(location == 'variable') {
		uries = await vscode.workspace.findFiles('build/' + product + '/values/' + rule_id + ".yml");
		if(uries.length == 0) {
			uries = await vscode.workspace.findFiles('build/' + product + '/values/' + rule_id + ".toml");
		}
	}
	else if(location == 'profile') {
		uries = await vscode.workspace.findFiles('build/' + rule_id);
	}
	else {
		uries = await vscode.workspace.findFiles('build/' + product + '/rules/' + rule_id + ".yml");
	}

	if(uries.length > 0)
	{
		let doc = vscode.workspace.openTextDocument(uries[0]);
		let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
		vscode.window.showTextDocument(uries[0], { preview: getPreviewProperty(), selection: range });
		return true;
	}
	return false
}

function getProduct() {
	const config = vscode.workspace.getConfiguration('content-navigator')
	if(config.get('openBuiltContent.showListOfProducts'))
	{
		let products = [
			"alinux2",
			"alinux3",
			"chromium",
			"debian9",
			"debian10",
			"debian11",
			"eks",
			"fedora",
			"firefox",
			"fuse6",
			"jre",
			"macos1015",
			"ocp4",
			"ol7",
			"ol8",
			"ol9",
			"opensuse",
			"rhcos4",
			"rhel7",
			"rhel8",
			"rhel9",
			"rhosp10",
			"rhosp13",
			"rhv4",
			"sle12",
			"sle15",
			"ubuntu1604",
			"ubuntu1804",
			"ubuntu2004",
			"uos20",
			"vsel"
		]
		return vscode.window.showQuickPick(products, { placeHolder: 'Select the product for the built content you would like to display'});
	}
	else
	{
		// get product name
		return config.get('testSuite.productName')
	}
}

export async function openContent(location: string, built_content: boolean) {
	// Get the active text editor

	let rule_id: string;
	let product;

	const config = vscode.workspace.getConfiguration('content-navigator')

	if(built_content)
		product = await getProduct();

	// content from clipboard
	if(config.get('useClipboard'))
	{
		rule_id = await vscode.env.clipboard.readText();

		var re = /\:/gi;
		rule_id = rule_id.replace(re, "").toLowerCase() // remove any colon character from the clipboard content

		let rule_id_from_clipboard = _getRuleIdFromString(rule_id);
		if(rule_id_from_clipboard != "") {
			rule_id = rule_id_from_clipboard
		}

		var accepted_chars = /^[a-zA-Z0-9-_\.]+$/;
		if (accepted_chars.test(rule_id)) {

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
				if(built_content){
					if(await openBuiltFile(rule_id, location, product as any)){
						return;
					}
				} else {
					if(await openFile(rule_id, location,)){
						return;
					}
				}
			}
		} else {
			vscode.window.showInformationMessage("Ignoring clipboard input as it contains invalid data.");
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
			if(built_content){
				if(await openBuiltFile(rule_id, location, product as any)){
					return;
				}
			} else {
				if(await openFile(rule_id, location)){
					return;
				}
			}
		}

		// selected word
		rule_id = document.getText(document.getWordRangeAtPosition(selection.active, RegExp("(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)")));
		if(rule_id.length > 0 && rule_id.length < 120)
		{
			if(built_content){
				if(await openBuiltFile(rule_id, location, product as any)){
					return;
				}
			} else {
				if(await openFile(rule_id, location)){
					return;
				}
			}
		}
	}

	vscode.window.showInformationMessage("Could not find any matching file with following pattern: " + location + "");
}

export function activate(context: vscode.ExtensionContext) {
	let open_rule_command = vscode.commands.registerCommand('content-navigator.openRule', () => {
		return openContent("rule.yml", false);
	});
	let open_oval_command = vscode.commands.registerCommand('content-navigator.openOVAL', () => {
		return openContent("oval/shared.xml", false);
	});
	let open_bash_command = vscode.commands.registerCommand('content-navigator.openBash', () => {
		return openContent("bash/shared.sh", false);
	});
	let open_ansible_command = vscode.commands.registerCommand('content-navigator.openAnsible', () => {
		return openContent("ansible/shared.yml", false);
	});
	let open_ignition_command = vscode.commands.registerCommand('content-navigator.openIgnition', () => {
		return openContent("ignition/shared.yml", false);
	});
	let open_anaconda_command = vscode.commands.registerCommand('content-navigator.openAnaconda', () => {
		return openContent("anaconda/shared.anaconda", false);
	});
	let open_puppet_command = vscode.commands.registerCommand('content-navigator.openPuppet', () => {
		return openContent("puppet/shared.pp", false);
	});
	let open_kubernetes_command = vscode.commands.registerCommand('content-navigator.openKubernetes', () => {
		return openContent("kubernetes/shared.yml", false);
	});
	let open_blueprint_command = vscode.commands.registerCommand('content-navigator.openBlueprint', () => {
		return openContent("blueprint/shared.yml", false);
	});

	let open_variable_command = vscode.commands.registerCommand('content-navigator.openVariable', () => {
		return openVariableFile(false);
	});


	let open_built_rule_command = vscode.commands.registerCommand('content-navigator.openBuiltRule', () => {
		return openContent("rule.yml", true);
	});
	let open_built_oval_command = vscode.commands.registerCommand('content-navigator.openBuiltOVAL', () => {
		return openContent("oval/shared.xml", true);
	});
	let open_built_bash_command = vscode.commands.registerCommand('content-navigator.openBuiltBash', () => {
		return openContent("bash/shared.sh", true);
	});
	let open_built_ansible_command = vscode.commands.registerCommand('content-navigator.openBuiltAnsible', () => {
		return openContent("ansible/shared.yml", true);
	});
	let open_built_ignition_command = vscode.commands.registerCommand('content-navigator.openBuiltIgnition', () => {
		return openContent("ignition/shared.yml", true);
	});
	let open_built_anaconda_command = vscode.commands.registerCommand('content-navigator.openBuiltAnaconda', () => {
		return openContent("anaconda/shared.anaconda", true);
	});
	let open_built_puppet_command = vscode.commands.registerCommand('content-navigator.openBuiltPuppet', () => {
		return openContent("puppet/shared.pp", true);
	});
	let open_built_kubernetes_command = vscode.commands.registerCommand('content-navigator.openBuiltKubernetes', () => {
		return openContent("kubernetes/shared.yml", true);
	});
	let open_built_blueprint_command = vscode.commands.registerCommand('content-navigator.openBuiltBlueprint', () => {
		return openContent("blueprint/shared.toml", true);
	});

	let open_built_variable_command = vscode.commands.registerCommand('content-navigator.openBuiltVariable', () => {
		return openVariableFile(true);
	});

	let open_built_profile_command = vscode.commands.registerCommand('content-navigator.openBuiltProfile', () => {
		return openContent("profile", true);
	});

	let copy_content_id_command = vscode.commands.registerCommand('content-navigator.copyContentId', async (fileUri) => {
		let uri = fileUri
		if(uri == null) {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				uri = editor.document.uri;
			}
		}
		if(uri != null) {
			let word = _getRuleId(uri);
			if (word != "") {
				let uri_str = uri.toString()
				if(uri_str.indexOf('.var') >= 0){
					vscode.window.showInformationMessage("Variable ID copied to Clipboard: " + word)
				} else {
					vscode.window.showInformationMessage("Rule ID copied to Clipboard: " + word)
				}
				vscode.env.clipboard.writeText(word)
			}
			else{
				let word = _getProfileId(uri);
				if (word != "") {
					vscode.window.showInformationMessage("Profile ID copied to Clipboard: " + word)
					vscode.env.clipboard.writeText(word)
				}
			}
		}
		
	});

	let copy_full_prefixed_content_id_command = vscode.commands.registerCommand('content-navigator.copyPrefixedContentId', async (fileUri) => {
		let uri = fileUri
		if(uri == null) {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				uri = editor.document.uri;
			}
		}
		if(uri != null) {
			let word = _getRuleId(uri);
			if (word != "") {
				let uri_str = uri.toString()
				if(uri_str.indexOf('.var') >= 0){
					vscode.window.showInformationMessage("Variable ID copied to Clipboard: xccdf_org.ssgproject.content_value_" + word)
					vscode.env.clipboard.writeText("xccdf_org.ssgproject.content_value_" + word)
				} else {
					vscode.window.showInformationMessage("Rule ID copied to Clipboard: xccdf_org.ssgproject.content_rule_" + word)
					vscode.env.clipboard.writeText("xccdf_org.ssgproject.content_rule_" + word)
				}
			}
			else{
				let word = _getProfileId(uri);
				if (word != "") {
					vscode.window.showInformationMessage("Profile ID copied to Clipboard: xccdf_org.ssgproject.content_profile_" + word)
					vscode.env.clipboard.writeText("xccdf_org.ssgproject.content_profile_" + word)
				}
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
	context.subscriptions.push(open_blueprint_command);
	context.subscriptions.push(open_variable_command);
	context.subscriptions.push(open_built_rule_command);
	context.subscriptions.push(open_built_oval_command);
	context.subscriptions.push(open_built_bash_command);
	context.subscriptions.push(open_built_ansible_command);
	context.subscriptions.push(open_built_ignition_command);
	context.subscriptions.push(open_built_anaconda_command);
	context.subscriptions.push(open_built_puppet_command);
	context.subscriptions.push(open_built_kubernetes_command);
	context.subscriptions.push(open_built_blueprint_command);
	context.subscriptions.push(open_built_variable_command);
	context.subscriptions.push(open_built_profile_command);
	context.subscriptions.push(copy_content_id_command);
	context.subscriptions.push(copy_full_prefixed_content_id_command);
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

	let provider2 = vscode.languages.registerCompletionItemProvider({pattern: '**/controls/*'}, {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return completionList;
		}
	});

	context.subscriptions.push(provider1);
	context.subscriptions.push(provider2);
}

// this method is called when your extension is deactivated
export function deactivate() { }
