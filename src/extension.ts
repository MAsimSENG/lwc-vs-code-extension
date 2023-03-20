import * as vscode from 'vscode';
import { createUpdatedJsFileContents, getCommonPath, writeToJsFile, createUpdatedHtmlFileContents, getUriOfCurrentComponentFolder, getNameOfCurrentComponent, getLWCScriptFileUri, readLWCScriptFile, getLWCHTMLFileUri, readLWCHTMLFile} from './util';
import { extractApis } from './apiRefactorUtil';
export function activate(context: vscode.ExtensionContext) {
		let disposable = vscode.commands.registerCommand('lwcrefactor.LWCREFACTOR', () => {
		let editor = vscode.window.activeTextEditor;
		if(editor){
			if(!editor.document.uri.fsPath.endsWith('.ts') && !editor.document.uri.fsPath.endsWith('.js') ){
				vscode.window.showErrorMessage('Please run the extension from your components js or ts file.');
				return;
			}
			const isTsFile = editor.document.uri.fsPath.endsWith('.ts');
			const currentFilePath = editor.document.uri.fsPath; 
			let commonPathForAllComponents= getCommonPath(currentFilePath);
			let pathToCurrentComponentFolder = getUriOfCurrentComponentFolder(currentFilePath);
			let nameofCurrentComponent = getNameOfCurrentComponent(currentFilePath);

			const jsFilePath = getLWCScriptFileUri(pathToCurrentComponentFolder,nameofCurrentComponent,isTsFile);
			const jsFileContents = readLWCScriptFile(jsFilePath);
			const htmlFilePath = getLWCHTMLFileUri(pathToCurrentComponentFolder,nameofCurrentComponent);
			const htmlFileContents = readLWCHTMLFile(htmlFilePath);

			const apiNames = extractApis(jsFileContents);			
			let panel = vscode.window.createWebviewPanel("random","LWC Refactor",vscode.ViewColumn.One,
				{enableScripts:true}
			 );
			 panel.webview.html = getWebViewHtml(apiNames);
			 panel.webview.onDidReceiveMessage((message: {apiNames:{oldName:string,newName:string,type:string}[]})=>{
				console.log('Received message:', message);

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






  
  

