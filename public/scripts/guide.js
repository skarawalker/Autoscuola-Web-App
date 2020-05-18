$(function() {
    $('#left-side-panel').load('left-side-panel.html');
});
$(function() {
    $('#top-bootstrap-bar-g').load('top-bootstrap-bar-g.html');
});

$.getJSON('http://localhost:8000/getInstructor', function(data) {
    var items = []
    $.each(data.rows, function(i, j) {
        console.log(j);
        items.push("<option value=" + j.cf + ">" + j.nome + " " +
            j.cognome + "</option>");
    });

    $("#selectBox").append(items);
});

$.getJSON('http://localhost:8000/getLicense', function(data) {
    var items = []
    $.each(data.rows, function(i, j) {
        items.push("<option value=" + j.nome_p + ">" + j.nome_p + "</select>");
    });
    $("#selectLicense").append(items);
});

$(function() {
    // Handle search form
    $("#guideForm").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            url: '/guide',
            type: 'post',
            data: $("#guideForm").serialize(),
            success: function(data) {
                alert("Guida Inserita")
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
        const nome = $('input[name=nome]').val()
        const cognome = $('input[name=cognome]').val()
        const date = $('input[name=data]').val()
        e.preventDefault();
        $.ajax({
            error: function(err) {
                alert(err.responseText)
            }
        });
        // avoid to execute the actual submit of the form.
        $.getJSON(`http://localhost:8000/g_search?data=${date}&nome=${nome}&cognome=${cognome}`, function(data) {
            const items = [];
            items.push("<tr class='.tr'><th class='.th' style='width: 20%;'>Data</th> <th class='.th' style='width: 20%;'>Ora</th><th class='.th' style='width: 30%;'>Istruttore</th><th class='.th' style='width: 30%;'>Persona</th></tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr><td class='.td' style='width: 20%;'>" + new Date(j.date).toLocaleDateString('it-IT') + "</td> " + "<td class='.td' style='width: 20%;'> " + j.time + "<td class='.td' style='width: 30%;'> " + j.i_name + " " + j.i_surname + " </td> " + "<td class='.td' style='width: 30%;'> " + j.name + " " + j.surname + "</td ></tr> ");
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