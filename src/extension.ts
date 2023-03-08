// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createUpdatedJsFileContents, getCommonPath, readLWCComponent, writeToJsFile } from './util';
import { extractApis, extractChildComponents, getPathsToChildComponents } from './apiRefactorUtil';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('lwcrefactor.helloWorld', () => {
		let editor = vscode.window.activeTextEditor;
		if(editor){

			let [commonPathForAllComponents,pathToCurrentComponentFolder,nameofCurrentComponent]= getCommonPath(editor.document.uri.fsPath);
			vscode.window.showInformationMessage(nameofCurrentComponent as string);

			const [htmlFileContents, jsFileContents,jsFilePath,htmlFilePath] = readLWCComponent(pathToCurrentComponentFolder as string,nameofCurrentComponent as string);
			const namesOfAllChildComponents = extractChildComponents(htmlFileContents);
			if(namesOfAllChildComponents){
				let pathsToAllChildComponents = getPathsToChildComponents(commonPathForAllComponents as string,namesOfAllChildComponents );
			}

			const apiNames = extractApis(jsFileContents);
			
			let panel = vscode.window.createWebviewPanel("random","LWC Refactor",vscode.ViewColumn.One,
				{enableScripts:true}
			 );
			 panel.webview.html = getWebViewHtml(apiNames);

			 panel.webview.onDidReceiveMessage((message: {apiNames:{oldName:string,newName:string}[]})=>{
				const updatedJsFile = createUpdatedJsFileContents(jsFileContents,message.apiNames);
				if(pathToCurrentComponentFolder.endsWith(".html")){
					pathToCurrentComponentFolder = pathToCurrentComponentFolder.replace(".html",".js");
				}
				writeToJsFile(jsFilePath,updatedJsFile);
			 },undefined,context.subscriptions);
			
		}
		
	});

	context.subscriptions.push(disposable);
}

function getWebViewHtml(apiNames:{name:string, defaultValue:string}[]){
	let apiNamesList = apiNames.reduce((totalString,name)=>{
		return totalString += `<input placeholder=${name.name} onblur="handleBlur(event)" type="text" id=${name.name}> <br>`;
	},'');
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
	</head>
	<body>
	${apiNamesList}
	<button type="button" onclick="handleSubmit()">Submit </button>
	<script>
		const vscode = acquireVsCodeApi();

		let arrayOfApiNames = [];
		let allInputs = document.getElementsByTagName("input");
		for(let input of allInputs){
			arrayOfApiNames.push({oldName:input.id,newName:input.id});
		};
		function handleBlur(event){
			const oldApiName = event.target.id; 
			const newApiName = event.target.value; 
			const index = arrayOfApiNames.findIndex(apiName => apiName.oldName === oldApiName)
			arrayOfApiNames[index] = {oldName:oldApiName,newName:newApiName};
			vscode.postMessage({
				apiNames: [...arrayOfApiNames],
			});			
		}

		function handleSubmit(){
			vscode.postMessage({
				apiNames: [...arrayOfApiNames],
			});
		}
	</script>
	</body>
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}






  
  

