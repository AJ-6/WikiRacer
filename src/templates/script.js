var socket = io.connect("https://" + document.domain + ':' + location.port);

socket.on('path_update', function(data) {
    var pathLinks = data.path.map(function(page, index) {
        return '<a href="' + data.links[index] + '" target="_blank" style="color: #2aa9e0;">' + page + '</a>';
    });
    document.getElementById('path').innerHTML = 'This is a new path! Current Path: ' + pathLinks.join(' → ');
});

socket.on('search_complete', function(data) {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('startButton').disabled = false; // Re-enable the button

    var alerts = document.getElementsByClassName('alert');
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].style.display = 'none';
    }

    var pathLinks = data.path.map(function(page, index) {
        return '<a href="' + data.links[index] + '" target="_blank" style="color: #2aa9e0;">' + page + '</a>';
    });

    document.getElementById('current_link').display = 'none';
    document.getElementById('path').innerHTML = 
        'Search Complete! Final Path: ' + pathLinks.join(' → ') + ' found on ' + data.timestamp;

    setTimeout(function() {
        document.getElementById('path').innerHTML = '';
    }, 300000); // Clear path after 5 minutes
});

socket.on('search_exists', function(data) {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('startButton').disabled = false;

    var alerts = document.getElementsByClassName('alert');
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].style.display = 'none';
    }

    var pathLinks = data.path.map(function(page, index) {
        return '<a href="' + data.links[index] + '" target="_blank" style="color: #2aa9e0;">' + page + '</a>';
    });
    document.getElementById('path').innerHTML = 
        'This search already exists! Path: ' + pathLinks.join(' → ') + ' found on ' + data.timestamp;

    setTimeout(function() {
        document.getElementById('path').innerHTML = '';
    }, 300000); // Clear path after 5 minutes
});

socket.on('size_warning', function(data) {
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').innerHTML = 
        'Oh no! Your optimal path includes a page with >' + data.size + ' links.';
    document.getElementById('startButton').disabled = false;
});

document.getElementById('startButton').addEventListener('click', function() {
    var startPage = document.getElementById('startPage').value;
    var endPage = document.getElementById('endPage').value;

    if (startPage.trim() !== '' && endPage.trim() !== '') {
        document.getElementById('path').innerHTML = '';
        document.getElementById('error').style.display = 'none';
        document.getElementById('spinner').style.display = 'block';
        document.getElementById('startButton').disabled = true;

        socket.emit('start_search', { start: startPage, end: endPage });
    } else {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = 
            'Please enter both a start and an end page.';
    }
});
