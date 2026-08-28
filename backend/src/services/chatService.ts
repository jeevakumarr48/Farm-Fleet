import type { Role } from '@prisma/client'
import { config } from '../config.js'

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
  const village = message.match(/\b(?:in|at|near|village)\b\s+([a-z][a-z -]{2,28})/i)?.[1]?.trim()
  const dateMatch = message.match(/(?:(?:on|for)\s+)?(\d{1,2})(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)/i)
  const month = dateMatch ? new Date(`${dateMatch[2]} ${dateMatch[1]}, 2025`).toISOString().slice(0, 10) : /tomorrow/i.test(lower) ? new Date(Date.now() + 86400000).toISOString().slice(0, 10) : undefined
  const field = message.match(/(?:plot|field)\s*([A-Za-z0-9][A-Za-z0-9 -]{1,20})/i)?.[1]?.trim()
  const farmerName = message.match(/(?:my name is|farmer is|name is)\s+([A-Za-z][A-Za-z ]{2,35})/i)?.[1]?.trim()
  return { ...context, ...(machineType ? { machineType } : {}), ...(acres ? { areaInAcres: Number(acres) } : {}), ...(phone ? { phone } : {}), ...(village ? { village: village.replace(/\s+(for|on|tomorrow|today).*$/i, '').trim() } : {}), ...(month ? { preferredDate: month } : {}), ...(field ? { field } : {}), ...(farmerName ? { farmerName } : {}) }
}

function quoteFor(context: ChatContext) { const perAcre = prices[context.machineType || 'tractor'] || prices.tractor; const area = context.areaInAcres || 1; const travel = context.village ? 180 : 0; return Math.round(perAcre * area + travel) }
function missingFor(context: ChatContext, role: Role) { const missing: string[] = []; if (!context.machineType) missing.push('machineType'); if (!context.areaInAcres) missing.push('areaInAcres'); if (!context.preferredDate) missing.push('preferredDate'); if (!context.village) missing.push('village'); if (!context.field) missing.push('field'); if (role !== 'FARMER' && !context.farmerName) missing.push('farmerName'); if (role !== 'FARMER' && !context.phone) missing.push('phone'); return missing }

async function externalAnswer(message: string, context: ChatContext, role: Role) { if (!config.AI_CHAT_API_URL) return null; try { const response = await fetch(config.AI_CHAT_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(config.AI_CHAT_API_KEY ? { Authorization: `Bearer ${config.AI_CHAT_API_KEY}` } : {}) }, body: JSON.stringify({ message, context, role, product: 'FarmFleet CHC machinery operations' }) }); if (!response.ok) return null; const result = await response.json() as { answer?: string; message?: string }; return result.answer || result.message || null } catch { return null } }
function approximateAnswer(message: string) { const lower = message.toLowerCase(); if (/weather|rain|monsoon|மழை/.test(lower)) return 'I cannot see live weather here, but a practical estimate is to keep a 30–60 minute buffer for rain, confirm the village road before dispatch, and avoid spraying during rainfall or strong wind.'; if (/crop|wheat|rice|paddy|soil|பயிர்|நெல்|கோதுமை/.test(lower)) return 'For a rough field plan, tell me the crop, acreage, and soil condition. Wheat and dry soil usually need less time than paddy or wet ground; the CHC should confirm the final duration on site.'; if (/diesel|fuel|டீசல்/.test(lower)) return 'Fuel is usually included in the CHC route allowance, but the exact rate depends on distance and machine type. I can give a rough quote if you share the machine, acreage, and village.'; if (/subsidy|scheme|loan|மானியம்/.test(lower)) return 'Government scheme eligibility changes by state and season. I can give general guidance, but please verify the current rule with your local agriculture office or CHC.'; if (/operator|driver|contact|call/.test(lower)) return 'The operator is normally shared after the job is assigned. Until then, the CHC dispatch team is the right contact for route or timing changes.'; return 'I can give an approximate operational answer, but I do not want to invent a precise fact. For the best estimate, share the crop, acreage, village, and preferred date, or ask me about a machine, rate, route, or booking.' }

export async function respondToChat(message: string, context: ChatContext, role: Role) {
  const lower = message.toLowerCase(); const next = extractContext(message, context); const wantsPrice = /price|cost|rate|quote|कितना|कीमत/i.test(lower); const wantsNegotiate = /negotiate|lower|discount|कम|सस्ता|कम कर/i.test(lower); const wantsLocation = /location|where|map|landmark|गांव|गाँव|स्थान/i.test(lower); const wantsHelp = /help|what can|hello|hi|नमस्ते|வணக்கம்/i.test(lower)
  if (wantsNegotiate && (next.quote || context.quote)) { const original = context.quote || quoteFor(next); const revised = Math.round(original * .92); return { context: { ...next, quote: revised, negotiated: true }, message: `I can offer a 8% route discount for this job. The revised estimate is ₹${revised.toLocaleString('en-IN')} instead of ₹${original.toLocaleString('en-IN')}. This is a prototype quote; the CHC can confirm the final rate.`, quickReplies: ['Accept revised quote', 'Keep original quote'] }
  }
  if (wantsLocation && !next.village) return { context: next, message: 'Tell me the village first. You can type something like “Bairiya village, Plot 12B, near the water tank”.', quickReplies: ['Bairiya village'] }
  const missing = missingFor(next, role)
  if (wantsHelp) return { context: next, message: 'I can make a machinery request, check a rate, suggest a time, or help with field location. Try “tractor for 4 acres in Bairiya”.', quickReplies: ['Book a tractor', 'Check prices'] }
  const bookingIntent = /book|booking|request|machine|tractor|rotavator|seeder|sprayer|harvester|acre|rate|price|quote|schedule/i.test(lower)
  if (!bookingIntent) return { context: next, message: await externalAnswer(message, next, role) || approximateAnswer(message), quickReplies: ['Book a machine', 'Check prices'] }
  if (wantsPrice && !next.machineType) return { context: next, message: 'Which machine do you need? I can quote tractors, rotavators, seeders, sprayers, and harvesters by acre.', quickReplies: ['Tractor price', 'Rotavator price', 'Sprayer price'] }
  if (wantsPrice && next.machineType) { const quote = quoteFor(next); return { context: { ...next, quote }, message: `${next.machineType[0].toUpperCase() + next.machineType.slice(1)} work is estimated at ₹${quote.toLocaleString('en-IN')} for ${next.areaInAcres || 1} acre${next.areaInAcres === 1 ? '' : 's'}${next.village ? `, including a ₹180 route allowance to ${next.village}` : ''}. Would you like to negotiate or continue?`, quickReplies: ['Negotiate rate', 'Continue booking'] } }
  if (missing.length > 0) { const prompts: Record<string, string> = { machineType: 'Which machine should I arrange: tractor, rotavator, seeder, sprayer, or harvester?', areaInAcres: 'How many acres should the machine cover?', preferredDate: 'What date should I plan it for? For example, 20 January.', village: 'Which village is the field in?', field: 'What is the field or plot name?', farmerName: 'What is the farmer’s name?', phone: 'What phone number should the operator call?' }; const field = missing[0]; return { context: next, message: prompts[field], quickReplies: field === 'machineType' ? ['Tractor', 'Rotavator', 'Sprayer'] : [] } }
  const quote = next.quote || quoteFor(next); return { context: { ...next, quote }, message: `I have a ${next.machineType} booking for ${next.areaInAcres} acres at ${next.village}, ${next.field}, planned for ${next.preferredDate}. The estimate is ₹${quote.toLocaleString('en-IN')}. Shall I schedule it?`, quickReplies: ['Schedule this job', 'Change details', 'Negotiate rate'], draftReady: true }
}
