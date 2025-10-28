import { db } from '../Config/DataBase.js';

const hasUser = async (email) => {
    try {
        const user = await db.from("users").where({ email }).first();
        return !!user;
    } catch (error) {
        console.error("Error In hasUser", error);
        return null;
    }
}

const insertData = async (userData) => {
    try {
        await db.from("users").insert(userData);
        return true;
    } catch (error) {
        console.error("Error In insertData", error);
        return null;
    }
}

const getUserPasswordByEmail = async (email) => {
    try {
        let getUserPasswordByEmailRes = await db
            .from("users")
            .select(
                "id",
                "name",
                "client_id",
                "password"
            )
            .where({ email })
            .first();
        return getUserPasswordByEmailRes ? getUserPasswordByEmailRes : null;
    } catch (error) {
        console.error("Error In insertData", error);
        return null;
    }
}

const updatePassword = async (reqObj) => {
    try {
        let { email, password } = reqObj;
        await db("users")
            .where({ email })
            .update({
                password,
                updated_at: new Date(),
            });
        return true;
    } catch (error) {
        console.error("Error In updatePassword", error);
        return null;
    }
}

const incrementLoginAttment = async (id) => {
    try {
        await db("users").where({ id }).increment("login_attempt", 1);
    } catch (error) {
        console.error("Error In updatePassword", error);
        return null;
    }
}
export {
    hasUser,
    insertData,
    getUserPasswordByEmail,
    updatePassword,
    incrementLoginAttment
};
