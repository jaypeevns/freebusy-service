const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentialJson = require('./../credentials.json');

/*
**
* Get Free or Busy in formation
* @param {Data Json} all the data required to fetch free or busy info from Calendar API.
*/

exports.free_busy_service = (data_check) => {
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first time.
    const TOKEN_PATH = 'token.json';
    const {client_secret, client_id, redirect_uris} = credentialJson.installed;
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                resolve(getAccessToken(oAuth2Client));
            } else {
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            }
        });
    }).then(async (oAuth2Client)=>{
        await fetchFreeBusy(oAuth2Client, data_check);
    }).catch((err)=>{
        throw err;
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getAccessToken(oAuth2Client) {
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first time.
    const TOKEN_PATH = 'token.json';
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'];
    return new Promise((resolve, reject) =>{
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        /*const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });*/
        /*rl.question('Enter the code from that page here: ', (code) => {
            rl.close();*/
        let code = "4/EgGQsQawew09z8lK_Vw3Me4QejQP71Gfi-q1RRX233AMo42ZgM2nh2M";
            console.log("Code:--"+code);
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    console.error('Error retrieving access token', err);
                    reject(err);
                } else {
                    // Store the token to disk for later program executions
                    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log('Token stored to', TOKEN_PATH);
                        }
                    });
                    oAuth2Client.setCredentials(token);
                    resolve(oAuth2Client);
                }
            });
        //});
    }).catch((err)=>{
        throw err;
    });
}

/*
**
* Get Free or Busy in formation
* @param {google.auth.OAuth2} auth An authorized OAuth2 client.
* @param {Data Json} all the data required to fetch free or busy info from Calendar API.
*/
function fetchFreeBusy(auth, data_check) {
    return new Promise((resolve, reject)=>{
        const calendar = google.calendar({version: 'v3', auth});
        const startDate = data_check.startDate.toISOString();
        const endDate = data_check.endDate.toISOString();
        const check = {
            auth: auth,
            resource: {
                timeMin: startDate,
                timeMax: endDate ,
                timeZone: "UTC+5:30",
                groupExpansionMax: 42,
                calendarExpansionMax: 42,
                items: [
                    {
                        id: data_check.calendarID
                    }
                ],
            }
        };
        calendar.freebusy.query(check, (err, res) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
            } else {
                data_check.result = res.data;
                resolve(data_check);
            }
        });
    }).catch((err)=>{
        throw err;
    });
}