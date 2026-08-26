import { prisma } from '../../lib/prisma.js'
import { predictDuration } from '../durationService.js'

export interface DurationInput { machineType: string; areaInAcres: number; cropType?: string; location?: unknown; season?: string }
export interface DurationPrediction { predictedDurationMinutes: number; confidenceScore: number; sampleCount: number; model: 'rule-based' | 'historical-adjusted' }

export class JobDurationPredictor {
  async predict(input: DurationInput): Promise<DurationPrediction> {
    const samples = await prisma.jobDurationTrainingSample.findMany({ where: { machineType: input.machineType }, select: { actualDurationMinutes: true, areaInAcres: true } }).catch(() => [])
    const locationText = typeof input.location === 'string' ? input.location : JSON.stringify(input.location || '')
    const locationFactor = /remote|outskirts|far|canal/i.test(locationText) ? 1.15 : 1
    const seasonFactor = input.season?.toLowerCase() === 'monsoon' ? 1.1 : 1
    const base = predictDuration(input.machineType, input.areaInAcres, input.cropType)
    const baseline = { ...base, predictedDurationMinutes: Math.ceil(base.predictedDurationMinutes * locationFactor * seasonFactor) }
    if (samples.length < 3) return { ...baseline, sampleCount: samples.length, model: 'rule-based' }
    const observedPerAcre = samples.reduce((total, sample) => total + sample.actualDurationMinutes / Math.max(sample.areaInAcres, 0.1), 0) / samples.length
    const historicalEstimate = Math.ceil(observedPerAcre * input.areaInAcres)
    return { predictedDurationMinutes: Math.max(30, historicalEstimate), confidenceScore: Math.min(.98, .78 + samples.length / 100), sampleCount: samples.length, model: 'historical-adjusted' }
  }
}

export const jobDurationPredictor = new JobDurationPredictor()
