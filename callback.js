module.exports = {
  successCallback: function (results, message, response, code) {
    response.set('Content-Type', 'application/json');
    if (results === null) {
      response.statusMessage = message;
      results = message;
    }
    response.statusCode = code;
    var res = {};
    if (code && message !== null) {
      res.code = code;
      if (results)
        res.data = results;
      response.send(JSON.stringify(res));
    }
    else
      response.end(JSON.stringify(results))
  },

  errorCallback: function (error, response, code) {
    response.set('Content-Type', 'application/json');
    response.statusMessage = error;
    response.statusCode = code;
    response.send(JSON.stringify({
      "code":    code,
      "message": error
    }));

  }
}
