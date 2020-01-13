var data;
var items = [];
$.getJSON('http://localhost:8000/temp.json', function (data) {
    items.push("<tr class='table100-head'><th class='column1'>Nome</th><th class='column2'>Cognome</th><th class='column3'>Codice Fiscale</th><th class='column4'>Data Nascita</th><th class='column5'>Data Iscrizione</th><th class='column6'>Telefono</th> </tr>");
    $.each(data.rows, function (i, j) {
        items.push("<tr><td class='column1'>" + j.nome + "</td> " + "<td class='column2'>" + j.cognome + "</td><td class='column3'>" + j.cod_fis + "</td>"+ "<td class='column4'>" + j.data_nascita + "</td>"+ "<td class='column5'>" + j.data_iscrizione + "</td>"+ "<td class='column6'>" + j.telefono + "</td></tr>");
    });

    $("<table>", {
        "class": "response",
        html: items.join("")
    }).appendTo("section");
});