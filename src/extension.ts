// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createUpdatedJsFileContents, getCommonPath, readLWCComponent, writeToJsFile, createUpdatedHtmlFileContents} from './util';
import { extractApis, extractChildComponents, getPathsToChildComponents } from './apiRefactorUtil';
import { write } from 'fs';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('lwcrefactor.LWCREFACTOR', () => {
		let editor = vscode.window.activeTextEditor;
		if(editor){
			let [commonPathForAllComponents,pathToCurrentComponentFolder,nameofCurrentComponent]= getCommonPath(editor.document.uri.fsPath);
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
			 panel.webview.onDidReceiveMessage((message: {apiNames:{oldName:string,newName:string,type:string}[]})=>{
				const updatedApiNameTypeValue = message.apiNames.map((name)=>{
					const indexInApiNames = apiNames.findIndex((originalApiName)=>originalApiName.name === name.oldName);
					return {name:name.newName,oldName:name.oldName,type:apiNames[indexInApiNames].type,defaultValue:apiNames[indexInApiNames].defaultValue};
				});
				const updatedJsFile = createUpdatedJsFileContents(jsFileContents,updatedApiNameTypeValue);
				const updateHtmlFile = createUpdatedHtmlFileContents(htmlFileContents,message.apiNames);

				const updatedApiNames = message.apiNames.map((name)=>{
					return {name:name.newName, defaultValue:''};
				});				
				panel.webview.html = getWebViewHtml(updatedApiNames);
				writeToJsFile(jsFilePath,updatedJsFile);
				writeToJsFile(htmlFilePath,updateHtmlFile);
				panel.dispose();
			 },undefined,context.subscriptions);
			
		}
		
	});

	context.subscriptions.push(disposable);
}

function getWebViewHtml(apiNames:{name:string,defaultValue:string}[]){
	let apiNamesList = apiNames.reduce((totalString,name)=>{
		return totalString += `<span> @api ${name.name}</span>` + `<input placeholder=${name.name} onblur="handleBlur(event)" type="text" id=${name.name}> <br> <br> `;
	},'');
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
	<style>
	body{
		background-color: powderblue;
		display:grid;
	}
	</style>
	</head>
	<body>
	<h2>Bismillah </h2>
	<h3>Bulk rename your api properties and have them changed in your html too! </h3> 
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
			const newNameValue = event.target.value;
			if(newNameValue){
				const newApiName = newNameValue; 
				const index = arrayOfApiNames.findIndex(apiName => apiName.oldName === oldApiName)
				arrayOfApiNames[index] = {oldName:oldApiName,newName:newApiName};			
			}
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






  
  

