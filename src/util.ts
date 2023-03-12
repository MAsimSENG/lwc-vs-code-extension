import * as vscode from 'vscode';
import { apiNames } from './types';

const fs = require('fs');


export function getCommonPath(currentFilePath:string){
	const path = currentFilePath.split('/');
	const lwcFolderPath = path.slice(0,path.length-2); 
    const componentFolderLocation = path.slice(0,path.length-1);
	return [(lwcFolderPath.join('/')),(componentFolderLocation.join('/')),(path[path.length-2])];
}

export function readLWCComponent(pathOfCurrentComponent:string, nameofCurrentComponent:string): string[]{
    const jsFilePath = pathOfCurrentComponent +'/' + nameofCurrentComponent +'.js';
    const htmlFilePath = pathOfCurrentComponent +'/' + nameofCurrentComponent + '.html';
    const jsFileContents =  fs.readFileSync(jsFilePath).toString();	
    const htmlFileContents =  fs.readFileSync(htmlFilePath).toString();	
    return [htmlFileContents,jsFileContents,jsFilePath,htmlFilePath];
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
    const apiRegex = new RegExp(/@api\s+([\w]+)\s*(\s*:\s*[\w]+(\s*\|\s*[\w]+\s*)*)?(\s*\=\s*.+)?;/g);
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