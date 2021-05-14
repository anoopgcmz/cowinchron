const express = require('express');
const moment = require('moment');
const mongodb = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');

const router = express.Router();
//Get request

router.get('/', async (req, res) => {
    // let post = await loadContacts();
    //res.send(await post.find({}).toArray());
    console.log('Contacts listed');
})

//post request
router.post('/', async (req, res) => {
    // let post = await loadContacts();
    // await post.insertOne({
    //     phoneNumber: req.body.phonenumber,
    //     pinCode: req.body.pincode,
    //     status: 1
    // })
    //res.status(201).send();
    console.log('Contacts Added');

})

//delete request
router.delete('/', async (req, res) => {
    // let post = await loadContacts();
    // await post.deleteOne({
    //     phoneNumber: req.body.phonenumber
    // })
    // res.status(201).send();
    console.log('Contacts Deleted');
})

//chron job to send message
router.get('/check', async (req, res) => {
    await runchrone();

})

async function runchrone() {
    console.log('RunChrone');
    try {
        cron.schedule('10 * * * *', async () => {
            console.log("Inside cron");
            getContacts();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function getContacts() {
    console.log('inside Get contacts');
    // let post = await loadContacts();
    let contactData = ['688004','688561','691523','673636','673635'];
    //let contactData = await post.find({}).toArray();
    console.log('Contacts listed');
    let availability = await checkAvailability(contactData);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", availability);
}

async function checkAvailability(contactData) {
    let distinctPincode = [...new Set(contactData.map(x => x.pinCode))]
    let today = moment().startOf('day').format('DD-MM-YYYY');
    let vaccineData = [];
    for (let i = 0; i <= distinctPincode.length - 1; i++) {
        vaccineData.push(await getSlotsForDate(distinctPincode[i], today));
    }
    return vaccineData;
}

async function getSlotsForDate(PINCODE, DATE) {
    let config = {
        header: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
        }
    };
    let url= `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${PINCODE}&date=${DATE}`;
    console.log('url= ',url);
    let respData = await axios.get(url,config)
        .then((slots)=>{
            let sessions = slots.data.centers;
            console.log('Session>>>>>>>>>>>>>',sessions);
            if (sessions.length > 0) {
                console.log("validSlots here");
                return sessions;
            }
            return [];
        })
        .catch(function (error) {
            console.log(error.message);
            return [];
        });
    return respData;
}

// //mongoconnect
// async function loadContacts() {
//     const client = await mongodb.MongoClient.connect('', {
//         useNewUrlParser: true,useUnifiedTopology:true
//     });

//     return client.db('myFirstDatabase').collection('contact')
// }

module.exports = router;