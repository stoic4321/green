import App from './client/App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import morgan from 'morgan';
import { renderToString } from 'react-dom/server';
import router from './server/routes';
import logger from './server/util/logger';
import path from 'path';
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map(asset=>
    `<link rel="stylesheet" href="${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map(asset=>
    `<script src="${asset}"${extra}></script>`
  ).join('') : '' : '';
};

const myStream = {
  write: text => {
    logger.info(text.trim())
  }
}

console.log(path.join(__dirname, '../build/public'))

const server = express();

// server.use(express.static(path.join(__dirname, '../build/public'))); //I solve the problem at this place
// server.use('/z', express.static(path.join(__dirname, '../build/public/static/css/client.e6077be3.css'))); //I solve the problem at this place
// server.use(express.static(path.join(__dirname, '../build/public'))); //I solve the problem at this place

server.use(morgan('dev', { stream: myStream }))
server.use('/api', router)
server.get('/', (req,res)=>{
  res.redirect('/app/')
})

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  // .use(express.static(process.env.NODE_ENV==='production' ? path.join(__dirname, '../build/public') : 'public'))
  .get('/app/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
      `<!doctype html>
          <html lang="">
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta charset="utf-8" />
                <title>Doc Box</title>
                <meta name="transparent" content="true" />
                ${cssLinksFromAssets(assets, 'client')}
            </head>
            <body>
                <div id="root">${markup}</div>
                ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
            </body>
        </html>`
      );
    }
  });

export default server;
