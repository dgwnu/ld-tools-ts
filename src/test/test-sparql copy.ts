/**
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 * Test SparqJs using typescript node-ts
 * 
 * @see <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
 *
 */

import { ClientRequest, ClientRequestArgs } from 'http';
import { NodeSparql } from '../lib/node-sparql';

const queryStatements = [
  'SELECT ?subject ?predicate ?object',
  'WHERE {',
  '  ?subject ?predicate ?object .',
  '}',
  'LIMIT 100'
];

console.log('---- Test class NodeSparql ----');
const nodeSparql = new NodeSparql({
  host: 'local',
  port: 3030,
  path: '/fooddata',
  nameSpaces: [
    { prefix: 'rdf', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
    { prefix: 'rdfs', uri: 'http://www.w3.org/2000/01/rdf-schema#' },
    { prefix: 'owl', uri: 'http://www.w3.org/2002/07/owl#' }
  ]
});

nodeSparql.getRequest(queryStatements).subscribe(
  data => console.log('nodeSparql.getRequest - data', data),
  error => console.log('nodeSparql.getRequest - error', error),
  () => console.log('nodeSparql.getRequest - complete')
);


interface SparQlRequest {
  nameSpaces: string[];
  queryStatements: string[];
}

console.log('------------- test-sparql.ts -----------------');

/**
 * Test SparQL-statement
 */
const sparQlRq: SparQlRequest = {
  nameSpaces: [
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'PREFIX owl: <http://www.w3.org/2002/07/owl#>'
  ],
  queryStatements: queryStatements
};
const sparqlQuery = sparQlRq.nameSpaces.join('\n') + sparQlRq.queryStatements.join('\n');

const clientReqArgs: ClientRequestArgs = {
  host: 'localhost',
  port: 3030,
  path: '/fooddata',
  headers: {
    'Accept': 'application/json',
  }
};

const clientReq = new ClientRequest({
  host: clientReqArgs.host,
  port: clientReqArgs.port,
  path: clientReqArgs.path + '/sparql?query=' + encodeURIComponent(sparqlQuery),
  headers: clientReqArgs.headers,
  method: 'GET'
}, res => {
  console.log('res.headers', res.headers);
  if (res.statusCode) console.log('res.statusCode', res.statusCode);
  if (res.statusMessage) console.log('res.statusMessage', res.statusMessage);

  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    const json_res = JSON.parse(data);
    const vars = json_res.head.vars;
    for (const i in json_res.results.bindings) {
      const b = json_res.results.bindings[i];
      console.log("\nrow "+i+" :");
      for (const j in vars) {
          const v = vars[j];
          console.log(v+"="+b[v].value);
      }
    }    
  });

});

clientReq.on('error', error => {
  console.log('error.name', error.name);
  console.log('error.message', error.message);
});

clientReq.end();

/*
see <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
var http = require('http');

var query_string = "PREFIX omv: <http://omv.ontoware.org/2005/05/ontology#>\n" +
"SELECT ?ont ?name ?acr " +
"WHERE { " +
"	?ont a omv:Ontology .  " +
"	?ont omv:acronym ?acr ." +
"	?ont omv:name ?name . " +
" }";
var apikey =  "Your API KEY!";

var options = {
  host: 'sparql.bioontology.org',
  port: 8080,
  path: '/sparql?query=' +encodeURIComponent(query_string) + "&apikey=" + encodeURIComponent(apikey),
  headers: {
      'Accept': 'application/json',
  },
  method: 'GET'
};

var req = http.request(options, function(res) {
  
  console.log("Got response: " + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  
  var data = "";

  res.on('data', function (chunk) {
    data += chunk; 
  });

  res.on('end', function () {
        var json_res = JSON.parse(data);
        var vars = json_res.head.vars;
        for (i in json_res.results.bindings) {
            var b = json_res.results.bindings[i];
            console.log("\nrow "+i+" :");
            for (j in vars) {
                var v = vars[j];
                console.log(v+"="+b[v].value);
            }
        }
    });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
req.end();
*/