'use strict';

module.exports = { 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: 'eu-central-1',
  bucket: 'nodejs-mongodb-api-images',
  dirname: 'images'
};
