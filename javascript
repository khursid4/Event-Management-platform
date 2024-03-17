// server.js

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/eventManagement', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define GraphQL schema
const schema = buildSchema(`
    type Event {
        id: ID!
        title: String!
        description: String
        date: String
        location: String
    }

    type Query {
        events: [Event]
        event(id: ID!): Event
    }

    type Mutation {
        createEvent(title: String!, description: String, date: String, location: String): Event
    }
`);

// Sample data
const events = [];

// Define resolvers
const root = {
    events: () => events,
    event: ({ id }) => events.find(event => event.id === id),
    createEvent: ({ title, description, date, location }) => {
        const event = { id: String(events.length + 1), title, description, date, location };
        events.push(event);
        return event;
    }
};

// Create Express server
const app = express();

// Define GraphQL route
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // Enable GraphiQL for easy testing in the browser
}));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
