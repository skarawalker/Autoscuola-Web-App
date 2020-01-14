$.getJSON('http://localhost:8000/getNextExpirations', function (data) {
    var items = []
    items.push("<tr><th>Nome</th><th>Cognome</th> <th>Data Scadenza</th> </tr>");
    $.each(data.rows, function (i, j) {
        const dataScadenza = new Date(j.data_scadenza)
        items.push("<tr><td >" + j.nome + "</td> " + "<td >" + j.cognome + "</td><td>" + dataScadenza.toLocaleDateString('it-IT') + "</td></tr>");
    });
    $("<table>", {
        "class": "mylist",
        html: items.join("")
    }).appendTo("section");
});