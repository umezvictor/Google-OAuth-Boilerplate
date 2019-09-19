/*
this function does validation. it is a utility validation file
checks for empty string, undefined, empty Object
*/
// const isEmpty = value => {
//     value === undefined || value === null || 
//     (typeof(value) === 'object' && Object.keys(value).length === 0) || 
//     (typeof(value) === 'string' && value.trim().length === 0);
// }

const isEmpty = value => 
value === undefined || value === null || 
(typeof value === 'object' && Object.keys(value).length === 0) || 
(typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
