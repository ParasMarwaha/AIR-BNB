const express = require('express');
const app = express();
const indexController = require('./controllers/index.controller');
const usercontroller = require('./controllers/usercontroller');
const cookieParser = require('cookie-parser');
const {verify} = require('jsonwebtoken')
const fileupload = require('express-fileupload');
const connection = require('./db/connection');

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(fileupload({}))
app.set('view engine', 'ejs');


function adminAuthorization(req, res, next) {
    if (req.cookies.adminToken === undefined) {
        return res.redirect('/admin')
    }

    let token = req.cookies.adminToken
    let secret = "abc@123"
    try {
        req['adminInfo'] = verify(token, secret)
        next()
    } catch (error) {
        res.redirect('/admin')
    }
}

function userAuthorization(req, res, next) {
    if (req.cookies.userToken === undefined) {
        return res.redirect('/userLogin')
    }

    let token = req.cookies.userToken
    let secret = "abc@123"
    try {
        req.userInfo = verify(token, secret)
        next()
    } catch (error) {
        res.redirect('/userLogin')
    }
}

function customerAuthorization(req, res, next) {
    if (req.cookies.customerToken === undefined) {
        return res.redirect('/user-Login')
    }

    let token = req.cookies.customerToken
    let secret = "abc@123"
    try {
        req['customerInfo'] = verify(token, secret)
        next()
    } catch (error) {
        res.redirect('/user-Login')
    }
}


app.get("/admin", (req, res) => {
    res.render('admin/adminLogin');
})
app.post("/adminLogin", indexController.AdminLogin)

app.get("/adminDashboard", adminAuthorization, (req, res) => {
    res.render('admin/dashboard');
})

app.get("/add-city", adminAuthorization, (req, res) => {
    res.render('admin/addcity');
})

app.get("/adminLogout", (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin')
})

app.get("/adminChangePassword", adminAuthorization, (req, res) => {
    res.render('admin/changePassword');
})
app.post("/adminChangePassword", adminAuthorization, indexController.AdminChangePassword)

app.get("/adminForgotPassword", (req, res) => {
    res.render('admin/adminForgotPassword');
})
app.post("/adminForgotPassword", indexController.AdminForgotPassword)
app.post("/adminVerifyOtp", indexController.AdminVerifyOtp)
app.get("/adminChangeForgotPassword", (req, res) => {
    res.render('admin/adminChangeForgotPassword');
})
app.post("/adminChangeForgotPassword", indexController.AdminChangeForgotPassword)
app.get("/", (req, res) => {
    res.render("user/index")
})
app.get("/userSignup", (req, res) => {
    res.render('user/userSignup');
})

app.get("/user-Signup", (req, res) => {
    res.render('customer/WebUserSignup');
})

app.post("/userSignup", usercontroller.UserSignup)

app.post("/user-Signup", usercontroller.WebUserSignup)

app.get("/userLogin", (req, res) => {
    res.render("user/userLogin");
})

app.get("/user-Login", (req, res) => {
    res.render("customer/WebUserSignin");
})
app.post("/userLogin", usercontroller.UserLogin)

app.post("/user-Login", usercontroller.WebUserLogin)

app.get("/userDashboard", userAuthorization, (req, res) => {
    res.render("user/dashboard");
})

app.get("/user-Dashboard", customerAuthorization, (req, res) => {
    res.render("customer/CustomerDashboard");
})
app.get("/userLogout", (req, res) => {
    res.clearCookie('userToken');
    res.redirect('/userLogin');
})

app.get("/user-Logout", (req, res) => {
    res.clearCookie('customerToken');
    res.redirect('/');
})
app.get("/userChangePassword", userAuthorization, (req, res) => {
    res.render("user/changePassword");
})

app.get("/user-ChangePassword", customerAuthorization, (req, res) => {
    res.render("customer/CustomerchangePassword");
})
app.post("/userChangePassword", userAuthorization, usercontroller.UserChangePassword)

app.post("/user-ChangePassword", customerAuthorization, usercontroller.CustomerChangePassword)

app.get("/userForgotPassword", (req, res) => {
    res.render("user/userForgotPassword");
})

app.get("/user-ForgotPassword", (req, res) => {
    res.render("customer/CustomerForgotPassword");
})
app.post("/userForgotPassword", usercontroller.UserForgotPassword)

app.post("/userVerifyOtp", usercontroller.UserVerifyOtp)

app.post("/user-ForgotPassword", usercontroller.CustomerForgotPassword)

app.post("/user-VerifyOtp", usercontroller.CustomerVerifyOtp)

app.get("/userChangeForgotPassword", (req, res) => {
    res.render("user/userChangeForgotPassword");
})

app.get("/user-ChangeForgotPassword", (req, res) => {
    res.render("customer/CustomerChangeForgotPass");
})
app.post("/userChangeForgotPassword", usercontroller.UserChangeForgotPassword)

app.post("/user-ChangeForgotPassword", usercontroller.CustomerChangeForgotPassword)

app.post('/add-city', adminAuthorization, indexController.AddCity)

app.get('/read-city', indexController.Read)

app.post('/UpdateCity', indexController.UpdateCity)

app.get('/delete-city/:id', indexController.DeleteCity)

app.get('/add-property', userAuthorization, (req, res) => {
    // console.log(req['userInfo'])
    let {id} = req['userInfo']
    let get = `select * from userhotels where id= ${id}`
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            // console.log(record[0].airbnbName)
            res.render('user/AddProperty', {AirName: record[0].airbnbName})
        }
    })
})

app.get('/view-property', (req, res) => {
    res.render('user/ViewProperty')
})

app.post('/add-property', userAuthorization, usercontroller.AddProperty)

app.post('/update-property/:prop_id', userAuthorization, usercontroller.UpdateProperty)

app.get('/read-property', userAuthorization, usercontroller.ReadProperty)

app.get('/delete-property/:id', userAuthorization, usercontroller.DeleteProperty)

app.get('/delete-property-image/:id', userAuthorization, usercontroller.DeletePropertyImage)

app.get('/delete-property-amenity/:id', userAuthorization, usercontroller.DeletePropertyAmenity)

app.get('/view-bookings', customerAuthorization, (req, res) => {
    res.render('customer/ViewBookings')
})

app.get('/view-all-booking', adminAuthorization, (req, res) => {
    res.render('admin/ViewCustomerBook')
})

app.post('/add-room-photos', userAuthorization, usercontroller.AddRoomPhoto)

app.post('/add-amenity', userAuthorization, usercontroller.AddAmenity)

app.get('/customer-booking', customerAuthorization, usercontroller.CustomerBooking)

app.get('/user-view-booking', userAuthorization, usercontroller.UserViewBooking)


app.get('/all-bookings', adminAuthorization, indexController.AllBookings)

app.get('/property-desc/:prop_id', userAuthorization, (req, res) => {
    //console.log(req.params)
    let {prop_id} = req.params
    res.render('user/PropertyDesc', {prop_id: prop_id})
})

app.get('/get-all-propertyData/:prop_id', usercontroller.GetAllPropertyData)

app.get('/search-hotel', customerAuthorization, (req, res) => {
    // Retrieve query parameters from URL
    const checkin = req.query.checkin;
    const checkout = req.query.checkout;
    const city = req.query.city;
    const type = req.query.type;

    // Render your search page with parameters if needed
    res.render('customer/SearchHotel', {checkin, checkout, city, type});
});

app.post('/get-hotel', customerAuthorization, usercontroller.GetHotel)

app.get('/hotel-desc/:prop_id', customerAuthorization, (req, res) => {
    //console.log(req.params)
    let {prop_id} = req.params
    res.render('customer/UserHotels', {prop_id: prop_id})
})

app.get('/desc/:prop_id', customerAuthorization, (req, res) => {
    //console.log(req.params)
    let {prop_id} = req.params
    let {id} = req['customerInfo']
    //console.log(id)
    let get = `select * from booking where user_id= ${id} and prop_id= ${prop_id}`;
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else if (record.length > 0) {
            res.render('customer/ViewBookedProperty', {prop_id: prop_id})
        } else {
            res.redirect('/view-bookings')
        }
    })
})

app.post('/bookings', customerAuthorization, usercontroller.Bookings)

app.get('/user-desc/:user_id', usercontroller.UserDetails)

app.post('/upload-review', customerAuthorization, usercontroller.UploadReview)

app.post('/update-review', customerAuthorization, usercontroller.UpdateReview)

app.get('/get-review/:prop_id', customerAuthorization, usercontroller.GetReview)

app.get('/user-view-bookings',(req, res) => {
    res.render('user/ViewBookings')
})


const PORT = 3000
app.listen(PORT, () => console.log('Server is running on 3000 port'));