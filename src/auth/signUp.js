import bcrypt from 'bcrypt';
import generator from 'generate-password';
import { v4 as uuidv4 } from 'uuid';
import { hasUser, insertData } from '../Models/userModel.js';
import { sendPasswordEmail } from '../helpers/mailer.js';

export const signup = async (req, res) => {
    try {
        let { body: { name, email } } = req;
        const saltRounds = 10;
        const hasUserRes = await hasUser(email);
        if (hasUserRes) {
            return res.send({ status: false, code: 409, message: "An account with this email address already exists. Please use a different email or login." });
        } else {
            const password = generator.generate({
                length: 16,
                numbers: true,
                symbols: true,
                uppercase: true,
                lowercase: true,
                strict: true,
                exclude: '"\\'
            });
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            let reqObj = {
                name: name,
                email: email,
                password: hashedPassword,
                client_id: uuidv4()
            }
            const insertDataRes = await insertData(reqObj);
            if (insertDataRes) {
                let emailRes = await sendPasswordEmail(email, password, 'signup');
                return res.send({ status: true, code: 200, message: "User Details Inserted SucessFully", Email: emailRes && emailRes.accepted && emailRes.accepted.length > 0 ? 200 : 500 });
            } else {
                return res.send({ status: false, code: 400, message: "User Details Not Inserted" });
            }
        }
    } catch (error) {
        console.error("Error In userSignUp", error);
        return res.send({ status: false, code: 500, message: "Internal Server Error" });
    }
}