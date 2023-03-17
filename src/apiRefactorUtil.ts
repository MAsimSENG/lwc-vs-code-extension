import { globalApiRegex, apiRegex } from './apiRefactor/constants';
export function extractApis(javascriptFileContent:string){
	let apiNames :{name:string,type:string,defaultValue:string}[] = [];
	let apiDeclarationMatches = javascriptFileContent.match(globalApiRegex);
    if(apiDeclarationMatches){
		for (const match of apiDeclarationMatches) {
			let matches = match.match(apiRegex);
			if(matches){
				const [, name,type,, defaultValue] = matches;
				apiNames.push({ name,type, defaultValue });
			}
		  }  
	}
	return apiNames;
  }


  export function extractChildComponents(htmlString:string) {
	const componentRegex = /<[a-z]+(_[a-z]+)*(-[a-z]+)+/g;	
	return 	htmlString.match(componentRegex)?.map((name)=> name.slice(1,name.length));
}

export function extractNamespace(htmlString:string) {
	const componentRegex = /[a-z]+(_[a-z]+)*/g;	
	return 	htmlString.match(componentRegex)?.[0];
}

export function extractComponentName(htmlString:string) {
	const componentRegex = /(-[a-z]+)+/g;	
	return 	htmlString.match(componentRegex)?.[0];
}
export function getPathsToChildComponents(parentDirectoryForAllComponents:string,childComponentNames: string[]){
	return childComponentNames.map((childComponentName)=>{
		//c-child commerce_builder-child commerce-child commerce-quack-chid 
		if(childComponentName.startsWith("c-")){
			let componentName = childComponentName.slice(2,childComponentName.length);
			return parentDirectoryForAllComponents + "/" + componentName;
		}
		else{
			const nameSpace =  extractNamespace(childComponentName);
			const componentName = extractComponentName(childComponentName);
			return parentDirectoryForAllComponents + "/" + nameSpace + "/" + componentName?.slice(1,componentName.length);
		}
	});
}