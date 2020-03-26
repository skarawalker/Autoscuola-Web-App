// UI loads
$(function() {
    $('#left-side-panel').load('/left-side-panel.html');
});
$(function() {
    $('#top-bootstrap-bar-u').load('/top-bootstrap-bar-u.html');
});

//options in license select
$.getJSON('http://localhost:8000/getLicense', function(data) {
    var items = []
    $.each(data.rows, function(i, j) {
        items.push("<option value=" + j.nome_p + ">" + j.nome_p + "</select>");
    });
    $("#selectLicense").append(items);
});

//form di ricerca
$(function() {
    // Handle search form
    $("#searchForm").submit(function(e) {
        const nome = $('input[name=nome]').val()
        const cognome = $('input[name=cognome]').val()
        const dn = $('input[name=dn]').val()
        const cf = $('input[name=cf]').val()
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/search_user?nome=${nome}&cognome=${cognome}&dn=${dn}&cf=${cf}`, function(data) {
            const items = [];
            items.push("<tr><th >Nome</th><th>Cognome</th><th>Codice Fiscale</th><th>Data Nascita</th><th>Data Iscrizione</th><th>Telefono</th> </tr>");
            $.each(data.rows, function(i, j) {
                const dataNascita = new Date(j.data_nascita)
                const dataIscrizione = new Date(j.data_iscrizione)
                items.push("<tr class='result'><td>" + j.nome + "</td><td>" + j.cognome + "</td><td>" + j.cod_fis + "</td><td>" + dataNascita.toLocaleDateString('it-IT') + "</td><td>" + dataIscrizione.toLocaleDateString('it-IT') + "</td><td>" + j.telefono + "</td></tr>");
            });
            $(".response").empty()
            const table = $("<table class='bodytable'>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo(".response")
        });
        return false;
    });
})

//ricerca degli acconti
$(function() {
    // Handle money form
    $("#accontiForm").submit(function(e) {
        const nome2 = $('input[name=nome2]').val()
        const cognome2 = $('input[name=cognome2]').val()
        const cf2 = $('input[name=cf2]').val()
        e.preventDefault()
        $.getJSON(`http://localhost:8000/acconti?nome2=${nome2}&cognome2=${cognome2}&cf2=${cf2}`, function(data) {
            const items = [];
            items.push("<tr class='res-header'><th >Nome</th><th>Cognome</th><th>Patente </th><th style='text-align:right'>Acconto1</th><th style='text-align:right'>Acconto2</th> </tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr class='result'><td>" + j.nome + "</td><td>" + j.cognome + "</td><td>" + j.patente_1 + "</td><td><input style='text-align:right' type='textbox' name='acc1' placeholder ='" + j.acconto1 + "€ / " + j.costo1 + "€'/></td><td><input style='text-align:right' type='textbox' name='acc2' placeholder ='" + j.acconto2 + "€ / " + j.costo2 + "€'/>" + "</td><td><input name='cod_fis' type='hidden' value='" + j.cod_fis + "'></input><input type='hidden' name='patente_1' value='" + j.patente_1 + "'></input><input type='hidden' name='acconto1' value='" + j.acconto1 + "'></input><input type='hidden' name='acconto2' value='" + j.acconto2 + "'></input><input type = 'submit' name='submit' value ='Modifica'> </td></tr > ");
            });
            $("#risposta").empty()
            const table = $("<table>", {
                "class": "bodytable",
                "style": "align-self: center"
            })
            table.html(items.join('')).appendTo("#risposta")
        });
    });
    return false;
});

// aggiornamento degli acconti
$(function() {
    $('#upd_acconti').submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            url: '/acc_mod',
            type: 'post',
            data: $("#upd_acconti").serialize(),
            success: function(data) {
                alert("Acconti modificati!")
            },
            error: function(e) {
                alert(e.responseText)
            }
        });
    });
});
$(function() {
    // Handle search form
    $("#insertForm").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            url: '/user_add',
            type: 'post',
            data: $("#insertForm").serialize(),
            success: function(data) {
                alert("Utente Inserito")
            },
            error: function(e) {
                alert(e.responseText)
            }
        });
    });
});

$(function() {
    $("#readAllForm").submit(function(e) {
        e.preventDefault()
        $.getJSON(`http://localhost:8000/readall`, function(data) {
            const items = [];
            items.push("<tr class='res-header'><th class='column1'>Nome</th><th class='column2'>Cognome</th><th class='column3'>Codice Fiscale</th><th class='column4'>Data Nascita</th><th class='column5'>Data Iscrizione</th><th class='column6'>Telefono</th> </tr>");
            $.each(data.rows, function(i, j) {
                const dataNascita = new Date(j.data_nascita)
                const dataIscrizione = new Date(j.data_iscrizione)
                items.push("<tr><td class='column1'>" + j.nome + "</td> " + "<td class='column2'>" + j.cognome + "</td><td class='column3'>" + j.cod_fis + "</td>" + "<td class='column4'>" + dataNascita.toLocaleDateString('it-IT') + "</td>" + "<td class='column5'>" + dataIscrizione.toLocaleDateString('it-IT') + "</td>" + "<td class='column6'>" + j.telefono + "</td></tr>");
            });
            $(".response").empty()
            const table = $("<table class='bodytable'>", {
                "class": "response"
            });
            table.html(items.join('')).appendTo(".response")
        });
    });
});