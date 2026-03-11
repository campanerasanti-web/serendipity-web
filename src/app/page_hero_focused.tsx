'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
    Shield, Brain, ArrowRight, Sparkles,
    CheckCircle2, FileText, Archive, Database,
    Fingerprint, Wifi, BarChart3, Users, Zap,
    Globe, DollarSign, Activity, Package, Sun, Moon
} from 'lucide-react'
import { Button } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'
import { AuthControls } from '@/components/auth-controls'

/* ─── TYPES ── */
type Lang = 'es' | 'en' | 'vn'

/* ─── TRANSLATIONS ── */
const COPY = {
    es: {
        nav: ['Sistema', 'Módulos', 'Sophia', 'Acceso'],
        enter: 'Entrar',
        goToApp: 'Ir al Dashboard',
        // Hero
        heroEyebrow: 'Serendipity OS · Beta 2026',
        heroLine1: 'El sistema',
        heroLine2: 'que piensa',
        heroLine3: 'con tu negocio.',
        heroDesc: 'Gestión financiera y operativa con inteligencia artificial. Diseñado para organizaciones que exigen más.',
        heroCta: 'Acceder al sistema',
        heroCtaSecondary: 'Crear cuenta',
        // Feature bento
        bentoBadge: 'Capacidades del sistema',
        bentoTitle: 'Todo lo que necesitas, integrado.',
        bentoDesc: 'Seis módulos trabajando como uno solo.',
        // Climate
        climBadge: 'Sistema Adaptativo',
        climTitle: 'Una interfaz que respira con tu operación.',
        climDesc: 'El Clima Financiero analiza en tiempo real el estado de tu negocio y adapta la UI, colores y alertas. No es un dashboard más — es un sistema vivo.',
        climates: [
            { name: 'SIEMBRA', emoji: '🌱', desc: 'Crecimiento activo. El sistema en modo expansión óptima.' },
            { name: 'COSECHA', emoji: '🌾', desc: 'Rendimiento máximo. Recolección de resultados positivos.' },
            { name: 'TORMENTA', emoji: '⚡', desc: 'Alerta operativa. Foco en estabilización y contingencia.' },
        ],
        // Sophia
        sophiaBadge: 'Inteligencia Artificial',
        sophiaTitle: 'Sophia no es un chatbot.',
        sophiaTitle2: 'Es tu agente operativo.',
        sophiaDesc: 'Sophia orquesta micro-agentes especializados para monitorear finanzas, analizar el Sagrario y generar reportes ejecutivos. Mientras tú decides, ella trabaja.',
        sophiaFeats: [
            'Análisis del Sagrario (Memoria Histórica con RAG)',
            'Orquestación de Micro-Agentes especializados',
            'Reportes Ejecutivos en PDF bajo demanda',
            'Recomendaciones basadas en principios herméticos',
        ],
        sophiaCta: 'Consultar a Sophia',
        // Access
        accessBadge: 'Control de Acceso',
        accessTitle: 'Capas de acceso.',
        accessTitle2: 'Control total.',
        accessDesc: 'Roles granulares con biometría WebAuthn. Cada usuario ve exactamente lo que necesita.',
        roles: [
            { role: 'Admin', tag: 'SISTEMA', desc: 'Visibilidad total, configuración global y gestión de usuarios.' },
            { role: 'Supervisor', tag: 'EQUIPO', desc: 'Monitoreo de equipos, aprobaciones y seguimiento operativo.' },
            { role: 'Operativo', tag: 'CAMPO', desc: 'Registro de actividades, lotes y comunicación directa.' },
        ],
        // CTA
        ctaTitle: 'Listo para transformar tu operación.',
        ctaDesc: 'Únete a la organización que ya opera con inteligencia consciente.',
        ctaPrimary: 'Acceder ahora',
        ctaSecondary: 'Crear cuenta',
        // Footer
        copyright: '© 2026 Serendipity Bros',
        // Modules
        modules: [
            { title: 'Finanzas', desc: 'Ingresos, gastos, liquidez y proyecciones en tiempo real.', tag: 'FIN_01', icon: 'BarChart3', size: 'large' },
            { title: 'Sophia IA', desc: 'Macro-agente que orquesta micro-agentes especializados.', tag: 'AI_CORE', icon: 'Brain', size: 'medium' },
            { title: 'Sagrario', desc: 'Bóveda de conocimiento con búsqueda semántica (RAG).', tag: 'VAULT', icon: 'Database', size: 'medium' },
            { title: 'Biometría', desc: 'WebAuthn: huella digital y FaceID integrados.', tag: 'SEC_03', icon: 'Fingerprint', size: 'small' },
            { title: 'Offline Sync', desc: 'Opera sin red. Sincronización automática al volver.', tag: 'SYNC_04', icon: 'Wifi', size: 'small' },
            { title: 'Trazabilidad', desc: 'Lotes de producción y eficiencias por estación.', tag: 'OPS_05', icon: 'Zap', size: 'small' },
        ],
    },
    en: {
        nav: ['System', 'Modules', 'Sophia', 'Access'],
        enter: 'Enter',
        goToApp: 'Go to Dashboard',
        heroEyebrow: 'Serendipity OS · Beta 2026',
        heroLine1: 'The system',
        heroLine2: 'that thinks',
        heroLine3: 'with your business.',
        heroDesc: 'Financial and operational management powered by AI. Built for organizations that demand more.',
        heroCta: 'Access the system',
        heroCtaSecondary: 'Create account',
        bentoBadge: 'System Capabilities',
        bentoTitle: 'Everything you need, integrated.',
        bentoDesc: 'Six modules working as one.',
        climBadge: 'Adaptive System',
        climTitle: 'An interface that breathes with your operation.',
        climDesc: 'The Financial Climate analyzes your business in real time and adapts the UI, colors and alerts. Not just a dashboard — a living system.',
        climates: [
            { name: 'SIEMBRA', emoji: '🌱', desc: 'Active growth. System in optimal expansion mode.' },
            { name: 'COSECHA', emoji: '🌾', desc: 'Maximum performance. Harvesting positive results.' },
            { name: 'TORMENTA', emoji: '⚡', desc: 'Operational alert. Focus on stabilization and contingency.' },
        ],
        sophiaBadge: 'Artificial Intelligence',
        sophiaTitle: "Sophia isn't a chatbot.",
        sophiaTitle2: "She's your operational agent.",
        sophiaDesc: 'Sophia orchestrates specialized micro-agents to monitor finances, analyze the Vault and generate executive reports. While you decide, she works.',
        sophiaFeats: [
            'Sagrario analysis (Historical Memory with RAG)',
            'Orchestration of specialized Micro-Agents',
            'Executive PDF Reports on demand',
            'Recommendations based on hermetic principles',
        ],
        sophiaCta: 'Consult Sophia',
        accessBadge: 'Access Control',
        accessTitle: 'Access layers.',
        accessTitle2: 'Total control.',
        accessDesc: 'Granular roles with WebAuthn biometrics. Each user sees exactly what they need.',
        roles: [
            { role: 'Admin', tag: 'SYSTEM', desc: 'Total visibility, global configuration and user management.' },
            { role: 'Supervisor', tag: 'TEAM', desc: 'Team monitoring, approvals and operational tracking.' },
            { role: 'Operative', tag: 'FIELD', desc: 'Activity logging, batches and direct communication.' },
        ],
        ctaTitle: 'Ready to transform your operation.',
        ctaDesc: 'Join the organization already operating with conscious intelligence.',
        ctaPrimary: 'Access now',
        ctaSecondary: 'Create account',
        copyright: '© 2026 Serendipity Bros',
        modules: [
            { title: 'Finance', desc: 'Revenue, expenses, liquidity and projections in real time.', tag: 'FIN_01', icon: 'BarChart3', size: 'large' },
            { title: 'Sophia AI', desc: 'Macro-agent orchestrating specialized micro-agents.', tag: 'AI_CORE', icon: 'Brain', size: 'medium' },
            { title: 'Sagrario', desc: 'Knowledge vault with semantic search (RAG).', tag: 'VAULT', icon: 'Database', size: 'medium' },
            { title: 'Biometrics', desc: 'WebAuthn: fingerprint and FaceID integrated.', tag: 'SEC_03', icon: 'Fingerprint', size: 'small' },
            { title: 'Offline Sync', desc: 'Work offline. Auto-sync when back online.', tag: 'SYNC_04', icon: 'Wifi', size: 'small' },
            { title: 'Traceability', desc: 'Production batches and efficiency per station.', tag: 'OPS_05', icon: 'Zap', size: 'small' },
        ],
    },
    vn: {
        nav: ['Hệ thống', 'Mô-đun', 'Sophia', 'Truy cập'],
        enter: 'Vào',
        goToApp: 'Vào Dashboard',
        heroEyebrow: 'Serendipity OS · Beta 2026',
        heroLine1: 'Hệ thống',
        heroLine2: 'suy nghĩ',
        heroLine3: 'cùng doanh nghiệp.',
        heroDesc: 'Quản lý tài chính và vận hành với AI. Được thiết kế cho các tổ chức đòi hỏi cao hơn.',
        heroCta: 'Truy cập hệ thống',
        heroCtaSecondary: 'Tạo tài khoản',
        bentoBadge: 'Khả năng hệ thống',
        bentoTitle: 'Tất cả bạn cần, tích hợp.',
        bentoDesc: 'Sáu mô-đun hoạt động như một.',
        climBadge: 'Hệ thống thích ứng',
        climTitle: 'Giao diện hít thở cùng hoạt động.',
        climDesc: 'Khí hậu tài chính phân tích thời gian thực và điều chỉnh UI, màu sắc và cảnh báo.',
        climates: [
            { name: 'SIEMBRA', emoji: '🌱', desc: 'Tăng trưởng tích cực. Hệ thống ở chế độ mở rộng tối ưu.' },
            { name: 'COSECHA', emoji: '🌾', desc: 'Hiệu suất tối đa. Thu hoạch kết quả tích cực.' },
            { name: 'TORMENTA', emoji: '⚡', desc: 'Cảnh báo hoạt động. Tập trung ổn định và dự phòng.' },
        ],
        sophiaBadge: 'Trí tuệ nhân tạo',
        sophiaTitle: 'Sophia không phải chatbot.',
        sophiaTitle2: 'Cô ấy là đặc vụ vận hành của bạn.',
        sophiaDesc: 'Sophia điều phối các micro-agent chuyên biệt để giám sát tài chính và tạo báo cáo điều hành.',
        sophiaFeats: [
            'Phân tích Sagrario (Bộ nhớ lịch sử với RAG)',
            'Điều phối các Micro-Agent chuyên biệt',
            'Báo cáo điều hành PDF theo yêu cầu',
            'Khuyến nghị dựa trên nguyên tắc hermetic',
        ],
        sophiaCta: 'Tư vấn Sophia',
        accessBadge: 'Kiểm soát truy cập',
        accessTitle: 'Các lớp truy cập.',
        accessTitle2: 'Toàn quyền kiểm soát.',
        accessDesc: 'Vai trò chi tiết với sinh trắc học WebAuthn.',
        roles: [
            { role: 'Admin', tag: 'HỆ THỐNG', desc: 'Tầm nhìn toàn bộ, cấu hình toàn cầu và quản lý người dùng.' },
            { role: 'Giám sát', tag: 'ĐỘI', desc: 'Giám sát nhóm, phê duyệt y theo dõi hoạt động.' },
            { role: 'Vận hành', tag: 'THỰC ĐỊA', desc: 'Ghi chép hoạt động, lô hàng và giao tiếp trực tiếp.' },
        ],
        ctaTitle: 'Sẵn sàng chuyển đổi hoạt động.',
        ctaDesc: 'Tham gia tổ chức đã hoạt động con trí tuệ có ý thức.',
        ctaPrimary: 'Truy cập ngay',
        ctaSecondary: 'Tạo tài khoản',
        copyright: '© 2026 Serendipity Bros',
        modules: [
            { title: 'Tài chính', desc: 'Doanh thu, chi phí, thanh khoản và dự báo thời gian thực.', tag: 'FIN_01', icon: 'BarChart3', size: 'large' },
            { title: 'Sophia IA', desc: 'Đặc vụ macro điều phối các micro-agent chuyên biệt.', tag: 'AI_CORE', icon: 'Brain', size: 'medium' },
            { title: 'Sagrario', desc: 'Kho kiến thức với tìm kiếm ngữ nghĩa (RAG).', tag: 'VAULT', icon: 'Database', size: 'medium' },
            { title: 'Sinh trắc', desc: 'WebAuthn: vân tay và FaceID tích hợp.', tag: 'SEC_03', icon: 'Fingerprint', size: 'small' },
            { title: 'Offline Sync', desc: 'Làm việc offline. Tự động đồng bộ khi có mạng.', tag: 'SYNC_04', icon: 'Wifi', size: 'small' },
            { title: 'Truy xuất', desc: 'Lô sản xuất và hiệu quả theo trạm.', tag: 'OPS_05', icon: 'Zap', size: 'small' },
        ],
    }
}

const MODULE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    BarChart3, Brain, Database, Fingerprint, Wifi, Zap
}

/* ─── FADE-IN SECTION ── */
function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ─── EYEBROW / BADGE ── */
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 font-mono">
            <span className="w-4 h-px bg-blue-600 inline-block" />
            {children}
            <span className="w-4 h-px bg-blue-600 inline-block" />
        </span>
    )
}

/* ─── HORIZONTAL TICKER ── */
const TICKER_ITEMS = [
    'Sophia Macro-Agent', '·', 'Financial Climate', '·', 'Sagrario Vault', '·',
    'WebAuthn Biometrics', '·', 'Offline Sync', '·', 'PDF Reports', '·',
    'RAG Memory', '·', 'Role-Based Access', '·', 'Real-time Analytics', '·',
]

function Ticker() {
    return (
        <div className="overflow-hidden py-3 select-none" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} className="text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{ color: item === '·' ? '#3b82f6' : 'var(--muted-foreground)' }}>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

/* ─── BENTO GRID ── */
type BentoModule = { title: string; desc: string; tag: string; icon: string; size: string }

function BentoGrid({ modules }: { modules: BentoModule[] }) {
    const [featuredIdx, setFeaturedIdx] = useState(0)
    const [progress, setProgress] = useState(0)
    const INTERVAL = 3500

    useEffect(() => {
        let frame: number
        const startRef = { t: Date.now() }

        const tick = () => {
            const elapsed = (Date.now() - startRef.t) % INTERVAL
            setProgress(elapsed / INTERVAL * 100)
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)

        const rotate = setInterval(() => {
            startRef.t = Date.now()
            setFeaturedIdx(i => (i + 1) % modules.length)
        }, INTERVAL)

        return () => { cancelAnimationFrame(frame); clearInterval(rotate) }
    }, [modules.length])

    const ordered = [
        modules[featuredIdx],
        ...modules.filter((_, i) => i !== featuredIdx),
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[200px]">
            <div className="md:col-span-2 md:row-span-2 relative min-h-[220px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={featuredIdx}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-[28px] border overflow-hidden shadow-lg cursor-default"
                        style={{
                            borderColor: 'rgba(37,99,235,0.25)',
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(99,102,241,0.03))'
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.06),transparent_60%)]" />
                        <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
                            {modules.map((_, i) => (
                                <button key={i} onClick={() => setFeaturedIdx(i)} className={cn('h-1.5 rounded-full transition-all duration-300', i === featuredIdx ? 'bg-blue-600 w-5' : 'bg-blue-300/40 w-1.5 hover:bg-blue-400/60')} />
                            ))}
                        </div>
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
                                {(() => { const Icon = MODULE_ICON_MAP[ordered[0].icon]; return <Icon size={28} /> })()}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/70 font-mono">{ordered[0].tag}</p>
                                <h3 className="text-[clamp(28px,4vw,40px)] font-black tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--foreground)' }}>{ordered[0].title}</h3>
                                <p className="font-medium text-base leading-relaxed max-w-sm" style={{ color: 'var(--muted-foreground)' }}>{ordered[0].desc}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-blue-100/30">
                            <div className="h-full bg-blue-600 transition-none" style={{ width: `${progress}%` }} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            {ordered.slice(1).map((mod, i) => {
                const Icon = MODULE_ICON_MAP[mod.icon]
                return (
                    <motion.div key={mod.tag} layout transition={{ duration: 0.35 }} className="group relative rounded-[28px] border overflow-hidden cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <h3 className="font-black text-lg mb-1 tracking-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--foreground)' }}>{mod.title}</h3>
                                <p className="text-xs font-medium leading-snug" style={{ color: 'var(--muted-foreground)' }}>{mod.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

/* APP MOCKUP */
function AppMockup({ lang }: { lang: 'es' | 'en' | 'vn' }) {
    const [isDark, setIsDark] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const T = 'transition-all duration-500'

    const bg0     = isDark ? '#09090b' : '#f5f5f7'
    const bg1     = isDark ? '#09090b' : '#f5f5f7'
    const topBg   = isDark ? '#09090b' : '#ffffff'
    const topBdr  = isDark ? '#27272a' : '#e4e7eb'
    const cardBg  = isDark ? '#1c1c1f' : '#ffffff'
    const cardBdr = isDark ? '#3f3f46' : '#e4e7eb'
    const urlBg   = isDark ? '#27272a' : '#ffffff'
    const urlBdr  = isDark ? '#3f3f46' : '#e4e7eb'
    const txt0    = isDark ? '#f4f4f5' : '#09090b'
    const txt1    = isDark ? '#a1a1aa' : '#6b7280'
    const txt2    = isDark ? '#52525b' : '#9ca3af'
    const sidebarBg  = '#0f0f11'
    const sidebarBdr = 'rgba(255,255,255,0.06)'

    const sideItems = [
        { icon: BarChart3, name: 'El Punto Cero',      sub: 'FINANZAS EN TIEMPO REAL',     active: true  },
        { icon: Activity,  name: 'Matriz de Ritmos',   sub: 'PRODUCCI\u00d3N DE LA PLANTA',    active: false },
        { icon: Database,  name: 'Jard\u00edn de Datos',    sub: 'REPORTES / ANAL\u00cdTICA',       active: false },
        { icon: Brain,     name: 'Conciencia Sophia',  sub: 'SABIDUR\u00cdA DOCUMENTAL',       active: false },
        { icon: Shield,    name: 'El Templo',          sub: 'CONFIGURACI\u00d3N / ADMIN',      active: false },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-[1000px] transform-gpu"
        >
            <div className={`absolute -top-7 right-1 flex items-center gap-1.5 text-[10px] font-bold select-none pointer-events-none ${T} ${isDark ? 'text-blue-400' : 'text-zinc-400'}`}>
                {isDark ? <Sun size={10} /> : <Moon size={10} />}
                <span>{isDark ? (lang === 'es' ? 'Modo Oscuro' : 'Dark Mode') : (lang === 'es' ? 'Modo Claro' : 'Light Mode')}</span>
                <span className="opacity-40 flex items-center gap-1">&middot; click <Sparkles size={10} className="text-blue-500" /></span>
            </div>

            <div className={`absolute -inset-x-10 -bottom-4 h-60 rounded-full blur-[80px] pointer-events-none ${T} transform-gpu`} style={{ background: isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.05)' }} />

            <div className={`rounded-[18px] border overflow-hidden ${T} transform-gpu`} style={{ borderColor: isDark ? '#3f3f46' : 'rgba(228,228,235,0.9)', boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.5)' : '0 25px 60px rgba(0,0,0,0.08)' }}>
                <div className={`flex items-center gap-3 px-4 py-2.5 border-b ${T}`} style={{ background: isDark ? '#1c1c1f' : '#f4f4f5', borderColor: topBdr }}>
                    <div className="flex gap-1.5 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 mx-2">
                        <div className={`h-6 rounded-md border flex items-center px-3 ${T}`} style={{ background: urlBg, borderColor: urlBdr }}>
                            <span className={`text-[10px] font-mono ${T}`} style={{ color: txt2 }}>app.serendipity.com/dashboard</span>
                        </div>
                    </div>
                    <button onClick={() => setIsDark(d => !d)} className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer ${T}`} style={{ background: isDark ? '#3f3f46' : '#e4e7eb', color: isDark ? '#a1a1aa' : '#71717a' }}>
                        {isDark ? <Sun size={13} /> : <Moon size={13} />}
                    </button>
                </div>

                <div className={`flex ${T} h-[280px] sm:h-[420px] lg:h-[520px] will-change-transform`} style={{ background: bg0 }}>
                    <div className="flex-shrink-0 flex flex-col" style={{ width: '176px', background: sidebarBg, borderRight: `1px solid ${sidebarBdr}` }}>
                        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${sidebarBdr}` }}>
                            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                <Shield size={13} className="text-white" />
                            </div>
                            <span className="text-white font-black text-[12px] tracking-tight">Serendipity<span className="text-blue-500">.</span></span>
                        </div>
                        <div className="p-2 flex flex-col gap-0.5 flex-1 overflow-hidden">
                            {sideItems.map((item, i) => {
                                const isActive = activeIdx === i
                                return (
                                    <div key={i} onClick={() => setActiveIdx(i)} className="flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.05]" style={{ background: isActive ? '#2563eb' : 'transparent' }}>
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)' }}>
                                            <item.icon size={12} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold truncate leading-none mb-0.5" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.55)' }}>{item.name}</p>
                                            <p className="text-[7px] font-black uppercase tracking-wider truncate" style={{ color: 'rgba(255,255,255,0.28)' }}>{item.sub}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${sidebarBdr}` }}>
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">AD</div>
                            <div className="min-w-0">
                                <p className="text-white text-[10px] font-bold truncate">Admin</p>
                                <p className="text-[7px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>ADMINISTRADOR</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-1 flex flex-col overflow-hidden ${T}`} style={{ background: bg1 }}>
                        <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${T}`} style={{ background: topBg, borderColor: topBdr }}>
                            <div>
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] font-mono mb-0.5" style={{ color: txt2 }}>SISTEMA ANTHROPOS</p>
                                <p className="font-black text-[13px] leading-none" style={{ color: txt0 }}>Centro de Mando</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={isDark ? { background: 'rgba(20,83,45,0.3)', borderColor: 'rgba(22,101,52,0.5)' } : { background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                                <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: isDark ? '#4ade80' : '#15803d' }}>COSECHA ðŸŒ¾</span>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border mb-1.5" style={isDark ? { background: 'rgba(20,83,45,0.25)', borderColor: 'rgba(22,101,52,0.4)' } : { background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                    <span className="text-[7px] font-black uppercase tracking-widest" style={{ color: isDark ? '#4ade80' : '#15803d' }}>SISTEMA OPERATIVO CONECTADO</span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-[16px] font-black leading-tight" style={{ color: txt0 }}>Buen d\u00eda, Admin</h3>
                                        <p className="text-[10px] font-medium mt-0.5 max-w-[200px] leading-snug" style={{ color: txt1 }}>\u00c9poca de Cosecha. El balance es estable.</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-[7px] font-black uppercase tracking-widest mb-0.5" style={{ color: txt2 }}>STATUS: SIEMBRA</p>
                                        <p className="text-[8px] font-bold" style={{ color: '#3b82f6' }}>Simetr\u00eda Sagrada</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { title: 'Matriz de Ritmos', sub: 'Producci\u00f3n', value: '108.000 SF', color: '#3b82f6', pct: 72, icon: Activity },
                                    { title: 'Fondo de Paz',     sub: 'Amortizaci\u00f3n', value: '$15.000', color: '#22c55e', pct: 37, icon: Shield },
                                ].map((card, i) => (
                                    <div key={i} className={`rounded-xl border p-3 flex flex-col justify-between ${T}`} style={{ background: cardBg, borderColor: cardBdr, minHeight: '105px' }}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: i === 0 ? (isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff') : (isDark ? 'rgba(22,163,74,0.12)' : '#f0fdf4') }}>
                                                <card.icon size={12} style={{ color: card.color }} />
                                            </div>
                                            <p className="text-[10px] font-black truncate" style={{ color: txt0 }}>{card.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black" style={{ color: txt0 }}>{card.value}</p>
                                            <div className="h-0.5 rounded-full my-1.5" style={{ background: isDark ? '#3f3f46' : '#f1f5f9' }}>
                                                <div className="h-full rounded-full" style={{ width: `${card.pct}%`, background: card.color }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── CLIMATE DEMO ── */
function ClimateOrb({ active, clima }: { active: boolean; clima: { name: string; emoji: string; desc: string } }) {
    const isRed = clima.name === 'TORMENTA'
    return (
        <motion.div
            layout
            className={cn(
                'relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 transform-gpu',
                active
                    ? isRed
                        ? 'border-red-400/30 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 shadow-lg scale-[1.01]'
                        : 'border-blue-400/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 shadow-lg scale-[1.01]'
                    : 'opacity-50'
            )}
            style={!active ? { borderColor: 'var(--border)', background: 'var(--secondary)' } : {}}
        >
            <div className="flex items-start gap-4 relative z-10">
                <span className="text-2xl">{clima.emoji}</span>
                <div>
                    <p className={cn('text-[10px] font-black uppercase tracking-[0.3em] mb-1 font-mono', active ? (isRed ? 'text-red-500' : 'text-blue-600') : 'text-zinc-400')}>{clima.name}</p>
                    <p className={cn('text-sm font-medium leading-snug transition-colors', active ? 'text-zinc-800 dark:text-white' : 'text-zinc-400')}>{clima.desc}</p>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── PAGE ── */
export default function LandingPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const { language } = useTranslation()
    const lang = (language as Lang) || 'es'
    const c = COPY[lang]
    const [climateIdx, setClimateIdx] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setClimateIdx(i => (i + 1) % 3), 3200)
        return () => clearInterval(id)
    }, [])

    const { scrollYProgress } = useScroll()
    const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            <div className="min-h-screen font-sans overflow-x-hidden antialiased" style={{ fontFamily: 'var(--font-inter), var(--font-outfit), sans-serif', background: 'var(--background)', color: 'var(--foreground)' }}>

                {/* ── NAV ── */}
                <motion.header
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-10 h-16 apple-blur border-b border-[var(--border)]"
                >
                    <span className="text-xl font-black tracking-tighter text-blue-600">
                        Serendipity<span className="text-[var(--foreground)]">.</span>
                    </span>

                    <div className="hidden sm:flex items-center gap-1 text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                        {c.nav.map((label, i) => (
                            <a key={label} href={`#${['system', 'modules', 'sophia', 'access'][i]}`} className="px-3 py-1.5 rounded-lg hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all">
                                {label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <AuthControls />
                        {user ? (
                             <Link href="/dashboard" className="hidden sm:block">
                                <Button size="sm" className="!rounded-full h-10 bg-blue-600 text-white hover:bg-blue-500 px-5 gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
                                    {c.goToApp} <ArrowRight size={14} />
                                </Button>
                             </Link>
                        ) : (
                            <Link href="/login" className="hidden sm:block">
                                <Button size="sm" className="!rounded-full h-10 bg-blue-600 text-white hover:bg-blue-500 px-5 gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
                                    {c.enter} <ArrowRight size={14} />
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.header>

                {/* HERO */}
                <section className="relative overflow-hidden pt-24 pb-12 flex flex-col items-center justify-center" style={{ background: 'var(--background)', minHeight: '100dvh' }}>
                    <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                    <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transform-gpu" style={{ background: 'rgba(37,99,235,0.08)' }} />
                    <div className="absolute top-[30%] right-[5%] w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none transform-gpu" style={{ background: 'rgba(99,102,241,0.06)' }} />

                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full transform-gpu">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
                            <div className="flex flex-col gap-6 text-left">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-blue-600 font-mono" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                        {c.heroEyebrow}
                                    </span>
                                </motion.div>

                                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="font-black leading-[0.9] tracking-[-0.04em]" style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif', color: 'var(--foreground)' }}>
                                    <AnimatePresence mode="wait">
                                        <motion.span key={lang} initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }} className="block">
                                            {c.heroLine1}<br /><span className="text-blue-600">{c.heroLine2}</span><br />{c.heroLine3}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.h1>

                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="text-[17px] font-medium leading-relaxed max-w-md" style={{ color: 'var(--muted-foreground)' }}>{c.heroDesc}</motion.p>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex flex-col sm:flex-row items-start gap-3">
                                    <Link href={user ? "/dashboard" : "/login"}>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-3 px-8 rounded-2xl text-white text-[15px] font-bold shadow-lg transition-all whitespace-nowrap bg-blue-600 shadow-blue-500/10" style={{ height: '54px' }}>
                                            {user ? c.goToApp : c.heroCta}
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </Link>
                                    {!user && (
                                        <Link href="/register">
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-3 px-8 rounded-2xl text-[15px] font-bold transition-all whitespace-nowrap" style={{ border: '2px solid var(--border)', color: 'var(--foreground)', height: '54px', background: 'transparent' }}>
                                                {c.heroCtaSecondary}
                                            </motion.button>
                                        </Link>
                                    )}
                                </motion.div>
                            </div>
                            <AppMockup lang={lang} />
                        </div>
                    </motion.div>
                </section>

                {/* Modules */}
                <section id="modules" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <Eyebrow>{c.bentoBadge}</Eyebrow>
                        <h2 className="mt-4 text-[clamp(32px,5vw,56px)] font-black tracking-tighter" style={{ fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--foreground)' }}>{c.bentoTitle}</h2>
                        <p className="mt-2 text-lg font-medium" style={{ color: 'var(--muted-foreground)' }}>{c.bentoDesc}</p>
                    </FadeIn>
                    <BentoGrid modules={c.modules} />
                </section>

                {/* Climate */}
                <section id="system" className="py-24 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn>
                            <Eyebrow>{c.climBadge}</Eyebrow>
                            <h2 className="mt-4 text-[clamp(32px,5vw,56px)] font-black tracking-tighter leading-[1.05]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{c.climTitle}</h2>
                            <p className="mt-4 text-lg font-medium leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{c.climDesc}</p>
                        </FadeIn>
                        <div className="flex flex-col gap-4">
                            {c.climates.map((clima, i) => (
                                <ClimateOrb key={clima.name} active={climateIdx === i} clima={clima} />
                            ))}
                        </div>
                    </div>
                </section>

                <Ticker />

                {/* Sophia */}
                <section id="sophia" className="py-32 px-6 md:px-12 bg-zinc-950 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn>
                            <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-[11px] font-black uppercase tracking-widest mb-6">
                                <Brain size={16} /> {c.sophiaBadge}
                            </div>
                            <h2 className="text-[clamp(40px,6vw,72px)] font-black leading-[0.9] tracking-tighter mb-8" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                                {c.sophiaTitle}<br /><span className="text-zinc-500">{c.sophiaTitle2}</span>
                            </h2>
                            <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-10 max-w-lg">{c.sophiaDesc}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                {c.sophiaFeats.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                                        <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> {feat}
                                    </div>
                                ))}
                            </div>
                            <Button size="lg" className="rounded-2xl h-14 px-10 bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-[13px]">{c.sophiaCta}</Button>
                        </FadeIn>
                        <FadeIn delay={0.2} className="relative">
                            <div className="aspect-square rounded-[40px] border border-white/10 p-2 bg-zinc-900/50 backdrop-blur-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_70%)] animate-pulse" />
                                <div className="relative h-full w-full rounded-[32px] border border-white/5 bg-zinc-900 flex flex-col items-center justify-center p-12">
                                    <div className="w-48 h-48 rounded-full bg-blue-600/10 flex items-center justify-center relative">
                                        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[ping_4s_linear_infinite]" />
                                        <div className="absolute inset-4 rounded-full border border-blue-500/10 animate-[ping_6s_linear_infinite_1s]" />
                                        <Brain size={80} className="text-blue-500 drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
                                    </div>
                                    <div className="mt-12 text-center">
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 font-mono">NEURAL STATUS</p>
                                        <div className="flex gap-2">
                                            {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-6 bg-blue-600/30 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <section id="access" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-[4/3] rounded-[40px] border border-[var(--border)] overflow-hidden bg-[var(--secondary)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_60%)]" />
                            <div className="p-10 h-full flex flex-col justify-end gap-6 relative z-10">
                                {c.roles.map((role, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] shadow-xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{role.role[0]}</div>
                                            <div>
                                                <p className="text-sm font-black" style={{ color: 'var(--foreground)' }}>{role.role}</p>
                                                <p className="text-[10px] font-bold text-zinc-500">{role.desc}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">{role.tag}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <FadeIn>
                            <Eyebrow>{c.accessBadge}</Eyebrow>
                            <h2 className="mt-4 text-[clamp(40px,6.5vw,72px)] font-black leading-[0.9] tracking-tighter" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{c.accessTitle}<br /><span className="text-zinc-400">{c.accessTitle2}</span></h2>
                            <p className="mt-6 text-xl font-medium leading-relaxed max-w-md" style={{ color: 'var(--muted-foreground)' }}>{c.accessDesc}</p>
                        </FadeIn>
                    </div>
                </section>

                <section className="py-32 px-6 text-center bg-zinc-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_70%)]" />
                    <FadeIn className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-[clamp(40px,7vw,88px)] font-black leading-[0.85] tracking-tighter mb-8" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{c.ctaTitle}</h2>
                        <p className="text-xl text-zinc-400 font-medium mb-12 max-w-xl mx-auto">{c.ctaDesc}</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={user ? "/dashboard" : "/login"}>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-16 px-12 rounded-2xl bg-white text-black text-[15px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">{user ? c.goToApp : c.ctaPrimary}</motion.button>
                            </Link>
                            {!user && (
                                <Link href="/register">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-16 px-12 rounded-2xl border border-white/20 text-zinc-300 text-[15px] font-bold hover:border-white/40 hover:text-white transition-all">{c.ctaSecondary}</motion.button>
                                </Link>
                            )}
                        </div>
                    </FadeIn>
                </section>

                <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-8">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[15px] font-black tracking-[-0.04em] text-white">Serendipity<span className="text-blue-500">.</span></span>
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600">{c.copyright}</p>
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">{c.enter}</Link>
                            <Link href="/register" className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">{lang === 'es' ? 'Registro' : lang === 'vn' ? 'Đăng ký' : 'Register'}</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </ReactLenis>
    )
}
