/**
 * @file test-sparql-client.ts
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 * Test SparqJs using typescript node-ts
 * 
 * @see <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
 *
 */


import { SparqlClient } from '../lib/sparql-client';

const queryStatements = [
  'SELECT ?subject ?predicate ?object',
  'WHERE {',
  '  ?subject ?predicate ?object .',
  '}',
  'LIMIT 100'
];

console.log('---- Test class NodeSparql ----');
const sparqlClient = new SparqlClient({
  host: 'local',
  port: 3030,
  path: '/fooddata',
  nameSpaces: [
    { prefix: 'rdf', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
    { prefix: 'rdfs', uri: 'http://www.w3.org/2000/01/rdf-schema#' },
    { prefix: 'owl', uri: 'http://www.w3.org/2002/07/owl#' }
  ]
});

sparqlClient.query(queryStatements).subscribe(
  data => console.log('nodeSparql.getRequest - data', data),
  error => console.log('nodeSparql.getRequest - error', error),
  () => console.log('nodeSparql.getRequest - complete')
);
