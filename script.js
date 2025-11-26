document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chart-container');
    
    // 1. Data.json file ko fetch karna
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 2. Data ko naya record upar dikhaane ke liye reverse karna
            data.reverse(); 

            // 3. Table banane ka kaam shuru karna (sirf 3 columns)
            let tableHTML = '<table class="matka-chart"><thead><tr><th>दिनांक (Date)</th><th>दिन (Day)</th><th>परिणाम (Result)</th></tr></thead><tbody>';

            // 4. Har data record ke liye table ki row banana
            data.forEach(record => {
                const rowClass = record.day.toLowerCase() === 'sunday' ? 'sunday' : '';

                // Central result cell jahan Open aur Close ka data saath mein hoga
                const resultCell = `
                    <div class="result-cell-container">
                        <span class="panna">${record.open_panna}</span>
                        <span class="number open-number">${record.open_num}</span>
                        <span class="jodi-separator">-</span>
                        <span class="number close-number">${record.close_num}</span>
                        <span class="panna">${record.close_panna}</span>
                    </div>
                `;

                tableHTML += `<tr class="${rowClass}">`;
                
                // Column 1: Date
                tableHTML += `<td>${record.date}</td>`;
                
                // Column 2: Day
                tableHTML += `<td>${record.day}</td>`;
                
                // Column 3: Result (Open Panna + Open Num + Jodi + Close Num + Close Panna)
                tableHTML += `<td class="result-column">${resultCell}</td>`;
                
                tableHTML += '</tr>';
            });

            // 5. Table ko band karna aur HTML ko container mein daalna
            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Data load karne mein gadbadi:', error);
            container.innerHTML = '<p style="color:red;">चार्ट लोड करने में कोई समस्या आई। कृपया डेटा फ़ाइल जाँचें।</p>';
        });
});
