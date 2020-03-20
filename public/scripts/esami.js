$(function() {
    $('#left-side-panel').load('left-side-panel.html');
});
$(function() {
    $('#top-bootstrap-bar-e').load('top-bootstrap-bar-e.html');
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
            items.push("<tr class='.tr'><th class='.th'>Data</th> <th class='.th'>Ora</th><th class='.th'>Istruttore</th><th class='.th'>Persona</th></tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr><td class='.td' >" + new Date(j.date).toLocaleDateString('it-IT') + "</td> " + "<td class='.td' > " + j.time + "<td class='.td' > " + j.i_name + " " + j.i_surname + " </td> " + "<td class='.td' > " + j.name + " " + j.surname + "</td ></tr> ");
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