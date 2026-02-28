'use client'

import { useEffect } from 'react'
import { useFinance } from './use-finance'

export function useFinancialClimate() {
    const { data: finance } = useFinance()

    useEffect(() => {
        if (finance?.climate?.season) {
            document.documentElement.setAttribute('data-climate', finance.climate.season)
        } else {
            document.documentElement.setAttribute('data-climate', 'SIEMBRA')
        }
    }, [finance])

    return finance?.climate
}
