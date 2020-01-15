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
            items.push("<tr class='table100-head'><th>Data</th><th>Ora</th><th>Istruttore</th><th>Persona</th></tr>");
            $.each(data.rows, function(i, j) {
                items.push("<tr><td class='column1'>" + new Date(j.date).toLocaleDateString('it-IT') + "</td> " + "<td class = 'column1'> " + j.time + "<td class = 'column1'> " + j.i_name + " " + j.i_surname + " </td> " + " </td> " + "<td class = 'column1' > " + j.name + " " + j.surname + "</td > ");
            });
            $(".response").empty()
            const table = $("<table class='table100-head'>", {
                "class": "response"
            })
            table.html(items.join('')).appendTo(".response")
        });
        return false;
    });
})