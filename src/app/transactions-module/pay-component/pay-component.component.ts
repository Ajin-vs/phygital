import { Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { TransactionServiceService } from '../transaction-service.service';
import * as cp from 'crypto-js';

@Component({
  selector: 'app-pay-component',
  templateUrl: './pay-component.component.html',
  styleUrls: ['./pay-component.component.css']
})
export class PayComponentComponent {

  constructor(private transactionService: TransactionServiceService) {
    window.crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    ).then(keyPair => {
      window.crypto.subtle.exportKey(
        'spki',
        keyPair.publicKey
      ).then(publicKey => {
        console.log(publicKey, "public key");

        const message = 'Hello, world!';
        console.log( new TextEncoder().encode(message));
        
        window.crypto.subtle.sign(
          {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA256'
          },
          keyPair.privateKey,
          new TextEncoder().encode(message)
        ).then(signature => {
          console.log(signature, "signature");
          console.log(keyPair.publicKey,"keyPair.publicKey");
          
          window.crypto.subtle.verify(
            {
              name: 'RSASSA-PKCS1-v1_5',
              hash: 'sha256'
            },
            keyPair.publicKey,
            signature,
            new TextEncoder().encode(message)
          ).then(res => {
            console.log(res, "responses");

          })
        })
      })

    })





  }
  speak = async () => {
    await TextToSpeech.speak({
      text: `Recieved 100 rupees`,
      lang: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient'
    });
  };




  // importPublicKey(publicKey:any){
  //   return crypto.subtle.importKey(
  //     'spki',
  //     this.str2ab(publicKey),
  //     {
  //       name: 'RSA-OAEP',
  //       hash: { name: 'SHA-256' },
  //     },
  //     true,
  //     ['verify']
  //   );
  // }



  getMessageEncoding(data: any) {
    let enc = new TextEncoder();
    return enc.encode(data);
  }
  str2ab(str: any) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  getSupportedLanguages = async () => {
    const languages = TextToSpeech.getSupportedLanguages();

    this.transactionService.sign().subscribe(async res => {
      console.log(res,"Api response");
      
// try asyn await
const publicKey = res.publicKeyPEM;
const data = res.data;
const signature = res.signatureBase64;

// Decode the signature from base64 to Uint8Array
const signatureArrayBuffer = this.base64ToArrayBuffer(signature);
console.log(signatureArrayBuffer,"signature");

// Fetch the part of the PEM string between header and footer
const pemHeader = "-----BEGIN PUBLIC KEY-----";
const pemFooter = "-----END PUBLIC KEY-----";
const pemContents = publicKey.substring(
  pemHeader.length,
  publicKey.length - pemFooter.length - 2,
);
console.log(pemContents,"pemContents");

// Base64 decode the string to get the binary data
const binaryDerString = window.atob(pemContents);
console.log(binaryDerString);

// Convert from a binary string to an ArrayBuffer
const binaryDer = this.str2ab(binaryDerString);
console.log(binaryDer,"binaryDer");
try {
  // Import the public key as a CryptoKey
  const importedPublicKey = await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ['verify'],
  );

  // Get the encoded data as Uint8Array
  const encoded = this.getMessageEncoding(data);
console.log(importedPublicKey,"importedPublicKey");

  // Verify the signature
  const verificationResult = await window.crypto.subtle.verify(
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'sha-256'
    },
    importedPublicKey,
    signatureArrayBuffer,
    encoded,
  );

  console.log('Verification Result:', verificationResult);

} catch (error) {
  console.error('Error verifying the signature:', error);
}

      // console.log(res, "response from API");

      // const publicKey = res.publicKeyPEM;
      // const data = res.data;
      // const signature = res.signatureBase64;
      // console.log(publicKey);
      // // fetch the part of the PEM string between header and footer
      // const pemHeader = "-----BEGIN PUBLIC KEY-----";
      // const pemFooter = "-----END PUBLIC KEY-----";
      // const pemContents = publicKey.substring(
      //   pemHeader.length,
      //   publicKey.length - pemFooter.length - 2,
      // );
      // console.log(pemContents);
      // let bSign = this.base64ToArrayBuffer(signature)
      // console.log(bSign);

      // // base64 decode the string to get the binary data
      // const binaryDerString = window.atob(pemContents);
      // // convert from a binary string to an ArrayBuffer
      // const binaryDer = this.str2ab(binaryDerString);

      // window.crypto.subtle.importKey(
      //   "spki",
      //   binaryDer,
      //   {
      //     name: "RSASSA-PKCS1-v1_5",
      //     hash: "SHA-256",
      //   },
      //   true,
      //   ['verify'],
      // ).then(publicKey => {
      //   let encoded = this.getMessageEncoding(data);

      //   console.log(publicKey);
      //   console.log(bSign);
      //   console.log(encoded);
        
      //   window.crypto.subtle.verify(
      //     {
      //       name: 'RSASSA-PKCS1-v1_5',
      //       hash: 'sha256'
      //     },
      //     publicKey,
      //     bSign,
      //     encoded,
      //   );
      // }).then(verificationResult => {
      //   console.log(verificationResult, "status");

      // }).catch((error) => {
      //   console.error('Error verifying the signature:', error);
      // });



    })




  };

  getSupportedVoices = async () => {
    const voices = await TextToSpeech.getSupportedVoices();
    console.log(voices);

  };

  isLanguageSupported = async (lang: string) => {
    const isSupported = await TextToSpeech.isLanguageSupported({ lang });
  };
}
