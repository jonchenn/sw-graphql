var express = require('express');
var express_graphql = require('express-graphql');
var {
  buildSchema
} = require('graphql');
var path = require('path');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);
// Root resolver
var root = {
  message: () => 'Hello World!'
};
// Create an express server and a GraphQL endpoint
var app = express();

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(4000, () => console.log(
  'Serving localhost:4000/ for web, /graphql for GraphQL API endpoint.'));
