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

import { ClientRequest, ClientRequestArgs } from 'http';
import { Observable } from 'rxjs';

interface RequestArgs {
    host: string;
    port?: number;
    path?: string; 
    nameSpaces?: {
        prefix: string;
        uri: string;
    }[];
};

interface QueryResult {
    rowNr: number;
    values: {
        varName: string;
        varUri: string;
    }[];
};

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
    query(
        query: string, 
        defaultGraphUri?: string,
        namedGraphUri?: string,
        reqArgs?: RequestArgs) 
    {
        return new Observable<any>(observer => {

            // Check and set request args
            if (!reqArgs && this.defaultClientArgs) {
                reqArgs = this.defaultClientArgs;
            } else {
                observer.error('Sparql client is not specified (!reqArgs && !this.baseArgs)');
            }

            // Build query via get request
            let viaGetReqPath = reqArgs.path + '?query=' + encodeURIComponent(query);

            if (defaultGraphUri) {
                viaGetReqPath += '&default-graph-uri=' + encodeURIComponent(defaultGraphUri);
            }

            if (namedGraphUri) {
                viaGetReqPath += '&named-graph-uri=' + encodeURIComponent(namedGraphUri);
            }

            console.log(`viaGetReqPath = ${viaGetReqPath}`);

            const queryViaGetReq = new ClientRequest({
                host: reqArgs.host,
                port: reqArgs.port,
                path: viaGetReqPath,
                headers: { 'Accept': 'application/json' },
                method: 'GET'
            }, response => {
                // Log Response Header info
                console.log('SparqlClient > query > response.headers: ', response.headers);
                if (response.statusCode) console.log('res.statusCode', response.statusCode);
                if (response.statusMessage) console.log('res.statusMessage', response.statusMessage);

                // Parse and convert Data
                let data = '';

                // Parse on each data chunk event
                response.on('data', (chunk: string) => {
                    data += chunk;
                });

                // Convert to JSON after last data chunk event
                response.on('end', () => {
                    observer.next(JSON.parse(data));
                    observer.complete();
                });


            });

            // Query via get request error event handler
            queryViaGetReq.on('error', error => {
                observer.error({ name: error.name, message: error.message, stack: error.stack });    
            });

            // Execute query via get request
            queryViaGetReq.end();

        });
    }

}