const nodemailer = require('nodemailer')


var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

var mailOptions = {
  from: process.env.EMAIL,
  to: ,
  subject: "Forgotten User Name | Nutri",
  text: ""
}

transporter.sendMail(mailOptions, function(err, info){
  if(err){
    console.log(err)
  } else {
    console.log("email sent:" + info.response )
  }
})

