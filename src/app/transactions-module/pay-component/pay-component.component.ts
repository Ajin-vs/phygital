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

  constructor(private transactionService: TransactionServiceService){
window.crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    ).then(keyPair=>{
      window.crypto.subtle.exportKey(
        'spki',
        keyPair.publicKey
      ).then(publicKey=>{
        console.log(publicKey,"public key");

        const message = 'Hello, world!';
       window.crypto.subtle.sign(
          {
            name: 'RSASSA-PKCS1-v1_5'
          },
          keyPair.privateKey,
          new TextEncoder().encode(message)
        ).then(signature=>{
          console.log(signature,"signature");
          window.crypto.subtle.verify(
            {
              name: 'RSASSA-PKCS1-v1_5'
            },
            keyPair.publicKey,
            signature,
            new TextEncoder().encode(message)
          ).then(res=>{
            console.log(res,"response");
            
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


  getSupportedLanguages = async () => {
    const languages = await TextToSpeech.getSupportedLanguages();
    console.log(languages);
    
    this.transactionService.sign().subscribe(data=>{
      // console.log(data);
      let bufferObj =data
      console.log(bufferObj.sign);

      let signa = bufferObj.sign
      
      let signature = Buffer.from(signa, "utf8");
      const message = 'this need to be verified';
      // signature=data
      const l1='-----BEGIN PUBLIC KEY-----\n'
      const l2='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0z7QeLa/t8TmZu+6IYnKfAlfdroJwpT0zkNuAzGCM5hT8SYtpla2bda0pEeK+VusxBnSrG+LXEtOlqNBaP4TgIQIAUisfQivdVSzpFWruIs4FWPqT3aDc6PzMZ1vDgn1FcHpeJ7GNTL7uGLsV3DzFFNI7l67H2tvJK1Q/oP9lI2XrctA1WWkJlPhMPgQmBjaR11IlSEHJhT283HWSTYPrO6VdMNVlq9lC8N/eJO2V2FtpAhtFgI9jAA/3TAxF4nL2+w+q0sHv4MocaNo2/9gMwAMS+gJjJEikzFBVgjslrm3mf0Dm0pP4MCmC9vy9EnpLaA0P7BWOs2Ls4jK2WJtlwIDAQAB'
      const l3= '\n-----END PUBLIC KEY-----\n'
      let p = l1+l2+l3
      const keyData = new TextEncoder().encode(p);
       window.crypto.subtle.importKey(
        "spki",
  new TextEncoder().encode(p),
  { name: "RSA-OAEP", hash: "SHA-256" },
  false,
  ["encrypt"]
      ).then(publicKey=>{
        console.log(publicKey,"public key");
        
        window.crypto.subtle.verify(
          {
            name: 'RSASSA-PKCS1-v1_5'
          },
          publicKey,
          signature,
          new TextEncoder().encode(message)
        ).then(res=>{
          console.log(res,"response");
          
        })
      })
     
      
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
