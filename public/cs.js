$(function(){
    // Handle search form
    $("#searchForm").submit(function(e) {
        const nome = $('input[name=nome]').val()
        const cognome = $('input[name=cognome]').val()
        const dn = $('input[name=dn]').val()
        const cf = $('input[name=cf]').val()
        
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/search?nome=${nome}&cognome=${cognome}&dn=${dn}&cf=${cf}`, function (data) {
            const items = [];
            items.push("<tr class='table100-head'><th class='column1'>Nome</th><th class='column2'>Cognome</th><th class='column3'>Codice Fiscale</th><th class='column4'>Data Nascita</th><th class='column5'>Data Iscrizione</th><th class='column6'>Telefono</th> </tr>");
            $.each(data.rows, function (i, j) {
                items.push("<tr><td class='column1'>" + j.nome + "</td> " + "<td class='column2'>" + j.cognome + "</td><td class='column3'>" + j.cod_fis + "</td>" + "<td class='column4'>" + j.data_nascita + "</td>" + "<td class='column5'>" + j.data_iscrizione + "</td>" + "<td class='column6'>" + j.telefono + "</td></tr>");
            });
            $("section").empty()
            const table = $("<table>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo('section')
        });
    });
})