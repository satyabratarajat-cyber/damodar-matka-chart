document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chart-container');
    // Chart mein Monday se Saturday tak ke liye
    const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Pehle data ko date ke hisaab se sort karte hain
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // 1. Data ko hafto (Weeks) mein group karna
            const weeks = groupDataIntoWeeks(data);

            // 2. Chart ka HTML banana
            let tableHTML = generateChartHTML(weeks, DAYS_OF_WEEK);
            container.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Data load error:', error);
            container.innerHTML = '<h2 style="color:red; text-align:center;">चार्ट लोड करने में त्रुटि।</h2>';
        });

    // Function: Simple data array ko Weekly array mein badalna
    function groupDataIntoWeeks(data) {
        const weeks = [];
        let currentWeek = null;

        for (const record of data) {
            const date = new Date(record.date);
            const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

            // Naya hafta shuru karna (Aamtaur par Monday se)
            // Ya agar pehla record Monday nahi hai, to bhi naya hafta shuru karein
            if (dayIndex === 1 || !currentWeek) { 
                const weekStartDate = new Date(date);
                if (dayIndex !== 1) { // Agar pehla din Monday nahi hai, to date ko Monday tak piche le jaana
                    weekStartDate.setDate(date.getDate() - (dayIndex === 0 ? 6 : dayIndex - 1));
                }

                const weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekStartDate.getDate() + 5); // Week Saturday ko khatam hota hai

                // Date format dd/mm/yy
                const format = (d) => `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;

                currentWeek = {
                    startDate: format(weekStartDate),
                    endDate: format(weekEndDate),
                    days: {} // Monday se Saturday ka data rakhega
                };
                weeks.push(currentWeek);
            }

            // Record ko Week ke andar sahi din mein daalna
            const dayKey = record.day.slice(0, 3).toUpperCase(); // MON, TUE, etc.
            currentWeek.days[dayKey] = record;
        }
        return weeks;
    }

    // Function: Weekly data se HTML table banana
    function generateChartHTML(weeks, DAYS_OF_WEEK) {
        // Table Header: Date aur Mon se Sat
        let tableHTML = '<table class="matka-grid"><thead><tr><th>Date</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody>';

        // Har hafte (Week) ke liye ek Row
        weeks.forEach(week => {
            // Row for Date Range
            tableHTML += `<tr class="date-row">`;
            // Date Range Column
            tableHTML += `<td class="date-range">${week.startDate} <br/> to <br/> ${week.endDate}</td>`;
            
            // Loop through Mon (1) to Sat (6)
            for (let i = 1; i <= 6; i++) {
                const dayName = DAYS_OF_WEEK[i].slice(0, 3).toUpperCase(); 
                const record = week.days[dayName];
                
                if (record) {
                    // Ek hi cell mein Panna, Jodi, aur Panna ko alag-alag dikhana
                    const jodi = `${record.open_num}${record.close_num}`;
                    tableHTML += `<td class="data-cell">
                        <div class="panna-top">${record.open_panna}</div>
                        <div class="jodi-mid">${jodi}</div>
                        <div class="panna-bottom">${record.close_panna}</div>
                    </td>`;
                } else {
                    // Agar us din ka data nahi hai
                    tableHTML += `<td class="empty-cell"></td>`;
                }
            }
            tableHTML += `</tr>`;
        });

        tableHTML += '</tbody></table>';
        return tableHTML;
    }
});
