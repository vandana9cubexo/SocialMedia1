const nodeMailer=require('nodemailer')
exports.sendEmail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        //host:process.env.SMPT_HOST,
        //port:process.env.SMPT_PORT,
        //auth:{
            //user:process.env.SMPT_MAIL,
            //pass:process.env.SMPT_PASSWORD
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "374236444a8a2b",
                  pass: "3e32fac8f04d67"
                }
        })
        //service:process.env.SMPT_SERVICE
    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions)
}