import express from 'express';
const router = express.Router();

import { validateBody } from '../JoiValidation/JoiValidation.js';
import { signup } from '../auth/signUp.js';
import { login } from '../auth/login.js';
import { userForgotPassword } from '../auth/forgotPassword.js';
import { signUpReqModel, loginReqModel, forgotPasswordReqModel } from '../reqModel/authReqModel.js';

router.post("/sign-up", validateBody(signUpReqModel), signup);
router.post("/login", validateBody(loginReqModel), login);
router.post("/forgot-password", validateBody(forgotPasswordReqModel), userForgotPassword);

export default router;