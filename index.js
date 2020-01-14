$.getJSON('http://localhost:8000/getNextExpirations', function (data) {
    var items = []
    console.log(data);
    items.push("<tr><th>Nome</th><th>Cognome</th> <th>Data Scadenza</th> </tr>");
    $.each(data.rows, function (i, j) {
        items.push("<tr><td >" + j.nome + "</td> " + "<td >" + j.cognome + "</td><td>" + j.data_scadenza + "</td></tr>");
    });
    $("<table>", {
        "class": "mylist",
        html: items.join("")
    }).appendTo("section");
});