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