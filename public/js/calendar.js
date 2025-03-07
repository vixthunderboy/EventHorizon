async function fetchEventsForMonth(year, month) {
    try {
        const response = await fetch(`/api/events`);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }
        const events = await response.json();
        console.log("Events from API:", events);
        return events.filter(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
}



async function generateCalendar(year, month) {
    const now = new Date(year, month);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const events = await fetchEventsForMonth(currentYear, currentMonth); // Fetch events for the month

    const monthYearDisplay = `${now.toLocaleString('default', { month: 'long' })} ${currentYear}`;

    document.getElementById('month-year').innerText = monthYearDisplay

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    let date = 1 - startDayOfWeek;
    let calendarHTML = '';

    for (let i = 0; i < 6; i++) {
        let weekRow = '<tr>';
        for (let j = 0; j < 7; j++, date++) {
            const currentDate = new Date(currentYear, currentMonth, date-1);
            let dateEvents = events.filter(e => new Date(e.eventDate).toDateString() === currentDate.toDateString());

            let dayHTML = dateEvents.length > 0 
                ? `<td><a href="/event/${dateEvents[0]._id}">${date}</a></td>` // Assume event ID is accessible and you have a route to handle it
                : `<td>${date}</td>`;

            weekRow += date < 1 || date > daysInMonth
                ? `<td class="not-current-month">${date < 1 ? new Date(currentYear, currentMonth, date).getDate() : date - daysInMonth}</td>`
                : dayHTML;
        }
        weekRow += '</tr>';
        calendarHTML += weekRow;
    }

    document.querySelector('#calendar tbody').innerHTML = calendarHTML;

}

document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    generateCalendar(now.getFullYear(), now.getMonth());

    document.getElementById('prev-month').addEventListener('click', () => {
        const [month, year] = document.getElementById('month-year').textContent.split(' ');
        generateCalendar(parseInt(year), new Date(`${month} 1, ${year}`).getMonth() - 1);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        const [month, year] = document.getElementById('month-year').textContent.split(' ');
        generateCalendar(parseInt(year), new Date(`${month} 1, ${year}`).getMonth() + 1);
    });
});
