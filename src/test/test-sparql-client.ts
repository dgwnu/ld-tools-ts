/**
 * Test TypeScript SparqlClient Class
 * 
 * @file test-sparql-client.ts
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 */

/**
 * NODE Package Imports
 */
import { inspect } from 'util';

 /**
  * DGWNU Package Imports
  */
import { SparqlClient } from '../lib/sparql-client';

/*
const queryStatements = [
  'SELECT ?subject ?predicate ?object',
  'WHERE {',
  '  ?subject ?predicate ?object .',
  '}',
  'LIMIT 10'
].join('\n');
*/

const queryStatements = [
  'SELECT ?subject',
  'WHERE {',
  '  ?subject a owl:FunctionalProperty .',
  '}',
  'LIMIT 10'
].join('\n');

console.log('---- Test class NodeSparql ----');
const sparqlClient = new SparqlClient({
  host: 'dbpedia.org',
  port: 80,
  path: '/sparql'
});

sparqlClient.queryViaGet(queryStatements).subscribe(
  data => console.log('nodeSparql.query - data', console.log(inspect(data, false, 5, true))),
  error => console.log('nodeSparql.query - error', error),
  () => console.log('nodeSparql.query - complete')
);

