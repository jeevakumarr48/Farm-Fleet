import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Language, type Translation } from '../i18n'

interface LanguageValue { language: Language; setLanguage: (language: Language) => void; t: Translation; tr: (phrase: string) => string }
const LanguageContext = createContext<LanguageValue | null>(null)
const textOriginals = new WeakMap<Text, string>()
const attributeOriginals = new WeakMap<Element, Record<string, string>>()
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('farmfleet_language') as Language) || 'en')
  function setLanguage(next: Language) { localStorage.setItem('farmfleet_language', next); setLanguageState(next) }
  const t = translations[language]
  const tr = (phrase: string) => t.phrases[phrase] || phrase
  useEffect(() => {
    document.documentElement.lang = language
    const translateText = (value: string) => {
      if (language === 'en') return value
      if (t.phrases[value]) return t.phrases[value]
      let translated = value
      Object.entries(t.phrases).sort(([a], [b]) => b.length - a.length).forEach(([source, target]) => { if (source.length > 2 && translated.includes(source)) translated = translated.split(source).join(target) })
      return translated
    }
    const translateRoot = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []; let current: Node | null
      while ((current = walker.nextNode())) textNodes.push(current as Text)
      textNodes.forEach((node) => { if (node.parentElement?.closest('script, style, textarea')) return; let original = textOriginals.get(node) || node.nodeValue || ''; const knownSource = Object.entries(translations.ta.phrases).find(([, target]) => target === original)?.[0]; if (knownSource) original = knownSource; textOriginals.set(node, original); node.nodeValue = translateText(original) })
      const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll('*'))] : Array.from((root as Document).querySelectorAll?.('*') || [])
      elements.forEach((element) => { const originals = attributeOriginals.get(element) || {}; ['placeholder', 'title', 'aria-label'].forEach((attribute) => { const value = element.getAttribute(attribute); if (!value) return; const original = originals[attribute] || value; originals[attribute] = original; element.setAttribute(attribute, translateText(original)) }); attributeOriginals.set(element, originals) })
    }
    translateRoot(document.body)
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => translateRoot(node))))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language, t])
  return <LanguageContext.Provider value={{ language, setLanguage, t, tr }}>{children}</LanguageContext.Provider>
}
export function useLanguage() { const value = useContext(LanguageContext); if (!value) throw new Error('useLanguage must be inside LanguageProvider'); return value }
