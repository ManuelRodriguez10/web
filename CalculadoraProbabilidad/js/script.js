document.getElementById("dataForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const dataInput = document.getElementById("dataInput").value;
    if (!dataInput) {
        Swal.fire('Error', 'Por favor ingresa datos válidos.', 'error');
        return;
    }

    const data = dataInput.split(',').map(Number);
    if (data.some(isNaN)) {
        Swal.fire('Error', 'Todos los valores deben ser números.', 'error');
        return;
    }

    const frequencies = {};
    data.forEach(value => frequencies[value] = (frequencies[value] || 0) + 1);

    const xi = Object.keys(frequencies).map(Number);
    const fi = Object.values(frequencies);
    const N = fi.reduce((a, b) => a + b, 0);
    const xifi = xi.map((x, i) => x * fi[i]);
    const mean = xifi.reduce((a, b) => a + b, 0) / N;

    const absDiff = xi.map(x => Math.abs(x - mean));
    const absDiffFi = absDiff.map((diff, i) => diff * fi[i]);
    const squaredXifi = xi.map((x, i) => x ** 2 * fi[i]);

    // Display results in SweetAlert2
    Swal.fire({
        title: 'Resultados',
        html: `<p><strong>Moda:</strong> ${calculateMode(data)}</p>
               <p><strong>Mediana:</strong> ${calculateMedian(data)}</p>
               <p><strong>Media:</strong> ${mean.toFixed(2)}</p>
               <p><strong>Desviación Media:</strong> ${(absDiffFi.reduce((a, b) => a + b, 0) / N).toFixed(2)}</p>
               <p><strong>Rango:</strong> ${Math.max(...data) - Math.min(...data)}</p>
               <p><strong>Varianza:</strong> ${(squaredXifi.reduce((a, b) => a + b, 0) / N - mean ** 2).toFixed(2)}</p>
               <p><strong>Desviación Estándar:</strong> ${Math.sqrt(squaredXifi.reduce((a, b) => a + b, 0) / N - mean ** 2).toFixed(2)}</p>`
    });

    // Populate table
    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = "";
    let cumulativeFrequency = 0;
    xi.forEach((x, i) => {
        cumulativeFrequency += fi[i];
        tableBody.innerHTML += `<tr>
            <td>${x}</td>
            <td>${fi[i]}</td>
            <td>${cumulativeFrequency}</td>
            <td>${(cumulativeFrequency / N).toFixed(2)}</td>
            <td>${xifi[i]}</td>
            <td>${absDiff[i].toFixed(2)}</td>
            <td>${absDiffFi[i].toFixed(2)}</td>
            <td>${squaredXifi[i]}</td>
        </tr>`;
    });
});

function calculateMode(data) {
    const freqMap = {};
    data.forEach(num => freqMap[num] = (freqMap[num] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freqMap));
    const modes = Object.keys(freqMap).filter(num => freqMap[num] === maxFreq);
    return modes.join(', ');
}

function calculateMedian(data) {
    const sorted = data.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
}
