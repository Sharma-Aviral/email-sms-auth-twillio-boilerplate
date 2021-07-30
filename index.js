
//boiler plate for email / phone verification
//pending api integration

const express = require("express")
const app = express()
const port  = 3000
require('dotenv').config()
const accountSid = process.env.twillio_account_sid;
const authToken = process.env.twillio_auth_tokken;
const client = require('twilio')(accountSid, authToken);



app.use( express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// use these variables to simulate fetched data from db 

const phoneNumber  = "xxxxx"
const emailId  = "xxxxxx"


//sending otp....opens channel for verification sms otp
app.get("/sendNumber" , (req,res)=>{
   client.verify.services(process.env.twillio_verify_service_id)
   .verifications
   .create({to: phoneNumber, channel: 'sms'})
   .then(verification => res.send({status: verification.status}))
})


//verification of sms otp post 
app.post("/verifyNumber" , (req,res)=>{  
   client.verify.services(process.env.twillio_verify_service_id)
   .verificationChecks
   .create({to: phoneNumber, code: req.body.otpNo})
   .then(verification_check => {
      if(verification_check.status === "approved"){res.send({phoneVerified: true})}
      res.send({phoneVerified: false})

}); 



})


//sending otp....opens channel for verification for email
app.get("/sendemail" , (req,res)=>{
   client.verify.services(process.env.twillio_verify_service_id)
   .verifications
   .create({to: emailId, channel: 'email'})
   .then(verification => res.send({status: verification.status}))
   .catch((e)=>{
      console.log(e)
   })

})


//verify email route 
app.post("/verifyemail" , (req,res)=>{
     
client.verify.services(process.env.twillio_verify_service_id)
.verificationChecks
.create({to: emailId, code: req.body.otpNo})
.then(verification_check => {
   if(verification_check.status === "approved"){res.send({emailVerified: true})}
   res.send({emailVerified: false})

});
}) 


// hosting app at 3000 
app.listen(port , (err)=>{
   console.log("runnin")
})
