import NodeRSA from 'node-rsa';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ HASH ID USERA ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const key = new NodeRSA({ b: 512 });

export const encrypt = (id) => {
    const encrypted = key.encrypt(id, 'base64');
    return encrypted;
}

export const decrypt = (id) => {
    const decrypted = key.decrypt(id, 'utf8');
    return decrypted;
}
