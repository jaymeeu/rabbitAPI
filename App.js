const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "rabbit"
});

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//insert into doe table
app.post("/insertDoe", async (req, res) => {
  const {name, type,cageNo, description } = req.body;
  const state = "Available";
  const form = "Doe";
  
  const check = "SELECT * FROM doelist WHERE name = ?"
  await db.query(check, name, (abs, pre) =>{
    if(pre.length > 0){
      res.send({message:"Doe Name Already Exist"});
      }
    else{
        const count = "SELECT COUNT (*) as count from doelist"
        db.query(count, (abs2, pre2) =>{
          const num = pre2[0].count + 1;
          if (num > 0){
            const countupdate = "UPDATE count SET number = ? WHERE name = ?"
            db.query(countupdate, [num, "Doe"], (abs, pre) =>{
              
            })
          }
        });
        const sqlInsert = "INSERT INTO doelist (name, type, state, cageNo, description, form) VALUES (?,?,?,?,?,?)";
        db.query(sqlInsert, [name, type, state, cageNo, description, form], (err, result) => {
          res.send({message:"doe inserted"});
        });
        const date = new Date().toString();
        const activity = `${name} is added to doe list`
        const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
        db.query(sqlActivity, [activity, date], (err, result) => {
            
        });
    }
  })
});

  // Chart Data
  app.get("/chartData", async (req, res) => {
    const sqlSelect = "SELECT * from count";
    await db.query(sqlSelect, (err, result) => {
      const data = JSON.stringify(result)
        res.send(data);
    });
  });

  // get all doe
app.get("/getDoes", async (req, res) => {
    const sqlSelect = "SELECT * FROM doelist";
    await db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
  });

  //insert into buck table
  app.post("/insertBuck", async (req, res) => {
    const {name, type,cageNo, description } = req.body;
    const state = "Available";
    const form = "Buck";
    
    const check = "SELECT * FROM bucklist WHERE name = ?"
    await db.query(check, name, (abs, pre) =>{
      if(pre.length > 0){
        res.send({message:"Buck Name Already Exist"});
        }
      else{
        const count = "SELECT COUNT (*) as count from bucklist"
        db.query(count, (abs2, pre2) =>{
          const num = pre2[0].count + 1;
          if (num > 0){
            console.log(num)
            const countupdate = "UPDATE count SET number = ? WHERE name = ?"
            db.query(countupdate, [num, "Buck"], (abs, pre) =>{
              
            })
          }
        });

        const sqlInsert = "INSERT INTO bucklist (name, type, state, cageNo, description, form) VALUES (?,?,?,?,?,?)";
        db.query(sqlInsert, [name, type, state, cageNo, description, form], (err, result) => {
          res.send({message:"buck inserted"});
        });

        const date = new Date().toString();
        const activity = `${name} is added to buck list`
        const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
         db.query(sqlActivity, [activity, date], (err, result) => {
            
        });
      }
    })
  });

  //get all bucks
app.get("/getBucks", async (req, res) => {
    const sqlSelect = "SELECT * FROM bucklist";
    await db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
  });

  app.post("/insertKitten", async (req, res) => {
    const {category, type, pDoe, pBuck, mKitten, fKitten, tKitten, description, dateProduced } = req.body;
    const sqlInsert = "INSERT INTO kittenlist (categoryName, parentDoe, parentBuck, description, type, count, numberMale, numberFemale, dateProduced ) VALUES (?,?,?,?,?,?,?,?,?)";
    await db.query(sqlInsert, [category, pDoe, pBuck, description, type,tKitten, mKitten, fKitten, dateProduced  ], (err, result) => {
        console.log(err);
    });

    const date = new Date().toString();
    const activity = `${category} is added to kitten list`
    const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
    db.query(sqlActivity, [activity, date], (err, result) => {
        console.log(err);
    });
  }); 

  app.get("/getKittens", async (req, res) => {
    const sqlSelect = "SELECT * FROM kittenlist";
    await db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
  });

  app.post("/getKit", async (req, res) => {
    const kittenName = req.body.kittenName;
    const sqlSelect = "SELECT * FROM kittenlist WHERE categoryName = ? ";
    await db.query(sqlSelect, kittenName, (err, result) => {
        res.send(result);
    });
  });
// get rabbit medical history
  app.post("/getMed", async (req, res) => {
    const name = req.body.name;
    const sqlSelect = "SELECT * FROM medical_report WHERE rabbitName = ? ";
    await db.query(sqlSelect, name, (err, result) => {
        res.send(result);
    });
  });

// update buck state
app.put("/updateBuck", async (req, res) => {
  const {rabbitName, selectedState} = req.body;
  const sqlUpdate = "UPDATE bucklist SET state = ? WHERE name = ? ";
  await db.query(sqlUpdate, [selectedState, rabbitName], (err, result) => {
      res.send(result);
  });
  const date = new Date().toString();
    const activity = `${rabbitName} state is changed ${selectedState}`
    const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
    db.query(sqlActivity, [activity, date], (err, result) => {
        console.log(err);
    });
});

// update doe state
app.put("/updateDoe", async (req, res) => {
  const {rabbitName, rabbitState, selectedState, dateCrossed, selectedDate, mkit, fkit, tmale, tfemale, tkitten} = req.body;
  if (rabbitState == "Bred"){
    if(selectedState == "Available"){
      const sqlUpdate = "UPDATE doelist SET state = ? WHERE name = ? ";
      await db.query(sqlUpdate, [selectedState, rabbitName], (err, result) => {
          res.send(result);
      });

      const date = new Date().toString();
      const activity = `${rabbitName} state is changed to ${selectedState}`
      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
       db.query(sqlActivity, [activity, date], (err, result) => {
        
      });
    }
    else {
      const getDoeTrack = "SELECT * FROM tracker WHERE form = ?"
        db.query(getDoeTrack, "Doe", (fail, pass)=> {
            const checkPreg = parseInt(pass[0].checkPreg)
            const addNest = parseInt(pass[0].addNest)
            const expectedDelivery = parseInt(pass[0].expectedDelivery)

            const addNestDate =new Date(dateCrossed);
            addNestDate.setDate(addNestDate.getDate() + (checkPreg + addNest));
            const addNestDates = addNestDate.toString();

            const expectedDeliveryDate =new Date(dateCrossed);
            expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + (checkPreg + addNest + expectedDelivery));
            const expectedDeliveryDates = expectedDeliveryDate.toString();

            const sqlUpdateDoe = "UPDATE doelist SET state = ?, addNest = ?, expectedDelivery = ? WHERE name = ? ";
           db.query(sqlUpdateDoe, [selectedState, addNestDates, expectedDeliveryDates, rabbitName ], (err, result) => {
           }); 

           const date = new Date().toString();
            const activity = `${rabbitName} state is changed to ${selectedState}`
            const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
            db.query(sqlActivity, [activity, date], (err, result) => {
              
            });
      })  
    }
  }
  else{
    if(selectedState == "Available")
      {
        const sqlUpdate = "UPDATE doelist SET state = ? WHERE name = ? ";
        await db.query(sqlUpdate, [selectedState, rabbitName], (err, result) => {
            res.send(result);
        });
        const date = new Date().toString();
        const activity = `${rabbitName} state is changed to ${selectedState}`
        const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
        db.query(sqlActivity, [activity, date], (err, result) => {
          
        });
      }
    else
      {
        const getDoeTrack = "SELECT * FROM tracker WHERE form = ?"
        db.query(getDoeTrack, "Doe", (fail, pass)=> {
            const removeNest = parseInt(pass[0].removeNest)
            const okToRebreed = parseInt(pass[0].okToRebreed)

            const removeNestDate =new Date(selectedDate);
            removeNestDate.setDate(removeNestDate.getDate() + removeNest);
            const removeNestDates = removeNestDate.toString();

            const okToRebreedDate =new Date(selectedDate);
            okToRebreedDate.setDate(okToRebreedDate.getDate() + (removeNest + okToRebreed));
            const okToRebreedDates = okToRebreedDate.toString();

            const totalKit = parseInt(mkit) + parseInt(fkit);
            const newFTotal = parseInt(fkit) + parseInt(tfemale);
            const newTmale = parseInt(mkit) + parseInt(tmale);
            const newTotal = parseInt(tkitten) + totalKit;
            const sqlUpdateDoe = "UPDATE doelist SET state = ?, actualDelivery = ?, removeNest = ?, okToRebreed = ?, lastKit = ?, lastMale = ?, lastFemale = ?, totalMale = ?, totalFemale = ?, totalKit = ? WHERE name = ? ";
           db.query(sqlUpdateDoe, [selectedState, selectedDate, removeNestDates, okToRebreedDates, totalKit, mkit, fkit, newTmale, newFTotal, newTotal, rabbitName ], (err, result) => {
             console.log(err)
           }); 

           const date = new Date().toString();
            const activity = `${rabbitName} state is changed to ${selectedState}`
            const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
            db.query(sqlActivity, [activity, date], (err, result) => {
              
            });
      }) 

      }
     
    }
    
});

// update rabbit state from available to bred
  app.put("/breed", async (req, res) => {
    const values = req.body;
    const rabbitName = values.rabbitName;
    const dates = values.date;
    const form = values.form;
    const state = "Bred";
    const selectedRabbit = values.selectedRabbit;
    
    if (form == "Buck"){
      const getBuckTrack = "SELECT okToRebreed FROM tracker WHERE form = ?"
      await db.query(getBuckTrack, form, (fails, pas)=> {
        const val = pas[0].okToRebreed
        const numberOfDays = parseInt(val)
        const expectedReadyDate =new Date(dates)
        expectedReadyDate.setDate(expectedReadyDate.getDate() + numberOfDays);
        const expectedReady = expectedReadyDate.toString()

        if (expectedReadyDate){
          const sqlUpdate = "UPDATE bucklist SET state = ?, doeBredWith = ?, dateCrossed = ?, expectedReadyDate = ? WHERE name = ? ";
           db.query(sqlUpdate, [state, selectedRabbit,dates, expectedReady, rabbitName ], (err, result) => {
            
          }); 

          const schedule = `Check if ${rabbitName} is Available`;
          const insertSchedule = "INSERT INTO schedules (schedule, date) VALUES (?,?)"
          db.query(insertSchedule, [schedule, expectedReady])

          const getDoeTrack = "SELECT * FROM tracker WHERE form = ?"
            db.query(getDoeTrack, "Doe", (fail, pass)=> {
            const checkPreg = parseInt(pass[0].checkPreg)
            
            const checkPregDate =new Date(dates);
            checkPregDate.setDate(checkPregDate.getDate() + checkPreg);
            const checkPregDates = checkPregDate.toString();
        
          const sqlUpdateDoe = "UPDATE doelist SET state = ?, buckBredWith = ?, dateCrossed = ?, checkPreg = ? WHERE name = ? ";
           db.query(sqlUpdateDoe, [state, rabbitName, dates, checkPregDates, selectedRabbit ], (err, result) => {
           }); 

            const schedule = `Check if ${selectedRabbit} is Pregnant`;
           const insertSchedule = "INSERT INTO schedules (schedule, date) VALUES (?,?)"
           db.query(insertSchedule, [schedule, checkPregDates])

           const date = new Date().toString();
            const activity = `${rabbitName} is bred with ${selectedRabbit}`
            const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
            db.query(sqlActivity, [activity, date], (err, result) => {
              
            });
          }); 
        }
        else{res.send({message: "Set Buck Trackers First"})}
      })
    }
    else{
      const getBuckTrack = "SELECT * FROM tracker WHERE form = ?"
      await db.query(getBuckTrack, form, (fail, pass)=> {
        const checkPreg = parseInt(pass[0].checkPreg)

        const checkPregDate =new Date(dates);
        checkPregDate.setDate(checkPregDate.getDate() + checkPreg);
        const checkPregDates = checkPregDate.toString();

        if (checkPreg){
            const sqlUpdate = "UPDATE doelist SET state = ?, buckBredWith = ?, dateCrossed = ?, checkPreg = ? WHERE name = ? ";
            db.query(sqlUpdate, [state, selectedRabbit,dates, checkPregDates, rabbitName ], (err, result) => {
              
            }); 
            const schedule = `Check if ${rabbitName} is Pregnant`;
            const insertSchedule = "INSERT INTO schedules (schedule, date) VALUES (?,?)"
            db.query(insertSchedule, [schedule, checkPregDates], (err, result)=>{})
            
            const getDoeTrack = "SELECT okToRebreed FROM tracker WHERE form = ?"
            db.query(getDoeTrack, "Buck", (fails, pas)=> {
              const val = pas[0].okToRebreed
              const numberOfDays = parseInt(val)
              const expectedReadyDate =new Date(dates)
              expectedReadyDate.setDate(expectedReadyDate.getDate() + numberOfDays);
              const expectedReady = expectedReadyDate.toString()

            const sqlUpdateBuck = "UPDATE bucklist SET state = ?, doeBredWith = ?, dateCrossed = ?, expectedReadyDate = ? WHERE name = ? ";
            db.query(sqlUpdateBuck, [state, rabbitName, dates, expectedReady, selectedRabbit ], (err, result) => {
            }); 
            const schedule = `Check if ${selectedRabbit} is Available`;
            const insertSchedule = "INSERT INTO schedules (schedule, date) VALUES (?,?)"
            db.query(insertSchedule, [schedule, expectedReady])
   
            const date = new Date().toString();
            const activity = `${rabbitName} is bred with ${selectedRabbit}`
            const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
            db.query(sqlActivity, [activity, date], (err, result) => {
              
            });
          });
        }
        else{res.send({message: "Set Buck Trackers First"})}
      })
    }
  });

  // update tracker
  app.put("/tracker", async (req, res) => {
    const values = req.body;
    const checkPreg = values.checkPreg;
    const addNest = values.addNest;
    const expectedDelivery = values.expectedDelivery;
    const actualDelivery = values.actualDelivery;
    const removeNest = values.removeNest;
    const rebreed = values.rebreed;
    const startWeaning = values.startWeaning;
    const endWeaning = values.endWeaning;
    const ready = values.ready;
    const seperateG = values.seperateG;
    const seperateC = values.seperateC;
    const readyB = values.readyB;
    const form  =  values.form;
    
    if (form == "Doe"){
      const sqlUpdate = "UPDATE tracker SET checkPreg = ?, addNest = ?, expectedDelivery = ?, actualDelivery = ?, removeNest = ?, okToRebreed = ? WHERE form = ? ";
      await db.query(sqlUpdate, [checkPreg, addNest,expectedDelivery, actualDelivery, removeNest, rebreed, form ], (err, result) => {
        res.send(result);
      });

      const date = new Date().toString();
      const activity = "Doe Tracker Updated"
      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
      db.query(sqlActivity, [activity, date], (err, result) => {
        
      });

    }
    else if (form == 'Buck'){
      const sqlUpdate = "UPDATE tracker SET okToRebreed = ? WHERE form = ? ";
      await db.query(sqlUpdate, [rebreed, form ], (err, result) => {
        // res.send(result);
      });
      
      const date = new Date().toString();
      const activity = "Buck Tracker Updated"
      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
       db.query(sqlActivity, [activity, date], (err, result) => {
      });
    }
    else{
      const sqlUpdate = "UPDATE tracker SET startWeaning = ?, endWeaning = ?, readySell = ?, seperateGender = ?, seperateCage = ?, okToBreed = ? WHERE form = ? ";
      await db.query(sqlUpdate, [startWeaning, endWeaning,ready, seperateG, seperateC, readyB, form ], (err, result) => {
        // res.send(result);
      });
      
      const date = new Date().toString();
      const activity = "Kit Tracker Updated"
      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
       db.query(sqlActivity, [activity, date], (err, result) => {
       });
    }
  });

// delete from rabbit table and insert it into deleterabbit table
  app.put("/delete", async (req, res) => {
    const {rabbitName, date, buyer, form, price,description, option} = req.body;
    //buck start here...  
    if (form == "Buck")
        {
            const sqlDelete = "DELETE FROM bucklist WHERE name = ? ";
            await db.query(sqlDelete, rabbitName, (err, result) => {
              res.send(result);
            });
              
              const count = "SELECT COUNT (*) as count from bucklist"
                db.query(count, (abs2, pre2) =>{
                const num = pre2[0].count -1;
                  if (num > 0){
                    const countupdate = "UPDATE count SET number = ? WHERE name = ?"
                    db.query(countupdate, [num, "Buck"], (abs, pre) =>{})
                    }
                  });

                if (option == "Sold")
                  {
                      const sqlInsert = "INSERT INTO sales (rabbitName, buyer, price, description, date) VALUES (?,?,?,?)"
                      await db.query(sqlInsert, [rabbitName,buyer, price, description, date], (err, result) => {
                      });
                      const sqlInsertDelete = "INSERT INTO deleterabbit (name, whyDelete, dateDelete) VALUES (?,?,?)"
                      await db.query(sqlInsertDelete, [rabbitName, option,date], (err, result) => {
                      });
                      
                      const dated = new Date().toString();
                      const activity = `${rabbitName} Got Sold`
                      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
                      db.query(sqlActivity, [activity, dated], (err, result) => {
                        
                      });
                    }
                else
                    {
                      const sqlInsert = "INSERT INTO deleterabbit (name, whyDelete, dateDelete) VALUES (?,?,?)"
                      await db.query(sqlInsert, [rabbitName, option, date], (err, result) => {
                      });
                        const dated = new Date().toString();
                        const activity = `${rabbitName} is removed (death)`
                        const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
                        db.query(sqlActivity, [activity, dated], (err, result) => {});
                    }
          }
          //buck end here...
          //doe start here...
      else{
              const sqlDelete = "DELETE FROM doelist WHERE name = ? ";
              await db.query(sqlDelete, rabbitName, (err, result) => {
                res.send(result); 
              });
                const count = "SELECT COUNT (*) as count from doelist"
                db.query(count, (abs2, pre2) =>{
                  const num = pre2[0].count - 1;
                  if (num > 0){
                    const countupdate = "UPDATE count SET number = ? WHERE name = ?"
                    db.query(countupdate, [num, "Doe"], (abs, pre) =>{
                      
                    })
                  }
                });

              if (option == "Sold"){
                  const sqlInsert = "INSERT INTO sales (rabbitName, price, description, date) VALUES (?,?,?,?)"
                  await db.query(sqlInsert, [rabbitName, price,description, date], (err, result) => {
                  });
                  const sqlInsertDelete = "INSERT INTO deleterabbit (name, whyDelete, dateDelete) VALUES (?,?,?)"
                  await db.query(sqlInsertDelete, [rabbitName, option,date], (err, result) => {
                  }); 

                  const dates = new Date().toString();
                  const activity = `${rabbitName} Got Sold`
                  const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
                  db.query(sqlActivity, [activity, dates], (err, result) => {
                    
                  });
                }
                
              else{
                  const sqlInsert = "INSERT INTO deleterabbit (name, whyDelete, dateDelete) VALUES (?,?,?)"
                  await db.query(sqlInsert, [rabbitName, option,date], (err, result) => {
                  });

                  const dates = new Date().toString();
                  const activity = `${rabbitName} is removed (death)`
                  const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
                  db.query(sqlActivity, [activity, dates], (err, result) => {
                    
                  });
                }
        }    
        //doe ends here...
    });

  //add mediaction from rabbit
  app.post("/medication", async (req, res) => {
    const values = req.body;
    const rabbitName = values.rabbitName;
    const sickness = values.sickness;
    const description = values.description;
    const medication = values.medication;
    const observation = values.observation;
    const date = values.date;

    const Insert = "INSERT INTO medical_report (rabbitName, sickness, description, medication, observation, dates) VALUES (?,?,?,?,?,?)";
    await db.query(Insert, [rabbitName, sickness, description, medication, observation, date], (err, result) => {
        
    });
      const dates = new Date().toString();
      const activity = `${medication} administered to ${rabbitName} for ${sickness}`
      const sqlActivity = "INSERT INTO activity_report (activity, date) VALUES (?,?)";
      db.query(sqlActivity, [activity, dates], (err, result) => {
        
      });
  });
 
  //get available Rabbit
  app.get("/getAvailDoe", async (req, res) =>{
      const select = "SELECT id, name FROM doelist WHERE state = ?"
      await db.query (select, "Available", (err, result)=>{
        res.send(result);
        console.log(err) 
      });
  })

  //get available Rabbit
  app.get("/getAvailBuck", async (req, res) =>{
    const select = "SELECT id, name FROM bucklist WHERE state = ?"
    await db.query (select, "Available", (err, result)=>{
      res.send(result);
      console.log(err) 
    });
  })

   //get available Rabbit
   app.get("/getReport", async (req, res) =>{
    const select = "SELECT * FROM activity_report ORDER BY id DESC"
    await db.query (select, (err, result)=>{
      res.send(result);
    });
  })

   //get available Rabbit
   app.get("/getSales", async (req, res) =>{
    const select = "SELECT * FROM sales"
    await db.query (select, (err, result)=>{
      res.send(result);
    });
  })

   app.post("/getTrack", async (req, res) => {
    const form = req.body.rabbitForm;
    const Select = "SELECT * FROM tracker WHERE form = ?";
    await db.query(Select, form, (err, result) => {
      res.send(result);
    });
  });
  
  app.get("/getWeaners", async (req, res) => {
    const sqlSelect = "SELECT * FROM weanerlist";
    await db.query(sqlSelect, (err, result) => {
      res.send(result);
    });
  });

  app.post("/getWeaner", async (req, res) => {
    const WeanerName = req.body.WeanerName;
    const sqlSelect = "SELECT * FROM weanerlist WHERE categoryName = ? ";
    await db.query(sqlSelect, WeanerName, (err, result) => {
      res.send(result);
    });
  });

var server = app.listen(3000, ()=>{
    var port = server.address().port
    console.log('Running on port ' + port)
}); 