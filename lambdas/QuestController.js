const DBClient = require("../dynamoDB")
const Response = require("../Response")
const { v4: uuidv4 } = require('uuid');



exports.create=async(event)=>{
    try{


        let data=JSON.parse(event.body)
        data['id']=uuidv4()
        data['created']=+new Date()
        // data['completed']=false
        await DBClient.put({
            TableName:'QuestTable',
            Item:data
        }).promise() 

    

        // if(!event.pathParameters || !event.pathParameters.data){
        //     throw new Error('missing data')
        // }

        return Response._200({message:'Successfully created'})

    }catch(err){
        console.log(err)
        return Response._400({message:err})
    }

    

}

exports.editQuest=async(event)=>{
    try{
        let data=JSON.parse(event.body)
         
        await DBClient.put({
            TableName:'QuestTable',
            Item:data
        }).promise() 

    

        // if(!event.pathParameters || !event.pathParameters.data){
        //     throw new Error('missing data')
        // }

        return Response._200({message:'Successfully edited'})

    }catch(err){
        console.log(err)
        return Response._400({message:err})
    }

    
}


exports.getAll=async(event)=>{
    try{
        const params={
            TableName:'QuestTable',
            ProjectionExpression: "id,title,expDays,tags,created",
        }
        console.log('ola')
        return Response._200(await DBClient.scan(params).promise())
    }catch(err){
        console.log(err)
        return Response._400({message:err})
    }
}

exports.getMyCreatedQuests=async(event)=>{
    try {
        const { creator } = event.queryStringParameters;

        const params={
            TableName:'QuestTable',
            FilterExpression: 'contains(creator, :creator)',
            ProjectionExpression: "id,title,completed",
            ExpressionAttributeValues: {
                ":creator": creator,
              },
        }
        let result=await DBClient.scan(params).promise()
        return Response._200(result)
    } catch (error) {
        return Response._400({message:error})
    }
}


exports.getQuest=async(event)=>{
    try {
        const { id } = event.queryStringParameters;
        console.log(id)
        const params={
            TableName:'QuestTable',
            Key:{
                'id':id
            }
        }
        let result=await DBClient.get(params).promise()
        return Response._200(result)
    } catch (error) {
        return Response._400({message:error})
    }
}


exports.acceptQuest=async(event)=>{
    try{
        let data=JSON.parse(event.body)
        const Param={
            TableName:'QuestTable',
            Key:{
                'id':data.id
            },
            UpdateExpression: 'set acceptor = :acceptor',
            ExpressionAttributeValues:{
                ':acceptor':data.acceptor
            }
        }

        await DBClient.update(Param).promise()
        return Response._200({message:'successful'})
    }catch(err){
        return Response._400({message:err})
    }
}


exports.getMyQuests=async(event)=>{
    try {

        const { acceptor } = event.queryStringParameters;
        console.log(acceptor)
        const Params={
            TableName:'QuestTable',
            FilterExpression: 'contains(acceptor, :acceptor)',
            ProjectionExpression: "id,title,creator,description,completed",
            ExpressionAttributeValues: {
                ":acceptor": acceptor,
              },
        }
        let res=await DBClient.scan(Params).promise()
        return Response._200(res)
    } catch (error) {
        return Response._400({message:error})
    }
}

exports.setQuestStatus=async(event)=>{
    try{
        let data=JSON.parse(event.body)
        const Param={
            TableName:'QuestTable',
            Key:{
                'id':data.id
            },
            UpdateExpression: 'set completed = :completed',
            ExpressionAttributeValues:{
                ':completed':data.completed
            }
        }

        await DBClient.update(Param).promise()
        return Response._200({message:'successful'})
    }catch(err){
        return Response._400({message:err})
    }
}