import { ApolloServerPlugin } from 'apollo-server-plugin-base';

const sentry: ApolloServerPlugin = {
	// The requestDidStart event fires whenever Apollo Server begins fulfilling a GraphQL request
	requestDidStart(context) {
		return {
			//  didResolveSource (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#didresolvesource)

			/*  parsingDidStart (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#parsingdidstart)
                The parsingDidStart event fires whenever Apollo Server will parse a GraphQL request to create its associated document AST.

                If Apollo Server receives a request with a query string that matches a previous request, the associated document might already be available in Apollo Server's cache. In this case, parsingDidStart is not called for the request, because parsing does not occur.
            */

			/*  validationDidStart (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#validationdidstart)
                The validationDidStart event fires whenever Apollo Server will validate a request's document AST against your GraphQL schema.

                Like parsingDidStart, this event does not fire if a request's document is already available in Apollo Server's cache (only successfully validated documents are cached by Apollo Server).

                The document AST is guaranteed to be available at this stage, because parsing must succeed for validation to occur.
            */

			/*  didResolveOperation (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#didresolveoperation)
                The didResolveOperation event fires after the graphql library successfully determines the operation to execute from a request's document AST. At this stage, both the operationName string and operation AST are available.

                If the operation is anonymous (i.e., the operation is query { ... } instead of query NamedQuery { ... }), then operationName is null.
            */

			/*  responseForOperation (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#responseforoperation)
                The responseForOperation event is fired immediately before GraphQL execution would take place. If its return value resolves to a non-null GraphQLResponse, that result is used instead of executing the query. Hooks from different plugins are invoked in series, and the first non-null response is used.
            */

			/*  executionDidStart (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#executiondidstart)
                The executionDidStart event fires whenever Apollo Server begins executing the GraphQL operation specified by a request's document AST.
            */
			executionDidStart(rc) {
				console.log(rc.request.query);
				console.log('variables', rc.request.variables);
			}

			/*  didEncounterErrors (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#didencountererrors)
                The didEncounterErrors event fires when Apollo Server encounters errors while parsing, validating, or executing a GraphQL operation.
            */

			/*  willSendResponse (https://www.apollographql.com/docs/apollo-server/integrations/plugins/#willsendresponse)
                The willSendResponse event fires whenever Apollo Server is about to send a response for a GraphQL operation. This event fires (and Apollo Server sends a response) even if the GraphQL operation encounters one or more errors.
            */
		};
	}
};

export default sentry;
