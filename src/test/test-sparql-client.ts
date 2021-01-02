/**
 * Test TypeScript SparqlClient Class
 * 
 * @file test-sparql-client.ts
 *
 * @author Onno Haldar <onno@plan-k.nl>
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

sparqlClient.queryViaGet(queryStatements).subscribe(
  data => console.log('nodeSparql.query - data', logData(data)),
  error => console.log('nodeSparql.query - error', error),
  () => console.log('nodeSparql.query - complete')
);

function logData(data: any) {
  const vars = data.head.vars;
  for (const i in data.results.bindings) {
    const b = data.results.bindings[i];
    console.log("\nrow "+i+" :");
    for (const j in vars) {
        const v = vars[j];
        console.log(v+"="+b[v].value);
    }
  }
}
