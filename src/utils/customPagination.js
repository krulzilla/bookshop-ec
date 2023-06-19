const getPagination = (model, page, pageSize, pipelines = []) => {
    const start = (page - 1) * pageSize;
    return model.aggregate([
        {
            $skip: start
        },
        {
            $limit: pageSize
        },
        ...pipelines
    ]);
}

module.exports = getPagination;