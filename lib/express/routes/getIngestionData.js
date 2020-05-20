const _ = require('lodash');

module.exports = function getFn(mongoClient) {
  const db = mongoClient.db(process.env.MONGO_DATABASE_NAME);
  const collection = db.collection(process.env.MONGO_INGESTED_COLLECTION);
  return async function get(req, res, next) {
    // query
    const { deviceId } = req.params;
    const query = {
      deviceId,
    };
    let { start, end } = req.query;
    if (start) {
      start = new Date(parseInt(start, 10));
      _.set(query, 'ts.$gte', start);
    }
    if (end) {
      end = new Date(parseInt(end, 10));
      _.set(query, 'ts.$lte', end);
    }
    // options
    let perPage = req.query.perPage || 10;
    perPage = (perPage > 100) ? perPage = 100 : perPage;
    const page = req.query.page || 1;
    const skip = (page - 1) * perPage;

    const options = {
      limit: perPage,
      skip,
    };

    let sortKey = req.query.sort || 'ts';
    let sortOrder = sortKey[0];

    if (sortOrder !== '+' && sortOrder !== '-') {
      sortOrder = '+';
      sortKey = `${sortOrder}${sortKey}`;
    }

    const sortOrderValue = (sortOrder === '-') ? -1 : 1;

    _.set(options, `sort.${sortKey.substring(1)}`, sortOrderValue);
    const find = collection.find(query, options).toArray();
    const count = collection.countDocuments(query);

    try {
      const results = await Promise.all([find, count]);
      _.set(res, 'locals.response', { data: results[0], totalItems: results[1] });
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
