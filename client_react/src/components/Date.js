// Styles
import "./Date.css"

export default function DateTime ( {datetime})
{
    let formatter
    const todaysDate = new Date()
    const date = new Date(datetime)

    // Compare the two dates, if the duration is more than a day, display 'Month Day', 
    // otherwise, display 'hh:mm'
    // Gets the milliseconds difference between the two dates.
    const timeDiff = Math.abs(todaysDate.getTime() - date.getTime());

    // Convert to hours
    const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
    
    if (hoursDiff > 160)
    {
        formatter = new Intl.DateTimeFormat('en-US', {  month: 'short', day: 'numeric'});
    }
    else if (hoursDiff > 16)
    {
        formatter = new Intl.DateTimeFormat('en-US', {  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    }
    else
    {
        formatter = new Intl.DateTimeFormat('en-US', { timeStyle: "short" });
    }

    const formattedDate = formatter.format(date);
    return <span className="date-time">{formattedDate}</span>
}




