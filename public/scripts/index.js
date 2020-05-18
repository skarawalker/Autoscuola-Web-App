$.getJSON('http://localhost:8000/getNextExpirations', function(data) {
    var items = []
    items.push("<tr><th class='intestazione'>Nome</th><th class='intestazione'>Cognome</th><th class='intestazione'>Data Scadenza</th> </tr>");
    $.each(data.rows, function(i, j) {
        const dataScadenza = new Date(j.data_scadenza)
        
        items.push("<tr><td>" + j.nome + "</td> " + "<td>" + j.cognome + "</td><td>" + dataScadenza.toLocaleDateString('it-IT') + "</td></tr>");
    });
    $("<table>", {
        "class": "bodytable",
        html: items.join("")
    }).appendTo("#scadenze");
});
$.getJSON('http://localhost:8000/getGuideOggi', function(data) {
    var items = []
    items.push("<tr><th  class='intestazione' style='text-align:left'>Cognome</th><th style='text-align:left' class='intestazione'>Patente </th> <th style='text-align:left' class='intestazione'>Ora</th><th style='text-align:left' class='intestazione'>Data</th><th style='text-align:left' class='intestazione'>Durata(min)</th></tr>");
    $.each(data.rows, function(i, j) {
        items.push("<tr><td>" + j.surname + "</td><td>" + j.license + "</td><td>" + j.time + "</td> + j.durata</td><td>" + new Date(j.date).toLocaleDateString('it-IT') +"</td><td>"+ j.duration+"</td></tr>");
    });
    $("<table>", {
        "class": "bodytable",
        html: items.join("")
    }).appendTo("#guide");
});

$.getJSON('http://localhost:8000/getPatNum', function(data) {
    var item4chart = [];
    $.each(data.rows, function(i, j) {
        item4chart.push([j.patente, parseInt(j.numero)]);
    });
    google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Patenti');
    data.addColumn('number', 'Quantità');
    data.addRows(item4chart);
    console.log(data)
    // Set chart options
    var options = {
        backgroundColor: { fill: 'transparent' },
        'title': '',
        'width': 500,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
});


//grafici
