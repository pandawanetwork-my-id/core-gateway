// reference: https://github.com/PeculiarVentures/webcrypto-docs/blob/master/AES_GCM.md#decrypt
const { Crypto } = require("@peculiar/webcrypto")
const { TextDecoder } = require('util')
const crypto = new Crypto()

const config = {
  KEY: '7fa42b5237fffa44a01d766b566ca6c18cf8e9eced8b34f61bc86ca722f9235d',
  IV: '41e40637f14e28a022cccc528b89b128'
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}
function hexStringToArrayBuffer(hexString) {
    hexString = hexString.replace(/^0x/, '');
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);    
    }
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    var array = new Uint8Array(integers);
    return array.buffer;
}

function decrypt (encryptedText) {
    return new Promise((resolve, reject) => {
        const buffEncryptedText = hexStringToArrayBuffer(encryptedText)
        const buffKey = hexStringToArrayBuffer(config.KEY)
        const buffIV = hexStringToArrayBuffer(config.IV)
        crypto
          .subtle
          .importKey('raw', buffKey, 'AES-GCM', false, ['decrypt'])
          .then((importedKey) => {
            crypto.subtle.decrypt(
              {
                name: "AES-GCM",
                iv: buffIV,     // BufferSource
                // additionalData, // Optional. The additional authentication data to include
                // tagLength: 128, // 32, 64, 96, 104, 112, 120 or 128 (default)
              },
              importedKey,  // AES key
              buffEncryptedText, // BufferSource
            )
              .then((res) => {
                const text = new TextDecoder('utf8').decode(res)
                resolve(text)
              })
              .catch(reject)
          })
          .catch(reject)
    })
}

function encrypt (text) {
    return new Promise((resolve, reject) => {
        const buffKey = hexStringToArrayBuffer(config.KEY)
        const buffIV = hexStringToArrayBuffer(config.IV)
        text = new TextEncoder().encode(text)

        crypto
          .subtle
          .importKey('raw', buffKey, 'AES-GCM', false, ['encrypt'])
          .then((importedKey) => {
            const enc = crypto.subtle.encrypt(
              {
                name: "AES-GCM",
                iv: buffIV,     // BufferSource
              },
              importedKey,  // AES key
              text, // text
            )

            enc.then((res) => {
                resolve(buf2hex(res))
              })
              .catch(reject)
          })
          .catch(reject)
    })
}

module.exports = {
    decrypt,
    encrypt
}