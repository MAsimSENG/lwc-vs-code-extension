import { globalApiRegex } from './apiRefactor/constants';
import * as vscode from 'vscode';
import { apiNames } from './types';

const fs = require('fs');



export function getNameOfCurrentComponent(currentFilePath:string){
    // currentFilePath : /Users/muhammadasimali/Workspace/lwcbasics3/lwcp3/force-app/main/default/lwc/parent/parent.js
    const path = currentFilePath.split('/');
    return path[path.length-2]; 
}

export function getUriOfCurrentComponentFolder(currentFilePath:string){
    // currentFilePath : /Users/muhammadasimali/Workspace/lwcbasics3/lwcp3/force-app/main/default/lwc/parent/parent.js
    const path = currentFilePath.split('/');
    return path.slice(0,path.length-1).join('/');

}
export function getCommonPath(currentFilePath:string){
    // currentFilePath : /Users/muhammadasimali/Workspace/lwcbasics3/lwcp3/force-app/main/default/lwc/parent/parent.js
	const path = currentFilePath.split('/');
    return path.slice(0,path.length-2).join('/'); 
}

export function getLWCScriptFileUri(pathOfCurrentComponent:string, nameofCurrentComponent:string,isTsFile:boolean):string { 
    const ecmaScriptExtension = isTsFile ? '.ts' : '.js';
    const scriptFilePath = pathOfCurrentComponent +'/' + nameofCurrentComponent + ecmaScriptExtension;
    return scriptFilePath; 
}

export function readLWCScriptFile(scriptFilePath:string){
    const jsFileContents =  fs.readFileSync(scriptFilePath).toString();	
    return jsFileContents;

}
export function getLWCHTMLFileUri(pathOfCurrentComponent:string, nameofCurrentComponent:string){
    const htmlFilePath = pathOfCurrentComponent +'/' + nameofCurrentComponent + '.html';
    return htmlFilePath; 
}

export function readLWCHTMLFile(htmlFilePath:string): string{
    const htmlFileContents =  fs.readFileSync(htmlFilePath).toString();	
    return htmlFileContents;
}

    
export function writeToJsFile(filePath:string,content:string):void{
    fs.writeFile(filePath, content, (err:any) => {
        if (err){
            vscode.window.showErrorMessage(err);
        }
        else {
            vscode.window.showInformationMessage("succesfully written to" + filePath);
            }
      });
}


export function createUpdatedJsFileContents(jsFileContents:string,updatedApiNames:apiNames){
    function replacer(api:string, name:string, type :string | undefined,equalSign : string | undefined, defaultValue : string | undefined,offset:number, string:string){
        const indexInApiNames =  updatedApiNames.findIndex(oldName => oldName.oldName === name);
        const nameObject = updatedApiNames[indexInApiNames];
        return `@api ${nameObject.name}${nameObject.type || ''}${nameObject.defaultValue || ''};`;
    }    
    const apiRegex = new RegExp(globalApiRegex);
    let updatedJsFileWithApi =  jsFileContents.replaceAll(apiRegex,replacer);
    updatedApiNames.forEach((apiName)=>{
        updatedJsFileWithApi = updatedJsFileWithApi.replace(`this.${apiName.oldName}`,`this.${apiName.name}`);
    });
     return updatedJsFileWithApi;
}

    
export function createUpdatedHtmlFileContents(htmlFileContents:string,updatedApiNames:apiNames){
    updatedApiNames.forEach((apiName)=>{
        htmlFileContents = htmlFileContents.replace(`${apiName.oldName}`,`${apiName.newName}`);
    });
    return htmlFileContents;
}