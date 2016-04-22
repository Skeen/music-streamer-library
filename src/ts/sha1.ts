// calculate sha1 hash of input string
export function sha1(input:string) : string
{
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(input);
    return shasum.digest('hex');
}


