const getPagination = (model, page, pageSize, pipelines = []) => {
    const start = (page - 1) * pageSize;

    return model.aggregate([
        ...pipelines,
        {
            $facet: {
                data: [
                    {
                        $skip: start
                    },
                    {
                        $limit: pageSize
                    }
                ],
                pagination: [
                    {
                        $count: "totalRow"
                    }
                ]
            }
        }
    ]);
}

module.exports = getPagination;