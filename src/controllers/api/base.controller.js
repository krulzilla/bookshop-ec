
class BaseController {
    response = (response, status, message, code = 200, data) => {
        response.status(code).json({
            status: status,
            msg: message,
            data: data
        });
    }
}