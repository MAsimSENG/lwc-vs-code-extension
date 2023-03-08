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
    const apiRegex = new RegExp(/@api(\s)+[a-zA-Z_]+(\w)*(\s)*;/g);
    const classDeclarationIndex = jsFileContents.indexOf('export default class');
    const classDeclarationEndIndex = jsFileContents.indexOf('{', classDeclarationIndex) + 1;
    let updatedJsFile = jsFileContents.replace(apiRegex,"");
    return updatedJsFile.substring(0,classDeclarationEndIndex) + "\n" + updatedApiNames.map(name=>`@api ${name.newName};\n`).join(" ") + updatedJsFile.substring(classDeclarationEndIndex+1);
}