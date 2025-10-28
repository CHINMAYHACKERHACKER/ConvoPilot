import bcrypt from 'bcrypt';
import generator from 'generate-password';
import { hasUser, updatePassword } from '../Models/userModel.js';
import { sendPasswordEmail } from '../helpers/mailer.js';

export const userForgotPassword = async (req, res) => {
    try {
        let { body: { email } } = req;
        const saltRounds = 10;
        const hasUserRes = await hasUser(email);
        if (hasUserRes) {
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
                email: email,
                password: hashedPassword
            }
            const forgotPasswordRes = await updatePassword(reqObj);
            if (forgotPasswordRes) {
                let emailRes = await sendPasswordEmail(email, password, 'forgot');
                return res.send({
                    status: true,
                    code: 200,
                    message: "Updated Paswword SucessFully",
                    Email: emailRes && emailRes.accepted && emailRes.accepted.length > 0 ? 200 : 500
                });
            } else {
                return res.send({ status: false, code: 400 });
            }
        } else {
            return res.send({
                status: false,
                code: 404,
                message: "No account found with this email address. Please check and try again."
            });
        }
    } catch (error) {
        console.error("Error In userForgotPassword", error);
        return res.send({ status: false, code: 500, message: "Internal Server Error" });
    }
}