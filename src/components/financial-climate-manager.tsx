'use client'

import { useFinancialClimate } from '@/hooks/use-financial-climate'

export function FinancialClimateManager() {
    // This hook will side-effect and update the document attribute
    useFinancialClimate()
    return null
}
