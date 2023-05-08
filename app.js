import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY;

const app = express();
const __dirname = path.resolve();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-sms', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const message = req.body.message;

  const formData = new URLSearchParams();

  formData.append('user_api_key', apiKey);
  formData.append('sms_message', message);
  formData.append('sms_to_phone', phoneNumber);

  const request = {
    method: 'POST',
    body: formData,
  };

  fetch('https://fiotext.com/send-sms', request)
    .then((response) => {
      if (response.ok) {
        res.send('SMS sent!');
      } else {
        res.status(500).send('Failed to send SMS');
      }
    })
    .catch((error) => {
      res.status(500).send('Failed to send SMS');
    });
});

app.listen(3000, () => {
  console.log('SMS app listening on port 3000!');
});
