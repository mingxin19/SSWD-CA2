// Import router package 
const router = require('express').Router(); 

//import passport package
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Import validation package 
let validator = require('validator');

// require database connection
const {sql, dbConnPoolPromise} = require('../database/db.js');



// Define SQL statements here for use in function below 
// These are parameterised queries note @named parameters. 
// Input parameters are parsed and set before queries are executed 

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM dbo.Novel for json path;'; 

// without_array_wrapper - use for single result 
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.Novel WHERE Novel_Id = @id for json path, without_array_wrapper;'; 

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_AUTHID = 'SELECT * FROM dbo.Novel WHERE Author_Id = @id ORDER BY Novel_Name ASC for json path;';

const SQL_SELECT_BY_TYPEID = 'SELECT * FROM dbo.Type WHERE Type_Id = @id ORDER BY Novel_Name ASC for json path;';

// Second statement (Select...) returns inserted record identified by Novel_Id = SCOPE_IDENTITY() 
const SQL_INSERT = 'INSERT INTO dbo.Novel (Author_Id, Type_Id, Novel_Name, Novel_Description, Novel_Word_Count, Novel_Like) VALUES (@authorId, @typeId, @novelName, @novelDescription, @novelWordCount, @likes); SELECT * from dbo.Novel WHERE Novel_Id = SCOPE_IDENTITY();'; 

const SQL_UPDATE = 'UPDATE dbo.Novel SET Author_Id = @authorId, Type_Id = @typeId, Novel_Name = @novelName, Novel_Description = @novelDescription, Novel_Word_Count = @novelWordCount, Novel_Like = @likes WHERE Novel_Id = @id; SELECT * FROM dbo.Novel WHERE Novel_Id = @id;'; 

const SQL_DELETE = 'DELETE FROM dbo.Novel WHERE Novel_Id = @id;'; 



//GET all novels, returns JSON - "localhost:8080/novel"
router.get('/', async (req, res) =>{

    //GET database connection and execute SQL
    try{
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            //execute query
            .query(SQL_SELECT_ALL);

        //Send HTTP response, JSON data is in the first element of recordset of the result variable
        res.json(result.recordset[0]);

    }catch(err){ //catch and return/show the errors
        res.status(500);
        res.send(err.message);
    }

});



//GET novel by id, returns JSON, id is a parameter in the url - "localhost:8080/novel/:id"
router.get('/:id', async (req, res) =>{

    // read value of id parameter from the request url
    const novel_Id = req.params.id;

    //validation on the id if DB - Novel table had novel with that id
    //bad input could led to crash of server or lead to attack
    //if validation fail, a message will be return 
    if(!validator.isNumeric(novel_Id, {no_symbols:true})){
        res.json({"error":"invalid id parameter"});
        return false;
    }

    //GET database connection and execute SQL
    try{
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('id', sql.Int, novel_Id)
            //execute query
            .query(SQL_SELECT_BY_ID);

        //Send HTTP response, JSON data is in the recordset of the result variable
        res.json(result.recordset);

    }catch(err){ //catch and return/show the errors
        res.status(500);
        res.send(err.message);
    }

});



//GET novel by author id, returns JSON, id is a parameter in the url - "localhost:8080/novel/byAuthor/:id"
router.get('/byAuthor/:id', async (req, res) => {

    // read value of id parameter from the request url
    const author_Id = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(author_Id, { no_symbols: true })) {
        res.json({ "error": "invalid author id parameter" });
        return false;
    }

    // If validation passed execute query and return results
    // returns a novel with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, author_Id)
            // execute query
            .query(SQL_SELECT_BY_AUTHID);

        // Send response with JSON result    
        res.json(result.recordset[0])

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});



//GET novel by type id, returns JSON, id is a parameter in the url - "localhost:8080/novel/byType/:id"
router.get('/byType/:id', async (req, res) => {

    // read value of id parameter from the request url
    const type_Id = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(type_Id, { no_symbols: true })) {
        res.json({ "error": "invalid type id parameter" });
        return false;
    }

    // If validation passed execute query and return results
    // returns a novel with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, type_Id)
            // execute query
            .query(SQL_SELECT_BY_TYPEID);

        // Send response with JSON result    
        res.json(result.recordset[0])

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});



// POST - Insert a new novel. 
// This async function sends a HTTP post request 
router.post('/', passport.authenticate('jwt', { session: false}), async (req, res) => { 

    // Validate - this string, inially empty, will store any errors 
    let errors = ""; 
    
    // Make sure that author id is just a number - note that values are read from request body 
    const author_Id = req.body.authorId; 
    if (!validator.isNumeric(author_Id, {no_symbols: true})) { 
        errors+= "invalid author id; "; 
    } 

    // Make sure that type id is just a number - note that values are read from request body 
    const type_Id = req.body.typeId; 
    if (!validator.isNumeric(type_Id, {no_symbols: true})) { 
        errors+= "invalid type id; "; 
    } 

    // Escape text and potentially bad characters 
    const novel_Name = validator.escape(req.body.novelName); 
    if (novel_Name === "") { 
        errors+= "invalid novel name; "; 
    } 

    // Escape text and potentially bad characters
    const novel_Description = validator.escape(req.body.novelDescription); 
    if (novel_Description === "") { 
        errors+= "invalid novel description; "; 
    } 

    // Make sure that novel word count is just a number 
    const novel_Word_Count = req.body.novelWordCount; 
    if (!validator.isNumeric(novel_Word_Count, {no_symbols: true})) { 
        errors+= "invalid novel word count; "; 
    } 

    // Make sure that novel likes is just a number 
    const likes = req.body.like; 
    if (!validator.isNumeric(likes, {no_symbols: true})) { 
        errors+= "invalid novel likes; "; 
    } else if(likes != 0){
        errors+= "invalid novel likes; "; 
    }
    
    
    // If errors send details in response 
    if (errors != "") { 
        // return http response with errors if validation failed 
        res.json({ "error": errors }); 
        return false; 
    } 

    likes = 0;
    
    // If no errors, insert 
    try { 
        // Get a DB connection and execute SQL 
        const pool = await dbConnPoolPromise 
        const result = await pool.request() 

        // set name parameter(s) in query 
        .input('authorId', sql.Int, author_Id) 
        .input('typeId', sql.Int, type_Id) 
        .input('novelName', sql.NVarChar, novel_Name) 
        .input('novelDescription', sql.NVarChar, novel_Description) 
        .input('novelWordCount', sql.Int, novel_Word_Count) 
        .input('likes', sql.Int, likes) 

        // Execute Query 
        .query(SQL_INSERT); 
    
        // If successful, return inserted novel via HTTP 
        res.json(result.recordset[0]); 
    
    } catch (err) { 
        res.status(500) 
        res.send(err.message) 
    } 
    
});



// PUT - Update a novel. 
// This async function sends a HTTP post request 
router.put('/', passport.authenticate('jwt', { session: false}), async (req, res) => { 

    // Validate - this string, inially empty, will store any errors 
    let errors = ""; 
    
    // Make sure that novel id is just a number - note that values are read from request body 
    const novel_Id = req.body.id; 
    if (!validator.isNumeric(novel_Id, {no_symbols: true})) { 
        errors+= "invalid novel id; "; 
    } 

    // Make sure that author id is just a number - note that values are read from request body 
    const author_Id = req.body.authorId; 
    if (!validator.isNumeric(author_Id, {no_symbols: true})) { 
        errors+= "invalid author id; "; 
    } 

    // Make sure that type id is just a number - note that values are read from request body 
    const type_Id = req.body.typeId; 
    if (!validator.isNumeric(type_Id, {no_symbols: true})) { 
        errors+= "invalid type id; "; 
    } 

    // Escape text and potentially bad characters 
    const novel_Name = validator.escape(req.body.novelName); 
    if (novel_Name === "") { 
        errors+= "invalid novel name; "; 
    } 

    // Escape text and potentially bad characters
    const novel_Description = validator.escape(req.body.novelDescription); 
    if (novel_Description === "") { 
        errors+= "invalid novel description; "; 
    } 

    // Make sure that novel word count is just a number 
    const novel_Word_Count = req.body.novelWordCount; 
    if (!validator.isNumeric(novel_Word_Count, {no_symbols: true})) { 
        errors+= "invalid novel word count; "; 
    } 


    // Make sure that novel likes is just a number 
    const likes = req.body.like; 
    if (!validator.isNumeric(likes, {no_symbols: true})) { 
        errors+= "invalid novel likes; "; 
    } 
    
    
    // If errors send details in response 
    if (errors != "") { 
        // return http response with errors if validation failed 
        res.json({ "error": errors }); 
        return false; 
    } 
    
    // If no errors, update 
    try { 
        // Get a DB connection and execute SQL 
        const pool = await dbConnPoolPromise 
        const result = await pool.request() 

        // set name parameter(s) in query 
        .input('id', sql.Int, novel_Id) 
        .input('authorId', sql.Int, author_Id) 
        .input('typeId', sql.Int, type_Id) 
        .input('novelName', sql.NVarChar, novel_Name) 
        .input('novelDescription', sql.NVarChar, novel_Description) 
        .input('novelWordCount', sql.Int, novel_Word_Count) 
        .input('like', sql.Int, likes) 

        // Execute Query 
        .query(SQL_UPDATE); 
    
        // If successful, return update the novel via HTTP 
        res.json(result.recordset[0]); 
    
    } catch (err) { 
        res.status(500) 
        res.send(err.message) 
    } 
    
});



// DELETE - delete a novel. 
// This async function sends a HTTP post request 
router.delete('/', passport.authenticate('jwt', { session: false}), async (req, res) =>{

    const novel_Id = req.body.id;

    //validation on the id if DB - Novel table had novel with that id
    //bad input could led to crash of server or lead to attack
    //if validation fail, a message will be return 
    if(!validator.isNumeric(novel_Id, {no_symbols:true})){
        res.json({"error":"invalid id parameter"});
        return false;
    }

    //GET database connection and execute SQL
    try{
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('id', sql.Int, novel_Id)
            //execute query
            .query(SQL_DELETE);

        //get the row that got affected by the update function
        const rowsAffected = Number(result.rowsAffected);

        //set a response message to null to let user know delete function fail to execute
        let response = {"Novel Id that got deleted": null}

        //check if the row that got affected is equal to 0, if it is, 
        //set response message as above, or set the Id of the novel that got deleted to display on the response message
        if(rowsAffected > 0){
            response = {"Novel Id that got deleted": novel_Id}
        }else{
            response = {"The Id entered is invalid. Novel Id that got deleted": novel_Id}
        }

        //Send HTTP response, JSON data is in the recordset of the result variable
        res.json(response);

    }catch(err){ //catch and return/show the errors
        res.status(500);
        res.send(err.message);
    }

});



// export module
module.exports = router; 
















