import { config } from '../../config.js'

const tamilToEnglish: Array<[string, string]> = [
  ['டிராக்டர்', 'tractor'], ['ரோட்டாவேட்டர்', 'rotavator'], ['விதைப்பான்', 'seeder'], ['தெளிப்பான்', 'sprayer'], ['அறுவடை இயந்திரம்', 'harvester'],
  ['ஏக்கர்', 'acres'], ['கிராமம்', 'village'], ['வயல்', 'field'], ['நிலப்பகுதி', 'plot'], ['அருகில்', 'near'], ['இன்று', 'today'], ['நாளை', 'tomorrow'],
  ['காலை', 'morning'], ['மதியம்', 'afternoon'], ['மாலை', 'evening'], ['பெயர்', 'name'], ['தொலைபேசி', 'phone'], ['வேண்டும்', 'requested'], ['தேவை', 'need'],
  ['தண்ணீர் தொட்டி', 'water tank'], ['கோதுமை', 'wheat'], ['நெல்', 'paddy'], ['உருளைக்கிழங்கு', 'potato'], ['விரைவாக', 'urgent'], ['பதிவு செய்', 'book'],
]

export async function translateTamilToEnglish(text: string) {
  if (!text.trim()) return text
  if (config.TRANSLATION_API_URL) {
    try {
      const response = await fetch(config.TRANSLATION_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(config.SPEECH_TO_TEXT_API_KEY ? { Authorization: `Bearer ${config.SPEECH_TO_TEXT_API_KEY}` } : {}) }, body: JSON.stringify({ text, sourceLanguage: 'ta', targetLanguage: 'en' }) })
      if (response.ok) { const result = await response.json() as { translatedText?: string }; if (result.translatedText) return result.translatedText }
    } catch { /* Use the local prototype dictionary when the provider is unavailable. */ }
  }
  return tamilToEnglish.reduce((translated, [tamil, english]) => translated.split(tamil).join(` ${english} `), text).replace(/\s+/g, ' ').trim()
}
