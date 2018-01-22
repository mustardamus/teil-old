const { superstruct } = require('superstruct')
const { isMongoId, isEmpty } = require('validator')

// TODO make it extendible with custom types from config file

const struct = superstruct({
  types: {
    isMongoId (val) { return isMongoId(val) },
    isEmpty,
    isNotEmpty (val) { return !isEmpty(val) }
  }
})

module.exports = { superstruct, struct }

/*
isAfter(str [, date])
isAlpha(str [, locale])
isAlphanumeric(str [, locale])
isAscii(str)
isBase64(str)
isBefore(str [, date])
isBoolean(str)
isCreditCard(str)
isDataURI(str)
isEmail(str [, options])
isFQDN(str [, options])
isFloat(str [, options])
isFullWidth(str)
isHalfWidth(str)
isHexColor(str)
isHexadecimal(str)
isIP(str [, version])
isISBN(str [, version])
isISSN(str [, options])
isISIN(str)
isISIN(str)
isISO31661Alpha2(str)
isISRC(str)
isInt(str [, options])
isJSON(str)
isLatLong(str)
isLowercase(str)
isMACAddress(str)
isMD5(str)
isMimeType(str)
isMultibyte(str)
isNumeric(str)
isPort(str)
isSurrogatePair(str)
isURL(str [, options])
isUUID(str [, version])
isUppercase(str)
isVariableWidth(str)
*/
