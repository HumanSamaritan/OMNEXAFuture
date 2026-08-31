'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './clearloop.module.css';

type Journey = {
  startDate: string;
  cravingsManaged: number;
  checkins: number;
  movementWins: number;
  learningWins: number;
  mood?: string;
  lastTrigger?: string;
  reminder?: string;
};

type ChatMessage = { role: 'assistant' | 'user'; text: string };

const STORAGE_KEY = 'clearloop-private-v1';
const CHAT_KEY = 'clearloop-chat-v1';

const initialJourney: Journey = {
  startDate: new Date().toISOString(),
  cravingsManaged: 0,
  checkins: 0,
  movementWins: 0,
  learningWins: 0,
  reminder: '18:00'
};

const triggers = ['Friends', 'Stress', 'Habit', 'Boredom', 'After food', 'Other'];
const moods = ['Good', 'Okay', 'Flat', 'Stressed', 'Struggling'];

function daysSince(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function coachReply(input: string, journey: Journey) {
  const text = input.toLowerCase();
  if (/chest|breath|faint|seizure|poison|overdose|emergency/.test(text)) {
    return 'That could need medical attention. ClearLoop cannot diagnose this. Please seek urgent medical care or contact your local emergency service if symptoms are severe or worsening.';
  }
  if (/crav|urge|want.*vape|need.*vape/.test(text)) {
    const trigger = journey.lastTrigger ? ` You last marked “${journey.lastTrigger}” as a trigger.` : '';
    return `You do not need to decide forever right now. Give yourself five minutes.${trigger} Move away from the cue, take slow breaths, drink some water and choose one small replacement action. Tap “Craving Rescue” so we can record the win on this device.`;
  }
  if (/stress|anxious|pressure|angry/.test(text)) {
    return 'Stress can make an old habit feel urgent. Try separating the stress from the vape decision: name what is stressing you, take a short movement break, then check the urge again in five minutes. Your goal is control, not perfection.';
  }
  if (/friend|party|social|peer/.test(text)) {
    return 'The social part may be harder than the nicotine decision. Prepare one simple line you can use without explaining yourself, stay with the group if you want to, and keep a drink or activity in hand so saying no feels less awkward.';
  }
  if (/relapse|vaped|slipped|failed/.test(text)) {
    return 'One lapse does not erase previous progress. Record what happened, identify the trigger and restart from the next decision. ClearLoop treats learning from the event as progress, not as a reason to shame you.';
  }
  return `You have recorded ${journey.cravingsManaged} craving win${journey.cravingsManaged === 1 ? '' : 's'} so far. Tell me what is happening right now — the situation, the urge, or what you want to protect by staying vape-free — and I will help you choose the next small action.`;
}

export default function ClearLoopClient() {
  const [journey, setJourney] = useState<Journey>(initialJourney);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'This is your private space. Tell me what you are dealing with today. Your entries stay in this browser on this device.' }
  ]);
  const [toast, setToast] = useState('');
  const [rescueActive, setRescueActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [listening, setListening] = useState(false);
  const lastReminder = useRef('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedChat = localStorage.getItem(CHAT_KEY);
      if (saved) setJourney({ ...initialJourney, ...JSON.parse(saved) });
      if (savedChat) setChat(JSON.parse(savedChat));
    } catch {}
    setHydrated(true);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/clearloop-sw.js').catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
    localStorage.setItem(CHAT_KEY, JSON.stringify(chat.slice(-20)));
  }, [journey, chat, hydrated]);

  useEffect(() => {
    if (!rescueActive || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((v) => v - 1), 1000);
    return () => window.clearInterval(id);
  }, [rescueActive, seconds]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!journey.reminder) return;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const marker = `${now.toDateString()}-${hhmm}`;
      if (hhmm === journey.reminder && lastReminder.current !== marker) {
        lastReminder.current = marker;
        if (Notification.permission === 'granted') new Notification('ClearLoop', { body: `You have already managed ${journey.cravingsManaged} cravings. Protect the next decision too.` });
      }
    }, 30000);
    return () => window.clearInterval(id);
  }, [journey.reminder, journey.cravingsManaged]);

  const days = hydrated ? daysSince(journey.startDate) : 0;
  const score = Math.min(100, 25 + Math.min(35, journey.cravingsManaged * 4) + Math.min(15, journey.checkins * 2) + Math.min(15, journey.movementWins * 3) + Math.min(10, journey.learningWins * 2));

  const achievements = useMemo(() => [
    { icon: '○', title: 'First decision', detail: 'Record your first craving win', done: journey.cravingsManaged >= 1 },
    { icon: '↗', title: 'Momentum', detail: 'Manage 5 cravings', done: journey.cravingsManaged >= 5 },
    { icon: '✦', title: 'Pattern finder', detail: 'Complete 5 check-ins', done: journey.checkins >= 5 },
    { icon: '∞', title: 'ClearLoop 10', detail: 'Reach 10 days on your journey', done: days >= 10 }
  ], [journey, days]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  }

  function setMood(mood: string) {
    setJourney((j) => ({ ...j, mood, checkins: j.checkins + 1 }));
    showToast(`Check-in saved privately: ${mood}`);
  }

  function setTrigger(trigger: string) {
    setJourney((j) => ({ ...j, lastTrigger: trigger, checkins: j.checkins + 1 }));
    showToast(`Trigger noted privately: ${trigger}`);
  }

  function recordWin() {
    setJourney((j) => ({ ...j, cravingsManaged: j.cravingsManaged + 1 }));
    setRescueActive(false);
    setSeconds(60);
    showToast('Craving win recorded on this device.');
  }

  function sendMessage() {
    const value = input.trim();
    if (!value) return;
    const next = [...chat, { role: 'user', text: value } as ChatMessage];
    setChat([...next, { role: 'assistant', text: coachReply(value, journey) }]);
    setInput('');
  }

  function speakLast() {
    const last = [...chat].reverse().find((m) => m.role === 'assistant');
    if (!last || !('speechSynthesis' in window)) return showToast('Voice playback is not supported by this browser.');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(last.text));
  }

  function listen() {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) return showToast('Voice input is not supported by this browser yet.');
    const recognition = new Recognition();
    recognition.lang = 'en-SG';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => setInput(event.results?.[0]?.[0]?.transcript || '');
    recognition.start();
  }

  async function enableNotifications() {
    if (!('Notification' in window)) return showToast('Notifications are not supported on this browser.');
    const result = await Notification.requestPermission();
    showToast(result === 'granted' ? 'Reminder notifications enabled on this device.' : 'Notification permission was not granted.');
  }

  function addCalendarReminder() {
    const [hour, minute] = (journey.reminder || '18:00').split(':').map(Number);
    const start = new Date(); start.setHours(hour, minute, 0, 0); if (start < new Date()) start.setDate(start.getDate() + 1);
    const end = new Date(start.getTime() + 5 * 60000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//OMNeXa//ClearLoop//EN\nBEGIN:VEVENT\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nRRULE:FREQ=DAILY\nSUMMARY:ClearLoop check-in\nDESCRIPTION:Protect the next decision. Notice the craving, choose your response, and recognise the progress.\nEND:VEVENT\nEND:VCALENDAR`;
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'clearloop-daily-reminder.ics'; a.click(); URL.revokeObjectURL(url);
    showToast('Calendar reminder created.');
  }

  function exportPrivateBackup() {
    const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), journey, chat }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'clearloop-private-backup.json'; a.click(); URL.revokeObjectURL(url);
  }

  function eraseJourney() {
    if (!window.confirm('Erase your ClearLoop journey from this browser? This cannot be undone unless you exported a backup.')) return;
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(CHAT_KEY);
    setJourney({ ...initialJourney, startDate: new Date().toISOString() });
    setChat([{ role: 'assistant', text: 'Your previous journey has been erased from this browser. This is a fresh private start.' }]);
    showToast('Local ClearLoop data erased.');
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.kicker}>OMNeXa · Human in control</p>
              <h1>ClearLoop <span>Your next decision is yours.</span></h1>
              <p className={styles.lead}>A private companion for understanding vaping, managing cravings and recognising progress. No account. No personal cloud profile. Your journey stays in this browser on this device.</p>
              <div className={styles.loopBar} aria-label="ClearLoop human-machine loop">
                {['Notice','Ask','Assist','Choose','Confirm','Learn'].map((step, i) => <div className={styles.loopStep} key={step}><b>0{i+1}</b>{step}</div>)}
              </div>
            </div>
            <aside className={styles.trustCard}>
              <div className={styles.trustRow}><span className={styles.trustIcon}>✓</span><div><strong>No login</strong><small>Start without a name, email or phone number.</small></div></div>
              <div className={styles.trustRow}><span className={styles.trustIcon}>⌂</span><div><strong>Local journey</strong><small>Cravings, mood, triggers and coaching history remain on this device.</small></div></div>
              <div className={styles.trustRow}><span className={styles.trustIcon}>◎</span><div><strong>Human decision rights</strong><small>ClearLoop suggests. You decide. It does not diagnose, punish or report you.</small></div></div>
            </aside>
          </div>
        </div>
      </section>

      <main className={styles.main}><div className={styles.shell}><div className={styles.grid}>
        <div className={styles.stack}>
          <section className={styles.card}>
            <span className={styles.status}><span className={styles.dot}/> Stored locally</span>
            <h2 style={{marginTop:12}}>Your progress</h2><p className={styles.sub}>Progress is personal. A difficult day does not erase what you have already learned.</p>
            <div className={styles.dashboard}>
              <div className={styles.metric}><strong>{days}</strong><span>days on journey</span></div>
              <div className={styles.metric}><strong>{journey.cravingsManaged}</strong><span>cravings managed</span></div>
              <div className={styles.metric}><strong>{journey.checkins}</strong><span>self check-ins</span></div>
            </div>
            <div className={styles.scoreWrap}><div className={styles.score} style={{'--score': `${score * 3.6}deg`} as React.CSSProperties}><strong>{score}</strong></div><div className={styles.scoreText}><h3>ClearScore</h3><p>A transparent motivation score based only on actions you record on this device. It is not a medical score.</p></div></div>
          </section>

          <section className={`${styles.card} ${styles.rescue}`}>
            <div className={styles.rescueBanner}><div><h2>Craving Rescue</h2><p className={styles.sub}>Interrupt the loop. You only need to manage the next few minutes.</p></div><button className={`${styles.button} ${styles.primary}`} onClick={() => {setRescueActive(true);setSeconds(60)}}>I feel like vaping</button></div>
            {rescueActive && <div><p className={styles.microcopy}>Move away from the cue if you can. Breathe slowly and let the intensity change before you decide.</p><div className={styles.timer}>{seconds}s</div><div className={styles.checkRow}>{triggers.map(t => <button key={t} onClick={() => setTrigger(t)} className={`${styles.choice} ${journey.lastTrigger===t ? styles.choiceActive:''}`}>{t}</button>)}</div><div className={styles.actions}><button className={`${styles.button} ${styles.primary}`} onClick={recordWin}>I managed this craving</button><button className={`${styles.button} ${styles.ghost}`} onClick={() => setSeconds(60)}>Another minute</button></div></div>}
          </section>

          <section className={styles.card}>
            <h2>How are you feeling?</h2><p className={styles.sub}>Self-report only. ClearLoop does not listen in the background or infer your mood from your microphone.</p>
            <div className={styles.checkRow}>{moods.map(m => <button key={m} onClick={() => setMood(m)} className={`${styles.choice} ${journey.mood===m ? styles.choiceActive:''}`}>{m}</button>)}</div>
            <div className={styles.actions}><button className={`${styles.button} ${styles.secondary}`} onClick={() => setJourney(j=>({...j,movementWins:j.movementWins+1}))}>I used movement instead</button><button className={`${styles.button} ${styles.secondary}`} onClick={() => setJourney(j=>({...j,learningWins:j.learningWins+1}))}>I learned something useful</button></div>
          </section>

          <section className={styles.card}>
            <h2>Evidence, not fear</h2><p className={styles.sub}>Short, source-led learning cards. ClearLoop should explain uncertainty and never invent medical claims.</p>
            <div className={styles.newsGrid}>
              <article className={styles.news}><span>Nicotine</span><h3>Dependence can develop quickly</h3><p>Nicotine is addictive. Young people are particularly vulnerable to dependence, but quitting support is useful at any age.</p><a href="https://www.who.int/health-topics/tobacco" target="_blank" rel="noreferrer">WHO tobacco guidance ↗</a></article>
              <article className={styles.news}><span>Singapore</span><h3>Use official local guidance</h3><p>Singapore maintains official information on vaping harms, enforcement and cessation support through health authorities.</p><a href="https://www.hsa.gov.sg/tobacco-regulation/vaping-enforcement" target="_blank" rel="noreferrer">HSA guidance ↗</a></article>
              <article className={styles.news}><span>Control</span><h3>A lapse is information</h3><p>ClearLoop records patterns without turning a lapse into punishment. The aim is to learn what preceded it and improve the next decision.</p><button className={`${styles.button} ${styles.ghost}`} onClick={()=>setJourney(j=>({...j,learningWins:j.learningWins+1}))}>Mark read</button></article>
            </div>
          </section>
        </div>

        <div className={styles.stack}>
          <section className={`${styles.card} ${styles.coach}`}>
            <h2>ClearCoach</h2><p className={styles.sub}>A Week 3-style assistive loop: you speak or type, ClearLoop suggests a next action, and you retain the decision.</p>
            <div className={styles.chat}>{chat.slice(-5).map((m,i)=><div key={i} className={`${styles.bubble} ${m.role==='assistant'?styles.assistant:styles.user}`}>{m.text}</div>)}</div>
            <div className={styles.inputRow}><input className={styles.input} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Tell ClearCoach what is happening…"/><button className={`${styles.button} ${styles.secondary} ${styles.mic}`} onClick={listen} aria-label="Voice input">{listening?'●':'🎙'}</button><button className={`${styles.button} ${styles.secondary}`} onClick={sendMessage}>Send</button></div>
            <div className={styles.actions}><button className={`${styles.button} ${styles.secondary}`} onClick={speakLast}>🔊 Read response aloud</button></div>
            <p className={styles.voiceNote}>Voice recognition and playback depend on browser/device support. No background microphone monitoring is used.</p>
          </section>

          <section className={styles.card}>
            <h2>Achievements</h2><p className={styles.sub}>Private gamification: you compete with your previous self, not with somebody else's addiction.</p>
            <div className={styles.achievements}>{achievements.map(a=><div key={a.title} className={`${styles.achievement} ${!a.done?styles.locked:''}`}><span className={styles.badge}>{a.icon}</span><div><strong>{a.title}</strong><small>{a.done?'Achieved on this device':a.detail}</small></div></div>)}</div>
          </section>

          <section className={styles.card}>
            <h2>Reminder loop</h2><p className={styles.sub}>Choose when ClearLoop should bring your own commitment back to your attention.</p>
            <div className={styles.reminderRow}><label><span className={styles.microcopy}>Daily check-in time</span><input className={styles.timeInput} type="time" value={journey.reminder||'18:00'} onChange={e=>setJourney(j=>({...j,reminder:e.target.value}))}/></label><button className={`${styles.button} ${styles.primary}`} onClick={enableNotifications}>Enable reminder</button></div>
            <div className={styles.actions}><button className={`${styles.button} ${styles.ghost}`} onClick={addCalendarReminder}>Add daily calendar reminder</button></div>
            <p className={`${styles.notice} ${styles.warning}`}>Browser notifications cannot be guaranteed when every browser is fully closed. The calendar option is the reliable cross-device fallback for this web MVP; native iOS/Android local notifications come in the app-wrapper phase.</p>
          </section>

          <section className={`${styles.card} ${styles.privacy}`}>
            <h2>Your privacy</h2><p className={styles.sub}>The safest sensitive database is the one OMNeXa does not possess.</p>
            <div className={styles.privacyList}>
              <div className={styles.privacyItem}><strong>No account</strong><p>No name, email or phone required for the core journey.</p></div>
              <div className={styles.privacyItem}><strong>No cloud journey</strong><p>Cravings, mood and coaching context use browser local storage in this MVP.</p></div>
              <div className={styles.privacyItem}><strong>No behavioural ads</strong><p>ClearLoop is not designed to sell or target users based on cessation behaviour.</p></div>
              <div className={styles.privacyItem}><strong>Human control</strong><p>Export or erase your local journey whenever you choose.</p></div>
            </div>
            <div className={styles.actions}><button className={`${styles.button} ${styles.ghost}`} onClick={exportPrivateBackup}>Export my private backup</button><button className={`${styles.button} ${styles.danger}`} onClick={eraseJourney}>Erase my journey</button></div>
            <p className={styles.sourceFooter}>ClearLoop is a behaviour-support prototype, not a medical device or diagnosis service. For urgent symptoms or significant health concerns, use qualified healthcare services. Website infrastructure may process ordinary technical request logs even though ClearLoop does not create a personal quitting profile.</p>
          </section>
        </div>
      </div></div></main>
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
