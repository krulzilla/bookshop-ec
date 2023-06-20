const getPagination = (model, page, pageSize, pipelines = []) => {
    const start = (page - 1) * pageSize;
    return model.aggregate([
        ...pipelines,
        {
            $skip: start
        },
        {
            $limit: pageSize
        }
    ]);
}

module.exports = getPagination;