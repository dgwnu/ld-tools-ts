/**
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 * SparQL Client Class
 * 
 * @see based on:
 *      Example <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
 *      W3C-standard <https://www.w3.org/TR/sparql11-protocol/#query-operation>
 *
 */

/**
 * Node Package Imports
 */
import { ClientRequest, ClientRequestArgs } from 'http';
import { Observable } from 'rxjs';
import { IRI, NamespaceManagerInstance } from 'rdflib-ts'; 

interface RequestArgs {
    host: string;
    port?: number;
    path?: string;
};

/**
 * Data Bindings of a Query Result
 */
interface VariableBinding {
    varName: string;
    varValue: IRI;
}

interface QueryResultRow {
    rowNr: number;
    bindings: VariableBinding[];
}

export class SparqlClient {

    /**
     * Sparql Client Constructor
     * @param clientArgs Default Sparql Client Parameters for all Requests
     */
    constructor(private defaultClientArgs?: RequestArgs) { }

    /**
     * Query via GET @see <https://www.w3.org/TR/sparql11-protocol/#query-via-get>
     * @param query Sparql query
     * @param defaultGraphUri Default Graph Uri (optional) 
     * @param namedGraphUri Named Graph Uri (optional)
     * @param reqArgs Endpoint server args (required of no default client args specified)
     */
    queryViaGet(
        query: string,
        defaultGraphUri?: string,
        namedGraphUri?: string,
        reqArgs?: RequestArgs) {
        return new Observable<QueryResultRow[]>(observer => {
            // Build request args
            let buildReqArgs: ClientRequestArgs = {};

            if (reqArgs) {
                buildReqArgs = reqArgs;
            } else if (this.defaultClientArgs) {
                buildReqArgs = this.defaultClientArgs;
            }

            if (buildReqArgs.host) {
                // Build query via get request path
                let viaGetReqPath = '?query=' + encodeURIComponent(query);

                if (buildReqArgs.path) {
                    viaGetReqPath = buildReqArgs.path + viaGetReqPath;
                }

                if (defaultGraphUri) {
                    viaGetReqPath += '&default-graph-uri=' + encodeURIComponent(defaultGraphUri);
                }

                if (namedGraphUri) {
                    viaGetReqPath += '&named-graph-uri=' + encodeURIComponent(namedGraphUri);
                }

                console.log(`viaGetReqPath = ${viaGetReqPath}`);

                // Set namespace prefixes for IRI-values
                addQueryNameSpaces(query);

                // Define via get request query
                const queryViaGetReq = new ClientRequest({
                    host: buildReqArgs.host,
                    port: buildReqArgs.port,
                    path: viaGetReqPath,
                    headers: { 'Accept': 'application/json' },
                    method: 'GET'
                }, response => {
                    // Log Response Header info
                    console.log('SparqlClient > query > response.headers: ', response.headers);
                    if (response.statusCode) console.log('res.statusCode', response.statusCode);
                    if (response.statusMessage) console.log('res.statusMessage', response.statusMessage);

                    // on each data next chunk from stream
                    response.on('data', (chunk: string) => {
                        observer.next(getQueryResultRows(chunk));
                    });

                    // on end complete stream
                    response.on('end', () => {
                        observer.complete();
                    });

                });

                // Query via get request error event handler
                queryViaGetReq.on('error', error => {
                    observer.error({ name: error.name, message: error.message, stack: error.stack });
                });

                // Execute query via get request
                queryViaGetReq.end();
            } else {
                observer.error('Sparql client is not specified (!reqArgs && !this.baseArgs)');
            }

        });
    }

}

/**
 * Return query result variale binding values as Query Result Rows (with IRI-values)
 * @param chunk Chunk of data to read the result variable bindings 
 */
function getQueryResultRows(chunk: string) {
    const data = JSON.parse(chunk);
    let resultRows: QueryResultRow[] = []; 
    const varObjs = data.head.vars;

    // Loop through result rows
    for (const rowIndex in data.results.bindings) {
      const resultRowData = data.results.bindings[rowIndex];
      let bindings: VariableBinding[] = [];

      // Loop through binded variables
      for (const varIndex in varObjs) {
          const varName = varObjs[varIndex];
          const varValueStr = String(resultRowData[varName].value);

          // Add Variable Binding Value
          bindings.push({
              varName: varName,
              varValue: new IRI(varValueStr)
          });
      }

      // Add Query Result Row
      resultRows.push({
          rowNr: Number(rowIndex),
          bindings: bindings
      });
    }

    return resultRows;
}


/**
 * Add namesspaces that are used in Query to default Namespaces for new IRI's
 * @param query SparQl Query
 */
function addQueryNameSpaces(query: string) {
    const prefixLines = query.split('\n').filter(queryLine => queryLine.toLowerCase().startsWith('prefix'));

    for (const prefixLine of prefixLines) {
        const nsPrefix = prefixLine.split(' ')[1].split(':')[0].trim();
        const nsValue = prefixLine.split('<')[1].split('>')[0];
        NamespaceManagerInstance.registerNamespace(nsPrefix, nsValue);
    }

}