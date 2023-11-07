import { useState, useLayoutEffect } from "react";
import { Temporal } from "temporal-polyfill";
import { TheTable } from "./TheTable";
import "./App.css";

export default function App() {
    const [timezones, set_timezones] = useState([]);
    const [current_date, set_current_date] = useState( Temporal.Now.zonedDateTimeISO() );
    useLayoutEffect(() => {
        fetch( "./timezone.json" ).then( r => r.json() ).then( r => {
            set_timezones(r);
        });
        const interval_hook = window.setInterval( () => {
            set_current_date( Temporal.Now.zonedDateTimeISO() );
        }, 1000);
        return () => window.setInterval(interval_hook);
    }, []);
    
    return (<main className="main">
        <div className="container">
            <h1 className="main-title">The World Clock</h1>
            { timezones.length > 0 ? <TheTable timezones={timezones} currentDate={current_date} /> : <p>No data</p> }
        </div>
    </main>);
}
