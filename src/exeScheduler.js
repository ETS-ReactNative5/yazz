'use strict';

var fs                          = require('fs');
var path                        = require('path');
var mkdirp                      = require('mkdirp')
const uuidv1                    = require('uuid/v1');
var sqlite3                     = require('sqlite3');
var os                          = require('os')
var perf                        = require('./perf')
var db_helper                   = require("./db_helper")
var isBinaryFile                = require("isbinaryfile");
var userData
var childProcessName
var nextCallId = 0

var isWin                               = /^win/.test(process.platform);
var inScan                              = false;
var stmt2                               = null;
var stmt3                               = null;
var setIn                               = null;
var updateProcessTable                  = null;
var finishedFindingFolders              = false;
var username                            = "Unknown user";
var dbsearch;

var setProcessToRunning;

var setProcessToIdle;



//username = os.userInfo().username.toLowerCase();
username = "node"
//console.log(username);

//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")







processMessagesFromMainProcess();

function processMessagesFromMainProcess() {
    process.on('message', (msg) => {


    if  (msg.message_type == 'init') {

        //console.log('-- Init v3');
        userData            = msg.user_data_path
        childProcessName    = msg.child_process_name

        //console.log("  Child recieved user data path: " + userData)
        var dbPath = path.join(userData, username + '.visi')

        //console.log("  DB path: " + dbPath)
        dbsearch = new sqlite3.Database(dbPath);
        dbsearch.run("PRAGMA journal_mode=WAL;")
        process.send({  message_type:       "database_setup_in_child" ,
                        child_process_name:  childProcessName
                        });


        setUpSql()






        } else if (msg.message_type == 'setUpSql') {


             //console.log(" --- setUpSql --- ")
             setUpSql();






     } else if (msg.message_type == "function_call_response") {

         //console.log("*) Response received at Scheduler ")
         //console.log("*) result generated by call ID: " + msg.called_call_id)
         var callDetails = callList[msg.called_call_id]
         //console.log("*) call details: " + JSON.stringify(msg,null,2))

         if (callDetails == null) {
            console.log("In Scheduler:function_call_response   callList    is not set for : " + JSON.stringify(msg,null,2))
            return
         }
         var parentCallId = callDetails.parent_call_id
         //console.log("*) parent call ID: " + JSON.stringify(parentCallId,null,2))

         var processName
         if (parentCallId == -1) {
             processName = "forked"
         } else {
             var parentCallDetails = callList[parentCallId]
             //console.log("*) parent call details: " + JSON.stringify(parentCallDetails,null,2))
             //console.log("*) Response: " + JSON.stringify(msg.result,null,2))
             processName = parentCallDetails.process_name
         }

         //console.log("msg.callback_index returned: " + msg.callback_index)
         process.send({     message_type:       "return_response_to_function_caller" ,
                            child_process_name:  processName,
                            callback_index:      msg.callback_index,
                            result:              msg.result
                        });



     } else if (msg.message_type == "processor_free") {


        dbsearch.serialize(
            function() {
                dbsearch.run("begin exclusive transaction");
                setProcessToIdle.run(msg.child_process_name)
                //zzz
                dbsearch.run("commit", function() {
                    processesInUse[msg.child_process_name] = false
                });
            })








     } else if (msg.message_type == "function_call_request") {

        if (msg.find_component.driver_name && msg.find_component.method_name) {
            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                      "SELECT * FROM system_code where base_component_id = ? and on_condition like '%" +
                        msg.find_component.method_name + "%' and code_tag = 'LATEST'; ",

                       msg.find_component.driver_name,

                        function(err, results)
                        {
                            if (results && (results.length > 0)) {
                               scheduleJobWithCodeId(  results[0].id,
                                                       msg.args,
                                                       msg.caller_call_id,
                                                       msg.callback_index)
                                //callbackFn(results[0].id);
                            } else {
                                //callbackFn(null)
                            }

                        })
            }, sqlite3.OPEN_READONLY)



        } else if (msg.find_component.code_id) {
                       scheduleJobWithCodeId(  msg.find_component.code_id,
                                               msg.args,
                                               msg.caller_call_id,
                                               msg.callback_index)



        } else if (msg.find_component.base_component_id) {
            //console.log("In msg.find_component.base_component_id")
                    dbsearch.serialize(
                        function() {
                            var stmt = dbsearch.all(
                              "SELECT id FROM system_code where base_component_id = ? and code_tag = 'LATEST'; ",

                               msg.find_component.base_component_id,

                                function(err, results)
                                {
                                    if (results && (results.length > 0)) {
                                        //console.log("    msg.find_component.base_component_id: " + msg.find_component.base_component_id  + " = " + results[0].id)
                                       scheduleJobWithCodeId(  results[0].id,
                                                               msg.args,
                                                               msg.caller_call_id,
                                                               msg.callback_index)
                                        //callbackFn(results[0].id);
                                    } else {
                                        console.log("    msg.find_component.base_component_id: Could not find " +   msg.find_component.base_component_id)
                                    }

                                })
                    }, sqlite3.OPEN_READONLY)
                    }









        } else if (msg.message_type == 'startNode') {


             //console.log(" --- Started Node --- ")
             //console.log("     Node ID: " + msg.node_id)
             //console.log("     Process ID: " + msg.child_process_id)
             //console.log("     Started: " + msg.started)
             dbsearch.serialize(
                 function() {
                     dbsearch.run("begin exclusive transaction");
                     updateProcessTable.run(
                         msg.node_id,
                         msg.child_process_id,
                         msg.started,
                         "IDLE",
                         null
                         )
                     dbsearch.run("commit", function() {
                            processesInUse[msg.node_id] = false
                     });
                 })

        }




    });
}





//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                        setUpSql                                         //
//                                                                                         //
//   This sets up the SqlLite prepared statements                                          //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function setUpSql() {

    setProcessToRunning = dbsearch.prepare("UPDATE system_process_info SET status = 'RUNNING', last_driver = ?, last_event = ?, system_code_id = ? WHERE process = ?");

    setProcessToIdle = dbsearch.prepare("UPDATE system_process_info SET status = 'IDLE' WHERE process = ?");


    updateProcessTable = dbsearch.prepare(
        " insert or replace into "+
        "     system_process_info (process, process_id, running_since, status, job_priority) " +
        " values " +
        "     (?,?,?,?,?)"
    )

}





function init() {
    parseEvents()

    setInterval( findNextJobToRun, 1000)
}







function parseEvents() {

    //console.log("function(executeCode) {")
    parseAllEvents()

}




var inScheduleCode2 = false;
function findNextJobToRun() {
    if (inScheduleCode2) {
        return
    }
    inScheduleCode2 = true

    var code_id = null

    for (var ff = 0; ff < eventList.length; ff++) {
        var cond = eventList[ff]
        code_id = cond.id
        if (cond.condType == "query") {
            testQueryToExecute(cond, code_id)

        }
    }
    inScheduleCode2 = false

}



function testQueryToExecute(cond, code_id) {
    if (cond.condition.where) {
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                    `select
                         count( process ) as cnt_max
                     from
                         system_process_info
                     where
                         system_code_id = ?
                     and
                         status = 'RUNNING'
                    `
                    ,
                    code_id
                    ,
                    function(err, results)
                    {
                        if (err) {
                            console.log("err: " + err)
                        } else {
                            //console.log("")
                            //console.log(JSON.stringify(cond,null,2))
                            //console.log("Process count    :" + JSON.stringify(results[0].cnt_max,null,2))
                            //console.log("Process count max:" + JSON.stringify(cond.max_processes,null,2))
                            //console.log("")
                            if (cond.max_processes && (results[0].cnt_max >= cond.max_processes)) {
                            } else {
                                //console.log("*) Executing SQlite: " + cond.condition.where)
                                dbsearch.serialize(
                                    function() {
                                        var stmt = dbsearch.all(
                                            "SELECT * FROM all_data where " +  cond.condition.where + " and status is NULL LIMIT 1",

                                            function(err, results)
                                            {
                                                if (results) {
                                                    if (results.length > 0) {

                                                        dbsearch.serialize(
                                                            function() {
                                                                dbsearch.run("begin exclusive transaction");
                                                                lockData.run(results[0].id)
                                                                dbsearch.run("commit",
                                                                    function() {

                                                                        //console.log("*) INIT -  starting the first job")
                                                                        scheduleJobWithCodeId(  code_id,  results,  null, null )
                                                                        inScheduleCode2 = false
                                                                    });
                                                                })



                                                    }
                                                } else {
                                                    inScheduleCode2 = false
                                                }
                                            })
                                }, sqlite3.OPEN_READONLY)
                            }
                        }
                    })
        }, sqlite3.OPEN_READONLY)
        //console.log("testQueryToExecute: " + JSON.stringify(cond,null,2))



    }
}







var processesInUse = new Object()

var tryAgain = true
function scheduleJobWithCodeId(codeId, args,  parentCallId, callbackIndex) {

    var processToUse = null
    var processNames = Object.keys(processesInUse)

    for ( var processNameIndex = 0 ; processNameIndex < processNames.length; processNameIndex ++ ) {

        var actualProcessName   = processNames[ processNameIndex ]
        var isInUse             = processesInUse[ actualProcessName ]

        //console.log(" select * from system_process_info    ")
        //console.log("    " + JSON.stringify(results,null,2))

        if ( !isInUse ) {
            processToUse = actualProcessName
            processesInUse[actualProcessName] = true
            console.log(" Sending job to process:    " + JSON.stringify(processToUse,null,2))
            sendJobToProcessName(codeId, args, actualProcessName, parentCallId, callbackIndex)
            return
        }
    }
    if (!processToUse) {
        console.log("Could not find a process to use for " + codeId)
        for ( var processNameIndex = 0 ; processNameIndex < processNames.length; processNameIndex ++ ) {
                console.log(`${processNameIndex}: ${processesInUse[actualProcessName]}`  )
        }
        if (tryAgain) {
            console.log("Retry in 2 seconds ..." )
            setTimeout(function() {
                scheduleJobWithCodeId(codeId, args,  parentCallId, callbackIndex)
            },2000)
        }
    }
}






function sendToProcess(  id  ,  parentCallId  ,  callbackIndex, processName  ,  base_component_id ,  on_condition  ,  args) {

    var newCallId = nextCallId ++

    callList[  newCallId  ] = {     process_name:       processName,
                                    parent_call_id:     parentCallId        }
    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            setProcessToRunning.run( base_component_id, on_condition, id, processName )
            dbsearch.run("commit", function() {
                process.send({  message_type:       "execute_code_in_exe_child_process" ,
                                child_process_name:  processName,
                                code_id:             id,
                                args:                args,
                                call_id:             newCallId,
                                callback_index:      callbackIndex,
                                on_condition:        on_condition,
                                base_component_id:   base_component_id
                                });
            });
        })
}


var callList = new Object
function sendJobToProcessName(id, args, processName, parentCallId, callbackIndex) {

    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id, on_condition FROM system_code where id = ? LIMIT 1",
                id,

                function(err, results)
                {
                    if (results) {
                        if (results.length > 0) {


                            sendToProcess(  id,
                                            parentCallId,
                                            callbackIndex,
                                            processName,
                                            results[0].base_component_id,
                                            results[0].on_condition,
                                            args)



                        }
                    }
                })
    }, sqlite3.OPEN_READONLY)

    }






function parseAllEvents( ) {

    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT id, on_condition, max_processes FROM system_code; ",

                function(err, results)
                {
                    if (results) {
                        for (var tt = 0; tt < results.length; tt ++) {

                            var cond = results[tt].on_condition
                            try {
                                var evaledCond = eval("(" +  cond + ")")
                                saveEvent(evaledCond, results[tt].id, results[tt].max_processes)
                                //console.log("")
                            } catch (err) {
                                console.log("Error in: "+ cond)
                                console.log(err)
                            }

                        }

                    }

                })
    }, sqlite3.OPEN_READONLY)
}



var eventList = []


function saveEvent(cond, id, maxP) {
    var typeCond =  (typeof cond)
    var saveType = null

    if (typeCond == "string") {
        saveType = "method"

    } else if (typeCond == "object") {
        saveType = "query"

    }
    //console.log("*) type: " + saveType)

    eventList.push({condType:       saveType,
                    condition:      cond,
                    max_processes:  maxP,
                    id:             id})

}







process.on('exit', function(err) {
    shutdownExeProcess(err);
  });
process.on('quit', function(err) {
  shutdownExeProcess(err);
});

function shutdownExeProcess(err) {
    console.log("** exeScheduler process was killed: " )
    if (err) {
        console.log("    : " + err)
    }


    if (dbsearch) {
        dbsearch.run("PRAGMA wal_checkpoint;")
    }
}
