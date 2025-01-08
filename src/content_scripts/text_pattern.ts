import {setNativeValue} from '../utils/helpers.ts'
import {defaultSettings} from './config/defaults.ts'
;(() => {
  const safeBase64Encode = (str: string): string => {
    try {
      const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
      return btoa(utf8Bytes)
    } catch (e) {
      console.error('Base64 encoding failed:', e)
      return 'Base64 encoding failed for this string'
    }
  }

  const generatePattern = (text: string, length: number): string => {
    const patterns: ((t: string) => string)[] = [
      t => t.toUpperCase(),
      t => t.toLowerCase(),
      t => `${t}' OR '1'='1`,
      t => `${t}"; DROP TABLE users; --`,
      t => `C:\\${t}\\path\\to\\file`,
      t => `/${t}/../../../etc/passwd`,
      t => `<script>${t}</script>`,
      t => `<${t}></${t}>`,
      t => `${t}™®©℗℠`,
      t => `${t}★☆☎☏✓`,
      t => `!@#$%^&*()_+${t}`,
      t => `[{|}]\\~\`${t}`,
      t => `"${t}"'${t}'„${t}"«${t}»`,
      t => `"${t}"'${t}'„${t}"«${t}»`,
      t => `${t}\n\t\r\f\v`,
      t => `${t}\0\x00\u0000`,
      t => `${t}🔥💣💀👾`,
      t => encodeURIComponent(t),
      t => btoa(t),
      t => t.repeat(10),
      t => `${t}\r\n${t}\n${t}\r`,
      t => `${t}\u200B\u200C\u200D\uFEFF`,
      t => `${t}\u200B\u200C\u200D\uFEFF`,
      t => `\u202E${t}\u202C`,
      t => `${t}\u001F\u007F\u0080\u009F`
    ]

    let result = ''
    let patternIndex = 0

    while (result.length < length) {
      const pattern = patterns[patternIndex % patterns.length]
      const transformed = pattern(text)
      result += transformed + ' | '
      patternIndex++
    }

    return result.substring(0, length)
  }

  chrome.storage.sync.get(
    {
      defaultPatternText: defaultSettings.defaultPatternText,
      defaultPatternLength: defaultSettings.defaultPatternLength
    },
    items => {
      const text = prompt('Enter text for pattern:', items.defaultPatternText) || ''
      if (text) {
        const length = parseInt(
          prompt('Total length:', items.defaultPatternLength) || '0'
        )
        if (length) {
          const result = generatePattern(text, length)
          console.log(
            '%c Pattern Generator',
            'font-family:monospace; color:#e67e22; font-size:16px; font-weight:bold;'
          )
          console.log(
            `%c Length: ${result.length}`,
            'font-family:monospace; color:#3498db; font-size:14px;'
          )
          console.log(
            '%c Result:',
            'font-family:monospace; color:#e74c3c; font-size:14px;',
            result
          )
          console.log(
            '%c Base64 encoded:',
            'font-family:monospace; color:#1abc9c; font-size:14px;',
            safeBase64Encode(result)
          )

          const indicatedElement = document.querySelector(':focus') as HTMLElement | null
          if (indicatedElement) {
            setNativeValue(indicatedElement, result)
            indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
          }
        }
      }
    }
  )
})()
