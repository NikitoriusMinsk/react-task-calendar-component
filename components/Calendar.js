import React from 'react'
import { useEffect, useState } from 'react';
import styles from '/styles/components/Calendar.module.css'

function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}
function getColumn(day, month, year){
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 ? 7 : dayOfWeek;
}
const schedule = [
    {
        start: 10,
        end: 10,
        title: 'Some Event',
        color: 'cadetblue'
    },
    {
        start: 21,
        end: 21,
        title: 'Another Event',
        color: 'coral'
    },
    {
        start: 8,
        end: 8,
        title: 'Event',
        color: 'burlywood'
    },
    {
        start: 26,
        end: 26,
        title: 'Event!',
        color: 'brown'
    }
]

export default function Calendar() {
    const [positions, setPositions] = useState([]);
    const [days, setDays] = useState([]);
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    
    function configureDays(){
        const dayCount = daysInMonth(date.getMonth(), date.getFullYear());
        const days = [];
        const positions = {};
        let row = 1;
        for (let i = 1; i <= dayCount; i++) {
            const column = getColumn(i, date.getMonth(), date.getFullYear());
            positions[i] = {
                row,
                column
            }
            days.push(
                <Day
                    key={`d${i}`}
                    number={i}
                    style={{
                        gridColumnStart: column,
                        gridColumnEnd: column + 1,
                        gridRowStart: row,
                        gridRowEnd: row + 1
                    }}
                />
            )
            if (column === 7) {
                row++;
            }
        }
        setPositions(positions);
        setDays(days);
    }

    function configureEvents(){
        const events = schedule.map((event, index) => {
            if (positions[event.start].row === positions[event.end].row) {
                return <Event
                    key={`e${index}`}
                    style={{
                        gridColumnStart: positions[event.start].column,
                        gridColumnEnd: positions[event.end].column + 1,
                        gridRowStart: positions[event.start].row,
                        gridRowEnd: positions[event.end].row+1,
                        backgroundColor: event.color,
                        top: index*15
                    }}
                    title={event.title}
                />
            } else {
                const events = [];
                for (let i = positions[event.start].row; i <= positions[event.end].row; i++) {
                    switch (i) {
                        case positions[event.end].row:
                            events.push(
                                <Event
                                    key={`e${index}_${i}`}
                                    style={{
                                        gridColumnStart: 1,
                                        gridColumnEnd: positions[event.end].column + 1,
                                        gridRowStart: i,
                                        gridRowEnd: i + 1,
                                        backgroundColor: event.color,
                                        top: index*15

                                    }}
                                    title={event.title}
                                />
                            )
                            break;
                        case positions[event.start].row:
                            events.push(
                                <Event
                                    key={`e${index}_${i}`}
                                    style={{
                                        gridColumnStart: positions[event.start].column,
                                        gridColumnEnd: 8,
                                        gridRowStart: i,
                                        gridRowEnd: i+1,
                                        backgroundColor: event.color,
                                        top: index*15
                                    }}
                                    title={event.title}
                                />
                            )
                            break;
                        default:
                            events.push(
                                <Event
                                    key={`e${index}_${i}`}
                                    style={{
                                        gridColumnStart: 1,
                                        gridColumnEnd: 8,
                                        gridRowStart: i,
                                        gridRowEnd: i+1,
                                        backgroundColor: event.color,
                                        top: index*15
                                    }}
                                    title={event.title}
                                />
                            )
                            break;
                    }
                }
                return events;
            }
        })
        setEvents(events);
    }

    useEffect(() => {
        configureDays();
    }, [])

    useEffect(() => {
        if (positions.length === 0) return
        configureEvents();
    }, [positions])

    function next(){
        date.setMonth(date.getMonth() + 1);
        configureDays();
    }

    function prev(){
        date.setMonth(date.getMonth() - 1);
        configureDays();
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.controlsContainer}>
                    <h1>{date.toLocaleString('en', { month: 'long' })}, {date.getFullYear()}</h1>
                    <div className={styles.controls}>
                        <span onClick={prev}>{`<`}</span>
                        <span onClick={next}>{`>`}</span>
                    </div>
                </div>
                <div className={styles.switch}>
                    <span 
                        className={view === 'day' && styles.active}
                        onClick={() => setView('day')}
                    >
                        Day
                    </span>
                    <span 
                        className={view === 'week' && styles.active}
                        onClick={() => setView('week')}
                    >
                        Week
                    </span>
                    <span 
                        className={view === 'month' && styles.active}
                        onClick={() => setView('month')}
                    >
                        Month
                    </span>
                </div>
            </div>
            {view === 'month' && <>
                <div className={styles.daysHeader}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
                <div className={styles.calendarContainer}>
                    <div className={styles.events}>
                        {events}
                    </div>
                    <div className={styles.calendar}>
                        {days}
                    </div>
                </div>
            </>}
            {view === 'week' && <>

            </>}
        </div>
    )
}

function Day({ number, children, ...props }){
    return (
        <div 
            className={styles.day}
            {...props}
        >
            <span className={styles.dayNumber}>{number}</span>
            {children}
        </div>
    )
}
function Event({ title, ...props }){
    return (
        <div 
            className={styles.event}
            {...props}
        >
            <span className={styles.eventTitle}>{title}</span>
        </div>
    )
}