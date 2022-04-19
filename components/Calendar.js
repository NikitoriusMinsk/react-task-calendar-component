import React from 'react'
import { useEffect, useState } from 'react';
import styles from '/styles/components/Calendar.module.css'

const schedule = [
    {
        start: 10,
        end: 10,
        time: '10:00',
        title: 'Some Event',
        color: 'cadetblue'
    },
    {
        start: 21,
        end: 21,
        time: '21:00',
        title: 'Another Event',
        color: 'coral'
    },
    {
        start: 8,
        end: 8,
        time: '08:00',
        title: 'Event',
        color: 'burlywood'
    },
    {
        start: 26,
        end: 26,
        time: '00:00',
        title: 'Event!',
        color: 'brown'
    },
    {
        start: 18,
        end: 18,
        time: '10:00',
        title: 'Some Event',
        color: 'burlywood'
    },
    {
        start: 19,
        end: 19,
        time: '11:30',
        title: 'Some Event',
        color: 'cadetblue'
    },
    {
        start: 19,
        end: 19,
        time: '09:30',
        title: 'Some Event',
        color: 'brown'
    },
]
function getDayOfWeek(day, month, year){
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 ? 7 : dayOfWeek;
}
Date.prototype.GetFirstDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay()+ (this.getDay() == 0 ? -6:1) )));
}
Date.prototype.GetLastDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() +7)));
}

export default function Calendar() {
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('week');

    function next(){
        switch(view){
            case 'month':
                setDate(new Date(date.getFullYear(), date.getMonth() + 1));
                break;
            case 'week':
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
                break;
            case 'day':
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
                break;
            default:
                break;
        }
    }

    function prev(){
        switch(view){
            case 'month':
                setDate(new Date(date.getFullYear(), date.getMonth() - 1));
                break;
            case 'week':
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
                break;
            case 'day':
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.controlsContainer}>
                    {view === 'month' && <h1>{date.toLocaleString('en', { month: 'long' })}, {date.getFullYear()}</h1>}
                    {view ==='week' && <h1>{date.toLocaleDateString('en', {month: 'long'})} {date.GetFirstDayOfWeek().getDate()}-{date.GetLastDayOfWeek().getDate()} </h1>}
                    <div className={styles.controls}>
                        <span onClick={prev}>{`<`}</span>
                        <span onClick={next}>{`>`}</span>
                    </div>
                </div>
                <div className={styles.switch}>
                    <span 
                        className={view === 'day' ? styles.active : null}
                        onClick={() => setView('day')}
                    >
                        Day
                    </span>
                    <span 
                        className={view === 'week' ? styles.active : null}
                        onClick={() => setView('week')}
                    >
                        Week
                    </span>
                    <span 
                        className={view === 'month' ? styles.active : null}
                        onClick={() => setView('month')}
                    >
                        Month
                    </span>
                </div>
            </div>
            {view === 'month' && <MonthView date={date} />}
            {view === 'week' && <WeekView date={date} />}
        </div>
    )
}

function MonthView({ date }){
    const [positions, setPositions] = useState();
    const [days, setDays] = useState();
    const [events, setEvents] = useState();
    
    function daysInMonth (month, year) {
        return new Date(year, month+1, 0).getDate();
    }

    function configureDays(){
        const dayCount = daysInMonth(date.getMonth(), date.getFullYear());
        const days = [];
        const positions = {};
        // fill current month days
        let row = 1;
        for (let i = 1; i <= dayCount; i++) {
            const column = getDayOfWeek(i, date.getMonth(), date.getFullYear());
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
        // fill previous month days
        const prevDaysCount = getDayOfWeek(1, date.getMonth(), date.getFullYear()) - 1;
        const prevMonthDays = daysInMonth(date.getMonth() - 1, date.getFullYear());
        for (let i = prevMonthDays; i > prevMonthDays - prevDaysCount; i--) {
            const column = getDayOfWeek(i, date.getMonth() - 1, date.getFullYear());
            positions[-i] = {
                row: 1,
                column
            }
            days.unshift(
                <Day
                    key={`dp${i}`}
                    number={i}
                    style={{
                        gridColumnStart: column,
                        gridColumnEnd: column + 1,
                        gridRowStart: 1,
                        gridRowEnd: 2
                    }}
                    faded
                />
            )
        }
        //fill future month days
        const nextDaysCount = 7 - getDayOfWeek(dayCount, date.getMonth(), date.getFullYear());
        for (let i = 1; i <= nextDaysCount; i++) {
            const column = getDayOfWeek(i, date.getMonth() + 1, date.getFullYear());
            positions[`future${i}`] = {
                row,
                column
            }
            days.push(
                <Day
                    key={`df${i}`}
                    number={i}
                    style={{
                        gridColumnStart: column,
                        gridColumnEnd: column + 1,
                        gridRowStart: row,
                        gridRowEnd: row + 1
                    }}
                    faded
                />
            )
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
    }, [date])

    useEffect(() => {
        if (!positions) return
        configureEvents();
    }, [positions])

    return(
        <>
            <div className={styles.daysHeader}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
            </div>
            <div className={styles.monthContainer}>
                <div className={styles.events}>
                    {events}
                </div>
                <div className={styles.calendar}>
                    {days}
                </div>
            </div>
        </>
    )
}

function WeekView({ date }){
    const [hours, setHours] = useState();
    const [events, setEvents] = useState();

    function configureHours(){
        const hours = [];
        let hour = 0;
        for (let i = 0; i < 1440; i+=60) {
            hours.push(
                <Hour
                    key={`h${i}`}
                    number={hour++}
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 9,
                        gridRowStart: i + 1,
                        gridRowEnd: i + 60
                    }}
                />
            )
        }
        setHours(hours);
    }

    function configureEvents(){
        const events = schedule.map((event, index) => {
            if ((event.start >= date.GetFirstDayOfWeek().getDate()) && (event.end <= date.GetLastDayOfWeek().getDate())) {
                const column = getDayOfWeek(event.start, date.getMonth(), date.getFullYear()) + 1;
                const hourMinutes = event.time.split(':');
                return <Event
                    key={`e${index}`}
                    style={{
                        gridColumnStart: column,
                        gridColumnEnd: column + 1,
                        gridRowStart: parseInt(hourMinutes[0]) * 60 + parseInt(hourMinutes[1]),
                        gridRowEnd: parseInt(hourMinutes[0]) * 60 + parseInt(hourMinutes[1]) + 60,
                        backgroundColor: event.color,
                        height: 'auto'
                    }}
                    title={`${event.title}/${event.time}`}
                />
            }
        })
        setEvents(events);
    }

    useEffect(() => {
        configureHours();
        configureEvents()
    }, [date])

    return (
        <>
            <div className={styles.weekHeader}>
                <span />
                <span>
                    <span>Mon</span>
                    <span>{date.GetFirstDayOfWeek().getDate()}</span>
                </span>
                <span>
                    <span>Tue</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+1}</span>
                </span>
                <span>
                    <span>Wed</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+2}</span>
                </span>
                <span>
                    <span>Thu</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+3}</span>
                </span>
                <span>
                    <span>Fri</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+4}</span>
                </span>
                <span>
                    <span>Sat</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+5}</span>
                </span>
                <span>
                    <span>Sun</span>
                    <span>{date.GetFirstDayOfWeek().getDate()+6}</span>
                </span>
            </div>
            <div className={styles.weekContainer}>
                <div className={styles.events}>
                    {events}
                </div>
                <div className={styles.calendar}>
                    {hours}
                </div>
            </div>
        </>
    )
}

function Day({ number, faded=false, ...props }){
    return (
        <div 
            className={`${styles.day} ${faded && styles.faded}`}
            {...props}
        >
            <span className={styles.dayNumber}>{number}</span>
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
function Hour({ number, ...props}){
    return (
        <div 
            className={styles.hour}
            {...props}
        >
            <span className={styles.hourNumber}>{`${number < 10 ? `0${number}` : number}:00`}</span>
        </div>
    )
}