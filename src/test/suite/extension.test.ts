import { jsString, apiData } from './../data';
import * as assert from 'assert';
import * as utilFunction from '../../apiRefactorUtil';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('apiRefactorUtil', () => {
	test('api extraction', () => {
		const result = utilFunction.extractApis(jsString);
		assert.strictEqual(result,apiData);
	});
});
