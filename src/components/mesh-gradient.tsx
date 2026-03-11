'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export function MeshGradient() {
    const { scrollYProgress } = useScroll()
    
    // Subtle parallax for mesh blobs
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
    const x1 = useTransform(scrollYProgress, [0, 1], [0, 100])
    
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base Layer */}
            <div className="absolute inset-0 bg-[var(--background)]" />
            
            {/* Rotating Blobs */}
            <motion.div 
                style={{ y: y1, x: x1 }}
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{ 
                    rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 15, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px]"
            />
            
            <motion.div 
                style={{ y: y2 }}
                animate={{ 
                    rotate: -360,
                    scale: [1, 1.2, 1],
                }}
                transition={{ 
                    rotate: { duration: 50, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[100px]"
            />
            
            <motion.div 
                animate={{ 
                    x: [-20, 20, -20],
                    y: [-20, 20, -20],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-red-600/[0.03] blur-[140px]"
            />

            {/* Grain Overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grain-y.com/assets/images/grain-dark.png')]" />
        </div>
    )
}
