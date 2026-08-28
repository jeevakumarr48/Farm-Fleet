import type { Role } from '@prisma/client'

export type BookingState = 'IDLE' | 'COLLECT_MACHINE' | 'COLLECT_AREA' | 'COLLECT_DATE' | 'COLLECT_LOCATION' | 'COLLECT_FARMER' | 'QUOTE' | 'NEGOTIATE' | 'CONFIRM'
export interface BookingContext { state?: BookingState; machineType?: string; areaInAcres?: number; preferredDate?: string; village?: string; field?: string; landmark?: string; farmerName?: string; phone?: string; quote?: number; negotiated?: boolean }
export interface MachineReply { handled: boolean; context?: BookingContext; message?: string; quickReplies?: string[]; draftReady?: boolean }

const machines = ['tractor', 'rotavator', 'seeder', 'sprayer', 'harvester']
const rates: Record<string, number> = { tractor: 950, rotavator: 720, seeder: 680, sprayer: 540, harvester: 1450 }
function parseDate(value: string) { const match = value.match(/(?:(?:on|for)\s+)?(\d{1,2})(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)/i); if (match) return new Date(`${match[2]} ${match[1]}, ${new Date().getFullYear()}`).toISOString().slice(0, 10); return /tomorrow/i.test(value) ? new Date(Date.now() + 86400000).toISOString().slice(0, 10) : undefined }
function parseVillage(value: string) { return value.match(/\b(?:in|at|near|village)\b\s+([a-z][a-z -]{2,28})/i)?.[1]?.replace(/\s+(for|on|tomorrow|today).*$/i, '').replace(/\s+village$/i, '').trim() }
function parseFields(value: string, current: BookingContext) { const lower = value.toLowerCase(); const machineType = machines.find((machine) => lower.includes(machine)); const acres = value.match(/(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़)/i)?.[1]; const phone = value.match(/(?:\+91[\s-]?)?[6-9]\d{9}/)?.[0]; const date = parseDate(value); const village = parseVillage(value); const field = value.match(/\b(?:plot|field)\b\s*(?:is|:)?\s*([A-Za-z0-9][A-Za-z0-9 -]{1,24}?)(?=\s+(?:near|on|at)|,|$)/i)?.[1]?.trim(); const name = value.match(/(?:my name is|farmer is|name is)\s+([A-Za-z][A-Za-z ]{2,35})/i)?.[1]?.trim() || (!current.farmerName && !/book|booking|request|machine|tractor|rotavator|seeder|sprayer|harvester|acre|rate|price|quote|schedule/i.test(lower) && /^[A-Za-z]+(?:\s+[A-Za-z]+){1,2}$/.test(value.trim()) ? value.trim() : undefined); return { ...current, ...(machineType ? { machineType } : {}), ...(acres ? { areaInAcres: Number(acres) } : {}), ...(phone ? { phone } : {}), ...(date ? { preferredDate: date } : {}), ...(village ? { village } : {}), ...(field ? { field } : {}), ...(name ? { farmerName: name } : {}) }
}
function quote(context: BookingContext) { return Math.round((rates[context.machineType || 'tractor'] || rates.tractor) * (context.areaInAcres || 1) + (context.village ? 180 : 0)) }
function prompt(state: BookingState, context: BookingContext = {}): MachineReply { const prompts: Record<string, string> = { COLLECT_MACHINE: 'Which machine should I arrange: tractor, rotavator, seeder, sprayer, or harvester?', COLLECT_AREA: 'How many acres should the machine cover?', COLLECT_DATE: 'What date should I plan it for? For example, 20 January or tomorrow.', COLLECT_LOCATION: 'Which village and field is the job in?', COLLECT_FARMER: 'What is the farmer’s name and phone number?' }; return { handled: true, context: { ...context, state }, message: prompts[state] || 'Tell me what field job you need help with.', quickReplies: state === 'COLLECT_MACHINE' ? ['Tractor', 'Rotavator', 'Sprayer'] : [] } }

export class BookingStateMachine {
  transition(message: string, input: BookingContext, role: Role): MachineReply {
    const lower = message.toLowerCase(); const bookingIntent = /book|booking|request|machine|tractor|rotavator|seeder|sprayer|harvester|acre|rate|price|quote|schedule|முன்பதிவு|இயந்திரம்/i.test(lower); const state = input.state || 'IDLE'
    if (state === 'IDLE' && !bookingIntent) return { handled: false }
    const next = parseFields(message, input)
    if (/negotiate|lower|discount|कम|சலுகை/i.test(lower) && (next.quote || input.quote)) { const original = input.quote || quote(next); const revised = Math.round(original * .92); return { handled: true, context: { ...next, state: 'NEGOTIATE', quote: revised, negotiated: true }, message: `I can apply an 8% route discount. The revised estimate is ₹${revised.toLocaleString('en-IN')} instead of ₹${original.toLocaleString('en-IN')}. The CHC confirms the final price.`, quickReplies: ['Approve & schedule', 'Keep original quote'] } }
    if (/approve|schedule this job|yes|confirm/i.test(lower) && (state === 'QUOTE' || state === 'NEGOTIATE' || state === 'CONFIRM')) return { handled: true, context: { ...next, state: 'CONFIRM' }, message: 'The booking details are ready. Use the approval button to add this job to the run sheet.', quickReplies: ['Approve & schedule'], draftReady: true }
    if (!next.machineType) return prompt('COLLECT_MACHINE')
    if (!next.areaInAcres) return prompt('COLLECT_AREA', next)
    if (!next.preferredDate) return prompt('COLLECT_DATE', next)
    if (!next.village || !next.field) return prompt('COLLECT_LOCATION', next)
    if (role !== 'FARMER' && (!next.farmerName || !next.phone)) return prompt('COLLECT_FARMER', next)
    const total = next.quote || quote(next)
    if (/price|cost|rate|quote/i.test(lower)) return { handled: true, context: { ...next, state: 'QUOTE', quote: total }, message: `${next.machineType[0].toUpperCase() + next.machineType.slice(1)} work is estimated at ₹${total.toLocaleString('en-IN')} for ${next.areaInAcres} acres, including the route allowance to ${next.village}. Would you like to negotiate or continue?`, quickReplies: ['Negotiate rate', 'Approve & schedule'] }
    return { handled: true, context: { ...next, state: 'QUOTE', quote: total }, message: `I have a ${next.machineType} booking for ${next.areaInAcres} acres at ${next.village}, ${next.field}, planned for ${next.preferredDate}. The estimate is ₹${total.toLocaleString('en-IN')}. Shall I schedule it?`, quickReplies: ['Approve & schedule', 'Negotiate rate', 'Change details'], draftReady: true }
  }
}

export const bookingStateMachine = new BookingStateMachine()
