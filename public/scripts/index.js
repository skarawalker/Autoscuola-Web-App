$.getJSON('http://localhost:8000/getNextExpirations', function(data) {
    var items = []
    items.push("<tr><th>Nome</th><th>Cognome</th><th>Data Scadenza</th> </tr>");
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
    items.push("<tr><th style='text-align:left'>Nome</th><th style='text-align:left'>Cognome</th><th style='text-align:left'>Patente</th> <th style='text-align:left'>Ora</th><th style='text-align:left'>Durata(min)</th></tr>");
    $.each(data.rows, function(i, j) {
        const dataScadenza = new Date(j.data_scadenza)
        items.push("<tr><td>" + j.nome + "</td> " + "<td>" + j.cognome + "</td><td>" + j.patente_g + "</td>" + j.ora + "</td>" + j.durata + "</td></tr>");
    });
    $("<table>", {
        "class": "bodytable",
        html: items.join("")
    }).appendTo("#guide");
});