const { randomInt } = require('crypto');
const { MongoClient } = require('mongodb');
const path = "mongodb://0.0.0.0:27017";
const mongo_client = new MongoClient(path);

let time = new Date();
let current = [
    {
        customerName: "Alice",
        customerId: "44108",
        deductedAmount: 0,
        accountBalance: 2000,
        date: time.toLocaleString()
    },
    {
        customerName: "Jane",
        customerId: "44109",
        deductedAmount: 0,
        accountBalance: 1500,
        date: time.toLocaleString()
    },
    {
        customerName: "Jake",
        customerId: "44110",
        deductedAmount: 0,
        accountBalance: 1000,
        date: time.toLocaleString()
    }
];

async function main(){
    try {
        await mongo_client.connect();
        var database = mongo_client.db('assignment');
        var collection = database.collection('bank_transaction');
        console.log("CONNECTED SUCCESSFULLY");
        await collection.insertMany(current, {forceServerObjectId: true});
        
        console.log("DAY 1");

        for(let j=0; j<9; j++){
            console.log(`DAY ${j+2}`);
            for(let i=0; i<current.length; i++){
                let input = deductionAmount();
                let is_transaction_complete = false;
    
                while(!is_transaction_complete){

                    if(input <= current[i].accountBalance){
                        current[i].deductedAmount += input;
                        current[i].accountBalance -= input;
                        current[i].date = new Date(time.getTime() + ((j+1) * 90000000)).toLocaleString(); 
                        is_transaction_complete = true;
                    }
                    else{
                        console.log(`Deduction Amount: ${input}$ ILLEGAL TRANSACTION!!! REJECTED`);
                        input = deductionAmount();
                    }
                }
            } 
            await collection.insertMany(current,{forceServerObjectId: true});
        }
        
    } catch (error) {
        console.log('ERROR WHILE CONNECTING TO DATABASE' + error);
    }
    finally{
        console.log("ALL TRANSACTION DONE");
        mongo_client.close();
    }   
}


function deductionAmount(){
   return Math.floor(Math.random() * 300);
}

main();
