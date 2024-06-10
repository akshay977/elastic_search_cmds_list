// ######## Getting nodes, clusters, shards, info #########

// get cluster health information
GET /_cluster/health

// get nodes information
GET /_cat/nodes?v

// get indices information
GET /_cat/indices?v

// get shards information
GET /_cat/shards?v

// delete index
DELETE /demo_1

// create new index
PUT /demo_index
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 2
  }  
}

//  ######## Managing documents ##########

// create new document in demo_index
POST /demo_index/_doc
{
  "name": "Dust bin",
  "price": 64,
  "in_stock": 10
}

// update the document in demo_index using ID
PUT /demo_index/_doc/100
{
  "name": "Toaster",
  "price": 49,
  "in_stock": 4
}

// Get the document using ID
GET /demo_index/_doc/100

// update the document using ID
POST /demo_index/_update/100
{
  "doc": {
    "in_stock": 3
  }
}

// update the document in an index (1st approach)
POST /demo_index/_update/100
{
  "script": {
    "source": "ctx._source.in_stock--"
  }
}

// update the document in an index (2nd approach)
POST /demo_index/_update/100
{
  "script": {
    "source": "ctx._source.in_stock = 10"
  }
}

// update the document in an index (3nd approach)
POST /demo_index/_update/100
{
  "script": {
    "source": "ctx._source.in_stock -= params.quantity",
    "params": {
      "quantity": 2
    }
  }
}

// Use triple double quote for a multi-line condition in source key

// replace document with ID 100 with new document
PUT /demo_index/_doc/100
{
  "name": "Bread Toaster",
  "price": 200
}

// delete document using ID
DELETE /demo_index/_doc/101

// delete document using _delete_by_query and similarly, there is _update_by_query
POST /demo_index/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}

// use _bulk API to create, update and delete documents in batches (or bulk)
POST /_bulk
{ "index": { "_index": "demo_index", "_id": 200 } }
{ "name": "Espresso Machine", "price": 199, "in_stock": 5 }
{ "create": { "_index": "demo_index", "_id": 201 } }
{ "name": "Milk frother", "price": 149, "in_stock": 14 }

// use _bulk API with index name in the request path
POST /demo_index/_bulk
{ "update": { "_id": 201 } }
{ "doc": { "price": 129 } }
{ "delete": { "_id": 200 } }


// ############# Mappings & Analysis ##############

POST /_analyze
{
  "text": "2 guys walk into a bar, but the third... DUCKS! :-)",
  "analyzer": "standard"
}

POST /_analyze
{
  "text": "2 guys walk into a bar, but the third... DUCKS! :-)",
  "char_filter": [],
  "tokenizer": "standard",
  "filter": ["lowercase"]
}

POST /_analyze
{
  "text": "2 guys walk into a bar, but the third... DUCKS! :-)",
  "analyzer": "keyword"
}

// Create a mapping while creating an index
PUT /dummy_reviews
{
  "mappings": {
    "properties": {
      "rating": { "type": "float" },
      "content": { "type": "text" },
      "product_id": { "type": "integer" },
      "author": {
        "properties": {
          "first_name": { "type": "text" },
          "last_name": { "type": "text" },
          "email": { "type": "keyword" }
        }
      }
    }
  }
}

// Insert test document to test mapping in dummy_reviews index
PUT /dummy_reviews/_doc/1
{
  "rating": 5.3,
  "content": "Outstanding product, I love this one !!",
  "product_id": 123,
  "author": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe123@example.com"
  }
}

// Get mapping of dummy_reviews index
GET /dummy_reviews/_mapping

// Get mapping a field (like rating) in dummy_reviews index
GET /dummy_reviews/_mapping/field/rating

// Get mapping of nested field in dummy reviews index
GET /dummy_reviews/_mapping/field/author.email

// Add a new field with mapping in dummy_reviews index
PUT /dummy_reviews/_mapping
{
  "properties": {
    "created_at": {
      "type": "date"
    }
  }
}

// Get the mapping of all fields in dummy_review index
GET /dummy_reviews/_mapping

// Dates in elasticsearch

// Specifying only date without time
PUT /dummy_reviews/_doc/1
{
  "rating": 4.5,
  "content": "Not bad, Not bad at all",
  "product_id": 123,
  "created_at": "2015-03-27",
  "author": {
    "first_name": "Average",
    "last_name": "Joe",
    "email": "avgjoe@gmail.com"
  }
}

// Specifying date with time in UTC format
PUT /dummy_reviews/_doc/2
{
  "rating": 4.5,
  "content": "Not bad, Not bad at all",
  "product_id": 123,
  "created_at": "2015-04-15T13:07:41Z",
  "author": {
    "first_name": "Average",
    "last_name": "Joe",
    "email": "avgjoe@gmail.com"
  }
}

// Specifying date with time and offset from UTC format
PUT /dummy_reviews/_doc/3
{
  "rating": 4.5,
  "content": "Could be better",
  "product_id": 123,
  "created_at": "2015-01-28T09:21:51+01:00",
  "author": {
    "first_name": "Spencer",
    "last_name": "Pearson",
    "email": "spearson@gmail.com"
  }
}

// Specifying milliseconds (long integer) or seconds (integer) from epoch (UNIX time format)
PUT /dummy_reviews/_doc/4
{
  "rating": 4.5,
  "content": "Very useful",
  "product_id": 123,
  "created_at": 143222344,
  "author": {
    "first_name": "Taylor",
    "last_name": "West",
    "email": "twest@gmail.com"
  }
}

// ####### Overview of mapping parameters #########

/*
  Java DateFormatter syntax or built-in formats can be used
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "purchased_at": {
        "type": "date",
        "format": "dd/MM/yyyy" // format parameter for dates
      }
    }
  }
}

/*
  properties parameter: Defines object field or nested fields
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "sold_by": {
        "properties": {
          "name": { "type": "text" }
        }
      }
    }
  }
}

PUT /sales
{
  "mappings": {
    "properties": {
      "products": {
        "type": "nested",
        "properties": {
          "name": { "type": "text" }
        }
      }
    }
  }
}

/*
  Coerce parameter: It is used to enable/disable coercion of values (enabled by default)
  It can enabled/disabled at field level and index level and index level coercion can be 
  overwritten for specific fields at field level
*/

PUT /sales
{
  "mappings": {
    "properties": {
      "amount": {
        "type": "float",
        "coerce": false
      }
    }
  }
}

PUT /sales
{
  "settings": {
    "index.mapping.coerce": false
  },
  "mappings": {
    "properties": {
      "amount": {
        "type": "float",
        "coerce": true
      }
    }
  }
}

/*
  doc_values: It is an "uninverted" inverted index and a separate data structure used
  for sorting, aggregating & scripting. USE WITH CAUTION !!!
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "buyer_email": {
        "type": "keyword",
        "doc_values": false // USE WITH CAUTION
      }
    }
  }
}

/*
  norms: Normalization factors used for relevance scoring.
  It is used for ranking the results and can be disabled 
  to save disk space.
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "tags": {
        "type": "text",
        "norms": false
      }
    }
  }
}

/*
  index: It is used for disabling indexing for a field.
  Values are still stoed in _source. It is useful if you won't
  use a field for search queries.Fields with indexing disabled
  can still be used for aggregations.
*/

PUT /server-metrics
{
  "mappings": {
    "properties": {
      "server_id": {
        "type": "integer",
        "index": false
      }
    }
  }
}

/*
  null_value: NULL cannot be indexed or searched. Use this parameter
  to replace NULL values with another value. It does not affect the
  value stored within _source.
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "partner_id": {
        "type": "keyword",
        "null_value": "NULL_VALUE"
      }
    }
  }
}

/*
  copy_to: It is used to copy multiple fields values into a "group field"
  Values are copied not terms/tokens. These values are then analyzed with
  analyzer of target field. 
*/
PUT /sales
{
  "mappings": {
    "properties": {
      "first_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "last_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "full_name": {
        "type": "text"
      }
    }
  }
}

// ####### Reindexing documents from 1 index to another ########
POST /_reindex
{
  "source": {
    "index": "dummy_reviews"
  },
  "dest": {
    "index": "dummy_reviews_v2"
  }
}

// Getting all documents using search API
GET /dummy_reviews_v2/_search
{
  "query": {
    "match_all": {}
  }
}

// Deleting the index by query
POST /dummy_reviews_v2/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}


/*
  _source gives the values supplied at index time so changing
  the datatype doesn't change the values returned. Keyword datatype
  should return string value not integer value so while reindexing
  the product_id value in _source should also be changed.
*/

// POST /_reindex
// {
//   "source": {
//     "index": "dummy_reviews"
//   },
//   "dest": {
//     "index": "dummy_reviews_v2"
//   },
//   "script": {
//     "source": """
//       if (ctx._source.product_id != null) {
//         ctx._source.product_id = ctx._source.product_id.toString();
//       }
//     """
//   }
// }

// Reindex documents matching a query
POST /_reindex
{
  "source": {
    "index": "dummy_reviews",
    "query": {
      "match_all": {}
    }
  },
  "dest": {
    "index": "dummy_reviews_v2"
  }
}

// Eg. Reindex documents with only positve reviews
POST /_reindex
{
  "source": {
    "index": "dummy_reviews",
    "query": {
      "range": {
        "rating": {
          "gte": 4.0
        }
      }
    }
  },
  "dest": {
    "index": "dummy_reviews_v2"
  }
}

/*
  1. Field mappings cannot be deleted
  2. Fields can be left out when indexing documents
*/
POST /_reindex
{
  "source": {
    "index": "dummy_reviews",
    "_source": ["content", "created_at", "rating"] // using source filtering some fields can be left out
  },
  "dest": {
    "index": "dummy_reviews_v2"
  }
}

// Changing a field's name
// POST /_reindex
// {
//   "source": {
//     "index": "dummy_reviews"
//   },
//   "dest": {
//     "index": "dummy_reviews_v2"
//   },
//   "script": {
//     "source": """
//       // Rename content field to comment
//       ctx._source.comment = ctx._source.remove("content");
//     """
//   }
// }

// Ignore reviews with ratings below 4.0
// POST /_reindex
// {
//   "source": {
//     "index": "dummy_reviews"
//   },
//   "dest": {
//     "index": "dummy_reviews_v2"
//   },
//   "script": {
//     "source": """
//       if (ctx._source.rating < 4.0) {
//         ctx.op = "noop"; // Can also be set to delete
//       }
//     """
//   }
// }

/*
  1.Always use query parameter instead of ctx.op because it is
  more performant and is preferred.

  2. Specifying delete as ctx.op deletes the document within
  the destination index and destination index may not be empty.
  The same can be done using Delete By Query API.
*/


/*
  An alternative to changing field names using reindex API is
  to use field aliases. They are defined with a field mapping
  and can be used within queries.

  1. The path field can be updated in an alias. Elasticsearch
  also supports index aliases
*/
PUT /dummy_reviews_v2/_mapping
{
  "properties": {
    "comment": {
      "type": "alias",
      "path": "content"
    }
  }
}

// Multi-field mappings
/*
  text datatype is only useful for full-text searches
  but keyword datatype is used for aggregations, sorting
  and scripting so we can use both datatypes using multi-field
  mappings
*/

PUT /dummy_multi_fields_test
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text"
      },
      "ingredients": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}


POST /dummy_multi_fields_test/_doc
{
  "description": "To make this spaghetti, you first need to...",
  "ingredients": ["Spaghetti", "Bacon", "eggs"]
}

GET /dummy_multi_fields_test/_search
{
  "query": {
    "match_all": {}
  }
}

GET /dummy_multi_fields_test/_search
{
  "query": {
    "match": {
      "ingredients": "Spaghetti"
    }
  }
}

GET /dummy_multi_fields_test/_search
{
  "query": {
    "term": {
      "ingredients.keyword": "Spaghetti"
    }
  }
}

// ##### Some videos skipped from "index templates" to "dynamic templates" #######


/*
  ######## Built-in analyzers ########

  1. Standard analyzer:
    It splits text at word boundaries and removes punctuation (done by the standard tokenizer).
    It lowercases letters with lowercase token filter and also it contains the stop token
    filter (disabled by default).

  2. Simple analyzer:
    It splits tokens when encountering anything else than letters and lowercases the letters
    with the lowercase tokenizer

  3. Whitespace analyzer:
    It splits text into tokens by whitespace and does not lowercase the letters.

  4. keyword analyzer:
    No-op analyzer that leaves the input text intact and it simply outputs it as a single token.
    It is used for exact matching of values.

  5. Pattern analyzer:
    A regular expression is used to match the token separators. This analyzer is very flexible
    and the default pattern is it matches all non-word characters (\W+). It also lowercases
    all letters by default.

  6. More analyzers can be seen in the documentation.
*/

PUT /dummy_reviews_v3
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}

// Configuring the built-in analyzer instead of creating a custom analyzer
PUT /products
{
  "settings": {
    "analysis": {
      "analyzer": {
        "remove_english_stop_words": {
          "type": "standard",
          "stopwords": "_english_"
        }
      }
    }
  }
}

// Testing analyzers, char_filters, token filters and tokenizer
POST /_analyze
{
  "tokenizer": "whitespace",
  "char_filter": ["html_strip"], 
  "filter": [
    "lowercase",
    "stop",
    "asciifolding"
  ],
  "text": "<p>Hello, <strong>World!</strong> My name is <i>Akshay</i> haha!</p>"
}

// Creating a custom analyzer
PUT /dummy_custom_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "stop",
            "asciifolding"
          ]
        }
      }
    }
  }
}

// Creating a custom analyzer at index creation time and configuring the tokenizer, char_filters or token filters
PUT /dummy_custom_danish_analyzer
{
  "settings": {
    "analysis": {
      "filter": {
        "danish_stop": {
          "type": "stop",
          "stopwords": "_danish_"
        }
      },
      "char_filter": {},
      "tokenizer": {}, 
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "danish_stop",
            "asciifolding"
          ]
        }
      }
    }
  }
}

// To add a new custom analyzer to existing index
PUT /dummy_custom_analyzer/_settings
{
  "analysis": {
    "analyzer": {
      "my_second_analyzer": {
        "type": "custom",
        "char_filter": ["html_strip"],
        "tokenizer": "standard",
        "filter": [
          "lowercase",
          "stop",
          "asciifolding"
        ]
      }
    }
  }
}

// To close an index from read/write requests (basically no indexing or search queries can be executed)
// In this state, static settings can be updated
POST /dummy_custom_analyzer/_close

// To open an index from read/write requests (basically no indexing or search queries can be executed)
// In this state only dynamic settings can be updated
POST /dummy_custom_analyzer/_open

// Analysis settings are static settings
GET /dummy_custom_analyzer/_settings


// ########## Updating existing analyzers in index ###########

// Add a field called description
PUT /dummy_custom_analyzer/_mapping
{
  "properties": {
    "description": {
      "type": "text",
      "analyzer": "my_custom_analyzer"
    }
  }
}

// Insert a document in index
POST /dummy_custom_analyzer/_doc
{
  "description": "Is that Peter's cute-looking dog?"
}

// Query document using keyword analyzer
GET /dummy_custom_analyzer/_search
{
  "query": {
    "match": {
      "description": {
        "query": "that",
        "analyzer": "keyword"
      }
    }
  }
}

POST /dummy_custom_analyzer/_close

// Update the existing my_custom_analyzer
PUT /dummy_custom_analyzer/_settings
{
  "analysis": {
    "analyzer": {
      "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "asciifolding"
          ]
        }
    }
  }
}

POST /dummy_custom_analyzer/_open

GET /dummy_custom_analyzer/_settings

// This will reindex all the documents
POST /dummy_custom_analyzer/_update_by_query?conflicts=proceed

// ######### Writing Search queries #########

/*
  Different types of search queries:

  1. URI searches: These are used rarely and cannot fully use the features of elastic search.
      It uses the apache lucene syntax.
      Eg: GET /products/_search?q=name:sauvigon AND tags: wine

  2. Query DSL: These are most commonly used JSON queries, are more verbose and can fully utilize all the features
      of elastic search.
      Eg:

      GET /products/_search
      {
        "query": {
          "bool": {
            "must": [
              {
                "match": { "name": "Sauvigon" }
              },
              {
                "match": { "tags": "wine" }
              }
            ]
          }
        }
      }
*/

// ##### Introduction to term level queries ####
/*
  1. Term level queries are not analyzed.
  2. Used to search structured data for exact values with correct case and value (filtering).
  3. Can be used on data types such as keyword, numbers, dates etc.
  4. Do not use term level queries on "text" datatype as you will get strange and unpredictable results.
  5. All term level queries are case sensitive by default so use "case_insensitive" parameter to change 
      this setting.
*/

// Term-level query for searching vegetable (case sensitive)
GET /dummy_products/_search
{
  "query": {
    "term": {
      "tags.keyword": "Vegetable"
    }
  }
}

// Term level query for searching vegetable (case insensitive)
GET /dummy_products/_search
{
  "query": {
    "term": {
      "tags.keyword": {
        "value": "vegetable",
        "case_insensitive": true 
      }
    }
  }
}

// Term level query to search for Meat AND/OR Soup (case sensitive)
GET /dummy_products/_search
{
  "query": {
    "terms": {
      "tags.keyword": ["Meat", "Soup"]
    }
  }
}

// Term level query to search for document using _ids
// Useful when _id is same as id column in relational DB.
GET /dummy_products/_search
{
  "query": {
    "ids": {
      "values": ["100", "200", "300"]
    }
  }
}

/*
  1. The range query is used to perform range searches
  2. Eg. in_stock >= 1 and in_stock <= 12
  3. Eg. createdAt >= 2020/01/01 and createdAt <= 2024/01/01
*/
GET /dummy_products/_search
{
  "query": {
    "range": {
      "in_stock": { // 
        "gte": 1, // gte, lte, gt and lt are the parameters which can be used
        "lte": 10
      }
    }
  }
}

// Range query to search by range of dates without time
/*
  1. Dates are handled automatically. Elasticsearch will use the sensible defaults
  automatically. In this case that would be between midnight and 1 sec before midnight.
  But it is recommended to specify it specifically.

  2. Dates should be specified in default date format
      yyyy/MM/dd HH:mm:ss || yyyy/MM/dd || epoch_millis

*/
GET /dummy_products/_search
{
  "query": {
    "range": {
      "createdAt": { 
        "gte": "2020/01/01",
        "lte": "2024/01/01",
        // "gte": "2020/01/01 00:00:00",
        // "lte": "2024/01/01 23:59:59"
      }
    }
  }
}

/*
  format parameter is used to specify date format used in supplied date values
*/
GET /dummy_products/_search
{
  "query": {
    "range": {
      "createdAt": {
        "format": "dd/MM/yyyy",
        "gte": "01/01/2020",
        "lte": "31/01/2020"
      }
    }
  }
}

/*
  Specifying the UTC offset:
  1. If time zone is not specified the provided dates in query are assumed to be
     in UTC format.

  2. Dates in elastic search are stored as UTC dates by default.
*/
GET /dummy_products/_search
{
  "query": {
    "range": {
      "createdAt": {
        "time_zone": "+01:00",
        "gte": "01/01/2020",
        "lte": "31/01/2020"
      }
    }
  }
}

/*
  Prefixes, wildcards and regular expressions:

  1. Term level queries are used for exact matching. It is used to query non-analyzed
      values with queries that are not analyzed.

  2. Prefix, wildcards and regular expressions queries should be used only on "keyword"
      fields only.
*/

/*
  Prefix queries:
    The value should contain the text at the start of the term and as the field is not analyzed
    and if the value is in the middle of the term it will not be matched.
*/
GET /dummy_products/_search
{
  "query": {
    "prefix": {
      "name.keyword": {
        "value": "Past"
      }
    }
  }
}

/*
  As the tags field contains array values and each term in the array is indexed separately
  it can be matched using prefix query and there is no worry about value being at the
  beginning of he field.
*/
GET /dummy_products/_search
{
  "query": {
    "prefix": {
      "tags.keyword": {
        "value": "Past"
      }
    }
  }
}

/*
    Pattern       Terms

    Past?         all terms starting with Past + 1 more character only like Pasta, Paste not Pastry, Pastist etc
    Past*         all terms starting with Past + more characters like Pasta, Pastry, Pastism, etc.
    *Past.        (AVOID THIS PATTERN !) all terms with any no. of characters before Past like root Past, dark Past, etc.
*/

GET /dummy_products/_search
{
  "query": {
    "wildcard": {
      "tags.keyword": {
        "value": "Past?"
      }
    }
  }
}

GET /dummy_products/_search
{
  "query": {
    "wildcard": {
      "tags.keyword": {
        "value": "Past*"
      }
    }
  }
}

/*
  Regular expressions:
  1. The regexp query matches terms that match a regular expression.
  2. Regular expressions are patterns used for matching strings.
  3. Allows more complex queries than the wildcard query.
  4. Elastic search uses Apache Lucene's set of regular expressions which
      may not be same as other engines' regular expressions
*/

GET /dummy_products/_search
{
  "query": {
    "regexp": {
      "tags.keyword": {
        "value": "Bee(f|r){1}"
      }
    }
  }
}

/*
  Term level query to check if a field contains value or not
*/
GET /dummy_products/_search
{
  "query": {
    "exists": {
      "field": "tags.keyword"
    }
  }
}

/*
  query to check if a field is null (Reverse of above query)
*/
GET /dummy_products/_search
{
  "query": {
    "bool": {
      "must_not": [
        {
          "exists": {
            "field": "tags.keyword"
          }
        }
      ]
    }
  }
}

// ######## Introduction to full text queries ##########

/*
  1. Full text queries are used to search unstructured text values
     Eg. Blog post, website content, emails, chats etc.

  2. Full text queries are not used for exact matching and are analyzed 
     the same way as the data is when it was indexed.

  3. Don't query "keyword" fields with full text queries because the
     field values were not analyzed.

  4. If no analyzer is configured for the field standard analyzer is used
*/

// This query will search for PASTA in name field (Irrespective of its position in value)
// The input value is analyzed before its compared with terms in inverted index
GET /dummy_products/_search
{
  "query": {
    "match": {
      "name": "PASTA"
    }
  }
}

// This query will search for pasta OR chicken in name field (Irrespective of its position in value)
// The input value is analyzed before its compared with terms in inverted index
GET /dummy_products/_search
{
  "query": {
    "match": {
      "name": "pasta chicken"
    }
  }
}

/*
  1. The default operator is OR which can be changed to AND using operator parameter.
  2. Input value is converted to ["pasta", "chicken"] with AND operator which means
     both values should be present in the name field.
*/
GET /dummy_products/_search
{
  "query": {
    "match": {
      "name": {
       "query": "PASTA CHICKEN",
       "operator": "and" 
      }
    }
  }
}

/*
  Introduction to relevance scoring

  1. Each result has a relevance scoring given by _score field in the results.
      It is calculated based on many factors and need not be studied.

  2. Query results are sorted descendingly by the _score metadata field. _score is
      a floating point number of how well a document matches a query.

  3. The most relevant results are placed highest (Eg. like on google)

  4. Documents matching term level queries are generally scored 1.0 or they don't
      match at all.
*/


















































