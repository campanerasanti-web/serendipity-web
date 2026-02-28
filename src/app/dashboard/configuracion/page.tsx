'use client'

import { useState } from 'react'
import { Card, Button, Input, Badge } from '@/components/ui-library'
import { Settings, Bell, Globe, Lock, Shield, UserCheck, ShieldAlert, Cpu, Database, Mail, MessageSquare, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'

export default function ConfiguracionPage() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('GLOBAL')

    const tabs = [
        { id: 'GLOBAL', n: t('temple.globalParams'), i: Globe },
        { id: 'NOTIF', n: t('temple.notifications'), i: Bell },
        { id: 'SECURITY', n: t('temple.security'), i: Shield },
        { id: 'ROLES', n: t('temple.roles'), i: Lock },
    ]

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="default" className="mb-2">{t('common.parametrization')}</Badge>
                    <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
                        {t('temple.title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg font-medium transition-colors">{t('temple.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-3">
                    {tabs.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-5 rounded-[20px] transition-all font-bold text-[15px] border border-transparent",
                                activeTab === item.id ? "bg-[var(--card)] shadow-sm ring-1 ring-[var(--border)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.i size={20} />
                                {item.n}
                            </div>
                            {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                        </button>
                    ))}
                </div>

                <Card className="lg:col-span-8 p-10 space-y-12 border-none ring-1 ring-[var(--border)] shadow-sm">
                    {activeTab === 'GLOBAL' && (
                        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <Settings className="text-[var(--muted-foreground)]" size={20} />
                                    <h3 className="font-bold text-xl tracking-tight text-[var(--foreground)]">{t('common.sophia')}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em] ml-1">{t('temple.productionGoal')}</label>
                                        <Input defaultValue="150,000" className="h-14 !rounded-[16px] border border-[var(--border)] bg-[var(--secondary)]/50 focus:bg-[var(--card)] transition-all font-bold text-lg" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em] ml-1">{t('temple.criticalCashThreshold')}</label>
                                        <Input defaultValue="2,000" className="h-14 !rounded-[16px] border border-[var(--border)] bg-[var(--secondary)]/50 focus:bg-[var(--card)] transition-all font-bold text-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-[var(--border)]">
                                <h4 className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em]">{t('temple.activeEngines')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] flex items-center gap-4">
                                        <Cpu size={20} className="text-amber-500" />
                                        <div>
                                            <p className="text-sm font-bold">{t('temple.reinvestmentLogic')}</p>
                                            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">{t('temple.frequency')}: 24h</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] flex items-center gap-4">
                                        <Database size={20} className="text-emerald-500" />
                                        <div>
                                            <p className="text-sm font-bold">{t('temple.hybridRedundancy')}</p>
                                            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">{t('temple.status')}: {t('common.synchronized')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'NOTIF' && (
                        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <Bell className="text-[var(--muted-foreground)]" size={20} />
                                    <h3 className="font-bold text-xl tracking-tight text-[var(--foreground)]">{t('temple.alertChannels')}</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { n: 'Slack (Anthropos-Alerts)', i: MessageSquare, s: true, desc: t('temple.slackDesc') },
                                        { n: t('temple.adminEmail'), i: Mail, s: true, desc: t('temple.adminEmailDesc') },
                                        { n: t('temple.pushNotifications'), i: Bell, s: false, desc: t('temple.pushNotificationsDesc') },
                                    ].map(ch => (
                                        <div key={ch.n} className="flex items-center justify-between p-6 rounded-[20px] bg-[var(--secondary)]/30 border border-[var(--border)]">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                                                    <ch.i size={20} className={ch.s ? "text-blue-500" : "text-[var(--muted-foreground)]"} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{ch.n}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">{ch.desc}</p>
                                                </div>
                                            </div>
                                            <Button variant={ch.s ? "secondary" : "ghost"} size="sm" className="font-bold">{ch.s ? t('common.active') : t('common.connect')}</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'SECURITY' && (
                        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="text-[var(--muted-foreground)]" size={20} />
                                    <h3 className="font-bold text-xl tracking-tight text-[var(--foreground)]">{t('temple.dataProtection')}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Card glass className="p-6 space-y-4 border-white/5">
                                        <Lock size={20} className="text-amber-500" />
                                        <h4 className="font-bold text-sm">{t('temple.twoFactorAuth')}</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">{t('temple.twoFactorAuthDesc')}</p>
                                        <Badge variant="success">{t('common.enabled')}</Badge>
                                    </Card>
                                    <Card glass className="p-6 space-y-4 border-white/5">
                                        <Clock size={20} className="text-blue-500" />
                                        <h4 className="font-bold text-sm">{t('temple.sessionTime')}</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">{t('temple.sessionTimeDesc')}</p>
                                        <span className="text-sm font-bold">45 {t('common.minutes')}</span>
                                    </Card>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'ROLES' && (
                        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <UserCheck className="text-[var(--muted-foreground)]" size={20} />
                                    <h3 className="font-bold text-xl tracking-tight text-[var(--foreground)]">{t('temple.hierarchy')}</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { r: 'ADMIN', n: t('temple.supremeAdmin'), desc: t('temple.supremeAdminDesc'), c: 'emerald' },
                                        { r: 'SUPERVISOR', n: t('temple.flowManager'), desc: t('temple.flowManagerDesc'), c: 'amber' },
                                        { r: 'OPERATIVO', n: t('temple.plantAgent'), desc: t('temple.plantAgentDesc'), c: 'blue' },
                                    ].map(role => (
                                        <div key={role.r} className="p-6 rounded-[20px] bg-[var(--secondary)]/30 border border-[var(--border)] flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black tracking-widest">{role.r}</span>
                                                    <span className="text-xs font-medium text-[var(--muted-foreground)]">— {role.n}</span>
                                                </div>
                                                <p className="text-xs text-[var(--muted-foreground)]">{role.desc}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="font-bold border border-[var(--border)]">{t('common.permissions')}</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="pt-10 border-t border-[var(--border)] flex flex-col sm:flex-row justify-end gap-4">
                        <Button variant="ghost" className="px-8 font-bold text-[var(--muted-foreground)] w-full sm:w-auto hover:text-[var(--foreground)]">{t('temple.reset')}</Button>
                        <Button className="px-12 h-14 !rounded-[18px] shadow-lg text-base w-full sm:w-auto">{t('temple.update')} {tabs.find(t_ => t_.id === activeTab)?.n}</Button>
                    </section>
                </Card>
            </div>
        </div>
    )
}
