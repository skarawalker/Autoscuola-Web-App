$(function() {
    $('#left-side-panel').load('left-side-panel.html');
});
$(function() {
    $('#top-bootstrap-bar-e').load('top-bootstrap-bar-e.html');
});

$.getJSON('http://localhost:8000/getLicense', function(data) {
    var items = []
    $.each(data.rows, function(i, j) {
        items.push("<option value=" + j.nome_p + ">" + j.nome_p + "</select>");
    });
    $("#selectLicense_i").append(items);
});

$.getJSON('http://localhost:8000/getLicense', function(data) {
    var items = []
    items.push("<option value=null>" + "Tutte" + "</select>");
    $.each(data.rows, function(i, j) {
        items.push("<option value=" + j.nome_p + ">" + j.nome_p + "</select>");
    });
    $("#selectLicense_s").append(items);
});

$(function() {
    $('#left-side-panel').load('left-side-panel.html');
});
$(function() {
    $('#top-bootstrap-bar-e').load('top-bootstrap-bar-e.html');
});

$(function() {
    $("#esamiForm").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            url: '/esami',
            type: 'post',
            data: $("#esamiForm").serialize(),
            success: function(data) {
                alert("Esame Inserito")
            },
            error: function(e) {
                alert(e.responseText)
            }
        });
    });
});

$(function() {
    // Handle search form
    $("#searchForm").submit(function(e) {
        const codfis = $('input[name=codfis]').val()
        const patente = $('select[name=patente]').val()
        const date = $('input[name=data]').val()
        const tipo = $('select[name=tipo]').val()
        e.preventDefault();
        $.ajax({
            error: function(err) {
                alert(err.responseText)
            }
        });
        // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/e_search?data=${date}&codfis=${codfis}&patente=${patente}&tipo=${tipo}`, function(data) {
            const items = [];
            items.push("<tr class='.tr'><th class='.th' style='width: 16px;'>Nome</th> <th class='.th' style='width: 16px;'>Cognome</th><th class='.th' style='width: 16px;'>Data</th><th class='.th' style='width: 16px;'>Patente</th><th class='.th' style='width: 16px;'>Tipo</th><th class='.th' style='width: 16px;'>Domande</th></tr>");
            var today = new Date();
                var str = "";
                var cnt =0;
            $.each(data.rows, function(i, j) {
                if(new Date(j.date)>=today&&cnt==0){
                    str="style='background-color:#FF0000'";
                    cnt++;
                }
                items.push("<tr "+str+"><td class='.td' style='width: 16px;'>" + j.name + "</td>" + "<td class='.td' style='width: 16px;'> " + j.surname + "</td >" + "<td class='.td' style='width: 16px;'>" + new Date(j.date).toLocaleDateString('it-IT') + "</td> " + "<td class='.td' style='width: 16px;'> " + j.license + "<td class='.td' style='width: 16px;'> " + j.type + "</td> " +
                    "<td class='.td' style='width: 16px;'> ");
                str="";
                if (j.type == "teorico")
                    items.push("<button onclick='mostraDomande(" + j.idesame + ")'>MOSTRA</button>" + "</td></tr> ")
                else
                    items.push("</td></tr> ")
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

// form per le domande
$(function() {
    // Handle search form
    $("#domandeLista").submit(function(e) {
        const esame = $('input[name=esame]').val()
        e.preventDefault();
        $.ajax({
            error: function(err) {
                alert(err.responseText)
            }
        });
        // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/domande?esame=${esame}`, function(data) {
            const items = [];
            items.push("<tr class='.tr'><th class='.th'>Domanda</th> <th class='.th'>Risposta Corretta</th><th class='.th'>Risposta Data</th></tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr><td class='.td' >" + j.text + "</td>" + "<td class='.td' > " + j.answer + "</td >" + "<td class='.td' >" + j.canswer + "</td></tr> ");
            });
            $(".domande").empty()
            const table = $("<table class='bodytable'>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo(".domande")
        });
        return false;
    });
})

function mostraDomande(id) {
    const esame = id;
    $.ajax({
        error: function(err) {
            alert(err.responseText)
        }
    });
    // avoid to execute the actual submit of the form.
    $.getJSON(`http://localhost:8000/domande?id=${esame}`, function(data) {
        const items = [];
        $.each(data.rows, function(i, j) {
            items.push("Domanda " + (i + 1) + ": " + j.text + "  \nRisposta corretta: " + j.answer + "   \nRisposta data: " + j.canswer + "\n");
        });
        alert(items)
            /*$(".domande").empty()
            const table = $("<table class='bodytable'>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo(".domande")*/
    });
    return false;
}
// form per le domande
/*$(function() {
    // Handle search form
    $("#domandeLista").submit(function(e) {
        const esame = $('input[name=id]').val()
        e.preventDefault();
        $.ajax({
            error: function(err) {
                alert(err.responseText)
            }
        });
        // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/domande?esame=${esame}`, function(data) {
            const items = [];
            items.push("<tr class='.tr'><th class='.th'>Domanda</th> <th class='.th'>Risposta Corretta</th><th class='.th'>Risposta Data</th></tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr><td class='.td' >"+j.text+"</td>"+"<td class='.td' > " + j.answer + "</td >"+"<td class='.td' >" + j.canswer + "</td></tr> ");
            });
            $(".domande").empty()
            const table = $("<table class='bodytable'>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo(".domande")
        });
        return false;
    });
})*/