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

interface RequestResp {
    rowNr: number;
    values: {
        varName: string;
        varUri: string;
    }[];
};

export class SparqlClient {

    /**
     * Sparql Client Constructor
     * @param clientArgs Sparql Client Parameters for all Requests
     */
    constructor(private clientArgs?: RequestArgs) {

    }

    /**
     * Query via GET @see <https://www.w3.org/TR/sparql11-protocol/#query-via-get>
     * @param query 
     * @param reqArgs 
     */
    getQuery(
        query: string, 
        defaultGraphUri?: URL,
        namedGraphUri?: URL,
        reqArgs?: RequestArgs) 
    {
        return new Observable<RequestResp[]>(observer => {

            if (!reqArgs && this.clientArgs) {
                reqArgs = this.clientArgs;
            } else {
                observer.error('Sparql client is not specified (!reqArgs && !this.baseArgs)');
            }

            const clientReqArgs: ClientRequestArgs = {
                host: 'localhost',
                port: 3030,
                path: '/fooddata',
                headers: {
                  'Accept': 'application/json',
                }
            };
            
            let reqResps: RequestResp[] = [];
            reqResps.push({ rowNr: 0, values: [{ varName: 'subject', varUri: 'test-uri' }] });

            observer.next(reqResps);
            observer.complete();
        });
    }

}