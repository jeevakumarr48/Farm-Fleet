import type { Role } from '@prisma/client'

export interface ChatContext {
  machineType?: string
  areaInAcres?: number
  preferredDate?: string
  village?: string
  field?: string
  landmark?: string
  farmerName?: string
  phone?: string
  quote?: number
  negotiated?: boolean
}

const machineTypes = ['tractor', 'rotavator', 'seeder', 'sprayer', 'harvester']
const prices: Record<string, number> = { tractor: 950, rotavator: 720, seeder: 680, sprayer: 540, harvester: 1450 }

function extractContext(message: string, context: ChatContext): ChatContext {
  const lower = message.toLowerCase()
  const machineType = machineTypes.find((type) => lower.includes(type))
  const acres = message.match(/(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़)/i)?.[1]
  const phone = message.match(/(?:\+91[\s-]?)?[6-9]\d{9}/)?.[0]
  const village = message.match(/(?:in|at|near|village)\s+([a-z][a-z -]{2,28})/i)?.[1]?.trim()
  const dateMatch = message.match(/(?:(?:on|for)\s+)?(\d{1,2})(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)/i)
  const month = dateMatch ? new Date(`${dateMatch[2]} ${dateMatch[1]}, 2025`).toISOString().slice(0, 10) : /tomorrow/i.test(lower) ? new Date(Date.now() + 86400000).toISOString().slice(0, 10) : undefined
  const field = message.match(/(?:plot|field)\s*([A-Za-z0-9][A-Za-z0-9 -]{1,20})/i)?.[1]?.trim()
  const farmerName = message.match(/(?:my name is|farmer is|name is)\s+([A-Za-z][A-Za-z ]{2,35})/i)?.[1]?.trim()
  return { ...context, ...(machineType ? { machineType } : {}), ...(acres ? { areaInAcres: Number(acres) } : {}), ...(phone ? { phone } : {}), ...(village ? { village: village.replace(/\s+(for|on|tomorrow|today).*$/i, '').trim() } : {}), ...(month ? { preferredDate: month } : {}), ...(field ? { field } : {}), ...(farmerName ? { farmerName } : {}) }
}

function quoteFor(context: ChatContext) { const perAcre = prices[context.machineType || 'tractor'] || prices.tractor; const area = context.areaInAcres || 1; const travel = context.village ? 180 : 0; return Math.round(perAcre * area + travel) }
function missingFor(context: ChatContext, role: Role) { const missing: string[] = []; if (!context.machineType) missing.push('machineType'); if (!context.areaInAcres) missing.push('areaInAcres'); if (!context.preferredDate) missing.push('preferredDate'); if (!context.village) missing.push('village'); if (!context.field) missing.push('field'); if (role !== 'FARMER' && !context.farmerName) missing.push('farmerName'); if (role !== 'FARMER' && !context.phone) missing.push('phone'); return missing }

export function respondToChat(message: string, context: ChatContext, role: Role) {
  const lower = message.toLowerCase(); const next = extractContext(message, context); const wantsPrice = /price|cost|rate|quote|कितना|कीमत/i.test(lower); const wantsNegotiate = /negotiate|lower|discount|कम|सस्ता|कम कर/i.test(lower); const wantsLocation = /location|where|map|landmark|गांव|गाँव|स्थान/i.test(lower); const wantsHelp = /help|what can|hello|hi|नमस्ते|வணக்கம்/i.test(lower)
  if (wantsNegotiate && (next.quote || context.quote)) { const original = context.quote || quoteFor(next); const revised = Math.round(original * .92); return { context: { ...next, quote: revised, negotiated: true }, message: `I can offer a 8% route discount for this job. The revised estimate is ₹${revised.toLocaleString('en-IN')} instead of ₹${original.toLocaleString('en-IN')}. This is a prototype quote; the CHC can confirm the final rate.`, quickReplies: ['Accept revised quote', 'Keep original quote'] }
  }
  if (wantsLocation && !next.village) return { context: next, message: 'Tell me the village first. You can type something like “Bairiya village, Plot 12B, near the water tank”.', quickReplies: ['Bairiya village'] }
  const missing = missingFor(next, role)
  if (wantsHelp) return { context: next, message: 'I can make a machinery request, check a rate, suggest a time, or help with field location. Try “tractor for 4 acres in Bairiya”.', quickReplies: ['Book a tractor', 'Check prices'] }
  if (wantsPrice && !next.machineType) return { context: next, message: 'Which machine do you need? I can quote tractors, rotavators, seeders, sprayers, and harvesters by acre.', quickReplies: ['Tractor price', 'Rotavator price', 'Sprayer price'] }
  if (wantsPrice && next.machineType) { const quote = quoteFor(next); return { context: { ...next, quote }, message: `${next.machineType[0].toUpperCase() + next.machineType.slice(1)} work is estimated at ₹${quote.toLocaleString('en-IN')} for ${next.areaInAcres || 1} acre${next.areaInAcres === 1 ? '' : 's'}${next.village ? `, including a ₹180 route allowance to ${next.village}` : ''}. Would you like to negotiate or continue?`, quickReplies: ['Negotiate rate', 'Continue booking'] } }
  if (missing.length > 0) { const prompts: Record<string, string> = { machineType: 'Which machine should I arrange: tractor, rotavator, seeder, sprayer, or harvester?', areaInAcres: 'How many acres should the machine cover?', preferredDate: 'What date should I plan it for? For example, 20 January.', village: 'Which village is the field in?', field: 'What is the field or plot name?', farmerName: 'What is the farmer’s name?', phone: 'What phone number should the operator call?' }; const field = missing[0]; return { context: next, message: prompts[field], quickReplies: field === 'machineType' ? ['Tractor', 'Rotavator', 'Sprayer'] : [] } }
  const quote = next.quote || quoteFor(next); return { context: { ...next, quote }, message: `I have a ${next.machineType} booking for ${next.areaInAcres} acres at ${next.village}, ${next.field}, planned for ${next.preferredDate}. The estimate is ₹${quote.toLocaleString('en-IN')}. Shall I schedule it?`, quickReplies: ['Schedule this job', 'Change details', 'Negotiate rate'], draftReady: true }
}
