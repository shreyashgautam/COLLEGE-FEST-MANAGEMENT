const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
let m="";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("sign.ejs");
});

app.post('/forget', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await LogInCollection.findOne({ email });
    if (!existingUser) {
      return res.render("login.ejs");
    }

    // Generate a JWT token
    const token = jwt.sign({ id: existingUser._id }, "shreyash#123333112e2A", { expiresIn: '1d' });

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shreyashgautam2007@gmail.com', // Your Yahoo email
        pass: 'Shreyash#123' // Use the generated app password here
      }
    });

    // Configure the email options
    const mailOptions = {
      from: 'shreyashgautam2007@gmail.com',
      to: 'shreyashgautam2007@gmail.com', // Recipient's email
      subject: 'Reset your password',
      text: `Reset your password by clicking on the link: http://localhost:3000/reset/${existingUser._id}/${token}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.send("Failed to send reset email");
      } else {
        console.log('Email sent:', info.response);
        return res.send("Reset email sent successfully");
      }
    });

  } catch (err) {
    console.error(err);
    res.render("login.ejs");
  }
});

app.post("/sign", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.render("exist.ejs");
    }

    await LogInCollection.insertMany([{ email, password }]);
    m=email;
    res.render("home", { email });
  } catch (err) {
    console.error(err);
    res.render("wrong.ejs");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    m=email;
    const user = await LogInCollection.findOne({ email });

    if (user && user.password === password) {
      res.render("home", { email });
    } else {
      res.render("invalid.ejs");
    }
  } catch (err) {
    console.error(err);
    res.render("wdetails.ejs");
  }
});
app.get("/home",(req,res)=>{
  res.render("home.ejs",{email:m});
})
// Other routes
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/pay", (req, res) => {
  res.render("pay.ejs");
});

app.get("/forget", (req, res) => {
  res.render("forget.ejs");
});

app.listen(port, () => {
  console.log("Listening to the given port");
  console.log("http://localhost:3000/");
});
