const sql = require('mssql')
require('dotenv').config()
const string_connection = `Server=${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const searchPerson = async(res) => {

    try {
        
        //console.log("string_connection :"+string_connection)
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);

        const result = await request.query('select * from persons');
        return result;

    }

    catch (err) {
        res.status(500).send('Error connecting to the database');

    } finally {
        // Close the database connection
        sql.close();
    }
}

const insertPerson = async(res,playload) => {

    try {
        
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);

        const result = await request.input('firstname', sql.NVarChar, playload.firstname).
        input('lastname', sql.NVarChar, playload.lastname).
       
        query('insert into dbo.persons (firstname,lastname) \
        values(@firstname,@lastname)');

        console.log('Rows affected:', result.rowsAffected[0]);
        
        return result.rowsAffected[0];
    }

    catch (err) {
        res.status(500).send(err);

    } finally {
        // Close the database connection
        sql.close();
    }
}

const updatePerson = async(res,playload) => {

    try {
        
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log(playload)
        const result = await request.input('firstname', sql.NVarChar, playload.firstname).
        input('lastname', sql.NVarChar, playload.lastname).
        input('id', sql.NVarChar, playload.id).
        query('update dbo.persons set firstname=@firstname, \
        lastname=@lastname \
        where id=@id\
        ');

        console.log('Result: ', result.rowsAffected[0]);
        
        return result.rowsAffected[0];
        
    }

    catch (err) {
        res.status(500).send(err);

    } finally {
        // Close the database connection
        sql.close();
    }
}


const deletePerson = async(res,id) => {

    try {
        
        let con = await sql.connect(string_connection)
        let request = new sql.Request(con);
        console.log("delete id:"+id)
        const result = await request.input('id', sql.NVarChar,id).
        query('delete from dbo.persons where id=@id');

        console.log('Result: ', result.rowsAffected[0]);
        
        return result.rowsAffected[0];
        
    }

    catch (err) {
        res.status(500).send(err);

    } finally {
        // Close the database connection
        sql.close();
    }
}


module.exports = {
    searchPerson,insertPerson,
    updatePerson,deletePerson}
