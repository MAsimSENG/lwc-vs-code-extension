import { jsString, apiData } from './../data';
import * as assert from 'assert';
import * as utilFunction from '../../apiRefactorUtil';

describe('extract apis',()=>{
    it('returns all the appopriate api values',()=>{
        const result = utilFunction.extractApis(jsString);
		expect(result).toStrictEqual(apiData);

    });
    it('returns no api values when the api value is commented out',()=>{
		const result = utilFunction.extractApis('//@api helloWorld;');
        expect(result).toStrictEqual([]);
    });
});

