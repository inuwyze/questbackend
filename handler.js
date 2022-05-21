'use strict';
const AWS = require('aws-sdk');
const DBClient = require('./dynamoDB');

module.exports.hello = async (event) => {
  var params = {
    RequestItems:{

      'QuestTable': [
        {PutRequest:{
          Item:{
        'id' : '001',
        'created' : +new Date(),
        'tags' : ['ola','ola2','ola3'],

        'creator':'simon',
      'acceptor':'anohana',
      'expDays':5,
      'title':'draw a portrait',
      'description':'description 1',
          }
        }
    },
    {PutRequest:{
      Item:{
        'id' : '002',
        'created' : +new Date(),
        'tags' : ['ola32','ola3'],
        'creator':'Paul',
   
      'acceptor':'anohana',
      'expDays':7,
      'title':'get food',
      'description':'description 2',
      }} 
    },
    {PutRequest:{
      Item:{
        'id' : '003',
        'created' : +new Date(),
        'tags' : ['ola','ola2','ola3'],
        'creator':'simon',
      'acceptor':'Paul',
      'expDays':2,
      'title':'title1',
      'description':'description 3',
      }}
    },
  ]
    }
  };
  await DBClient.batchWrite(params).promise()

  

  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
       
      },
      null,
      2
    ),
  };
};
