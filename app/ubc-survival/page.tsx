'use client';

import { useState, useEffect, useRef } from 'react';
import {
    EVENTS, FACULTIES, YEARS, VIBES, FACULTY_MODIFIERS, YEAR_MODIFIERS, VIBE_MODIFIERS,
    type GameEvent, type Option, type Stat
} from './game-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Skull, GraduationCap, MapPin, ArrowRight, RotateCcw, User, Calendar, Sparkles, Flag, AlertTriangle, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Screen = 'start' | 'game' | 'end' | 'game-over';

interface GameState {
    survival: number;
    serotonin: number;
    chaos: number;
    flags: string[];
}

interface HistoryItem {
    eventTitle: string;
    choiceText: string;
    resultMessage: string;
    turn: number;
}

export default function UBCSurvivalGame() {
    const [screen, setScreen] = useState<Screen>('start');

    // Player Setup
    const [faculty, setFaculty] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [vibe, setVibe] = useState<string>('');

    // Game State
    const [stats, setStats] = useState<GameState>({ survival: 50, serotonin: 50, chaos: 10, flags: [] });
    const [eventQueue, setEventQueue] = useState<GameEvent[]>([]);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [lastFeedback, setLastFeedback] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Initialize Game
    const startGame = () => {
        if (!faculty || !year || !vibe) return;

        let initialStats = { survival: 50, serotonin: 50, chaos: 10, flags: [] as string[] };

        const applyModifier = (mod: Partial<Record<Stat, number>>) => {
            Object.entries(mod).forEach(([stat, value]) => {
                initialStats[stat as Stat] += value;
            });
        };

        if (FACULTY_MODIFIERS[faculty]) applyModifier(FACULTY_MODIFIERS[faculty]);
        if (YEAR_MODIFIERS[year]) applyModifier(YEAR_MODIFIERS[year]);
        if (VIBE_MODIFIERS[vibe]) applyModifier(VIBE_MODIFIERS[vibe]);

        // Clamp stats
        initialStats.survival = Math.max(0, Math.min(100, initialStats.survival));
        initialStats.serotonin = Math.max(0, Math.min(100, initialStats.serotonin));
        initialStats.chaos = Math.max(0, Math.min(100, initialStats.chaos));

        setStats(initialStats);

        const shuffled = [...EVENTS].sort(() => 0.5 - Math.random());
        setEventQueue(shuffled);
        setCurrentEventIndex(0);
        setHistory([]);
        setLastFeedback(null);
        setScreen('game');
    };

    const checkConditions = (event: GameEvent, currentStats: GameState): boolean => {
        if (!event.conditions) return true;
        const { flag, notFlag, minStat, maxStat } = event.conditions;

        if (flag && !currentStats.flags.includes(flag)) return false;
        if (notFlag && currentStats.flags.includes(notFlag)) return false;
        if (minStat && currentStats[minStat.stat] < minStat.value) return false;
        if (maxStat && currentStats[maxStat.stat] > maxStat.value) return false;

        return true;
    };

    const getNextValidEventIndex = (startIndex: number, currentStats: GameState): number => {
        for (let i = startIndex; i < eventQueue.length; i++) {
            if (checkConditions(eventQueue[i], currentStats)) {
                return i;
            }
        }
        return -1;
    };

    useEffect(() => {
        if (screen === 'game' && eventQueue.length > 0) {
            const validIndex = getNextValidEventIndex(0, stats);
            if (validIndex !== -1 && validIndex !== currentEventIndex) {
                setCurrentEventIndex(validIndex);
            }
        }
    }, [screen]);

    const handleOptionClick = (option: Option) => {
        const newStats = { ...stats };
        option.effects.forEach(effect => {
            newStats[effect.stat] = Math.max(0, Math.min(100, newStats[effect.stat] + effect.amount));
        });

        if (option.addFlags) {
            option.addFlags.forEach(flag => {
                if (!newStats.flags.includes(flag)) newStats.flags.push(flag);
            });
        }
        if (option.removeFlags) {
            newStats.flags = newStats.flags.filter(f => !option.removeFlags?.includes(f));
        }

        setStats(newStats);

        const currentEvent = eventQueue[currentEventIndex];
        setHistory([...history, {
            eventTitle: currentEvent.title,
            choiceText: option.text,
            resultMessage: option.responseMessage,
            turn: history.length + 1
        }]);

        setLastFeedback(option.responseMessage);

        // Death Check
        if (newStats.survival <= 0) {
            setTimeout(() => setScreen('game-over'), 1500);
            return;
        }

        setTimeout(() => {
            setLastFeedback(null);
            const nextIndex = getNextValidEventIndex(currentEventIndex + 1, newStats);
            if (nextIndex !== -1 && history.length < 19) {
                setCurrentEventIndex(nextIndex);
            } else {
                setScreen('end');
            }
        }, 2000);
    };

    const getEndingTitle = () => {
        if (stats.survival < 20) return "Academic Probation Victim";
        if (stats.chaos > 80) return "Campus Menace";
        if (stats.serotonin > 80) return "Vibe Curator";
        if (stats.survival > 80 && stats.serotonin > 60) return "Dean's List Legend";
        if (stats.flags.includes('party_animal') && stats.survival > 50) return "Functional Party Animal";
        if (stats.flags.includes('raccoon_friend')) return "Raccoon Whisperer";
        return "Average UBC Student";
    };

    const getBarColor = (value: number, type: Stat) => {
        if (type === 'chaos') {
            return value > 80 ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.7)]' : value > 40 ? 'bg-purple-500' : 'bg-purple-400';
        }
        if (value > 70) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]';
        if (value > 30) return type === 'survival' ? 'bg-blue-500' : 'bg-yellow-500';
        return 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.7)]';
    };

    const StatBar = ({ icon: Icon, label, value, type }: { icon: any, label: string, value: number, type: Stat }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full bg-slate-800 border border-slate-700 ${type === 'survival' ? 'text-red-400' : type === 'serotonin' ? 'text-yellow-400' : 'text-purple-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-sm mb-1 font-bold text-slate-200">
                    <span>{label}</span>
                    <span>{value}%</span>
                </div>
                <Progress value={value} className="h-4 bg-slate-900 border border-slate-700" indicatorClassName={`transition-all duration-500 ${getBarColor(value, type)}`} />
            </div>
        </div>
    );

    // --- SCREENS ---

    if (screen === 'start') {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full z-10">
                    <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700 shadow-2xl shadow-blue-900/20">
                        <CardHeader>
                            <CardTitle className="text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold tracking-tight pb-2">UBC Survival</CardTitle>
                            <CardDescription className="text-center text-slate-400 text-xl">Can you survive the semester?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-200 flex items-center gap-2 text-lg"><GraduationCap className="w-5 h-5 text-blue-400" /> Faculty</Label>
                                <Select onValueChange={setFaculty}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 h-14 text-lg"><SelectValue placeholder="Select Faculty" /></SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">{FACULTIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200 flex items-center gap-2 text-lg"><Calendar className="w-5 h-5 text-green-400" /> Year</Label>
                                <Select onValueChange={setYear}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 h-14 text-lg"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200 flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-yellow-400" /> Vibe</Label>
                                <Select onValueChange={setVibe}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 h-14 text-lg"><SelectValue placeholder="Select Vibe" /></SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">{VIBES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-8 text-xl shadow-lg transition-transform hover:scale-[1.02]" onClick={startGame} disabled={!faculty || !year || !vibe}>
                                Start Semester <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex p-4 font-sans overflow-hidden relative gap-6">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Back to Dashboard Button */}
            <div className="absolute top-4 left-4 z-50">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* LEFT SIDEBAR: PROFILE */}
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 hidden lg:flex flex-col gap-4 z-10">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 flex-1 flex flex-col">
                    <CardHeader className="pb-2 text-center border-b border-slate-800">
                        <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                            <User className="w-10 h-10 text-blue-400" />
                        </div>
                        <CardTitle className="text-xl text-white">{faculty}</CardTitle>
                        <CardDescription className="text-slate-400">{year} • {vibe}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <StatBar icon={Heart} label="Survival" value={stats.survival} type="survival" />
                        <StatBar icon={Zap} label="Serotonin" value={stats.serotonin} type="serotonin" />
                        <StatBar icon={Skull} label="Chaos" value={stats.chaos} type="chaos" />

                        <div className="mt-8">
                            <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-3 block">Active Flags</Label>
                            <div className="flex flex-wrap gap-2">
                                {stats.flags.length === 0 && <span className="text-slate-600 text-sm italic">No flags yet...</span>}
                                {stats.flags.map(flag => (
                                    <Badge key={flag} variant="secondary" className="bg-slate-800 text-blue-300 border border-blue-900/50 px-3 py-1">
                                        <Flag className="w-3 h-3 mr-1" /> {flag.replace('_', ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* MAIN CONTENT: GAME EVENT */}
            <motion.div layout className="flex-1 flex items-center justify-center z-10 max-w-3xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {(screen === 'game' || screen === 'game-over' || screen === 'end') && (
                        <motion.div
                            key={screen === 'game' ? eventQueue[currentEventIndex]?.id : screen}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full"
                        >
                            {screen === 'game' && eventQueue[currentEventIndex] && (
                                <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700 shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden">
                                    {/* Feedback Overlay */}
                                    <AnimatePresence>
                                        {lastFeedback && (
                                            <motion.div
                                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                                                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                className="absolute inset-0 bg-slate-950/60 z-30 flex items-center justify-center p-12 text-center"
                                            >
                                                <motion.h3
                                                    initial={{ scale: 0.8, y: 20 }}
                                                    animate={{ scale: 1, y: 0 }}
                                                    className="text-3xl font-bold text-white leading-relaxed drop-shadow-lg"
                                                >
                                                    {lastFeedback}
                                                </motion.h3>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <CardHeader className="pb-4 border-b border-slate-800/50">
                                        <div className="flex justify-between items-center mb-6">
                                            <Badge variant="outline" className="border-blue-500 text-blue-400 px-4 py-1.5 text-sm font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                Event {history.length + 1}/20
                                            </Badge>
                                            {/* Mobile Stats (Only visible on small screens) */}
                                            <div className="lg:hidden flex gap-2">
                                                <Badge className={getBarColor(stats.survival, 'survival')}>{stats.survival}</Badge>
                                                <Badge className={getBarColor(stats.serotonin, 'serotonin')}>{stats.serotonin}</Badge>
                                                <Badge className={getBarColor(stats.chaos, 'chaos')}>{stats.chaos}</Badge>
                                            </div>
                                        </div>
                                        <CardTitle className="text-4xl text-white mb-4 leading-tight">{eventQueue[currentEventIndex].title}</CardTitle>
                                        <CardDescription className="text-xl text-slate-300 leading-relaxed">
                                            {eventQueue[currentEventIndex].description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-8 flex-1 flex flex-col justify-center">
                                        {eventQueue[currentEventIndex].options.map((option, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start h-auto py-6 px-8 text-left border-slate-700 bg-slate-800/40 hover:bg-slate-700 hover:text-white hover:border-blue-500 hover:scale-[1.01] transition-all whitespace-normal text-lg text-slate-200 group"
                                                    onClick={() => handleOptionClick(option)}
                                                >
                                                    <span className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center mr-4 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">{idx + 1}</span>
                                                    {option.text}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {screen === 'game-over' && (
                                <Card className="bg-red-950/90 backdrop-blur-xl border-red-700 shadow-2xl shadow-red-900/50 text-center p-10">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                        <Skull className="w-32 h-32 mx-auto text-red-500 mb-6" />
                                    </motion.div>
                                    <h1 className="text-6xl font-black text-red-500 mb-4 uppercase tracking-widest">Wasted</h1>
                                    <p className="text-2xl text-red-200 mb-8">You ran out of survival instinct. The semester claimed another victim.</p>
                                    <Button className="bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-12 text-xl" onClick={() => setScreen('start')}>
                                        Try Again
                                    </Button>
                                </Card>
                            )}

                            {screen === 'end' && (
                                <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700 shadow-2xl text-center p-10">
                                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}>
                                        <GraduationCap className="w-32 h-32 mx-auto text-yellow-500 mb-6" />
                                    </motion.div>
                                    <h1 className="text-5xl font-extrabold text-white mb-2">Semester Complete!</h1>
                                    <p className="text-3xl text-blue-400 font-bold mb-8">"{getEndingTitle()}"</p>
                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <div className="text-4xl font-bold text-red-500">{stats.survival}</div>
                                            <div className="text-sm text-slate-400 uppercase font-bold">Survival</div>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <div className="text-4xl font-bold text-yellow-500">{stats.serotonin}</div>
                                            <div className="text-sm text-slate-400 uppercase font-bold">Serotonin</div>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <div className="text-4xl font-bold text-purple-500">{stats.chaos}</div>
                                            <div className="text-sm text-slate-400 uppercase font-bold">Chaos</div>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 text-xl" onClick={() => setScreen('start')}>
                                        <RotateCcw className="mr-2 w-6 h-6" /> Play Again
                                    </Button>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* RIGHT SIDEBAR: LOG */}
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 hidden lg:flex flex-col gap-4 z-10">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="pb-2 border-b border-slate-800">
                        <CardTitle className="text-lg text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-slate-400" /> Semester Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative">
                        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {history.length === 0 && <div className="text-slate-600 text-center italic mt-10">Your story begins here...</div>}
                            {history.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
                                >
                                    <div className="flex justify-between text-xs text-slate-500 mb-1 uppercase font-bold">
                                        <span>Turn {item.turn}</span>
                                    </div>
                                    <div className="text-blue-300 font-semibold mb-1">{item.eventTitle}</div>
                                    <div className="text-slate-400 text-xs mb-2">"{item.choiceText}"</div>
                                    <div className="text-slate-200 italic border-l-2 border-slate-600 pl-2">{item.resultMessage}</div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
