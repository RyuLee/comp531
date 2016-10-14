var http = require('http')
var querystring = require('querystring')
var host = '127.0.0.1'
var port = 3333

http.createServer(preprocess).listen(port, host)
console.log('Server running at http://' + host + ':' + port)

function preprocess(req, res) {
    var body = ''
    req.on('data', function(chunk) {
        body += chunk
    })
    req.on('end', function() {
        req.body = body

        server(req, res)
    })
}

function server(req, res) {
    if (req.method == 'GET') {
        var payload = { 'hello': 'world' }
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        switch (req.url) {
            case "/":
                res.end()
                break
            case "/articles":
                payload = {
                    articles: [{ id: 1, author: 'Scott', body: 'A post' }, { id: 2, author: 'Pengyu', body: 'A post' },
                        { id: 3, author: 'Perry', body: 'A post' }
                    ]
                }
        }
        res.end(JSON.stringify(payload))
    } else if (req.method == 'POST') {
        switch (req.url) {
            case "/":
                res.end()
                break
            case "/login":
                var data = JSON.parse(req.body)
                if (typeof(data) != 'undefined') {
                    payload = { username: data.username, result: "success" }
                    res.end(JSON.stringify(payload))
                }else{
                    res.end()
                }
                break
        }
    } else if (req.method == 'PUT') {
        switch (req.url) {
            case "/":
                res.end()
                break
            case "/logout":
                res.end("OK")
                break
        }
    }

    console.log('Request method        :', req.method)
    console.log('Request URL           :', req.url)
    console.log('Request content-type  :', req.headers['content-type'])
    console.log('Request payload       :', req.body)

    //var payload = { 'hello': 'world' }
    //res.setHeader('Content-Type', 'application/json')
    //res.statusCode = 200
    //res.end(JSON.stringify(payload))
}
