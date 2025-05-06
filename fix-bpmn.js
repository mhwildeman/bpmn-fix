import BpmnModdle from 'bpmn-moddle';
import uuidV4 from 'uuid-v4';
import xml2js from 'xml2js';


export async function fixIDs(xmlStr) {
  let moddle = new BpmnModdle();
  let xml = await moddle.fromXML(xmlStr);

  let inOutComing = {};

  let definitions = xml.rootElement;

  let elements = await xml.rootElement.rootElements[0].flowElements;
  elements.forEach(element => {
    if (typeof element.id === 'undefined') {
      element.set('id', 'step' + uuidV4())
    }
    if (element['$type'] == 'bpmn:SequenceFlow') {
      if (element.targetRef) {
        inOutComing[element.targetRef.id] = inOutComing[element.targetRef.id] || {};
        inOutComing[element.targetRef.id].incoming = inOutComing[element.targetRef.id].incoming || [];
        inOutComing[element.targetRef.id].incoming.push(element.id);
      }

      if (element.sourceRef) {
        inOutComing[element.sourceRef.id] = inOutComing[element.sourceRef.id] || {};
        inOutComing[element.sourceRef.id].outgoing = inOutComing[element.sourceRef.id].outgoing || [];
        inOutComing[element.sourceRef.id].outgoing.push(element.id);
      }

      if(!element.targetRef || !element.sourceRef){
        throw new Error("No valid SequenceFlowß");
      }

      if (element.sourceRef.$type === 'bpmn:ExclusiveGateway' && typeof element.name == 'undefined'){
        element.set('name', String(element.id).replaceAll('_',' '));
      }

    }
    else {
      if (element.$type !== 'bpmn:ExclusiveGateway' && typeof element.name === 'undefined') {
        element.set('name', String(element.id).replaceAll('_',' '));
      }
      if (element.$type === 'bpmn:ExclusiveGateway')
      {
        element.set('name', '')
      }
      
      //Apperantly the name tag is used for business logic (in stead of id tag that should be used for these purposes)
      //element.set('name', String(element.name).replaceAll('_',' '));
      
    }
  });

  // xmlStrUpdated contains new id and the added process
  const {
    xml: updatedXML
  } = await moddle.toXML(definitions);

  var parser = new xml2js.Parser();
  let result = await parser.parseStringPromise(updatedXML);
  if (typeof result.definitions !== 'undefined') {
    Object.getOwnPropertyNames(result.definitions.process[0]).forEach(key => {
      switch (key) {
        case '$':
        case 'sequenceFlow':
          break;
        default:
          result.definitions.process[0][key].forEach(node => {
            if (inOutComing[node['$'].id]) {

              if (inOutComing[node['$'].id].outgoing) {
                node.outgoing = [];
                inOutComing[node['$'].id].outgoing.forEach(item => {
                  node.outgoing.push(item);
                })
              }
              if (inOutComing[node['$'].id].incoming) {
                node.incoming = [];
                inOutComing[node['$'].id].incoming.forEach(item => {
                  node.incoming.push(item);
                })
              }
            }
          });
      }
    })
  }
  else {
    Object.getOwnPropertyNames(result['bpmn:definitions']['bpmn:process'][0]).forEach(key => {
      switch (key) {
        case '$':
        case 'bpmn:sequenceFlow':
        case 'bpmn:extensionElements':
          break;
        default:
          result['bpmn:definitions']['bpmn:process'][0][key].forEach(node => {
            if (inOutComing[node['$'].id]) {
              if (inOutComing[node['$'].id].outgoing) {
                node['bpmn:outgoing'] = [];
                inOutComing[node['$'].id].outgoing.forEach(item => {
                  node['bpmn:outgoing'].push(item);
                })
              }
              if (inOutComing[node['$'].id].incoming) {
                node['bpmn:incoming'] = [];
                inOutComing[node['$'].id].incoming.forEach(item => {
                  node['bpmn:incoming'].push(item);
                })
              }
            }
          });
      }
    })
  }


  var builder = new xml2js.Builder();
  var resultingXML = builder.buildObject(result);

  return resultingXML
}