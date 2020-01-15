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
                alert('Errore generico')
            }
        });
    });
});