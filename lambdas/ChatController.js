const DBClient=require('../dynamoDB')
module.exports.connectionHandler=async(event)=>{
    // console.log('connection')
    // console.log(event)
    console.log(event.requestContext.connectionId)
    if(event.requestContext.routeKey=='$connect')
    {

        
        


        sendMessageToClient('http://localhost:3001',event.requestContext.connectionId,{type:'id',connectionID:event.requestContext.connectionId})

    }else if(event.requestContext.routeKey=='$disconnect'){
        console.log('disconnect')
        const {Items:[{userId}]}=await DBClient.query({
          TableName:'ChatTable',
          IndexName:'ChatIndex',
          KeyConditionExpression: 'connectionId = :connectionId',
          ExpressionAttributeValues: { ':connectionId':  event.requestContext.connectionId  } 
        }).promise()
        console.log(userId)
        await DBClient.delete({
          TableName:'ChatTable',
          Key:{
            'userId':userId
          }
        },(err,data)=>{
          if(err)console.log(err)
          else console.log(data)
        })
      }
      console.log(await DBClient.scan({TableName:'ChatTable'}).promise())
}



module.exports.setUserId=async(event)=>{
  console.log(event.requestContext.connectionId)
  const body=JSON.parse(event.body)
  console.log(body.userId)
  // console.log(event)

  const data={
    connectionId:event.requestContext.connectionId,
    userId:body.userId
  }

  await DBClient.put({
    TableName:'ChatTable',
    Item:data
  }).promise()


  console.log(await DBClient.scan({TableName:'ChatTable'}).promise())

}


const AWS=require('aws-sdk')
const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    console.log(connectionId)
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
 

module.exports.sendMSG=async(event)=>{
    try{

      console.log('msg')
      
      const body=JSON.parse(event.body)
      console.log(body)
      const r=await DBClient.get({
        TableName:'ChatTable',
        Key:{
          userId:body.receipientId
        }
    }).promise()
    console.log(r.Item.connectionId)
    
    sendMessageToClient('http://localhost:3001',r.Item.connectionId,{senderId:event.requestContext.connectionId,message:body.message})
  }catch(e){
    console.error(e)
  }
}

module.exports.defaultHandler = async (event, context) => {
  console.log(event)
  return {
    statusCode: 200,
  };
};