'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Info } from 'lucide-react';

const CanvasCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1)); // September 2025
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<Record<string, Array<{
        title: string;
        location: string;
        startTime: string;
        endTime: string;
        frequency: string;
        id: number;
        isExam?: boolean;
    }>>>({});
    const [eventForm, setEventForm] = useState({
        title: '',
        location: '',
        startTime: '',
        endTime: '',
        frequency: 'Does not repeat'
    });
    const [showExamAnimation, setShowExamAnimation] = useState(false);

    const getTodayEvents = () => {
        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];
        return events[dateKey] || [];
    };

    const deleteEvent = (dateKey: string, eventId: number) => {
        setEvents(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
        }));
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
        setShowEventModal(true);
    };

    const handleSubmitEvent = () => {
        if (!eventForm.title || !selectedDate) return;

        const dateKey = selectedDate.toISOString().split('T')[0];
        const isExam = eventForm.title.toLowerCase().includes('exam');
        const newEvent = {
            ...eventForm,
            id: Date.now(),
            isExam
        };

        setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newEvent]
        }));

        if (isExam) {
            setShowExamAnimation(true);

            // Play circus music
            const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            audio.volume = 0.5;
            audio.play();

            setTimeout(() => {
                setShowExamAnimation(false);
                audio.pause();
                audio.currentTime = 0;
            }, 3000);
        }

        setEventForm({
            title: '',
            location: '',
            startTime: '',
            endTime: '',
            frequency: 'Does not repeat'
        });
        setShowEventModal(false);
    };

    const formatDate = (date: Date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateKey = date.toISOString().split('T')[0];
            const dayEvents = events[dateKey] || [];
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(day)}
                >
                    <div className="day-number">{day}</div>
                    <div className="events-container">
                        {dayEvents.slice(0, 3).map(event => (
                            <div key={event.id} className={`event-item ${event.isExam ? 'exam-event' : ''}`}>
                                {event.isExam ? '📚 ' : ''}{event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="more-events">+{dayEvents.length - 3} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="canvas-container">
            <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .canvas-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          padding: 20px;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 90px;
          height: 100vh;
          background: #2d3b45;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
        }

        .logo {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 4px;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #2d3b45;
        }

        .nav-item {
          color: #8b95a0;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          font-size: 12px;
        }

        .nav-item.active {
          color: white;
        }

        .main-content {
          margin-left: 90px;
          padding: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .today-btn {
          background: white;
          border: 1px solid #d1d5db;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .month-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .nav-arrow {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 5px;
        }

        .month-title {
          font-size: 24px;
          font-weight: 400;
          color: #374151;
        }

        .view-buttons {
          display: flex;
          gap: 0;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          overflow: hidden;
        }

        .view-btn {
          background: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 14px;
          border-right: 1px solid #d1d5db;
        }

        .view-btn:last-child {
          border-right: none;
        }

        .view-btn.active {
          background: #4a5c6a;
          color: white;
        }

        .add-btn {
          background: white;
          border: 1px solid #d1d5db;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: auto;
        }

        .calendar-grid-container {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          overflow: hidden;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #f9fafb;
          border-bottom: 1px solid #d1d5db;
        }

        .day-header {
          padding: 15px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          color: #6b7280;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0;
        }

        .calendar-day {
          min-height: 120px;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .calendar-day:hover {
          background: #f9fafb;
        }

        .calendar-day:nth-child(7n) {
          border-right: none;
        }

        .calendar-day.empty {
          background: #fafafa;
          cursor: default;
        }

        .calendar-day.today {
          background: #eff6ff;
        }

        .calendar-day.today .day-number {
          background: #2563eb;
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-number {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 5px;
        }

        .events-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-item {
          background: #e91e63;
          color: white;
          font-size: 11px;
          padding: 3px 6px;
          border-radius: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .event-item.exam-event {
          background: #ff1744;
          font-weight: bold;
          font-size: 14px;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .more-events {
          font-size: 11px;
          color: #6b7280;
          padding: 3px 6px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 500;
          color: #374151;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          flex: 1;
          padding: 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
        }

        .tab.active {
          background: #e91e63;
          color: white;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #374151;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .time-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          border: none;
        }

        .btn-secondary {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        .btn-primary {
          background: #5b9bd5;
          color: white;
        }

        .btn-primary:hover {
          background: #4a8bc2;
        }

        .exam-animation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          pointer-events: none;
          animation: fadeInOut 3s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        .clown-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          font-size: 120px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .explosion-gif {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          object-fit: contain;
        }

        .exam-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 120px;
          font-weight: bold;
          color: #ff1744;
          text-shadow: 4px 4px 0px #000, -4px -4px 0px #fff;
          animation: examPulse 0.5s infinite alternate;
          z-index: 10000;
        }

        @keyframes examPulse {
          from { transform: translate(-50%, -50%) scale(1); }
          to { transform: translate(-50%, -50%) scale(1.1); }
        }

        .today-events-banner {
          position: fixed;
          left: 90px;
          right: 0;
          z-index: 100;
          background: linear-gradient(135deg, #ffff00 0%, #00ff00 25%, #ff00ff 50%, #00ffff 75%, #ff0000 100%);
          padding: 15px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: rainbowPulse 2s infinite;
        }

        @keyframes rainbowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .today-events-banner.top {
          top: 0;
          border-bottom: 5px dashed #ff1493;
        }

        .today-events-banner.bottom {
          bottom: 0;
          border-top: 5px dashed #ff1493;
        }

        .banner-gifs {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0.5;
          animation: scrollGifs 20s linear infinite;
          white-space: nowrap;
          filter: drop-shadow(0 0 5px #ff00ff);
        }

        .banner-gifs img {
          position: relative; /* remove absolute positioning */
          height: 120px;      /* bigger GIFs */
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }

        @keyframes scrollGifs {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .main-content-with-banners {
          padding-top: 120px;
          padding-bottom: 120px;
        }

        .banner-content {
          position: relative;
          z-index: 1;
        }

        .banner-title {
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 10px;
          text-shadow: 2px 2px 0px #ffff00, -2px -2px 0px #ff00ff;
          animation: textWobble 0.5s infinite;
        }

        @keyframes textWobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        .banner-events {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .banner-events::-webkit-scrollbar {
          display: none;
        }

        .banner-event {
          background: linear-gradient(45deg, #ffff00, #00ff00);
          padding: 12px 15px;
          border-radius: 6px;
          display: flex;
          gap: 10px;
          align-items: center;
          box-shadow: 0 0 10px #ff00ff, 0 0 20px #00ffff;
          min-width: 280px;
          flex-shrink: 0;
          border: 3px solid #ff1493;
          animation: eventBounce 1s infinite;
        }

        @keyframes eventBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .banner-event-info {
          flex: 1;
          min-width: 0;
        }

        .banner-event-title {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 1px 1px 0px #ffffff;
        }

        .banner-event-title.exam {
          color: #ff0000;
          font-size: 16px;
          animation: blink 0.3s infinite;
          text-shadow: 2px 2px 0px #ffff00;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.7; }
        }

        .banner-event-details {
          font-size: 12px;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
        }

        .delete-event-btn {
          background: linear-gradient(45deg, #ff0000, #ff00ff);
          color: #ffff00;
          border: 2px solid #00ff00;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          text-shadow: 1px 1px 0px #000000;
          animation: buttonPulse 1s infinite;
        }

        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .delete-event-btn:hover {
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          transform: scale(1.2) rotate(5deg);
          box-shadow: 0 0 20px #ff00ff;
        }

        .no-events-message {
          color: #000000;
          font-size: 16px;
          text-align: center;
          padding: 20px;
          font-weight: bold;
          text-shadow: 2px 2px 0px #ffff00, -2px -2px 0px #ff00ff;
          animation: shake 0.5s infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

            <div className="sidebar">
                <div className="logo">UBC</div>
                <div className="nav-item">Account</div>
                <div className="nav-item">Dashboard</div>
                <div className="nav-item">Courses</div>
                <div className="nav-item active">
                    <Calendar size={24} />
                    <span>Calendar</span>
                </div>
                <div className="nav-item">Inbox</div>
                <div className="nav-item">History</div>
                <div className="nav-item">Help</div>
            </div>

            {/* Top Banner */}
            <div className="today-events-banner top">
                <div className="banner-gifs">
                    <img
                        src="/aa.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/bb.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/ee.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/cc.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/ff.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/dd.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/sadhamstergirl.gif"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                </div>
                <div className="banner-content">
                    <div className="banner-title">📅 Today's Events</div>
                    {getTodayEvents().length > 0 ? (
                        <div className="banner-events">
                            {getTodayEvents().map(event => {
                                const today = new Date();
                                const dateKey = today.toISOString().split('T')[0];
                                return (
                                    <div key={event.id} className="banner-event">
                                        <div className="banner-event-info">
                                            <div className={`banner-event-title ${event.isExam ? 'exam' : ''}`}>
                                                {event.isExam && '🤡 '}{event.title}
                                            </div>
                                            <div className="banner-event-details">
                                                {event.startTime && event.endTime && `${event.startTime} - ${event.endTime}`}
                                                {event.location && ` • ${event.location}`}
                                            </div>
                                        </div>
                                        <button
                                            className="delete-event-btn"
                                            onClick={() => deleteEvent(dateKey, event.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-events-message">No events scheduled for today! 🎉</div>
                    )}
                </div>
            </div>

            <div className={`main-content main-content-with-banners`}>
                {getTodayEvents().length > 0 && (
                    <div className="today-events-banner">
                        <div className="banner-gifs">
                        <img
                        src="/dd.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/aa.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                   
                    <img
                        src="/ee.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                     <img
                        src="/bb.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/cc.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/ff.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    
                    <img
                        src="/sadhamstergirl.gif"
                        alt="Explosion"
                        className="explosion-gif"
                    /> 
                    </div>
                        <div className="banner-content">
                            <div className="banner-title">📅 Today's Events</div>
                            <div className="banner-events">
                                {getTodayEvents().map(event => {
                                    const today = new Date();
                                    const dateKey = today.toISOString().split('T')[0];
                                    return (
                                        <div key={event.id} className="banner-event">
                                            <div className="banner-event-info">
                                                <div className={`banner-event-title ${event.isExam ? 'exam' : ''}`}>
                                                    {event.isExam && '🤡 '}{event.title}
                                                </div>
                                                <div className="banner-event-details">
                                                    {event.startTime && event.endTime && `${event.startTime} - ${event.endTime}`}
                                                    {event.location && ` • ${event.location}`}
                                                </div>
                                            </div>
                                            <button
                                                className="delete-event-btn"
                                                onClick={() => deleteEvent(dateKey, event.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="header">
                    <button className="today-btn" onClick={() => setCurrentMonth(new Date())}>
                        Today
                    </button>
                    <div className="month-nav">
                        <button className="nav-arrow" onClick={handlePrevMonth}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="nav-arrow" onClick={handleNextMonth}>
                            <ChevronRight size={20} />
                        </button>
                        <h1 className="month-title">
                            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h1>
                    </div>
                    <div className="view-buttons">
                        <button className="view-btn">Week</button>
                        <button className="view-btn active">Month</button>
                        <button className="view-btn">Agenda</button>
                    </div>
                    <button className="add-btn">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="calendar-grid-container">
                    <div className="calendar-header">
                        {daysOfWeek.map(day => (
                            <div key={day} className="day-header">{day}</div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className="today-events-banner bottom">
            <div className="banner-gifs">
                    <img
                        src="/bb.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    
                    <img
                        src="/dd.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/ff.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/cc.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <img
                        src="/aa.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                     <img
                        src="/ee.png"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                   
                    <img
                        src="/sadhamstergirl.gif"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                </div>
                <div className="banner-content">
                    <div className="banner-title">⏰ Don't Forget!</div>
                    {getTodayEvents().length > 0 ? (
                        <div className="banner-events">
                            {getTodayEvents().map(event => {
                                const today = new Date();
                                const dateKey = today.toISOString().split('T')[0];
                                return (
                                    <div key={event.id} className="banner-event">
                                        <div className="banner-event-info">
                                            <div className={`banner-event-title ${event.isExam ? 'exam' : ''}`}>
                                                {event.isExam && '🤡 '}{event.title}
                                            </div>
                                            <div className="banner-event-details">
                                                {event.startTime && event.endTime && `${event.startTime} - ${event.endTime}`}
                                                {event.location && ` • ${event.location}`}
                                            </div>
                                        </div>
                                        <button
                                            className="delete-event-btn"
                                            onClick={() => deleteEvent(dateKey, event.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-events-message">Nothing on your schedule today! 🌟</div>
                    )}
                </div>
            </div>

            {showEventModal && (
                <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Event</h2>
                            <button className="close-btn" onClick={() => setShowEventModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="tabs">
                            <button className="tab">Event</button>
                            <button className="tab active">My To Do</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Input Event Title..."
                                    value={eventForm.title}
                                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Date <Info size={16} />
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={selectedDate ? formatDate(selectedDate) : ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">From</label>
                                <div className="time-row">
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={eventForm.startTime}
                                        onChange={e => setEventForm({ ...eventForm, startTime: e.target.value })}
                                    />
                                    <div>
                                        <label className="form-label">To</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={eventForm.endTime}
                                            onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Frequency</label>
                                <select
                                    className="form-input"
                                    value={eventForm.frequency}
                                    onChange={e => setEventForm({ ...eventForm, frequency: e.target.value })}
                                >
                                    <option>Does not repeat</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Input Event Location..."
                                    value={eventForm.location}
                                    onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary">More Options</button>
                            <button className="btn btn-primary" onClick={handleSubmitEvent}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExamAnimation && (
                <div className="exam-animation-overlay">
                    <div className="clown-background">
                        🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡
                    </div>
                    <img
                        src="/sadhamstergirl.gif"
                        alt="Explosion"
                        className="explosion-gif"
                    />
                    <div className="exam-text">EXAM! 📝</div>
                </div>
            )}
        </div>
    );
};

export default CanvasCalendar;