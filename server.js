var express = require('express');
var express_graphql = require('express-graphql');
var {
  buildSchema
} = require('graphql');
var path = require('path');

// GraphQL schema
var schema = buildSchema(`
    type Query {
      hello: String
      restaurant(id: Int!): Restaurant
      restaurants(type: String, stars: Int): [Restaurant]
    },
    type Restaurant {
      id: Int
      name: String
      type: String
      stars: Int
    }
`);

var restaurantData = [
  {
    id: 1,
    name: 'Le Bernardin',
    type: 'French',
    stars: 3,
  },
  {
    id: 2,
    name: 'Masa',
    type: 'Japanese',
    stars: 3,
  },
  {
    id: 3,
    name: 'Aquavit',
    type: 'European',
    stars: 2,
  },
  {
    id: 4,
    name: 'Gabriel Kreuther',
    type: 'French',
    stars: 2,
  },
  {
    id: 5,
    name: 'Babbo',
    type: 'Italian',
    stars: 1,
  },
  {
    id: 6,
    name: 'Bouley at Home',
    type: 'American',
    stars: 1,
  },
  {
    id: 7,
    name: 'Hirohisa',
    type: 'Japanese',
    stars: 1,
  },
  {
    id: 8,
    name: 'Junoon',
    type: 'Indian',
    stars: 1,
  }
]

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (args) => {
    var id = args.id;
    return restaurantData.filter(restaurant => {
      return restaurant.id == id;
    })[0];
  },
  restaurants: (args) => {
    var result = restaurantData;
    if (args.type) {
      result = result.filter(restaurant => restaurant.type === args.type);
    }
    if (args.stars) {
      result = result.filter(restaurant => restaurant.stars === args.stars);
    }
    return result;
  }
};

// Create an express server and a GraphQL endpoint
var app = express();

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.use(express.static('public'))

app.listen(4000, () => console.log(
  'Serving localhost:4000/ for web, /graphql for GraphQL API endpoint.'));
