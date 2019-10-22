const express = require('express');
const app = express.Router();
const sgMail = require('@sendgrid/mail');
var CrypJs = require('node-cryptojs-aes').CryptoJS;
const mydb = require('../utils/db');
var moment = require('moment');
const logger = require('../utils/logger')(__filename);


app.post("/config", function (request, response) {
 var doc = {
        "projectId": request.body.projectId,
        "projectName": request.body.projectName,
        "team": request.body.team,
        "date": request.body.date,
        "description": request.body.description
    };
    if (!mydb) {
        logger.error("No database.");
        response.status(500).send("Database connection is not ready");
        return;
        }
    // insert the username as a document
    mydb.insert(doc, function (err, body, header) {
        if (err) {
            console.log('[mydb.insert] ', err.message);
            response.send("Error");
            return;
        }
        doc._id = body.id;
        response.send(doc);
    });
});

app.get("/getdata", function (request, response) {
    var names = [];
    if (!mydb) {
        logger.error("No database.");
        response.status(500).send("Database connection is not ready");
        return;
    }

    mydb.list({ include_docs: true }, function (err, body) {
        if (!err) {
            body.rows.forEach(function (row) {
                if (row.doc.projectId) {
                    names.push(row.doc);
                }
            });
            response.json(names);
        }
    });
});

// app.post("/register", function (request, response) {
//     var doc = {

//         "username": request.body.username,
//         "password": request.body.password,
//         "firstName": request.body.firstName,
//         "lastName": request.body.lastName

//     };
//     if (!mydb) {
//         logger.error("No database.");
//         response.status(500).send("Database connection is not ready");
      
//     }
//     // insert the username as a document
//     mydb.insert(doc, function (err, body, header) {
//         if (err) {
//             console.log('[mydb.insert] ', err.message);
//             response.send("Error");
//             return;
//         }
//         doc._id = body.id;
//         response.send(doc);
//     });
// });

// app.post("/login", function (request, response) {
//     var username = request.body.username;
//     var password = request.body.password;

//     if (!mydb) {
//         logger.error("No database.");
//         response.status(500).send("Database connection is not ready");
//         return;
        
//     }
//     if (username && password) {
//         mydb.find({
//             selector: {
//                 "username": {
//                     "$eq": username
//                 }
//             },
//             "fields": [
//                 "firstName",
//                 "lastName",
//                 "username",
//                 "password"
//             ]

//         }, function (er, result) {
//             if (er) {

//                 logger.error(er);
//                 res.status(503).send("Too many requests to Database.");
//                 return;

//             }
//             if (result.docs && result.docs.length) {
//                 for (var i = 0; i < result.docs.length; i++) {
//                     if (result.docs[i].password === password) {
//                         response.send({ "username": result.docs[i].username, "firstName": result.docs[i].firstName, "lastName": result.docs[i].lastName });
//                         break;

//                     } else {
//                         response.send({ "Error": "Wrong_Password" });
//                     }


//                 }
//             } else {
//                 response.send({ "Error": "Wrong_Username" });
//             }

//         });

//     } else {
//         response.send({ "Error": "No_Username_Password" });
//     }


// });



app.get("/expiresUrl",(req,res)=>{
    const projectId = req.query.projectId;
    const milestoneId = parseInt(req.query.milestoneId);
    const user = req.query.user;
    if (milestoneId && projectId && user) 
    {
        if (!mydb) 
        {
            logger.error("No database.");
            res.status(500).send("Database connection is not ready");
            return;
        }
        const userquery = 
        {
            "selector": {
               "projectId": {
                  "$eq": projectId
               },
               "milestone": {
                        "$elemMatch": {
                           "id": {
                              "$eq": milestoneId
                           },
                           "feedback": {
                              "$elemMatch": {
                                 "user": user
                              }
                           }
                        }
                     }
            },
            "fields": [
               "projectId"
            ]
        };
        mydb.find(userquery,(er,result)=>
        {
            if (er) 
            {
                logger.error(er);
                res.status(503).send("Too many requests to Database.");
                return;
            }
            if (result.docs && (result.docs.length==1))
            {
                logger.info("User has already Given Feedback for this Milestone");
                res.status(200).send(
                    {
                        "expire":false,
                        "already":true,
                        "msg":"User has already Given Feedback for this Milestone"
                    }
                );
               
            }
            else
            {
                logger.info("User did not Give Feedback for this Milestone");
                const datequery = 
                {
                    selector: {
                             "projectId": {
                                    "$eq": projectId
                                },
                                "milestone": {
                                   "$elemMatch": {
                                      "id": {
                                         "$eq": milestoneId
                                      }
                                   }
                                }
                            },
                            "fields": [
                                "milestone",
                                "projectName",
                                "team",
                                "email_content"
                            ]
                };
                mydb.find(datequery,function (er, result)
                {
                    if (er) 
                    {
                    logger.error(er);
                    res.status(503).send("Too many requests to Database.");
                    return;
                    }

                    if (result.docs && (result.docs.length==1)) 
                    {

                        const milestone = result.docs[0].milestone;
                        const projectname = result.docs[0].projectName;
                        const team = result.docs[0].team;
                        const email_content = result.docs[0].email_content;

                        const finalData = [];
                        const maildata = [];

                        for(var i = 0;i<Object.keys(milestone).length; i++)
                        {
                            if(milestone[i].id==milestoneId){
                                finalData.push(milestone[i]);
                                break;
                         }
                    }
                
                    //milestone
                    for(var i = 0;i<Object.keys(email_content).length; i++)
                        {
                            if(email_content[i].milestoneid==milestoneId){
                                maildata.push(email_content[i]);
                                break;
                         }
                    }


                        var a = moment(finalData[0].initDate, ["DD-MM-YYYY"]);
                        var b = moment(new Date(),"DD-MM-YYYY");
                        var d = (b.diff(a, "days"));
                    
                if (parseInt(d) > 7) 
                {
                    logger.info(`Link has expired for milestoneid ${milestoneId} and projectid ${projectId}`);
                    res.status(200).send({"expire": true,"already":false});
                }
                else 
                {
                    res.send(
                            {
                                "projectId": projectId,
                                "projectName": projectname,
                                "team":team, 
                                "email_content":maildata[0].email_content,
                                "milestone": finalData[0].name, 
                                "expire": false,
                                "already":false
                            });
                        }
            }
            else
            {
                logger.error("Wrong Project Id or Milestone Id is provided");
                res.status(404).send({ "Error": "Please provide Correect Project ID or Milestone ID"});
            }
        })
                
            }
        })
    }
    else
    {
        logger.error("Project ID or milestone id or user field are wrongly taking by Client or data did not provide by Client");
        res.status(404).send({ "Error": "ProjectID/MilestoneID/User is not provided"});

    }
    
})


app.get("/email", (request, response) => {


    mydb.find(
        {
            selector: 
            {
                "email_content":
                 {
                    "$eq": request.body.email_content
                }
            }
        },(er, result) => 
        {
            if (er) 
            {
                logger.error({ "Error": "No Email content Found " })
            response.status(401).send({ "Error": "No Email content Found " });
            }
            else (result.docs && (result.docs.length==1))
            {
                for (var i = 0; i < result.docs.length; i++) 
                {
                    mydb.get(result.docs[i]._id, (er, data) => 
                    {
                        if (er) {
                        logger.info('Id is not found', er.message);
                        response.status(503).send("Too many request to database");
                        return;
                     }

                   
                 });
            }
        } 
});
});


app.post("/initiate", (request, response) => 
{
   
    if (request.body.projectId  && request.body.milestone && request.body.recipient && request.body.team && request.body.projectName) 
    {
        if (!mydb) 
        {
            logger.error("No database.");
            response.status(500).send("Database connection is not ready");
            return;
        }
                   
        mydb.find(
            {
                selector: 
                {
                    "projectId":
                     {
                        "$eq": request.body.projectId
                    }
                }
            },(er, result) => 
            {
                if (er) 
                {
                    logger.error('Query Error', er.message);
                    response.status(503).send("Too many request to database");
                    return;
                }
                if (result.docs && (result.docs.length==1))
                {
                    for (var i = 0; i < result.docs.length; i++) 
                    {
                        mydb.get(result.docs[i]._id, (er, data) => 
                        {
                            if (er) {
                            logger.info('Id is not found', er.message);
                            response.status(503).send("Too many request to database");
                            return;
                         }

                        if (!data.milestone) {
                            //If data milestone field not exists in db
                            data.milestone = [request.body.milestone];
                            data.recipient = [request.body.recipient];
                                                      
                            let mailcont={};
                            mailcont["milestoneid"]=request.body.milestone.id;
                            mailcont["email_content"]=request.body.email_content;
                            data.email_content = [mailcont];
                            
                            mydb.insert(data, data._id, function (er, body, header) {
                                if (er) {
                                    logger.error('[mydb.insert] ', er.message);
                                    response.status(503).send("Too many request to database");
                                }
                                sendMail( request.body.email_content,request.body.recipient.user, request.body.recipient.name,request.body.team, request.body.projectName, request.body.milestone, request.body.projectId);
                                data._id = body.id;
                                response.send(data);
                            });
                            //End If,  Not finding data milestone
                        }
                        else {
                            data.milestone.push(request.body.milestone);
                            data.recipient.push(request.body.recipient);
                            let mailcont={};
                            mailcont["milestoneid"]=request.body.milestone.id;
                            mailcont["email_content"]=request.body.email_content; 
                            data.email_content.push(mailcont);

                             mydb.insert(data, data._id, function (er, body, header) {
                                if (er) {
                                    logger.error('[mydb.insert] ', er.message);
                                    response.status(503).send("Too many request to database");
                                    }
                                sendMail( request.body.email_content,request.body.recipient.user,  request.body.recipient.name,request.body.team, request.body.projectName, request.body.milestone, request.body.projectId);
                                data._id = body.id;
                                logger.info("Successfully Inititaed Feedback Request")
                                response.send(data);
                                });
                         }
                     });
                }
            } else {
                logger.error({ "Error": "Wrong projectID" })
                response.status(401).send({ "Error": "Wrong projectID" });
            }
});
    }// End First If
    else {
        logger.error({ "Error": "No_ProjectId_Milestone_Recipient_team" })
        response.status(401).send({ "Error": "No_ProjectId_Milestone_Recipient" });
    }
    //Closing API Bracess
});

app.get("/view", (req, res) => {
    if (req.query.projectId) {
        var names = [];
        if (!mydb) {
            res.json(names);
            return;
        }

        mydb.find({
            selector: {
                "projectId": {
                    "$eq": req.query.projectId
                }
            }

        }, (er, result) => {
            if (er) {
                logger.error(er);
                res.status(503).send("Too many requests to Database.");

            }
            if (result.docs && result.docs.length) {
                res.send(result.docs);
            }
            else {
                res.status(400).send({ "error": "wrong project id" })
            }
        });
    } else {
        res.status(400).send({ "status": "error", "msg": "projectid is not prvided" });
    }
});



//Save Feedabck From User
app.post("/feedback", (request, response) => {
    if (request.body.projectId && request.body.rating && request.body.milestone && request.body.comment && request.body.submit_date && request.body.user) {

        if (!mydb) {
            logger.error("No database.");
            response.status(500).send("Database connection is not ready");
            return;
           
        }//Closing IF

        //Find document form the unique projectid           
        mydb.find({
            selector: {
                "projectId": {
                    "$eq": request.body.projectId
                }
            }

        }, (er, result) => {
            if (er) {
                console.log('Query Error', er.message);
                response.send("Error");
                return;
            }
            if (result.docs && (result.docs.length==1)) {
                for (var i = 0; i < result.docs.length; i++) {
                    mydb.get(result.docs[i]._id, (er, data) => {
                        if (er) {
                            console.log('Id is not found', er.message);
                            response.send("Error");
                            return;
                        }


                        if (!data.milestone) {
                            //If data milestone field not exists in db
                            console.log("Data Milestone not found");
                            response.send({ "Error": "Milestone does not exists" });
                        }
                        else {
                            console.log("Found");
                            for (let k = 0; k < data.milestone.length; k++) {
                                if ((request.body.milestone.id == data.milestone[k].id) && (request.body.milestone.name == data.milestone[k].name)) {
                                    console.log("match");
                                    if (!data.milestone[k].feedback) {
                                        console.log("Feedback Does not exists");
                                        data.milestone[k].feedback = [{
                                            "user": request.body.user,
                                            "comment": request.body.comment,
                                            "rating": request.body.rating,
                                            "submit_date": request.body.submit_date,
                                        }];
                                        mydb.insert(data, data._id, function (er, body, header) {
                                            if (er) {
                                                console.log('[mydb.insert] ', er.message);
                                                response.send("Error");
                                                return;
                                            }
                                            data._id = body.id;
                                            response.send(data);
                                        });


                                    } else {
                                        console.log("Feedback Exists");
                                        data.milestone[k].feedback.push({
                                            "user": request.body.user,
                                            "comment": request.body.comment,
                                            "rating": request.body.rating,
                                            "submit_date": request.body.submit_date,
                                        });

                                        mydb.insert(data, data._id, function (er, body, header) {
                                            if (er) {
                                                console.log('[mydb.insert] ', er.message);
                                                response.send("Error");
                                                return;
                                            }
                                            data._id = body.id;
                                            response.send(data);


                                        });
                                    }
                                }

                                else {
                                    console.log("no match");

                                }

                            }



                            //End ELSE if data.milestone exits 
                        }

                        //Ending Get Request
                    });

                    //End For loop;
                }
            }
            else {
                response.send({ "Error": "Wrong_projectID" });
            }
            // Closing find braces
        });
    }
    else {
        response.send({ "Error": "No_Milestone_comment_user_rating_submit_date" });
    }
    //Closing API Bracess
});



var encrypt = function (data) {
  
     
       
            var ciphertext = CrypJs.AES.encrypt(JSON.stringify(data),"hello");
            
            logger.info("encrypted successfully");
            return ciphertext.toString()
        

 
}

var decrypt = function (data) {
    return new Promise((resolve, reject) => {
        try {
            var decrypted = JSON.parse(CrypJs.AES.decrypt(obj, process.env.Secretkey).toString(CrypJs.enc.Utf8));
            resolve(decrypted);
        } catch (exception) {
            reject({ "message": exception.message });
        }

    });
}


var sendMail = function (email_content, email, name,team, projectName, milestone, projectid) 
{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    var i = 0;
    for (let t = 0; t < email.length; t++) 
    {
        var obj = 
        {
            user: email[t],
            name:name[t],
            projectId: projectid,
            milestone: milestone
        };

        let result = encrypt(obj);
            

                const link = 'https://customerfeedback.eu-gb.mybluemix.net/#/send?r=' + encodeURIComponent(result);
                const msg = 
                {
                    to: email[t],
                    from: 'do_not_reply@in.ibm.com',
                    subject: `UI Garage Feedback - Your opinion matters!`,
                    html:
                    `<div style="font-family:Roboto;font-size: 16px;">
                    <p>Hi ${name[t]}!</p> </div> ${email_content}<div style="font-family:Roboto;font-size: 16px; text-align: left;">
                    <p>Click <a href = ${link}>here</a> to share your feedback.<p>
                    </div>
                    <div style="font-family:Roboto;font-size: 16px; text-align: left;">
                    <p>Thanks & Regards,<br>Technology Assembly Centre(TAC), India</p>
                    </div>
                    <div style="font-family:Roboto;font-size: 10px; text-align: left;">
                    <p contenteditable="false">Note: This link will expire in 7 days.</p>
                    </div>`
                };
    
                sgMail.send(msg, (err, data) => {
                    if (err) {
                        logger.error("Send Mail error");
                        logger.error(err.msg);
                        return err.msg
                    }
                    i++;
                    logger.info(`Mail sent successfully to ${email[t]}`);
                    if (i == email.length) {
                        logger.info(`Mail sent successfully to everyone`);
                        return '';
                    }
                })
      
   
    }

}

module.exports = app;



