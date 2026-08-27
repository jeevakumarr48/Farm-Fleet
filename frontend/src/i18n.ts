import { taPhrases } from './taPhrases'

export type Language = 'en' | 'hi' | 'ta'
export type NavKey = 'overview' | 'bookings' | 'schedule' | 'machines' | 'requests' | 'tasks' | 'people' | 'profile' | 'help'
export interface Translation { appName: string; tagline: string; signIn: string; openDesk: string; welcome: string; nav: Record<NavKey, string>; roles: Record<'ADMIN' | 'CHC_MANAGER' | 'OPERATOR' | 'FARMER', string>; phrases: Record<string, string> }
export const translations: Record<Language, Translation> = {
  en: {
    appName: 'FarmFleet', tagline: 'CHC operations, in rhythm with the field', signIn: 'Sign in to FarmFleet', openDesk: 'Open operations desk', welcome: 'Welcome back',
    nav: { overview: 'Overview', bookings: 'Bookings', schedule: 'Schedule', machines: 'Machines', requests: 'My requests', tasks: 'Assigned jobs', people: 'People', profile: 'My profile', help: 'Help & support' },
    roles: { ADMIN: 'Administrator', CHC_MANAGER: 'CHC Manager', OPERATOR: 'Field Operator', FARMER: 'Farmer' },
    phrases: {},
  },
  hi: {
    appName: 'फार्मफ्लीट', tagline: 'खेत के साथ तालमेल में CHC संचालन', signIn: 'फार्मफ्लीट में साइन इन करें', openDesk: 'ऑपरेशन डेस्क खोलें', welcome: 'वापसी पर स्वागत है',
    nav: { overview: 'अवलोकन', bookings: 'बुकिंग', schedule: 'शेड्यूल', machines: 'मशीनें', requests: 'मेरे अनुरोध', tasks: 'सौंपे गए काम', people: 'लोग', profile: 'मेरी प्रोफ़ाइल', help: 'सहायता' },
    roles: { ADMIN: 'एडमिन', CHC_MANAGER: 'CHC मैनेजर', OPERATOR: 'फील्ड ऑपरेटर', FARMER: 'किसान' },
    phrases: {},
  },
  ta: {
    appName: 'ஃபார்ம்ஃப்ளீட்', tagline: 'வயலுடன் இணைந்த CHC செயல்பாடுகள்', signIn: 'ஃபார்ம்ஃப்ளீட்டில் உள்நுழைக', openDesk: 'செயல்பாட்டு மேசையைத் திறக்கவும்', welcome: 'மீண்டும் வரவேற்கிறோம்',
    nav: { overview: 'மேலோட்டம்', bookings: 'முன்பதிவுகள்', schedule: 'அட்டவணை', machines: 'இயந்திரங்கள்', requests: 'எனது கோரிக்கைகள்', tasks: 'ஒதுக்கப்பட்ட பணிகள்', people: 'பயனர்கள்', profile: 'எனது சுயவிவரம்', help: 'உதவி மற்றும் ஆதரவு' },
    roles: { ADMIN: 'நிர்வாகி', CHC_MANAGER: 'CHC மேலாளர்', OPERATOR: 'கள இயக்குநர்', FARMER: 'விவசாயி' },
    phrases: taPhrases,
  },
}
