const elasticsearch = require('elasticsearch');

export default function (server) {

  const config = server.config();
  const client = new elasticsearch.Client({ host: config.get('elasticsearch.url') });

  console.log("My discover is ready to go !");

  server.route({
    path: '/api/my_discover/list',
    method: 'GET',
    handler(req, reply) {
      //client.indices.get({ human:true }, function (err,response) {
      client.indices.stats({ human:true }, function (err,response) {
        reply(response);
      });      
    }
  });
  
  server.route({
    path: '/api/my_discover/index/{name}/{from}',
    method: 'GET',
    handler(req, reply) {

      client.search({
        index: req.params.name,
        from: req.params.from,
        size: 20
      }, function (err,response) {
        reply(response);
      });
    }
  });

  // This API used to do a SEARCH with a query string
  server.route({
    path: '/api/my_discover/index/{name}/{query}/{from}',
    method: 'GET',
    handler(req, reply) {

      client.search({
        index: req.params.name,
        q: req.params.query,
        from: req.params.from,
        size: 20
      }, function (err,response) {
        reply(response);
      });
    }
  });

  // This API used to do update a hit
  server.route({
    path: '/api/my_discover/index/{name}/{type}/{id}/{doc}',
    method: 'POST',
    async handler(req, reply) {
      let doc = JSON.parse(req.params.doc)
      await client.update({
        index: req.params.name,
        type: req.params.type,
        id: req.params.id,
        body: {
          doc: doc
        },
        refresh: true
      }, function (err,response) {
        reply(response);
      });
    }
  });
}
