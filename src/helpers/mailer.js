import nodemailer from 'nodemailer';

const sendPasswordEmail = async (toEmail, password, type) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'convopilot@gmail.com',
            pass: 'qvcv xtop klff hhji', // App password, not your actual Gmail password
        },
    });

    let subject = '';
    let text = '';

    if (type === 'signup') {
        subject = 'Welcome to ConvoPilot - Your Account Password';
        text = `Welcome to ConvoPilot! 🎉\n\nYour account has been created successfully.\nHere is your secure password: ${password}\n\nPlease store it safely and do not share it with anyone.`;
    } else if (type === 'forgot') {
        subject = 'ConvoPilot - Password Reset';
        text = `You have requested to reset your password.\nHere is your new secure password: ${password}\n\nPlease update it after logging in for security purposes.`;
    }

    const mailOptions = {
        from: 'convopilot@gmail.com',
        to: toEmail,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
};

export { sendPasswordEmail };
