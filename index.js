import { layoutProcess } from 'bpmn-auto-layout';
import { parseArgs } from 'node:util';
import fs from 'node:fs';
import { fixIDs } from './fix-bpmn.js';

if (process.argv <= 2) {
    throw Error("Please provide file name as argument.")
}

let path = process.argv[2];


try {
    const diagramXML = fs.readFileSync(path, 'utf8');
    let repairedXML = await fixIDs(diagramXML);

    repairedXML = await layoutProcess(repairedXML);
    
    console.log(repairedXML);

} catch (err) {
    console.error(err);
}

