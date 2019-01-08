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
      map: String
      stars: Int
    }
`);

var restaurantData = [
  {
    id: 1,
    name: 'Le Bernardin',
    type: 'French',
    stars: 3,
    map: 'https://goo.gl/maps/BoBB89qhUtH2',
  },
  {
    id: 2,
    name: 'Masa',
    type: 'Japanese',
    stars: 3,
    map: 'https://goo.gl/maps/XaQKVwjgfsR2',
  },
  {
    id: 3,
    name: 'Aquavit',
    type: 'European',
    stars: 2,
    map: 'https://goo.gl/maps/DVL1jGi5zD82',
  },
  {
    id: 4,
    name: 'Gabriel Kreuther',
    type: 'French',
    stars: 2,
    map: 'https://goo.gl/maps/RQiTLZGGSdB2',
  },
  {
    id: 5,
    name: 'Babbo',
    type: 'Italian',
    stars: 1,
    map: 'https://goo.gl/maps/TsbD8Z3WoRo',
  },
  {
    id: 6,
    name: 'Bouley at Home',
    type: 'American',
    stars: 1,
    map: 'https://goo.gl/maps/LyGNUW2gbtk',
  },
  {
    id: 7,
    name: 'Hirohisa',
    type: 'Japanese',
    stars: 1,
    map: 'https://goo.gl/maps/RpA3ahYrf9T2',
  },
  {
    id: 8,
    name: 'Junoon',
    type: 'Indian',
    stars: 1,
    map: 'https://goo.gl/maps/MCqxKiApEQS2',
  }
]

function sleep(ms){
  return new Promise(resolve => {
    setTimeout(resolve,ms)
  })
}

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (args) => {
    var id = args.id;
    return restaurantData.filter(restaurant => {
      return restaurant.id == id;
    })[0];
  },
  restaurants: async (args) => {
    var result = restaurantData;
    if (args.type) {
      result = result.filter(restaurant => restaurant.type === args.type);
    }
    if (args.stars) {
      result = result.filter(restaurant => restaurant.stars === args.stars);
    }

    // Simulated long latency of complex queries.
    await sleep(3000)

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
