export const jsString = `import { LightningElement, api, track } from 'lwc';

export default class Parent extends LightningElement {
    @api simple;
    @api singleType : String; 
    @api doubleType : string | undefined; 
    @api tripleType : string | arr | undefined; 
    @api simplewithDefault = 'hi';
    @api simpleWithNumberDefault = 5; 
    @api simpleWithArrDefault = []; 
    @api simpleWithArrFilled = [1,3];
    @api optional ? : string; 
    @api optionalWithDefault ?:string = 'hello'; 
}`;


export const apiData = [
    {
      defaultValue: undefined,
      name: 'simple',
      type: undefined,
    },
    {
      defaultValue: undefined,
      name: 'singleType',
      type: ': String',
    },
    {
      defaultValue: undefined,
      name: 'doubleType',
      type: ': string | undefined',
    },
    {
      defaultValue: undefined,
      name: 'tripleType',
      type: ': string | arr | undefined',
    },
    {
      defaultValue: "= 'hi'",
      name: 'simplewithDefault',
      type: undefined,
    },
    {
      defaultValue: '= 5',
      name: 'simpleWithNumberDefault',
      type: undefined,
    },
    {
      defaultValue: '= []',
      name: 'simpleWithArrDefault',
      type: undefined,
    },
    {
      defaultValue: '= [1,3]',
      name: 'simpleWithArrFilled',
      type: undefined,
    },
    {
      defaultValue: undefined,
      name: 'optional',
      type: '? : string',
    },
    {
      defaultValue: " = 'hello'",
      name: 'optionalWithDefault',
      type: '?:string',
    },
  ];
  