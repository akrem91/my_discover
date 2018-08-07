import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'angular-ui-bootstrap';
import 'ui/autoload/styles';
import './less/style.less';
import index from './templates/index.html';
import list from './templates/list.html';


uiRoutes.enable();

uiRoutes
.when('/', {
  template: index,
  controller: 'indicesView',
  controllerAs: 'ctrl'
})
.when('/index/:name', {
  template: list,
  controller: 'listOfHits',
  controllerAs: 'ctrl_hits'
});

uiModules

.get('app/my_discover',['ui.bootstrap'])

.controller('indicesView', function ($http) {
  $http.get('../api/my_discover/list').then((response) => {
    this.indices = Object.keys(response.data.indices);    
  });
})

.controller('listOfHits', function($routeParams, $http) {

  // Initialize our page
  this.from = 0;
  // Get index name
  this.index = $routeParams.name;
  // Get the first 20 hits
  $http.get(`../api/my_discover/index/${this.index}/${this.from}`).then((response) => {
    this.data = response.data.hits.hits;
    this.hitsCount = response.data.hits.total;
    this.convertObjectToString();
  });

  // Search with a query string. For example: q: 'title:test'
  this.search = function () {
    console.log("Query -> ", this.query);
    console.log("Query type -> ", typeof this.query);
    let type = typeof this.query;
    // Check if the query is valid (not empty query)
    if(type === "string"){
      // Initialize our page size = 20
      this.from = 0;
      // Verify length of the query in case, the user did a filter and later he remove the filter
      if(this.query.length > 0){
        $http.get(`../api/my_discover/index/${this.index}/${this.query}/${this.from}`).then((response) => {
          if(response.data.hits.hits != 'undefined'){
            this.data = response.data.hits.hits;
            this.hitsCount = response.data.hits.total;
            this.convertObjectToString();
          }else{
            alert("Filter undefined !")
          }        
        });
      }else{
        this.refresh();
      }      
    }else{
      console.log("Query undefined !")
    }    
  }
  // Refresh list of hits
  this.refresh = function () {
    // Initialize our page to 0 (start from 0)
    this.from = 0;
    // Empty the filter
    this.query = "";
    // Get the first 20 hits
    $http.get(`../api/my_discover/index/${this.index}/${this.from}`).then((response) => {
      this.data = response.data.hits.hits;
      this.hitsCount = response.data.hits.total;
      this.convertObjectToString();
    });
  }
  this.edit = function (val) {
    // Return a hit (object: _id, _index, _score, _source(dataModel), _type)
    let doc = JSON.stringify(val._source);
    $http.post(`../api/my_discover/index/${this.index}/${val._type}/${val._id}/${doc}`).then((response) => {
      if(response.status === 200){
        alert("Modification done !");
      }
    });
  }
  // Get the previous 20 hits 
  this.previous = function () {
    if(this.from <= 20){
      this.from = 0;
    }else{
      this.from = this.from - 20;
    }
    this.searchWithQuery(this.from);
  }
  // Get the next 20 hits
  this.next = function () {
    this.from = this.from + 20;
    this.searchWithQuery(this.from);
  }

  // This function convert an object to string before displaying values in Textarea
  this.convertObjectToString = function () {
    // Convert object to string of each hit 
    angular.forEach(this.data, function(row, indice){  
      angular.forEach(row._source, function(value, key){
        if(typeof row._source[key] !== "string")
           row._source[key] = JSON.stringify(row._source[key]);
      });
    });
  }
  //Return documents matching a query
  this.searchWithQuery = function (from) {
    let type = typeof this.query;
    if(type === "string"){
      // Search with query
      $http.get(`../api/my_discover/index/${this.index}/${this.query}/${from}`).then((response) => {
        this.data = response.data.hits.hits;
        this.hitsCount = response.data.hits.total;
        this.convertObjectToString();
      });
    }else{
      $http.get(`../api/my_discover/index/${this.index}/${from}`).then((response) => {
        this.data = response.data.hits.hits;
        this.hitsCount = response.data.hits.total;
        this.convertObjectToString();
      });    
    }    
  }
  
});


