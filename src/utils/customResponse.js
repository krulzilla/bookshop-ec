const apiResponse = (response, status, message, code = 200, data) => {
    response.status(code).json({
        status: status,
        msg: message,
        data: data
    });
}

const uiRender = (response, view, data, layout) => {
    response.render(view, {data: data, layout: layout});
}

module.exports = {
    apiResponse,
    uiRender,
}