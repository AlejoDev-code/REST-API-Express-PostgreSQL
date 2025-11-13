import {pool} from '../db.js'

export const getUsers = async (req, res)=>{
    const {rows} = await pool.query('SELECT * FROM users')
    //console.log(rows)
    res.json(rows);
}

export const getUser = async (req, res)=>{
    const {id} = req.params;

    const {rows} = await pool.query(`SELECT * FROM users WHERE id = ${id}`)
    console.log(rows)
    
    if (rows.length === 0 ) {
        console.log(rows.length)
        return res.status(404).json({message: 'User not found'});
    }

    res.json(rows);
}

export const createUser = async (req, res)=>{
    try {
        const {name, email} = req.body;

        if (!name || !email) {
            return res.status(422).json({message: "Empty field"});
        }

        const {rows} = await pool.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}') RETURNING *`)

        console.log(rows);
        res.send(rows[0]);
    } catch (error) {

        if (error?.code == "23505") {
            return res.status(409).json({message: "Email already exists"});
        }

        return res.status(500).json({message: "Internal server error"});
    }
}

export const deleteUser = async (req, res)=>{

    try {
        const {id} = req.params

        const {rows, rowCount} = await pool.query(`DELETE FROM users WHERE id = ${id} RETURNING *`);

        if (rowCount.length == 0) {
            return res.sendStatus(204);
        }   
        console.log(rows)
        res.json({message: rowCount});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
    

}

export const updateUser = async (req, res)=>{
    const {id} = req.params;
    const {name, email} = req.body;

    const {rows} = await pool.query(`UPDATE users SET name='${name}', email='${email}' WHERE id='${id}' RETURNING *`);

    console.log(rows);

    res.send(rows[0])  
}