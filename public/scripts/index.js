$.getJSON('http://localhost:8000/getNextExpirations', function(data) {
    var items = []
    items.push("<tr><th style='text-align:left'>Nome</th><th style='text-align:left'>Cognome</th><th style='text-align:left'>Data Scadenza</th> </tr>");
    $.each(data.rows, function(i, j) {
        const dataScadenza = new Date(j.data_scadenza)
        items.push("<tr><td>" + j.nome + "</td> " + "<td>" + j.cognome + "</td><td>" + dataScadenza.toLocaleDateString('it-IT') + "</td></tr>");
    });
    $("<table>", {
        "class": "mylist",
        html: items.join("")
    }).appendTo("section");
});