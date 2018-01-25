const { superstruct } = require('superstruct')
const { Types } = require('mongoose')
const {
  isAfter, isAlpha, isAlphanumeric, isAscii, isBase64, isBefore, isBoolean,
  isCreditCard, isDataURI, isEmail, isEmpty, isFQDN, isFloat, isFullWidth,
  isHalfWidth, isHexColor, isHexadecimal, isIP, isISBN, isISSN, isISIN,
  isISO31661Alpha2, isISRC, isInt, isJSON, isLatLong, isLowercase, isMACAddress,
  isMD5, isMimeType, isMongoId, isMultibyte, isNumeric, isPort, isSurrogatePair,
  isURL, isUUID, isUppercase, isVariableWidth
} = require('validator')

// TODO make it extendible with custom types from config file

const struct = superstruct({
  types: {
    isObjectId: val => Types.ObjectId.isValid(val),
    isNotEmpty: val => !isEmpty(val),

    isAfter,
    isAlpha,
    isAlphanumeric,
    isAscii,
    isBase64,
    isBefore,
    isBoolean,
    isCreditCard,
    isDataURI,
    isEmail,
    isEmpty,
    isFQDN,
    isFloat,
    isFullWidth,
    isHalfWidth,
    isHexColor,
    isHexadecimal,
    isIP,
    isISBN,
    isISSN,
    isISIN,
    isISO31661Alpha2,
    isISRC,
    isInt,
    isJSON,
    isLatLong,
    isLowercase,
    isMACAddress,
    isMD5,
    isMimeType,
    isMongoId,
    isMultibyte,
    isNumeric,
    isPort,
    isSurrogatePair,
    isURL,
    isUUID,
    isUppercase,
    isVariableWidth
  }
})

module.exports = { superstruct, struct }
