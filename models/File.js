const { model, Schema } = require("mongoose");
const nodemailer = require('nodemailer');
require('dotenv').config();

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});


console.log('MAIL_HOST:', process.env.MAIL_HOST);
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASSWORD:', process.env.MAIL_PASSWORD);
// post middleware
fileSchema.post('save', async (doc) => {
  try {
    console.log("doc-> ", doc);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD
      }
    });

    // send mail
    let info = await transporter.sendMail({
      from: 'JaiTestingApp',
      to: doc.email,
      subject: 'new file uploaded on cloudinary',
      html: `<h2>Hello jee <p>File Uploaded</p></h2>`
    })
    console.log(info);
  } catch(error) {
    console.error(error);
  }
})
require('dotenv').config();


module.exports = model("File", fileSchema);
