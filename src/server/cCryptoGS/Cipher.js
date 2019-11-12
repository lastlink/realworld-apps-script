var ALGOS = ['AES','DES','Rabbit','TripleDES']; 
/**
 * GAS library wrapper for CryptoJS
 * @param {String} pass passphrase to use for encrypting
 * @param {String} optAlgo default AES
 * @return {CryptoGS} self
 */

function Cipher (pass,optAlgo) {

  var self = this;
  // we'll allow case errors for algos.
  var pass_ = pass;
  var algo_ = caseFix(optAlgo || 'aes');
  if (!algo_) {
    throw 'unknown crypto algo ' + optAlgo;
  }
  
  if (!pass_) {
    throw 'you must provide a passphrase';
  }
  
  self.getAlgo = function () {
    return algo_;
  };
  /**
   * encrypt a message
   * @param {string} message the message to be encrypted
   * @return {string} the encrypted message
   */
  self.encrypt = function  (message) {
    return CryptoJS[algo_].encrypt(message, pass_).toString();
  }; 
  
  /**
   * decrypt a message
   * @param {string} message the encrypted message to be decrypted
   * @return {string} the decrypted message
   */
  self.decrypt = function  (encryptedMessage) {
    return CryptoJS[algo_].decrypt(encryptedMessage, pass_).toString(CryptoJS.enc.Utf8);
  }; 

  return self;
  
  /**
   * @param {string} algoToFix convert algo to correct case
   * @return {string} case sorted out algo
   */
  function caseFix (algoToFix) {
    var a;
    for (var i=0; !a && i <ALGOS.length;i++) {
      if (algoToFix.toLowerCase() === ALGOS[i].toLowerCase()) {
        a = ALGOS[i];
      }
    }
    return a;
  }

}

