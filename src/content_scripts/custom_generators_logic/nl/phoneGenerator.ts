import {
  generateRandomInt,
  addLeadingZeros,
  randomArrayElement
} from '../../../utils/helpers'
import {NlPhoneOptions} from '../../../../types'

// Dutch phone number formats:
// Mobile: 06 + 8 digits (e.g., 0612345678)
// Landline: 0 + area code (2-3 digits) + 7-8 digits
// International mobile: +31 6 + 8 digits (e.g., +31612345678)
// International landline: +31 + area code (without leading 0) + number

// Major area codes for landlines
const AREA_CODES = [
  '010', // Rotterdam
  '020', // Amsterdam
  '030', // Utrecht
  '040', // Eindhoven
  '050', // Groningen
  '070', // The Hague
  '071', // Leiden
  '072', // Alkmaar
  '073', // 's-Hertogenbosch
  '074', // Hengelo
  '075', // Zaandam
  '076', // Breda
  '077', // Venlo
  '078', // Dordrecht
  '079', // Zoetermeer
  '0111', // Goes
  '0113', // Vlissingen
  '0114', // Middelburg
  '0115', // Terneuzen
  '0117', // Sluis
  '0118', // Zierikzee
  '013', // Tilburg
  '014', // Doetinchem
  '015', // Delft
  '0161', // Oosterhout
  '0162', // Roosendaal
  '0164', // Bergen op Zoom
  '0165', // Steenbergen
  '0166', // Tholen
  '0167', // Willemstad
  '0168', // Dinteloord
  '0172', // Gouda
  '0174', // Naaldwijk
  '0175', // Hellevoetsluis
  '0180', // Spijkenisse
  '0181', // Brielle
  '0182', // Gorinchem
  '0183', // Leerdam
  '0184', // Sliedrecht
  '0186', // Oud-Beijerland
  '0187', // Middelharnis
  '0222', // Den Helder
  '0223', // Schagen
  '0224', // Texel
  '0226', // Enkhuizen
  '0227', // Hoorn
  '0228', // Medemblik
  '0229', // Monnickendam
  '023', // Haarlem
  '024', // Nijmegen
  '0251', // Beverwijk
  '0252', // Hillegom
  '0255', // IJmuiden
  '026', // Arnhem
  '027', // Winterswijk
  '0281', // Harderwijk
  '0284', // Doorn
  '0285', // Houten
  '0287', // Woerden
  '0294', // Weesp
  '0297', // Uithoorn
  '0299', // Purmerend
  '0314', // Doetinchem
  '0315', // Veenendaal
  '0316', // Wageningen
  '0317', // Ede
  '0318', // Barneveld
  '0320', // Lelystad
  '0321', // Dronten
  '033', // Amersfoort
  '0341', // Harderwijk
  '0342', // Barneveld
  '0343', // Veenendaal
  '0344', // Ede
  '0345', // Wageningen
  '0346', // Doetinchem
  '0347', // Zeist
  '0348', // Woerden
  '035', // Hilversum
  '036', // Almere
  '038', // Zwolle
  '0411', // Boxtel
  '0412', // Oss
  '0413', // Veghel
  '0416', // Waalwijk
  '0418', // Zaltbommel
  '043', // Maastricht
  '045', // Heerlen
  '046', // Sittard
  '0475', // Roermond
  '0478', // Venray
  '0481', // Boxmeer
  '0485', // Cuijk
  '0486', // Grave
  '0487', // Druten
  '0488', // Culemborg
  '0492', // Helmond
  '0493', // Deurne
  '0495', // Weert
  '0497', // Echt
  '0499', // Roermond
  '0511', // Drachten
  '0512', // Heerenveen
  '0513', // Sneek
  '0514', // Oosterwolde
  '0515', // Dokkum
  '0516', // Franeker
  '0517', // Harlingen
  '0518', // Bolsward
  '0519', // Stavoren
  '0521', // Steenwijk
  '0522', // Meppel
  '0523', // Hardenberg
  '0524', // Coevorden
  '0525', // Emmen
  '0527', // Hoogeveen
  '0528', // Assen
  '0529', // Beilen
  '053', // Enschede
  '0541', // Oldenzaal
  '0543', // Hengelo
  '0544', // Almelo
  '0545', // Goor
  '0546', // Rijssen
  '0547', // Vriezenveen
  '0548', // Vroomshoop
  '055', // Apeldoorn
  '0561', // Wolvega
  '0562', // West-Terschelling
  '0566', // Emmeloord
  '0570', // Deventer
  '0571', // Raalte
  '0572', // Holten
  '0573', // Goor
  '0575', // Zutphen
  '0577', // Epe
  '0578', // Heerde
  '058', // Leeuwarden
  '0591', // Emmen
  '0592', // Assen
  '0593', // Beilen
  '0594', // Meppel
  '0595', // Hoogeveen
  '0596', // Coevorden
  '0597', // Hardenberg
  '0598', // Steenwijk
  '0599' // Drachten
]

const MOBILE_PREFIX = '06'
const COUNTRY_CODE = '31'

/**
 * Generates a valid Dutch phone number
 * @param options - Options for generation (internationalFormat, phoneType)
 * @returns Valid Dutch phone number
 */
export const generateNlPhone = (options: NlPhoneOptions = {}): string => {
  const phoneType = options.phoneType || 'mobile'
  const internationalFormat = options.internationalFormat || false

  if (phoneType === 'mobile') {
    // Mobile: 06 + 8 digits
    const mobileNumber = addLeadingZeros(generateRandomInt(0, 99999999), 8)
    const fullNumber = `${MOBILE_PREFIX}${mobileNumber}`

    if (internationalFormat) {
      return `+${COUNTRY_CODE}${fullNumber.substring(1)}` // Remove leading 0
    }
    return fullNumber
  } else {
    // Landline: area code + 7-8 digits
    const areaCode = randomArrayElement(AREA_CODES)
    // Generate 7 or 8 digits depending on area code length
    const numberLength = areaCode.length === 3 ? 7 : 6 // 3-digit area code = 7 digits, 4-digit = 6 digits
    const subscriberNumber = addLeadingZeros(
      generateRandomInt(0, Math.pow(10, numberLength) - 1),
      numberLength
    )
    const fullNumber = `${areaCode}${subscriberNumber}`

    if (internationalFormat) {
      return `+${COUNTRY_CODE}${fullNumber.substring(1)}` // Remove leading 0
    }
    return fullNumber
  }
}
