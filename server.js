'use strict';
const httpContext = require('express-http-context');
const port = process.env.PORT || 8001;
const express = require('express');
const bodyParser = require('body-parser');
const swaggerize = require('swaggerize-express');
const swaggerUi = require('swaggerize-ui');
const path = require('path');
const fs = require("fs");
const _ = require('underscore');
const async = require('async');
const uuid = require('uuid/v4');
const logger = require('./utils/logger.js');
const swaggerTools = require('oas-tools');

fs.existsSync = fs.existsSync || require('path').existsSync;

let app = express();

app.use(bodyParser.json());


app.use(httpContext.middleware);

app.use((req, res, next)=> {
    httpContext.set('reqId', uuid());
    next();
});
let spec = fs.readFileSync(path.join(__dirname, '/config/oas-doc.yaml'));
const jsyaml = require('js-yaml');
let swaggerDoc = jsyaml.safeLoad(spec);
var options_object = {
    controllers: path.join(__dirname, './controllers'),
    checkControllers: true,
    loglevel: 'info',
    logfile: path.join(__dirname, './logs'),
    // customLogger: myLogger,
    strict: false,
    router: true,
    validator: true,
    docs: {
        apiDocs: '/api-docs',
        apiDocsPrefix: '',
        swaggerUi: '/docs',
        swaggerUiPrefix: ''
    },
    oasSecurity: false,
    securityFile: {
        // your security settings
    },
    oasAuth: true,
    grantsFile: {
        // your authorization settings
    },
    ignoreUnknownFormats: true
}

swaggerTools.configure(options_object);

swaggerTools.initializeMiddleware(swaggerDoc, app, function(middleware) {
    app.listen(port, () => {
        console.log("server started listing to request on port %s",port);
    })
});

/***************************************************************
 *  Swaggerize the application as a whole.
 *  This will be provided to deployment team for APIM as well.
 ***************************************************************/
/*

app.use(swaggerize({
    api: path.resolve('./config/openapi.json'),
    handlers: path.resolve('./handlers'),
    docspath: '/free-busy/swagger'
}));

app.use('/free-busy/docs', swaggerUi({
    docs: '/free-busy/swagger'
}));

app.get('/getFreeBusy', (req, res) => {
    logger.info("getFreeBusy Request generations for "+JSON.stringify(req.query));
    let id = require('./handlers/free-busy/{id}');
    id.getFreeBusy(req,res);
});

/!**********************************************************
 *  Create the NodeJS Server.
 **********************************************************!/
app.listen(port, () => {
    console.log("server started listing to request on port %s",port);
});*/
