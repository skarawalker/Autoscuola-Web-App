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
    items.push("<tr><th style='text-align:left' class='intestazione'>Nome</th><th  class='intestazione' style='text-align:left'>Cognome</th><th style='text-align:left' class='intestazione'>Patente </th> <th style='text-align:left' class='intestazione'>Ora</th><th style='text-align:left' class='intestazione'>Durata(min)</th></tr>");
    $.each(data.rows, function(i, j) {
        const dataScadenza = new Date(j.data_scadenza)
        items.push("<tr><td>" + j.nome + "</td> " + "<td>" + j.cognome + "</td><td>" + j.patente_g + "</td>" + j.ora + "</td>" + j.durata + "</td></tr>");
    });
    $("<table>", {
        "class": "bodytable",
        html: items.join("")
    }).appendTo("#guide");
});

//grafici
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
    data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
    ]);

    // Set chart options
    var options = {
        backgroundColor: { fill: 'transparent' },
        'title': 'Grafico per prova',
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}