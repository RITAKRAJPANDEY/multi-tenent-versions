// exports.encodeCursor=({created_at,id})=>{
//     return Buffer.from(JSON.stringify({created_at,id})).toString('base64url')
// }



// exports.decodeCursorUtil=(cursor)=>{
//     return JSON.parse(Buffer.from(cursor,'base64url').toString('utf8'));
// }

exports.encodeCursor = ({created_at,id})=>{
    return Buffer.from(JSON.stringify({created_at,id})).toString('base64url');
}

exports.decodeCursor=(cursor)=>{
    return JSON.parse(Buffer.from(cursor,'base64url').toString('utf8'));
}