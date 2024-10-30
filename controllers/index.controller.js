const connection = require('../db/connection');
const {sign}=require('jsonwebtoken')
const nodemailer = require("nodemailer");

function AdminLogin(req, res) {
    const{email, password} = req.body;
    let loginQuery = `select * from admin where email='${email}' and password='${password}'`;
    connection.query(loginQuery, (error, record) => {
        if (error) {
            res.json({error:error.message,message:''});
        }
        else
        {
            if (record.length===0) {
                res.json({error:'Invalid email or password'});
            }
            else
            {
                let payload = {
                    id: record[0].id,
                    email: record[0].email,
                    name: record[0].name,
                }
                let secret = "abc@123"
                let expiry = 60 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('adminToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error:'',message:'Login successful'});
            }
        }
    })
}

function AdminChangePassword(req, res) {
    let {id} = req['adminInfo']
    const {oldPassword, newPassword} = req.body;
    let checkQuery = `select * from admin where id=${id}`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].password !== oldPassword) {
                res.json({error: 'Old Password do not match', message: ''});
            } else {
                let changeQuery = `update admin set password='${newPassword}' where id=${id}`
                connection.query(changeQuery, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''});
                    } else {
                        res.json({error: '', message: 'Password changed successfully'});
                    }
                })
            }
        }
    })
}

function AdminForgotPassword(req, res) {
    {
        const {email} = req.body
        let l = 100000;
        let u = 999999;
        let OTP = Math.floor(l + (u - l) * Math.random());
        let insertQuery = `select * from admin where email='${email}'`;
        connection.query(insertQuery, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                if (record.length === 0) {
                    res.json({error: 'Email does not Exist', message: ''});
                } else {
                    let updateQuery = `update admin set otp='${OTP}' where email='${email}'`;
                    connection.query(updateQuery, (error) => {
                        if (error) {
                            res.json({error: error.message, message: ''});
                        } else {
                            const transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false, // or 'STARTTLS'
                                auth: {
                                    user: 'gitanshu.vij1305@gmail.com',
                                    pass: 'deedypvmlhtfeksk'
                                }
                            });

                            const mailOptions = {
                                from: 'gitanshu.vij1305@gmail.com',
                                to: email,
                                subject: 'OTP for Password Reset',
                                text: `Your OTP is: ${OTP}`
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    res.json({error: 'Failed to send OTP', message: ''});
                                }

                                // console.log('OTP sent to', email);
                                res.json({error: '', message: 'An OTP has been sent to given Email Address'});
                            });
                        }
                    })
                }
            }
        })
    }
}
function AdminVerifyOtp(req, res) {
    const {email, otp} = req.body
    let selectQuery = `select * from admin where email='${email}'`;
    connection.query(selectQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].otp !== otp) {

                res.json({error: 'OTP does not Matched', message: ''});
            } else {

                let nullQuery = `update admin set otp=NULL`;
                connection.query(nullQuery, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''})
                    } else {
                        res.json({error: '', message: 'OTP Matched'})
                    }
                })
            }
        }
    })
}
function AdminChangeForgotPassword(req, res) {
    const {newPassword, email} = req.body
    let updateQuery = `update admin set password='${newPassword}' where email='${email}'`;
    connection.query(updateQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Password Changed Successfully'})
        }
    })
}

function UserSignup(req, res) {
    const {name, email, password} = req.body;
    const insertQuery = `insert into users(name,email,password) Values('${name}', '${email}', '${password}')`
    connection.query(insertQuery, (error) => {
        {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                // Send password to the email address using a mailer service (e.g., Nodemailer)
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // or 'STARTTLS'
                    auth: {
                        user: 'gitanshu.vij1305@gmail.com',
                        pass: 'deedypvmlhtfeksk'
                    }
                });

                const mailOptions = {
                    from: 'gitanshu.vij1305@gmail.com',
                    to: email,
                    subject: 'User Signup',
                    text: `Thank You For Registering With US`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({error: 'Fail', message: ''});
                    }

                    // console.log('OTP sent to', email);
                    res.json({error: '', message: 'Sign up successful'});
                });
            }
        }
    })
}
function UserLogin(req, res) {
    const {email, password} = req.body;
    let checkQuery = `select * from users where email='${email}' and password='${password}'`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record.length === 0) {
                res.json({error: 'Invalid Email or Password', message: ''});
            } else {
                let payload = {
                    id: record[0].id,
                    email: record[0].email,
                    name: record[0].name,
                }
                let secret = "abc@123"
                let expiry = 60 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('userToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error: '', message: 'Login successful'});
            }
        }
    })
}


function AddCity(req, res) {
   // console.log(req.body)
let{state,city,pincode}=req.body;
    let insert = `insert into city (state,city,pincode) values('${state}','${city}','${pincode}')`;
    connection.query(insert, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else{
            res.json({error: '', message: 'City Added Successfully'});
        }
    })
}

function Read(req, res) {
    let get = `select * from city`;
    connection.query(get,(error,records)=>{
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else{
            res.json({error: '', records: records});
        }
    })
}

function UpdateCity(req,res){
   // console.log(req.body)
    let{id,state,city,pincode}=req.body;
    let insert = `update city set state='${state}', city='${city}',pincode = '${pincode}' where id = ${id}`;
    connection.query(insert, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else{
            res.json({error: '', message: 'City Updated Successfully'});
        }
    })
}

function DeleteCity(req,res){
    let{id} = req.params;
    let deleteQuery = `delete from city where id= ${id}`;
    connection.query(deleteQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else{
            res.json({error: '', message: 'City Deleted Successfully'});
        }
    })
}

function AllBookings(req, res) {
    let get  = `select * from booking as b join properties as p on b.prop_id=p.prop_id join user as u on b.user_id=u.user_id `
    connection.query(get,(error,record)=>{
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

module.exports = {
    AdminLogin,
    AdminChangePassword,
    AdminForgotPassword,
    AdminVerifyOtp,
    AdminChangeForgotPassword,
    AddCity,
    Read,
    UpdateCity,
    DeleteCity,
    AllBookings
}
