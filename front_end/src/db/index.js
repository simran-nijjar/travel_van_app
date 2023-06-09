// Created by: Sirpreet K. Dhillon and Simran Nijjar 
// This file creates our backend and our REST APIs 

// imports
var Express = require("express");
var bodyParser = require("body-parser");


// creating an instance of express app 
var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// FILE UPLOAD 
var fileUpload = require('express-fileupload');
var fs = require('fs'); // file system module 
app.use(fileUpload());
app.use('../Pages/Images', Express.static(__dirname+'../Pages/Images'));


// CORS
var cors = require("cors");
app.use(cors()); // can use corsOptions but will leave as is for travelvan project 

// MYSQL DB
var mysql = require("mysql");
const { request, response } = require("express");
const e = require("express");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'travelvan'
});


// APP listening on PORT = 49146 --> http://localhost:49146 
app.listen(49146, ()=>{
    connection.connect(function(err){
        if(err) throw err;
        console.log('Connected to TravelVan DB');
    });
});

// '/' means that it will be the root path/url
app.get('/', (request, response)=>{
    response.send('Travel Van Web Application Setup Tested!')
;})


// API Methods : GET POST PUT ... 
// Table1: user_table

/* select all data from the table */
app.get('/api/user_table',(request, response)=>{

    var query = `SELECT * FROM travelvan.user_table`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from user_table!');
        }
        response.send(rows);
    });

});
/* insert single data into the table */
app.post('/api/createaccount',(request, response)=>{

    var query = `INSERT INTO travelvan.user_table
                (Name, UserId, Phone, Password) VALUES (?, ?, ?, ?) `;
    var values = [request.body['Name'],request.body['UserId'],request.body['Phone'],request.body['Password']];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to insert user in user_table!');
        }
        response.json('Added data into user_table');
    });

});
/* update name in a given record */
app.put('/api/user_table/name',(request, response)=>{

    var query = `UPDATE travelvan.user_table
                SET Name=? WHERE UserId=?`;
    var values = [
        request.body['Name'],
        request.body['UserId']
    ];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to update user name in user_table!');
        }
        response.json('Updated User Name in user_table Successfully!');
    });

});
/* update phone in a given record */
app.put('/api/updatephone',(request, response)=>{

    var query = `UPDATE travelvan.user_table
                SET Phone=? WHERE UserId=?`;
    var values = [
        request.body['Phone'],
        request.body['UserId']
    ];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to update user phone in user_table!');
        }
        response.json('Updated User Phone number in user_table Successfully!');
    });

});
/* update data in a given record */
app.put('/api/user_table',(request, response)=>{

    var query = `UPDATE travelvan.user_table
                SET Name=?,
                Phone=? 
                WHERE UserId=?`;
    var values = [
        request.body['Name'], 
        request.body['Phone'],
        request.body['UserId'] // make sure to add the userId 
                               // or the varaible for WHERE cond. at the end
    ];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to update user data in user_table!');
        }
        response.json('Updated User Data in user_table Successfully!');
    });

});
/* delete a user --> not sending the id in values but instead from the URL itself*/
app.post('/api/deleteaccount',(request, response)=>{

    var query = `DELETE from travelvan.user_table WHERE UserId=?`;
    var values = [
        request.body['UserId']
    ];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to delete user in user_table!');
        }
        response.json('Deleted user Successfully!');
    });

});

// AUTHENTICATION
/* select all data from the table */
app.post('/api/signin',(request, response)=>{

    var query = `SELECT UserId, Name, Phone FROM travelvan.user_table where UserId=? and password=?`;
    var values = [
        request.body['UserId'],
        request.body['password']
    ];
    connection.query(query, values, function(err,rows,fields){
        if(err){
            response.send('Failed select query from user_table!');
        }
        if(!rows.length){
            response.json("User does not exist");
        }else {
                response.send(rows);
        } 
        //response.send(rows)       
    });

});

app.post('/api/register',(request, response)=>{

    var query = `INSERT into travelvan.user_table
                (Name, UserId, Phone, Password) VALUES (?, ?, ?,?) `;
    var values = [request.body['Name'],request.body['UserId'],request.body['Phone'],request.body['Password']];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to insert user in user_table!');
        }
        response.json('Added data into user_table');
    });

});



//Table2: Arriveby
app.get('/api/arriveby',(request, response)=>{

    var query = `SELECT * FROM travelvan.arriveby`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from arriveby!');
        }
        response.send(rows);
    });

});

//Table3: businessperson
app.get('/api/businessperson',(request, response)=>{

    var query = `SELECT * FROM travelvan.businessperson`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from businessperson!');
        }
        response.send(rows);
    });

});

//Table4: club
app.get('/api/club',(request, response)=>{

    var query = `SELECT * FROM travelvan.club`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from club!');
        }
        response.send(rows);
    });

});

//Projection by Club Name
app.get('/api/clubname',(request, response)=>{

    var query = `SELECT ClubID, Name FROM travelvan.club`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from club!');
        }
        response.send(rows);
    });

});

//Projection by Club Address
app.get('/api/clubaddress',(request, response)=>{

    var query = `SELECT ClubID, Address FROM travelvan.club`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from club!');
        }
        response.send(rows);
    });

});

//Projection by Club Fee
app.get('/api/clubfee',(request, response)=>{

    var query = `SELECT ClubID, Fee FROM travelvan.club`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from club!');
        }
        response.send(rows);
    });

});

//Table5: concert
app.get('/api/concert',(request, response)=>{

    var query = `SELECT * FROM travelvan.concert`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from concert!');
        }
        response.send(rows);
    });

});

//Aggregation by MIN(Cost) of Club
app.get('/api/concertmin',(request, response)=>{

    var query = `SELECT ConcertID, Price, Name, Address, Date FROM travelvan.concert WHERE Price = (SELECT MIN(Price) FROM travelvan.concert)`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from concert!');
        }
        response.send(rows);
    });

});

//Aggregation by MAX(Cost) of Club
app.get('/api/concertmax',(request, response)=>{

    var query = `SELECT ConcertID, Price, Name, Address, Date FROM travelvan.concert WHERE PRICE = (SELECT MAX(Price) FROM travelvan.concert)`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from concert!');
        }
        response.send(rows);
    });

});

//Table6: desirestogoto
app.get('/api/desirestogoto',(request, response)=>{

    var query = `SELECT * FROM travelvan.desirestogoto`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from desirestogoto!');
        }
        response.send(rows);
    });

});

//Table7: emergencymedicalservice
app.get('/api/emergencymedicalservice',(request, response)=>{

    var query = `SELECT * FROM travelvan.emergencymedicalservice`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from emergencymedicalservice!');
        }
        response.send(rows);
    });

});

//Table8: follows
app.get('/api/follows',(request, response)=>{

    var query = `SELECT * FROM travelvan.follows`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from follows!');
        }
        response.send(rows);
    });

});


//Table9: hadpersonalposts
app.get('/api/hadpersonalposts',(request, response)=>{

    var query = `SELECT * FROM travelvan.hadpersonalposts`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from hadpersonalposts!');
        }
        response.send(rows);
    });

});

//Table10: hadpictures
app.get('/api/hadpictures',(request, response)=>{

    var query = `SELECT * FROM travelvan.hadpictures`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from hadpictures!');
        }
        response.send(rows);
    });

});

//Table11: malls
app.get('/api/malls',(request, response)=>{

    var query = `SELECT * FROM travelvan.malls`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from malls!');
        }
        response.send(rows);
    });

});

//Table12: medicalservice
app.get('/api/medicalservice',(request, response)=>{

    var query = `SELECT * FROM travelvan.medicalservice`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from medicalservice!');
        }
        response.send(rows);
    });

});

//Table13: nonemergencymedicalservice
app.get('/api/nonemergencymedicalservice',(request, response)=>{

    var query = `SELECT * FROM travelvan.nonemergencymedicalservice`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from nonemergencymedicalservice!');
        }
        response.send(rows);
    });

});


//Table14: ownedplace
app.get('/api/ownedplace',(request, response)=>{

    var query = `SELECT * FROM travelvan.ownedplace`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from ownedplace!');
        }
        response.send(rows);
    });

});


//Table15: park
app.get('/api/park',(request, response)=>{

    var query = `SELECT * FROM travelvan.park`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from park!');
        }
        response.send(rows);
    });

});

//Table16: postedreviews
app.get('/api/postedreviews',(request, response)=>{

    var query = `SELECT * FROM travelvan.postedreviews`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from postedreviews!');
        }
        response.send(rows);
    });

});

//Table17: privatetransport
app.get('/api/privatetransport',(request, response)=>{

    var query = `SELECT * FROM travelvan.privatetransport`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from privatetransport!');
        }
        response.send(rows);
    });

});


//Table18: 	publictransport
app.get('/api/publictransport',(request, response)=>{

    var query = `SELECT * FROM travelvan.publictransport`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from publictransport!');
        }
        response.send(rows);
    });

});


//Table19: recreationcenters
app.get('/api/recreationcenters',(request, response)=>{

    var query = `SELECT * FROM travelvan.recreationcenters`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from recreationcenters!');
        }
        response.send(rows);
    });

});


//Table20: requires
app.get('/api/requires',(request, response)=>{

    var query = `SELECT * FROM travelvan.requires`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from requires!');
        }
        response.send(rows);
    });

});


//Table21: restaurant
app.get('/api/Restaurant',(request, response)=>{

    var query = `SELECT * FROM TravelVan.Restaurant`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from restaurant!');
        }
        response.send(rows);
    });

});

//Select by dress code in Restaurant
app.post('/api/RestaurantDressCode',(request, response)=>{

    var query = `SELECT RestaurantID, Name, dressCode FROM TravelVan.Restaurant WHERE dressCode = ?`;
    var values = [
        request.body['dressCode']
    ];
    connection.query(query,values,function(err,rows,fields){
        if(err){
            response.send('Failed select query from restaurant!');
        }
        if(!rows.length){
            response.json("Dress code does not exist");
        }
        response.send(rows);
    });

});

//Nested aggregation with group by in Restaurant
app.get('/api/RestaurantsAvgCost',(request, response)=>{

    var query = `SELECT RestaurantID, dressCode, Cost FROM TravelVan.Restaurant WHERE Cost = (SELECT AVG(Cost) FROM travelvan.Restaurant) GROUP BY dressCode`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from restaurant!');
        }
        response.send(rows);
    });

});

//Table22: tourist
app.get('/api/tourist',(request, response)=>{

    var query = `SELECT * FROM travelvan.tourist`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from tourist!');
        }
        response.send(rows);
    });

});

//Table23: transport
app.get('/api/transport',(request, response)=>{

    var query = `SELECT * FROM travelvan.transport`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from transport!');
        }
        response.send(rows);
    });

});

//Nested aggregation by group by in Transport
app.get('/api/underavg',(request, response)=>{

    var query = `SELECT TransportID, Cost FROM  travelvan.transport WHERE Cost < (SELECT AVG(Cost) FROM travelvan.transport)`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from transport!');
        }
        response.send(rows);
    });

});

// File or Photo Uploads
app.post('/api/photo_upload',(request, response)=>{

    //var values = request.body['pictureId']
    fs.writeFile("../Pages/Images/"+request.files.file.name,
    request.files.file.data, function(err){
        if(err){
            return 
            console.log(err);
        }
        response.send(request.files.file.name);
    })

});


// Join Query of REVIEWS
app.get('/api/selectreviews',(request, response)=>{

    var query = `SELECT ownedplace.placeid, ownedplace.Name, ownedplace.Address, postedreviews.Ratings, postedreviews.w_review
                FROM postedreviews 
                INNER JOIN ownedplace ON postedreviews.Placeid=ownedplace.Placeid
                ORDER BY ownedplace.Placeid`;
    connection.query(query, function(err,rows,fields){
        if(err){
            response.send('Failed select query from reviews!');
        }
        response.send(rows);
    });

});

// INSERT OPERATION REVIEWS
app.post('/api/insertreviews',(request, response)=>{

    var query = `INSERT INTO travelvan.postedreviews
                (Placeid, ReviewerId, Ratings, w_review) VALUES (?, ?, ?, ?) `;
    var values = [request.body['Placeid'],request.body['Reviewerid'],request.body['Ratings'],request.body['w_review']];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed!');
        }
        response.json('Added');
    });

});

//Division query of reviews
app.post('/api/findreviews',(request, response)=>{
    var query = `SELECT * FROM TravelVan.postedreviews WHERE Reviewerid = ?`;
    var values = [request.body['Reviewerid']];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed!');
        }
        response.send(rows);
    });

});

//get Review Id to add pictures

app.post('/api/getreviewid',(request, response)=>{

    var query = `SELECT postedreviews.Reviewid FROM postedreviews WHERE Placeid=? and ReviewerId=?`;
    var values = [request.body['Placeid'],request.body['ReviewerId']];
    
    connection.query(query, values,function(err,rows,fields){
        if(err){
            response.send('Failed to get review_id!');
        }
        response.send(rows);
    });

});
