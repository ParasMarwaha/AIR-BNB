const connection = require('../db/connection');
const {sign} = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const error = require("nodemailer/lib/mail-composer");

function UserSignup(req, res) {
    //console.log(req.body)
    let {email, password, name, confirmPass, city, phone, airName} = req.body;
    if (password !== confirmPass) {
        res.json({error: 'Confirm Password must be Same as Password', message: ''});
    } else {

        let get = `select * from userhotels where email='${email}'`;
        connection.query(get, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else if (record.length > 0) {
                res.json({error: 'Email already Registered', message: ''});
            } else {
                let insert = `insert into userhotels (name,email,password,city,phone,airbnbName) values('${name}','${email}','${password}','${city}','${phone}','${airName}')`

                connection.query(insert, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''});
                    } else {
                        res.json({error: '', message: 'User Registered Successfully'});
                    }
                })
            }
        })

    }
}

function WebUserSignup(req, res) {
    console.log(req.body)
    let {email, password, name, confirmPass, address, phone} = req.body;
    if (password !== confirmPass) {
        res.json({error: 'Confirm Password must be Same as Password', message: ''});
    } else {

        let get = `select * from user where email='${email}'`;
        connection.query(get, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else if (record.length > 0) {
                res.json({error: 'Email already Registered', message: ''});
            } else {
                let insert = `insert into user (name,email,password,address,phone) values('${name}','${email}','${password}','${address}','${phone}')`

                connection.query(insert, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''});
                    } else {
                        res.json({error: '', message: 'User Registered Successfully'});
                    }
                })
            }
        })

    }
}

function UserLogin(req, res) {
    // console.log(req.body)
    let {email, password,} = req.body
    let get = `select * from userhotels where email='${email}' and password='${password}'`;
    connection.query(get, (error, record) => {
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
                let expiry = 160 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('userToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error: '', message: 'Login successful'});
            }
        }
    })
}

function WebUserLogin(req, res) {
    // console.log(req.body)
    let {email, password,} = req.body
    let get = `select * from user where email='${email}' and password='${password}'`;
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record.length === 0) {
                res.json({error: 'Invalid Email or Password', message: ''});
            } else {
                let payload = {
                    id: record[0].user_id,
                    email: record[0].email,
                    name: record[0].name,
                }
                let secret = "abc@123"
                let expiry = 160 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error: '', message: 'Login successful'});
            }
        }
    })
}


function UserChangePassword(req, res) {
    const {id} = req['userInfo']
    const {oldPassword, newPassword} = req.body;
    let checkQuery = `select * from userhotels where id=${id}`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].password !== oldPassword) {
                res.json({error: 'Old Password do not match', message: ''});
            } else {
                let changeQuery = `update userhotels set password='${newPassword}' where id=${id}`
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

function CustomerChangePassword(req, res) {
    //console.log(req['customerInfo'])
    //console.log(req.body)
    const {id} = req['customerInfo']
    const {oldPassword, newPassword} = req.body;
    let checkQuery = `select * from user where user_id=${id}`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].password !== oldPassword) {
                res.json({error: 'Old Password do not match', message: ''});
            } else {
                let changeQuery = `update user set password='${newPassword}' where user_id=${id}`
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

function UserForgotPassword(req, res) {
    {
        const {email} = req.body
        let l = 100000;
        let u = 999999;
        let OTP = Math.floor(l + (u - l) * Math.random());
        let insertQuery = `select * from userhotels where email='${email}'`;
        connection.query(insertQuery, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                if (record.length === 0) {
                    res.json({error: 'Email does not Exist', message: ''});
                } else {
                    let updateQuery = `update userhotels set otp='${OTP}' where email='${email}'`;
                    connection.query(updateQuery, (error) => {
                        if (error) {
                            res.json({error: error.message, message: ''});
                        } else {
                            const transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false, // or 'STARTTLS'
                                auth: {
                                    user: 'parasmarwaha246@gmail.com',
                                    pass: 'auxq kiup dcan wlzi'
                                }
                            });

                            const mailOptions = {
                                from: 'parasmarwaha246@gmail.com',
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

function UserVerifyOtp(req, res) {
    const {email, otp} = req.body
    let selectQuery = `select * from userhotels where email='${email}'`;
    connection.query(selectQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].otp !== otp) {

                res.json({error: 'OTP does not Matched', message: ''});
            } else {

                let nullQuery = `update userhotels set otp=NULL`;
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

function UserChangeForgotPassword(req, res) {
    const {newPassword, email} = req.body
    let updateQuery = `update userhotels set password='${newPassword}' where email='${email}'`;
    connection.query(updateQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Password Changed Successfully'})
        }
    })
}

function AddProperty(req, res) {
    // console.log(req['userInfo'])
    let {id} = req['userInfo']
    let {Type, price, offer, city, description, address, airbnbName} = req.body;
    let {photo} = req.files
    let serverPhoto = `public/images/property/${photo.name}`
    let dbPath = `/images/property/${photo.name}`
    // console.log(serverPhoto)
    // console.log(dbPath)

    photo.mv(serverPhoto, (err, doc) => {
        if (err) {
            res.json({error: err.message, message: ''});
        } else {
            // let insert = `insert into properties (owner_id,type,price,offer,city_id,description,address,photo,airBnbName) values (${id},'${Type}','${price}','${offer}','${city}', "${description}", "${address}",'${dbPath}','${airbnbName}')`
            let insert = `insert into properties (owner_id,type,price,offer,city_id,description,address,photo,airBnbName) values (?,?,?,?,?,?,?,?,?)`;
            // console.log(insert)
            connection.query(insert, [id, Type, price, offer, city, description, address, dbPath, airbnbName], (error) => {
                if (error) {
                    res.json({error: error.message, message: ''});
                } else {
                    res.json({error: '', message: 'Property Added Successfully'});
                }
            })
        }
    })
}

function ReadProperty(req, res) {
    let {id} = req['userInfo']
    let read = `select * from properties where owner_id= ${id}`;
    connection.query(read, (error, records) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', records: records});
        }
    })
}

async function DeleteProperty(req, res) {
    let {id} = req.params
    let deleteQuery = `delete from properties where prop_id= ${id}`;
    connection.query(deleteQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Property Deleted Successfully'});
        }
    })
}

async function AddRoomPhoto(req, res) {

    //console.log(req.body)
    //console.log(req.files)
    let {id} = req.body
    let {roomImg} = req.files
    let serverPhoto = `public/images/property/${roomImg.name}`
    let dbPath = `/images/property/${roomImg.name}`
    roomImg.mv(serverPhoto, (err, doc) => {
        if (err) {
            res.json({error: err.message, message: ''});
        } else {
            let insert = `insert into roomimages (prop_id,photo) values (${id},'${dbPath}')`

            connection.query(insert, (error) => {
                if (error) {
                    res.json({error: error.message, message: ''});
                } else {
                    res.json({error: '', message: 'Image Added Successfully'});
                }
            })
        }
    })
}

async function AddAmenity(req, res) {
    // console.log(req.body)
    let {id, amenity} = req.body
    let check = `select * from amenity where amenity = '${amenity}' and prop_id= ${id}`;
    connection.query(check, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else if (record.length > 0) {
            res.json({error: 'Amenity Already Added', message: ''});
        } else {
            let insert = `insert into amenity (prop_id,amenity) values (${id},'${amenity}')`
            connection.query(insert, (error) => {
                if (error) {
                    res.json({error: error.message, message: ''});
                } else {
                    res.json({error: '', message: 'Amenity Added Successfully'});
                }
            })
        }
    })

}

async function GetAllPropertyData(req, res) {
    let {prop_id} = req.params;
    let get = `select * from properties where prop_id= ${prop_id}`;
    //console.log(get)
    connection.query(get, (error, records) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            let get2 = `select * from roomimages where prop_id = ${prop_id}`
            connection.query(get2, (error, room) => {
                if (error) {
                    res.json({error: error.message, message: ''});
                } else {
                    let get3 = `select * from amenity where prop_id = ${prop_id}`
                    connection.query(get3, (error, amenity) => {
                        if (error) {
                            res.json({error: error.message, message: ''});
                        } else {
                            let get4 = `select * from city where id = ${records[0].city_id}`
                            connection.query(get4, (error, city) => {
                                if (error) {
                                    res.json({error: error.message, message: ''});
                                } else {
                                    let get5 = `select * from review join user on review.user_id = user.user_id where prop_id = ${prop_id}`
                                    //console.log(get5)
                                    connection.query(get5, (error, review) => {
                                        if (error) {
                                            res.json({error: error.message, message: ''});
                                        } else {
                                            let get6 = `SELECT AVG(rating) AS average_rating FROM review where prop_id = ${prop_id}`
                                            connection.query(get6, (error, avgReview) => {
                                                if (error) {
                                                    res.json({error: error.message, message: ''});
                                                } else {
                                                    res.json({
                                                        error: '',
                                                        property: records,
                                                        room: room,
                                                        amenity: amenity,
                                                        city: city,
                                                        review: review,
                                                        avgReview: avgReview
                                                    });
                                                }
                                            })
                                        }

                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

async function DeletePropertyImage(req, res) {
    let {id} = req.params
    let deleteQuery = `delete from roomimages where room_id= ${id}`;
    connection.query(deleteQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Image Deleted Successfully'});
        }
    })
}

async function DeletePropertyAmenity(req, res) {
    let {id} = req.params
    let deleteQuery = `delete from amenity where amen_id= ${id}`;
    connection.query(deleteQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Amenity Deleted Successfully'});
        }
    })
}

function UpdateProperty(req, res) {
    // console.log(req['userInfo'])
    let {prop_id} = req.params
    let {Type, price, offer, city, description, address, airbnbName} = req.body;
    // console.log(serverPhoto)
    // console.log(dbPath)

    let update = `update properties set type ='${Type}' ,price = '${price}',offer = '${offer}',city_id = '${city}',description = '${description}',address = '${address}' where prop_id=${prop_id}`;

    connection.query(update, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Property Updated Successfully'});
        }
    })
}

function GetHotel(req, res) {
    //console.log(req.body)
    let {city, type, checkout, checkin} = req.body;
    let get = `SELECT p.*
FROM properties p
JOIN city c ON p.city_id = c.id
WHERE c.id = '${city}'
  AND p.type = '${type}'
  AND p.prop_id NOT IN (
      SELECT b.prop_id
      FROM booking b
      WHERE (b.checkin < '${checkout}' AND b.checkout > '${checkin}')
  )`
    //console.log(get)
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', record: record});
        }
    })
}

function CustomerForgotPassword(req, res) {
    {
        const {email} = req.body
        let l = 100000;
        let u = 999999;
        let OTP = Math.floor(l + (u - l) * Math.random());
        let insertQuery = `select * from user where email='${email}'`;
        connection.query(insertQuery, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                if (record.length === 0) {
                    res.json({error: 'Email does not Exist', message: ''});
                } else {
                    let updateQuery = `update user set otp='${OTP}' where email='${email}'`;
                    connection.query(updateQuery, (error) => {
                        if (error) {
                            res.json({error: error.message, message: ''});
                        } else {
                            const transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false, // or 'STARTTLS'
                                auth: {
                                    user: 'parasmarwaha246@gmail.com',
                                    pass: 'auxq kiup dcan wlzi'
                                }
                            });

                            const mailOptions = {
                                from: 'parasmarwaha246@gmail.com',
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

function CustomerVerifyOtp(req, res) {
    const {email, otp} = req.body
    let selectQuery = `select * from user where email='${email}'`;
    connection.query(selectQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].otp !== otp) {

                res.json({error: 'OTP does not Matched', message: ''});
            } else {

                let nullQuery = `update user set otp=NULL`;
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

function CustomerChangeForgotPassword(req, res) {
    const {newPassword, email} = req.body
    let updateQuery = `update user set password='${newPassword}' where email='${email}'`;
    connection.query(updateQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Password Changed Successfully'})
        }
    })
}

function Bookings(req, res) {
    //console.log(req.body)
    let {id} = req['customerInfo']
    let {paymentId, checkinDate, checkoutDate, totalAmount, prop_id, days} = req.body
    let insert = `insert into booking (prop_id,user_id,amount,checkin,checkout,T_id,days) values(${prop_id},${id},${totalAmount},'${checkinDate}','${checkoutDate}','${paymentId}',${days})`;
    //console.log(insert)
    connection.query(insert, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Room Booked Successfully'})
        }
    })

}

function CustomerBooking(req, res) {
    let {id} = req['customerInfo']
    //console.log(id)
    let get = `select * from booking as b join properties as p on b.prop_id=p.prop_id join user as u on b.user_id=u.user_id where b.user_id= ${id}`
    //console.log(get)
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', record: record})
        }
    })
}

function UserDetails(req, res) {
    //console.log(req.params)
    let {user_id} = req.params;
    let get = `select * from user where user_id= ${user_id}`
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', record: record})
        }
    })
}

function UploadReview(req, res) {
    //console.log(req.body)
    //console.log(req['customerInfo'])
    let {rating, feedback, prop_id} = req.body;
    let {id} = req['customerInfo']
    let insert = `insert into review (user_id,prop_id,rating,feedback) values (${id},${prop_id},'${rating}','${feedback}')`;
    connection.query(insert, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Review Uploaded'});
        }
    })
}

function GetReview(req, res) {
    //console.log(req.body)
    //console.log(req['customerInfo'])
    let {prop_id} = req.params;
    let {id} = req['customerInfo']
    let insert = `select * from review where user_id = ${id} and prop_id = ${prop_id}`;
    connection.query(insert, (error, record) => {
        if (error) {
            res.json({error: error.message, record: []});
        } else if (record.length > 0) {
            res.json({error: 'OpenUpdate', record: record});
        } else {
            res.json({error: '', message: ''})
        }
    })
}

function UpdateReview(req, res) {
    //console.log(req.body)
    //console.log(req['customerInfo'])
    let {Rating, Feedback, prop_id} = req.body;
    let {id} = req['customerInfo']
    let update = `update review set rating= '${Rating}',feedback= '${Feedback}' where user_id= ${id} and prop_id= ${prop_id}`;
    connection.query(update, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Review Updated'});
        }
    })
}

function UserViewBooking(req, res) {
    let {id} = req['userInfo']
    //console.log(id)
    let get = `select * from booking as b join properties as p on b.prop_id=p.prop_id join user as u on b.user_id=u.user_id where p.owner_id = ${id} order by checkin desc`
    //console.log(get)
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, record: []});
        }
        else{
            res.json({error: '', record:record})
        }
    })
}


module.exports = {
    UserSignup,
    UserLogin,
    UserChangeForgotPassword,
    UserForgotPassword,
    UserChangePassword,
    UserVerifyOtp,
    AddProperty,
    ReadProperty,
    DeleteProperty,
    AddRoomPhoto,
    AddAmenity,
    GetAllPropertyData,
    DeletePropertyImage,
    DeletePropertyAmenity,
    UpdateProperty,
    GetHotel,
    WebUserSignup,
    WebUserLogin,
    CustomerChangePassword,
    CustomerVerifyOtp,
    CustomerForgotPassword,
    CustomerChangeForgotPassword,
    Bookings,
    CustomerBooking,
    UserDetails,
    UploadReview,
    GetReview,
    UpdateReview,
    UserViewBooking
}