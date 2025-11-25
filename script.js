document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chart-container');
    
    // 1. Data.json file ko fetch karna
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                // Agar file nahi mili to error throw karein
                throw new Error(`HTTP error! status: ${response.status} - Data file nahi mili ya load nahi ho payi.`);
            }
            return response.json();
        })
        .then(data => {
            // 2. Data ko naya record upar dikhaane ke liye reverse karna
            data.reverse(); 

            // 3. Table banane ka kaam shuru karna
            let tableHTML = '<table class="matka-chart"><thead><tr><th>दिनांक (Date)</th><th>दिन (Day)</th><th>ओपन पन्ना (Open Panna)</th><th>ओपन (Open)</th><th>क्लोज पन्ना (Close Panna)</th><th>क्लोज (Close)</th><th>जोड़ी (Jodi)</th></tr></thead><tbody>';

            // 4. Har data record ke liye table ki row banana
            data.forEach(record => {
                // Sunday ko highlight karne ke liye class
                const rowClass = record.day.toLowerCase() === 'sunday' ? 'sunday' : '';

                tableHTML += `<tr class="${rowClass}">`;
                
                // Date
                tableHTML += `<td>${record.date}</td>`;
                
                // Day
                tableHTML += `<td>${record.day}</td>`;
                
                // Open Panna
                tableHTML += `<td>${record.open_panna}</td>`;

                // Open Number
                tableHTML += `<td class="open-number">${record.open_num}</td>`;

                // Close Panna
                tableHTML += `<td>${record.close_panna}</td>`;
                
                // Close Number
                tableHTML += `<td class="close-number">${record.close_num}</td>`;

                // Jodi (Result)
                tableHTML += `<td>${record.result}</td>`;
                
                tableHTML += '</tr>';
            });

            // 5. Table ko band karna aur HTML ko container mein daalna
            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        })
        .catch(error => {
            // Agar data load na ho to error message dikhana
            console.error('Data load karne mein gadbadi:', error);
            container.innerHTML = '<p style="color:red;">चार्ट लोड करने में कोई समस्या आई। कृपया डेटा फ़ाइल जाँचें।</p>';
        });
});