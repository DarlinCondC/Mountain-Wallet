import * as solanaWeb3 from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { PublicKey } from '@solana/web3.js';

import  AsyncStorage  from "@react-native-async-storage/async-storage";

//variables
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL                                                                     

//Funcion guardar llave
async function saveKey(data){
  try {
    console.log(await AsyncStorage.setItem('@storage_Key', data))  
  } catch (e) { 
       // saving error  
  }
}

//Funcion leer llave
async function readKey(){
  //obteniendo llave
  try {
    const key = await AsyncStorage.getItem('@storage_Key')
    return key 
  } catch (e) { 
       // saving error  
  }
}

//Funcion guardar llave
async function savePublicKey(data){
  try {
    console.log(await AsyncStorage.setItem('@storage_PublicKey', data))  
  } catch (e) { 
       // saving error  
  }
}

//Leer la public key de la cuenta
async function readPublicKey(){
  //obteniendo llave
  try {
    const key = await AsyncStorage.getItem('@storage_PublicKey')
    return key 
  } catch (e) { 
       // saving error  
  }
}


//Funcion guardar llave
async function saveMmemonic(data){
  try {   
    console.log(await AsyncStorage.setItem('@storage_Mnemonic', data))  
  } catch (e) { 
       // saving error  
  }
}

//Funcion leer llave
async function readMnemonic(){
  //obteniendo llave
  try {
    const key = await AsyncStorage.getItem('@storage_Mnemonic')
    return key 
  } catch (e) { 
       // saving error  
  }
}


//Funcion guardar contra
async function savePassword(data){
  try {
    console.log(await AsyncStorage.setItem('@storage_Pass', data))  
  } catch (e) { 
       // saving error  
  }
}

//Funcion guardar contra
async function readPassword(){
  //obteniendo contra
  try {
    const password = await AsyncStorage.getItem('@storage_Pass')
    return password  
  } catch (e) { 
       // saving error  
  }
}
//Funcion guardar nombre de usuario
async function saveUser(data){
  try {
  console.log(await AsyncStorage.setItem('@storage_User', data)) 
  } catch (e) { 
  // saving error 
  }
  }
  
  //Funcion leer nombre de usuario
  async function readUser(){
  try {
  const user = await AsyncStorage.getItem('@storage_User')
  return user 
  } catch (e) { 
  // saving error 
  }
  }


////////////////////////////////////////////////////////////
//  Funciones de Solana-web3 para la creacion de cuentas  //
////  obtener el balance y transferir SOL y SPL Tokens  ////
////////////////////////////////////////////////////////////


//generar mnemonic
async function generateMnemonic() {
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/mnemonic/`)
  const text = await response.text()
  saveMmemonic(text)
  return text
}

//Crear cuenta (public key)
async function createAccount(mnemonic: string) {
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/keypair_public_key/${mnemonic}`)
  const text = await response.text()
  savePublicKey(text)
  return text
}

//Crear cuenta (secret key)
async function fetchSecret(mnemonic: string) {
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/keypair_secret_key/${mnemonic}`)
  const text = await response.text()
  saveKey(text)
  return text
}

async function sendSoles(mnemonic: string, toPublicKey: string, amount: number){
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/send_transaction/${mnemonic}/${toPublicKey}/${amount}`)
  const text = await response.text()
  return text
}

async function sendSPL(mnemonic: string, toPublicKey: string, amount: number, mint: string){
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/send_transaction_spl/${mnemonic}/${toPublicKey}/${amount}/${mint}`)
  const text = await response.text()
  return text
}

async function sendSPLStable(mnemonic: string, toPublicKey: string, amount: number, mint: string){
  const response = await fetch(`https://wallet-condor-8246.uc.r.appspot.com/send_transaction_spl_stable/${mnemonic}/${toPublicKey}/${amount}/${mint}`)
  const text = await response.text()
  return text
}

//crear conexion
function createConnection(cluster:string) {
  return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(cluster))
}

//obtener balance de Solanas
async function getBalance(publicKey: string) {
  const connection = createConnection("mainnet-beta")
  
  const lamports = await connection.getBalance(new solanaWeb3.PublicKey(publicKey)).catch((err) => {
    console.log(err);
  })

  const sol = lamports / LAMPORTS_PER_SOL
  return sol
} 

//buscar cuentas asociadas a tokens
async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<PublicKey> {
    return (
      await solanaWeb3.PublicKey.findProgramAddress(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];
  }

//obtener balance del token
async function getToken(publicKey: string, splToken: string){
    const connection = createConnection("mainnet-beta")
    const account = await findAssociatedTokenAddress(new PublicKey(publicKey), new PublicKey(splToken))

  try {
    const balance = await connection.getTokenAccountBalance(new PublicKey(account.toString()))
    return balance.value.uiAmount
  } catch (e) {
    return 0
  }
}

// funcion para obtener el historial de transacciones
async function getHistory(pubKey:string,options = { limit: 20 }){

  const connection = createConnection("mainnet-beta");
  const history = await connection.getConfirmedSignaturesForAddress2(
  new PublicKey(pubKey),
  options
  );

  console.log(history);
  
  return history;

}


export { 
  savePublicKey,
  readPublicKey,
  generateMnemonic,
  createAccount,
  getBalance,
  getToken,
  saveKey,
  readKey,
  getHistory,
  saveMmemonic,
  readMnemonic,
  savePassword, 
  readPassword,
  fetchSecret,
  sendSoles,
  sendSPL,
  sendSPLStable,
  saveUser,
  readUser, 
  createConnection
}
