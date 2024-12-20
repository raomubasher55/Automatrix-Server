class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
  
    // Removing fields from the query that are not needed for filtering
    const removeFields = ['keyword', 'limit', 'page'];
    removeFields.forEach(el => delete queryCopy[el]);
  
    // Advanced filter for price, ratings etc.
    let queryObject = JSON.stringify(queryCopy);
    queryObject = queryObject.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
  
    // Apply filters to the query
    this.query = this.query.find(JSON.parse(queryObject));
    return this;
  }
  
  pagination(resPerPage = 10) {
    // Get the current page or default to 1
    const currentPage = Number(this.queryStr.page) || 1;
  
    // Ensure that currentPage is a valid number
    if (currentPage < 1) {
      throw new Error("Page number must be greater than or equal to 1");
    }
  
    // Calculate the number of items to skip
    const skip = resPerPage * (currentPage - 1);
  
    // Apply pagination to the query
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
  


}

module.exports = APIFeatures;
