const renderPagination = (div, totalPage, currentPage, hrefLink) => {
    totalPage = Math.ceil(totalPage);
    let startPage = currentPage - 1, endPage = currentPage + 1;

    if (currentPage == totalPage) startPage -= 1;

    if (startPage == 0 || startPage == 1) {
        startPage = 2;
        endPage += 1;
    }

    if (endPage >= totalPage) endPage = totalPage - 1;

    let render = `<nav><ul class="pagination pagination-rounded justify-content-end">`;

    render += `<li class="page-item${(currentPage <= 1 || totalPage < 1 || currentPage > totalPage) ? " disabled" : ""}"><a class="page-link" href="${hrefLink.replace(/page=\d+/g, "page=" + (currentPage - 1))}">&laquo;</a></li>`;

    if (totalPage > 0) {
        render += `<li class="page-item${currentPage == 1 ? " active" : ""}"><a class="page-link" href="${hrefLink.replace(/page=\d+/g, "page=1")}">1</a></li>`;
    }

    if ((startPage - 1) > 1) render += `<li class="page-item disabled"><a class="page-link">...</a></li>`;

    if (totalPage >= 3) {
        for (let page = startPage; page <= endPage; page++) {
            render += `<li class="page-item${page==currentPage ? ' active' : ''}"><a class="page-link" href="${hrefLink.replace(/page=\d+/g, "page=" + page)}">${page}</a></li>`;
        }
    }

    if ((totalPage - endPage) > 1) render += `<li class="page-item disabled"><a class="page-link">...</a></li>`;

    if (totalPage > 1) {
        render += `<li class="page-item${currentPage == totalPage ? " active" : ""}"><a class="page-link" href="${hrefLink.replace(/page=\d+/g, "page=" + totalPage)}">${totalPage}</a></li>`;
    }

    render += `<li class="page-item${(currentPage >= totalPage || currentPage < 0) ? " disabled" : ""}"><a class="page-link" href="${hrefLink.replace(/page=\d+/g, "page=" + (currentPage + 1))}">&raquo;</a></li>`;

    $(div).html(render);
}