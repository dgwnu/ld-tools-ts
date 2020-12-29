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
  'LIMIT 10'
].join('\n');

console.log('---- Test class NodeSparql ----');
const sparqlClient = new SparqlClient({
  host: 'dbpedia.org',
  port: 80,
  path: '/sparql',
  nameSpaces: [
    { prefix: 'rdf', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
    { prefix: 'rdfs', uri: 'http://www.w3.org/2000/01/rdf-schema#' },
    { prefix: 'owl', uri: 'http://www.w3.org/2002/07/owl#' }
  ]
});

sparqlClient.query(queryStatements).subscribe(
  data => console.log('nodeSparql.query - data', data),
  error => console.log('nodeSparql.query - error', error),
  () => console.log('nodeSparql.query - complete')
);
