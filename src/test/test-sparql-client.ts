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
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

 /**
  * DGWNU Package Imports
  */
import { SparqlClient } from '../lib/sparql-client';


console.log('---- Test class NodeSparql ----');
const sparqlClient = new SparqlClient({
  host: 'dbpedia.org',
  port: 80,
  path: '/sparql'
});

/*
const sparqlQuery = [
  'PREFIX dbo: <http://dbpedia.org/ontology/>',
  'SELECT ?subject',
  'WHERE {',
  '  ?subject a owl:FunctionalProperty .',
  '}',
  'LIMIT 10'
].join('\n');
*/

const sparqlQuery00 = readFileSync(join(__dirname, 'test-sparql-client-00.rq'), 'utf-8');

sparqlClient.queryViaGet(sparqlQuery00).subscribe(
  data => console.log('nodeSparql.query - data', console.log(inspect(data, false, 5, true))),
  error => console.log('nodeSparql.query - error', error),
  () => console.log('nodeSparql.query - complete')
);

