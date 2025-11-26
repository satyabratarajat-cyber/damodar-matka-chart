document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chart-container');
    const DAYS_OF_WEEK_KEYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Data file not found or network error.');
            }
            return response.json();
        })
        .then(data => {
            // Data ko date ke hisaab se sort karna (Zaroori)
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            const weeks = groupDataIntoWeeksSimplified(data, DAYS_OF_WEEK_KEYS);
            let tableHTML = generateChartHTML(weeks, DAYS_OF_WEEK_KEYS);
            container.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Data load error:', error);
            container.innerHTML = '<h2 style="color:red; text-align:center;">चार्ट लोड करने में त्रुटि। कृपया data.json फाइल जाँचें।</h2>';
        });

    // Sahi Date Parsing Logic
    function getDayKey(dateString) {
        // YYYY-MM-DD format ko read karke Day of Week nikalna
        const parts = dateString.split('-'); 
        // JavaScript mein Month 0 (Jan) se shuru hota hai, isliye -1
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]); 
        
        // Sunday (0), Monday (1), ... Saturday (6)
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return dayNames[dateObj.getDay()];
    }

    function groupDataIntoWeeksSimplified(data, keys) {
        const weeks = [];
        let currentWeek = { days: {}, records: [] };
        
        // Date format DD/MM/YY
        const format = (dStr) => {
            const d = new Date(dStr);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = String(d.getFullYear()).slice(-2);
            return `${day}/${month}/${year}`;
        };
        
        for (const record of data) {
            const dayKey = getDayKey(record.date);

            if (dayKey === 'MON' && currentWeek.records.length > 0) {
                const firstRecord = currentWeek.records[0];
                const lastRecord = currentWeek.records[currentWeek.records.length - 1];
                
                currentWeek.startDate = format(firstRecord.date);
                currentWeek.endDate = format(lastRecord.date);

                weeks.push(currentWeek);
                currentWeek = { days: {}, records: [] };
            }
            
            if (keys.includes(dayKey)) {
                currentWeek.days[dayKey] = record;
                currentWeek.records.push(record);
            }
        }

        if (currentWeek.records.length > 0) {
            const firstRecord = currentWeek.records[0];
            const lastRecord = currentWeek.records[currentWeek.records.length - 1];
            
            currentWeek.startDate = format(firstRecord.date);
            currentWeek.endDate = format(lastRecord.date);
            
            weeks.push(currentWeek);
        }
        return weeks;
    }

    function generateChartHTML(weeks, keys) {
        let tableHTML = '<table class="matka-grid"><thead><tr><th>Date</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody>';

        weeks.forEach(week => {
            tableHTML += `<tr class="date-row">`;
            tableHTML += `<td class="date-range">${week.startDate} <br/> to <br/> ${week.endDate}</td>`;
            
            keys.forEach(dayKey => {
                const record = week.days[dayKey];
                
                if (record) {
                    const jodi = `${record.open_num}${record.close_num}`;
                    tableHTML += `<td class="data-cell">
                        <div class="panna-top">${record.open_panna}</div>
                        <div class="jodi-mid">${jodi}</div>
                        <div class="panna-bottom">${record.close_panna}</div>
                    </td>`;
                } else {
                    tableHTML += `<td class="empty-cell"></td>`;
                }
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        return tableHTML;
    }
});
