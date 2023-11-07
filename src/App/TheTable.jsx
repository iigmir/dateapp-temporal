import { PropTypes } from "prop-types";
import { Temporal } from "temporal-polyfill";

function TableHead() {
    return (<tr>
        <th>Place</th>
        <th>Time</th>
    </tr>);
}

/**
 * @param {Object} props.item - `{ code: "Etc/UTC", place: "UTC" }`
 * @param {Temporal} props.currentDate - A Temporal object
 * @returns 
 */
function TableRow({ item, currentDate }) {
    const format_date = (current_timezone, current_date) => {
        const tz = Temporal.TimeZone.from( current_timezone );
        return tz.getPlainDateTimeFor( current_date.toString() );
    };
    const render_date = (timezone_code, current_date) => {
        const result = Temporal.PlainDate.from( format_date(timezone_code, current_date) );
        return result.toString();
    };
    const render_time = (timezone_code, current_date) => {
        const result = Temporal.PlainTime.from( format_date(timezone_code, current_date) );
        const h =   result.hour.toString().padStart(2, 0);
        const m = result.minute.toString().padStart(2, 0);
        const s = result.second.toString().padStart(2, 0);
        return `${h}:${m}:${s}`;
    };
    /**
     * If the hour is between 6 ~ 16, then it's day; otherwise, it's night.
     * @returns 
     */
    const day_or_night = (timezone_code, current_date) => {
        const date = Temporal.PlainTime.from( format_date(timezone_code, current_date) );
        const start_from = 5;
        const end_with = 17;
        return date.hour > start_from && date.hour < end_with ? "day" : "night";
    };
    
    return (<tr className={day_or_night(item.code, currentDate)}>
        <td>
            <p className="place">{ item.place }</p>
            <p className="date">{ render_date(item.code, currentDate) }</p>
        </td>
        <td>
            <time dateTime={render_time(item.code, currentDate)} className="time">{ render_time(item.code, currentDate) }</time>
        </td>
    </tr>);
}
TableRow.propTypes = {
    item: PropTypes.object,
    currentDate: PropTypes.object,
};

function TheTable({ timezones, currentDate }) {
    return <table className="the-table">
        <thead>
            <TableHead />
        </thead>
        <tbody>
            {timezones.map((item) => <TableRow item={item} key={item.code} currentDate={currentDate} />)}
        </tbody>
    </table>;
}
TheTable.propTypes = {
    timezones: PropTypes.array,
    currentDate: PropTypes.object,
};

export { TheTable, TableHead, TableRow };
