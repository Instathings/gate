module.exports = function getBaseTopic(prefix, clientId) {
  let topic = `${prefix}/${process.env.PROJECT_ID}/${clientId}`;
  if (process.env.NODE_ENV !== 'production') {
    topic = `${process.env.NODE_ENV}-${topic}`;
  }
  return topic;
};
