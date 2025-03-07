document.addEventListener('DOMContentLoaded', function () {
    const daySelect = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');

    // Populate days
    for (let i = 1; i <= 31; i++) {
        daySelect.options.add(new Option(i, i));
    }

    // Populate months
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months.forEach((month, index) => {
        monthSelect.options.add(new Option(month, index + 1));
    });

    // Populate years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
        yearSelect.options.add(new Option(year, year));
    }

    // Adjust days based on month/year for accuracy (leap years, different month lengths)
    function adjustDays() {
        const month = monthSelect.value;
        const year = yearSelect.value;
        const daysInMonth = new Date(year, month, 0).getDate();
        while (daySelect.options.length > daysInMonth) {
            daySelect.remove(daySelect.options.length - 1);
        }
        while (daySelect.options.length < daysInMonth) {
            daySelect.options.add(new Option(daySelect.options.length + 1, daySelect.options.length + 1));
        }
    }

    monthSelect.addEventListener('change', adjustDays);
    yearSelect.addEventListener('change', adjustDays);
});
