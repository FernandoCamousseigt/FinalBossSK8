const {Pool} = require('pg')
const pool = new Pool({
    user: 'postgres',
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "skatepark"
})

//consultas tipo ejercicio final de consigna: try, return, catch
async function inscribirSkater(email,nombre,pw2,experiencia,especialidad,name) {
    try {
        const result = await pool.query(`INSERT INTO skaters(email,nombre,password,anos_experiencia,especialidad,foto,estado)
         values('${email}','${nombre}','${pw2}',${experiencia},'${especialidad}','${name}',false) RETURNING *;`)
        const registro = result.rows[0]
        return registro

    } catch (error) {
        console.log(error)
        return error.code;
    }
    /* let idNuevo = result1.rows[0].id; */
}

async function traerSkaters() {
    try {
        const result = await pool.query("SELECT * FROM  skaters")
        return result.rows
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function setUsuarioStatus(id, estado) {

    const result = await pool.query(`UPDATE skaters SET estado=${estado} WHERE id = ${id} RETURNING *;`)
    return result.rows[0]
}

module.exports = {
    inscribirSkater,traerSkaters, setUsuarioStatus
/*     datosUsuarios,
    autentica,
    actualiza,
    borra */
}