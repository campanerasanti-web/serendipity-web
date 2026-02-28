'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, X, Zap, Shield, Info, Camera, Scan, Activity } from 'lucide-react'
import { Button } from './ui-library'
import { cn } from '@/lib/utils'

import jsQR from 'jsqr'

interface SophiaEyeProps {
    isOpen: boolean
    onClose: () => void
    onScan: (data: string) => void
}

export const SophiaEye = ({ isOpen, onClose, onScan }: SophiaEyeProps) => {
    const [isScanning, setIsScanning] = useState(false)
    const [scanProgress, setScanProgress] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [hasCamera, setHasCamera] = useState(false)

    useEffect(() => {
        let animationFrameId: number

        async function startCamera() {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.error("Cámara no soportada en este entorno.")
                    setHasCamera(false)
                    return
                }
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                })
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    setHasCamera(true)
                }
            } catch (err) {
                console.error("Acceso a cámara denegado o no disponible:", err)
                setHasCamera(false)
            }
        }

        const scan = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const video = videoRef.current
                const canvas = canvasRef.current
                if (canvas) {
                    const context = canvas.getContext('2d', { willReadFrequently: true })
                    if (context) {
                        canvas.height = video.videoHeight
                        canvas.width = video.videoWidth
                        context.drawImage(video, 0, 0, canvas.width, canvas.height)
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "dontInvert",
                        })

                        if (code && isScanning) {
                            setScanProgress(100)
                            setIsScanning(false)
                            setTimeout(() => {
                                onScan(code.data)
                                setScanProgress(0)
                            }, 500)
                        }
                    }
                }
            }
            if (isOpen && isScanning) {
                animationFrameId = requestAnimationFrame(scan)
            }
        }

        if (isOpen) {
            setIsScanning(true)
            setScanProgress(0)
            startCamera().then(() => {
                animationFrameId = requestAnimationFrame(scan)
            })
        } else {
            setIsScanning(false)
            setScanProgress(0)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }
        }

        return () => {
            cancelAnimationFrame(animationFrameId)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }
        }
    }, [isOpen, isScanning, onScan])

    useEffect(() => {
        if (isScanning && scanProgress < 95) {
            const timer = setTimeout(() => setScanProgress(prev => prev + 1), 100)
            return () => clearTimeout(timer)
        }
    }, [isScanning, scanProgress])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6"
                >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)] opacity-50" />
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                    </div>

                    <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="lg:col-span-7 relative aspect-square lg:aspect-video rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black group transition-all duration-700 hover:border-blue-500/20"
                        >
                            {hasCamera ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-zinc-900/40 flex flex-col items-center justify-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 animate-pulse">
                                        <Camera size={40} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Hardware: Soporte Limitado</p>
                                        <p className="text-xs font-bold text-blue-500/40">Iniciando Sincronía Neuronal...</p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                                    <div className="absolute -top-1 -left-1 w-14 h-14 border-t-[3px] border-l-[3px] border-blue-500 rounded-tl-3xl shadow-[-5px_-5px_20px_rgba(37,99,235,0.4)]" />
                                    <div className="absolute -top-1 -right-1 w-14 h-14 border-t-[3px] border-r-[3px] border-blue-500 rounded-tr-3xl shadow-[5px_-5px_20px_rgba(37,99,235,0.4)]" />
                                    <div className="absolute -bottom-1 -left-1 w-14 h-14 border-b-[3px] border-l-[3px] border-blue-500 rounded-bl-3xl shadow-[-5px_5px_20px_rgba(37,99,235,0.4)]" />
                                    <div className="absolute -bottom-1 -right-1 w-14 h-14 border-b-[3px] border-r-[3px] border-blue-500 rounded-br-3xl shadow-[5px_5px_20px_rgba(37,99,235,0.4)]" />

                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_25px_rgba(220,38,38,1)] z-10"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-red-600/20 to-transparent opacity-30" />
                                    </motion.div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <QrCode size={180} className="text-blue-500" strokeWidth={0.5} />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                                <div className="flex justify-between items-start">
                                    <div className="bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">SOPHIA_LENS_PRO</span>
                                    </div>
                                    <div className="bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-4 text-[10px] font-black tracking-[0.2em] text-white/50">
                                        <Activity size={12} className="text-blue-500" />
                                        <span>DYNAMIC_FOCUS</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mb-4">
                                    <div className="px-8 py-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1.5">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className={cn("w-1 h-3 rounded-full transition-all duration-300",
                                                        scanProgress > (i * 25) ? "bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-white/10")} />
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] min-w-[120px]">
                                                {scanProgress < 100 ? `Analizando: ${Math.floor(scanProgress)}%` : 'Lote Identificado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>

                            {/* Canvas oculto para procesamiento de jsQR */}
                            <canvas ref={canvasRef} className="hidden" />
                        </motion.div>

                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[28px] flex items-center justify-center shadow-[0_15px_40px_rgba(37,99,235,0.3)]">
                                        <Scan size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none mb-2">Ojo de Sophia</h2>
                                        <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Protocolo de Sincronía v.2.0</p>
                                    </div>
                                </div>
                                <p className="text-zinc-500 font-medium leading-relaxed max-w-md">
                                    El sistema procesa la geometría del código en tiempo real para validar la simetría operativa y financiera del lote.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl rounded-[32px] border border-white/10 group-hover:border-blue-500/40 transition-all duration-500" />
                                    <div className="relative p-7 space-y-3">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Resonancia</p>
                                            <p className="text-xl font-bold text-white tracking-tight">963.8 Hz</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl rounded-[32px] border border-white/10 group-hover:border-blue-500/40 transition-all duration-500" />
                                    <div className="relative p-7 space-y-3">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Estatuto</p>
                                            <p className="text-xl font-bold text-white tracking-tight">Certif. OK</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <span>Instrucciones de Sophia</span>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <div className="space-y-5 px-2">
                                    <div className="flex gap-5 items-start">
                                        <div className="w-1.5 h-6 bg-blue-500/30 rounded-full mt-0.5" />
                                        <p className="text-sm font-medium text-zinc-400 leading-relaxed">
                                            Evita reflejos de luz blanca sobre la superficie plástica del lote.
                                        </p>
                                    </div>
                                    <div className="flex gap-5 items-start">
                                        <div className="w-1.5 h-6 bg-white/10 rounded-full mt-0.5" />
                                        <p className="text-sm font-medium text-zinc-400 leading-relaxed">
                                            Mantén el código a una distancia de 15-20cm del lente óptico.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 h-16 rounded-[28px] border border-white/5 text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                                >
                                    Cerrar Visor
                                </button>
                                <Button
                                    className="flex-2 h-16 !rounded-[28px] bg-white text-black hover:bg-zinc-100 text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95"
                                    onClick={() => setScanProgress(0)}
                                >
                                    Reiniciar Sistema
                                </Button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-12 right-12 w-14 h-14 flex items-center justify-center rounded-[20px] bg-white/[0.03] text-white/20 border border-white/5 hover:bg-red-500/80 hover:text-white hover:border-red-500 transition-all duration-500 group shadow-2xl"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
