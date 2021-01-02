'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var http = require('http');
var rxjs = require('rxjs');
var rdflibTs = require('rdflib-ts');

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
var SparqlClient = /** @class */ (function () {
    /**
     * Sparql Client Constructor
     * @param clientArgs Default Sparql Client Parameters for all Requests
     */
    function SparqlClient(defaultClientArgs) {
        this.defaultClientArgs = defaultClientArgs;
    }
    /**
     * Query via GET @see <https://www.w3.org/TR/sparql11-protocol/#query-via-get>
     * @param query Sparql query
     * @param defaultGraphUri Default Graph Uri (optional)
     * @param namedGraphUri Named Graph Uri (optional)
     * @param reqArgs Endpoint server args (required of no default client args specified)
     */
    SparqlClient.prototype.queryViaGet = function (query, defaultGraphUri, namedGraphUri, reqArgs) {
        var _this = this;
        return new rxjs.Observable(function (observer) {
            // Build request args
            var buildReqArgs = {};
            if (reqArgs) {
                buildReqArgs = reqArgs;
            }
            else if (_this.defaultClientArgs) {
                buildReqArgs = _this.defaultClientArgs;
            }
            if (buildReqArgs.host) {
                // Build query via get request path
                var viaGetReqPath = '?query=' + encodeURIComponent(query);
                if (buildReqArgs.path) {
                    viaGetReqPath = buildReqArgs.path + viaGetReqPath;
                }
                if (defaultGraphUri) {
                    viaGetReqPath += '&default-graph-uri=' + encodeURIComponent(defaultGraphUri);
                }
                if (namedGraphUri) {
                    viaGetReqPath += '&named-graph-uri=' + encodeURIComponent(namedGraphUri);
                }
                console.log("viaGetReqPath = " + viaGetReqPath);
                // Set namespace prefixes for IRI-values
                addQueryNameSpaces(query);
                // Define via get request query
                var queryViaGetReq = new http.ClientRequest({
                    host: buildReqArgs.host,
                    port: buildReqArgs.port,
                    path: viaGetReqPath,
                    headers: { 'Accept': 'application/json' },
                    method: 'GET'
                }, function (response) {
                    // Log Response Header info
                    console.log('SparqlClient > query > response.headers: ', response.headers);
                    if (response.statusCode)
                        console.log('res.statusCode', response.statusCode);
                    if (response.statusMessage)
                        console.log('res.statusMessage', response.statusMessage);
                    // on each data next chunk from stream
                    response.on('data', function (chunk) {
                        observer.next(getQueryResultRows(chunk));
                    });
                    // on end complete stream
                    response.on('end', function () {
                        observer.complete();
                    });
                });
                // Query via get request error event handler
                queryViaGetReq.on('error', function (error) {
                    observer.error({ name: error.name, message: error.message, stack: error.stack });
                });
                // Execute query via get request
                queryViaGetReq.end();
            }
            else {
                observer.error('Sparql client is not specified (!reqArgs && !this.baseArgs)');
            }
        });
    };
    return SparqlClient;
}());
/**
 * Return query result variale binding values as Query Result Rows (with IRI-values)
 * @param chunk Chunk of data to read the result variable bindings
 */
function getQueryResultRows(chunk) {
    var data = JSON.parse(chunk);
    var resultRows = [];
    var varObjs = data.head.vars;
    // Loop through result rows
    for (var rowIndex in data.results.bindings) {
        var resultRowData = data.results.bindings[rowIndex];
        var bindings = [];
        // Loop through binded variables
        for (var varIndex in varObjs) {
            var varName = varObjs[varIndex];
            var varValueStr = String(resultRowData[varName].value);
            // Add Variable Binding Value
            bindings.push({
                varName: varName,
                varValue: new rdflibTs.IRI(varValueStr)
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
function addQueryNameSpaces(query) {
    var prefixLines = query.split('\n').filter(function (queryLine) { return queryLine.trim().toLowerCase().startsWith('prefix'); });
    for (var _i = 0, prefixLines_1 = prefixLines; _i < prefixLines_1.length; _i++) {
        var prefixLine = prefixLines_1[_i];
        var nsPrefix = prefixLine.split(' ')[1].split(':')[0].trim();
        var nsValue = prefixLine.split('<')[1].split('>')[0];
        rdflibTs.NamespaceManagerInstance.registerNamespace(nsPrefix, nsValue);
    }
}

exports.SparqlClient = SparqlClient;
